import { EntityManager } from "typeorm";
import { Profile } from "../DB/Entities/profile.entity";
import { Tab } from "../DB/Entities/Tab.entity";
import { TabPermission } from "../DB/Entities/TabPermission.entity";
import { ObjectEntity } from "../DB/Entities/object.entity";
import { ObjectPermission } from "../DB/Entities/ObjectPermission.entity";
import { FieldPermission } from "../DB/Entities/FieldPermission.entity";
import { RecordTypeAccess } from "../DB/Entities/RecordTypeAccess.entity";
import { ObjectFieldDefinition } from "../DB/Entities/ObjectFieldDefinition.entity";
import {
  IFieldPermissionInput,
  IObjectPermissionInput,
  IRecordTypeAccessInput,
  ITabPermissionInput,
} from "../types/Profile/Profile.types";

export type ProfilePermissionPayload = {
  tabPermissions?: ITabPermissionInput[];
  objectPermissions?: IObjectPermissionInput[];
  fieldPermissions?: IFieldPermissionInput[];
  recordTypeAccesses?: IRecordTypeAccessInput[];
};

/** Names from the request that had no matching row in `tabs` / `objects` — those permission rows are skipped. */
export type ProfilePermissionApplySummary = {
  missingTabs: string[];
  missingObjects: string[];
};

async function findObjectByName(manager: EntityManager, objectName: string): Promise<ObjectEntity | null> {
  return manager.getRepository(ObjectEntity).findOne({
    where: { name: objectName, isDeleted: false },
  });
}

async function findTabByName(manager: EntityManager, tabName: string): Promise<Tab | null> {
  return manager.getRepository(Tab).findOne({
    where: { name: tabName, isDeleted: false },
  });
}

async function resolveCanonicalFieldName(
  manager: EntityManager,
  objectId: string,
  requestedFieldName: string
): Promise<string> {
  const input = requestedFieldName.trim();
  if (!input) return input;

  const fieldDefRepo = manager.getRepository(ObjectFieldDefinition);
  const exact = await fieldDefRepo.findOne({
    where: { object: { id: objectId }, fieldName: input, isActive: true },
  });
  if (exact) return exact.fieldName;

  const defs = await fieldDefRepo.find({
    where: { object: { id: objectId }, isActive: true },
  });
  const byPropertyName = defs.find((d) => d.notes?.includes(`propertyName:${input}`));
  if (byPropertyName) return byPropertyName.fieldName;

  const byDbName = defs.find((d) => d.notes?.includes(`dbColumn:${input}`));
  if (byDbName) return byDbName.fieldName;

  return input;
}

export async function applyProfilePermissions(
  manager: EntityManager,
  profileId: number,
  payload: ProfilePermissionPayload
): Promise<ProfilePermissionApplySummary> {
  const profileRef = { profileId } as Profile;
  const missingTabs = new Set<string>();
  const missingObjects = new Set<string>();

  if (payload.tabPermissions?.length) {
    const permRepo = manager.getRepository(TabPermission);
    for (const row of payload.tabPermissions) {
      const tab = await findTabByName(manager, row.tabName.trim());
      if (!tab) {
        missingTabs.add(row.tabName.trim());
        continue;
      }
      let perm = await permRepo.findOne({
        where: { profile: { profileId }, tab: { id: tab.id } },
        relations: ["profile", "tab"],
      });
      if (!perm) {
        perm = permRepo.create({
          profile: profileRef,
          tab,
          readOnly: !!row.readOnly,
          defaultOn: !!row.defaultOn,
        });
      } else {
        perm.readOnly = !!row.readOnly;
        perm.defaultOn = !!row.defaultOn;
      }
      await permRepo.save(perm);
    }
  }

  if (payload.objectPermissions?.length) {
    const permRepo = manager.getRepository(ObjectPermission);
    for (const row of payload.objectPermissions) {
      const object = await findObjectByName(manager, row.objectName.trim());
      if (!object) {
        missingObjects.add(row.objectName.trim());
        continue;
      }
      let perm = await permRepo.findOne({
        where: { profile: { profileId }, object: { id: object.id } },
        relations: ["profile", "object"],
      });
      if (!perm) {
        perm = permRepo.create({
          profile: profileRef,
          object,
          canRead: !!row.canRead,
          canCreate: !!row.canCreate,
          canEdit: !!row.canEdit,
          canDelete: !!row.canDelete,
          canViewAll: !!row.canViewAll,
          canModifyAll: !!row.canModifyAll,
        });
      } else {
        perm.canRead = !!row.canRead;
        perm.canCreate = !!row.canCreate;
        perm.canEdit = !!row.canEdit;
        perm.canDelete = !!row.canDelete;
        if (row.canViewAll !== undefined) perm.canViewAll = !!row.canViewAll;
        if (row.canModifyAll !== undefined) perm.canModifyAll = !!row.canModifyAll;
      }
      await permRepo.save(perm);
    }
  }

  if (payload.fieldPermissions?.length) {
    const permRepo = manager.getRepository(FieldPermission);
    for (const row of payload.fieldPermissions) {
      const object = await findObjectByName(manager, row.objectName.trim());
      if (!object) {
        missingObjects.add(row.objectName.trim());
        continue;
      }
      const recordTypeName = (row.recordTypeName ?? "").trim();
      const canonicalFieldName = await resolveCanonicalFieldName(
        manager,
        object.id,
        row.fieldName
      );
      let perm = await permRepo.findOne({
        where: {
          profile: { profileId },
          object: { id: object.id },
          fieldName: canonicalFieldName,
          recordTypeName,
        },
      });
      if (!perm) {
        perm = permRepo.create({
          profile: profileRef,
          object,
          fieldName: canonicalFieldName,
          recordTypeName,
          mandatory: !!row.mandatory,
          readOnly: !!row.readOnly,
          editable: !!row.editable,
          notes: row.notes,
        });
      } else {
        perm.mandatory = !!row.mandatory;
        perm.readOnly = !!row.readOnly;
        perm.editable = !!row.editable;
        perm.notes = row.notes;
      }
      await permRepo.save(perm);
    }
  }

  if (payload.recordTypeAccesses?.length) {
    const permRepo = manager.getRepository(RecordTypeAccess);
    for (const row of payload.recordTypeAccesses) {
      const object = await findObjectByName(manager, row.objectName.trim());
      if (!object) {
        missingObjects.add(row.objectName.trim());
        continue;
      }
      const recordTypeName = row.recordTypeName.trim();
      let perm = await permRepo.findOne({
        where: {
          profile: { profileId },
          object: { id: object.id },
          recordTypeName,
        },
      });
      if (!perm) {
        perm = permRepo.create({
          profile: profileRef,
          object,
          recordTypeName,
          canRead: !!row.canRead,
          canCreate: !!row.canCreate,
          canEdit: !!row.canEdit,
          canDelete: !!row.canDelete,
        });
      } else {
        perm.canRead = !!row.canRead;
        perm.canCreate = !!row.canCreate;
        perm.canEdit = !!row.canEdit;
        perm.canDelete = !!row.canDelete;
      }
      await permRepo.save(perm);
    }
  }

  return {
    missingTabs: [...missingTabs],
    missingObjects: [...missingObjects],
  };
}
