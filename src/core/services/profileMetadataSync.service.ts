import { DataSource, EntityManager, EntityMetadata } from "typeorm";
import { DbConnections } from "../DB/postgresdb";
import { ObjectEntity } from "../DB/Entities/object.entity";
import { ObjectFieldDefinition } from "../DB/Entities/ObjectFieldDefinition.entity";
import { Tab } from "../DB/Entities/Tab.entity";
import { mappedTableForObject } from "../config/profileObjectMapping";

type SyncResult = {
  objectName: string;
  tableName: string;
  fieldsCreated: number;
  fieldsUpdated: number;
  fieldsDeactivated: number;
};

const METADATA_TABLE_EXCLUDE = new Set<string>([
  "objects",
  "tabs",
  "profiles",
  "object_permissions",
  "tab_permissions",
  "field_permissions",
  "record_type_access",
  "object_field_definitions",
  "object_record_type_definitions",
  "system_permissions",
]);

function normalizeType(type: unknown): string {
  if (typeof type === "string") return type;
  if (typeof type === "function" && type.name) return type.name;
  return String(type);
}

function looksLikeMatch(objectName: string, meta: EntityMetadata): boolean {
  const n = objectName.toLowerCase().replace(/\s+/g, "");
  const table = meta.tableName.toLowerCase().replace(/_/g, "");
  const target = (meta.targetName || "").toLowerCase().replace(/\s+/g, "");
  const singular = n.endsWith("s") ? n.slice(0, -1) : n;
  const plural = n.endsWith("s") ? n : `${n}s`;
  return (
    table === n ||
    table === singular ||
    table === plural ||
    target === n ||
    target === singular ||
    target === plural
  );
}

export class ProfileMetadataSyncService {
  private ds: DataSource;

  constructor(dataSource?: DataSource) {
    this.ds = dataSource ?? DbConnections.AppDbConnection.getConnection();
  }

  private syncableEntityMetas(): EntityMetadata[] {
    return this.ds.entityMetadatas.filter((m) => {
      if (!m.tableName) return false;
      if (METADATA_TABLE_EXCLUDE.has(m.tableName)) return false;
      if (m.tableType && m.tableType !== "regular") return false;
      return true;
    });
  }

  private findMetaForObject(objectName: string, hintTableName?: string): EntityMetadata | null {
    const metas = this.syncableEntityMetas();
    const explicit = hintTableName || mappedTableForObject(objectName);
    if (explicit) {
      const exact = metas.find((m) => m.tableName.toLowerCase() === explicit.toLowerCase());
      if (exact) return exact;
    }
    return metas.find((m) => looksLikeMatch(objectName, m)) ?? null;
  }

  private async syncOneObjectFields(
    object: ObjectEntity,
    meta: EntityMetadata,
    manager?: EntityManager
  ): Promise<SyncResult> {
    // IMPORTANT: when called from a transaction, we must use the transaction manager's repository,
    // otherwise we can create FK violations (object row not committed yet).
    const repoProvider = manager ?? this.ds;
    const fieldRepo = repoProvider.getRepository(ObjectFieldDefinition);
    const existing = await fieldRepo.find({ where: { object: { id: object.id } } });
    const existingByField = new Map(existing.map((f) => [f.fieldName, f]));
    const active = new Set<string>();

    let fieldsCreated = 0;
    let fieldsUpdated = 0;
    let fieldsDeactivated = 0;
    let order = 10;

    for (const col of meta.columns) {
      if (col.isVirtual || col.isCreateDate || col.isUpdateDate || col.isDeleteDate) continue;
      // Canonical RBAC field key is DB column name.
      const fieldName = col.databaseName;
      active.add(fieldName);
      const dataType = normalizeType(col.type);
      const notes = `dbColumn:${col.databaseName};propertyName:${col.propertyName}`;
      const prev = existingByField.get(fieldName);

      if (!prev) {
        await fieldRepo.save(
          fieldRepo.create({
            object,
            fieldName,
            dataType,
            sortOrder: order,
            notes,
            isActive: true,
          })
        );
        fieldsCreated++;
      } else {
        let changed = false;
        if (!prev.isActive) {
          prev.isActive = true;
          changed = true;
        }
        if (prev.dataType !== dataType) {
          prev.dataType = dataType;
          changed = true;
        }
        if (prev.sortOrder !== order) {
          prev.sortOrder = order;
          changed = true;
        }
        if (prev.notes !== notes) {
          prev.notes = notes;
          changed = true;
        }
        if (changed) {
          await fieldRepo.save(prev);
          fieldsUpdated++;
        }
      }
      order += 10;
    }

    for (const old of existing) {
      if (!active.has(old.fieldName) && old.isActive) {
        old.isActive = false;
        await fieldRepo.save(old);
        fieldsDeactivated++;
      }
    }

    return {
      objectName: object.name,
      tableName: meta.tableName,
      fieldsCreated,
      fieldsUpdated,
      fieldsDeactivated,
    };
  }

  async syncObjectAndTabCatalogFromSchema(): Promise<{
    objectsCreated: number;
    tabsCreated: number;
    fields: SyncResult[];
  }> {
    const result = { objectsCreated: 0, tabsCreated: 0, fields: [] as SyncResult[] };
    await this.ds.transaction(async (manager) => {
      const objRepo = manager.getRepository(ObjectEntity);
      const tabRepo = manager.getRepository(Tab);
      const metas = this.syncableEntityMetas();

      for (const meta of metas) {
        const objectName = meta.targetName || meta.name || meta.tableName;
        let obj = await objRepo.findOne({ where: { name: objectName, isDeleted: false } });
        if (!obj) {
          obj = await objRepo.save(
            objRepo.create({
              name: objectName,
              helpText: meta.tableName,
              dataType: "",
              isActive: true,
              isDeleted: false,
            })
          );
          result.objectsCreated++;
        }

        const tab = await tabRepo.findOne({ where: { name: objectName, isDeleted: false } });
        if (!tab) {
          await tabRepo.save(
            tabRepo.create({
              name: objectName,
              object: obj,
              isActive: true,
              isDeleted: false,
              orderNumber: 9999,
            })
          );
          result.tabsCreated++;
        }

        const sync = await this.syncOneObjectFields(obj, meta, manager);
        result.fields.push(sync);
      }
    });

    return result;
  }

  async ensureFieldDefinitionsForObject(objectName: string, hintTableName?: string): Promise<SyncResult | null> {
    const objRepo = this.ds.getRepository(ObjectEntity);
    const obj = await objRepo.findOne({ where: { name: objectName, isDeleted: false } });
    if (!obj) return null;
    const meta = this.findMetaForObject(objectName, hintTableName || obj.helpText || undefined);
    if (!meta) return null;
    return this.syncOneObjectFields(obj, meta);
  }
}
