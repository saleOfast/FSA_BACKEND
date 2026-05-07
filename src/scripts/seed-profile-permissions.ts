/**
 * Seeds navigation tabs, CRM objects, and sample profiles with permissions
 * aligned with the Profile Setting UI (tab / table / field / record type).
 *
 * Run after migrations (includes field_permissions + record_type_access):
 *   npm run seed:profile-permissions
 */
import "reflect-metadata";
import { EntityManager } from "typeorm";
import { DbConnections } from "../core/DB/postgresdb";
import { ObjectEntity } from "../core/DB/Entities/object.entity";
import { ObjectFieldDefinition } from "../core/DB/Entities/ObjectFieldDefinition.entity";
import { ObjectRecordTypeDefinition } from "../core/DB/Entities/ObjectRecordTypeDefinition.entity";
import { Tab } from "../core/DB/Entities/Tab.entity";
import { Profile } from "../core/DB/Entities/profile.entity";
import { User } from "../core/DB/Entities/User.entity";
import { applyProfilePermissions } from "../core/services/profilePermission.service";
import { IUserReference } from "../core/types/Profile/Profile.types";

const NAV_TABS = [
  "Dashboard",
  "Customer",
  "Product",
  "SKU",
  "Inventory",
  "Batch",
  "POSM",
  "Sales Order",
  "Dispatch",
  "Delivery",
];

const OBJECT_NAMES = [
  ...NAV_TABS,
  "Invoice Control Center",
  "Invoice",
  "Warehouse",
  "GRN",
  "Pricebook",
  "Scheme",
  "Discount",
  "Beat",
];

/** Master field list for Customer — shown in Field Permissions UI when table = Customer */
const CUSTOMER_FIELD_DEFS: { fieldName: string; dataType: string; notes?: string; sortOrder: number }[] = [
  { fieldName: "Parent Customer", dataType: "Dropdown", notes: "Hierarchy", sortOrder: 10 },
  { fieldName: "Customer Name", dataType: "Text", sortOrder: 20 },
  { fieldName: "Customer Type", dataType: "Dropdown", notes: "GT | MT | Ecom | Horeca", sortOrder: 30 },
  { fieldName: "Channel Type", dataType: "Dropdown", sortOrder: 40 },
  { fieldName: "Phone", dataType: "Text", sortOrder: 50 },
  { fieldName: "Alternate Mobile", dataType: "Text", sortOrder: 60 },
  { fieldName: "Email", dataType: "Text", sortOrder: 70 },
  { fieldName: "Billing Address Line 1", dataType: "Text", sortOrder: 80 },
  { fieldName: "Billing Address Line 2", dataType: "Text", sortOrder: 90 },
  { fieldName: "Billing Country", dataType: "Dropdown", sortOrder: 100 },
  { fieldName: "Billing State", dataType: "Dropdown", sortOrder: 110 },
  { fieldName: "Billing District", dataType: "Dropdown", sortOrder: 120 },
  { fieldName: "Billing City", dataType: "Text", sortOrder: 130 },
  { fieldName: "Billing Street", dataType: "Text", sortOrder: 140 },
  { fieldName: "Billing Pin Code", dataType: "Text", sortOrder: 150 },
  { fieldName: "Shipping City", dataType: "Text", sortOrder: 160 },
  { fieldName: "Shipping State", dataType: "Dropdown", sortOrder: 170 },
  { fieldName: "GST No", dataType: "Text", sortOrder: 180 },
  { fieldName: "PAN", dataType: "Text", sortOrder: 190 },
  { fieldName: "Category", dataType: "Dropdown", notes: "A | B | Platinum", sortOrder: 200 },
  { fieldName: "Account Owner", dataType: "Dropdown", sortOrder: 210 },
  { fieldName: "Beat Route", dataType: "Dropdown", sortOrder: 220 },
  { fieldName: "Default Warehouse", dataType: "Dropdown", sortOrder: 230 },
  { fieldName: "Payment Terms", dataType: "Dropdown", notes: "COD | 7 | 15 | 30 Days", sortOrder: 240 },
  { fieldName: "Credit Limit", dataType: "Number", sortOrder: 250 },
  { fieldName: "Opening Balance", dataType: "Number", sortOrder: 260 },
  { fieldName: "Outstanding Amount", dataType: "Number", notes: "Derived", sortOrder: 270 },
  { fieldName: "Discount Eligibility", dataType: "Dropdown", notes: "Yes | No", sortOrder: 280 },
];

const CUSTOMER_RECORD_TYPES: { recordTypeName: string; sortOrder: number }[] = [
  { recordTypeName: "GT", sortOrder: 1 },
  { recordTypeName: "MT", sortOrder: 2 },
  { recordTypeName: "Ecom", sortOrder: 3 },
  { recordTypeName: "Horeca", sortOrder: 4 },
];

async function ensureObject(manager: EntityManager, name: string, helpText: string): Promise<ObjectEntity> {
  const repo = manager.getRepository(ObjectEntity);
  let row = await repo.findOne({ where: { name, isDeleted: false } });
  if (!row) {
    row = repo.create({
      name,
      helpText,
      dataType: "",
      isActive: true,
      isDeleted: false,
    });
    row = await repo.save(row);
    console.log(`✅ Object created: ${name}`);
  }
  return row;
}

async function ensureTab(manager: EntityManager, name: string, orderNumber: number): Promise<Tab> {
  const repo = manager.getRepository(Tab);
  let row = await repo.findOne({ where: { name, isDeleted: false } });
  if (!row) {
    row = repo.create({
      name,
      orderNumber,
      isActive: true,
      isDeleted: false,
    });
    row = await repo.save(row);
    console.log(`✅ Tab created: ${name}`);
  } else if (row.orderNumber !== orderNumber) {
    row.orderNumber = orderNumber;
    row = await repo.save(row);
  }
  return row;
}

async function ensureObjectRecordTypeDefinitions(
  manager: EntityManager,
  objectName: string,
  defs: { recordTypeName: string; sortOrder: number }[]
): Promise<void> {
  const obj = await manager.getRepository(ObjectEntity).findOne({ where: { name: objectName, isDeleted: false } });
  if (!obj) return;
  const repo = manager.getRepository(ObjectRecordTypeDefinition);
  for (const d of defs) {
    const exists = await repo.findOne({ where: { object: { id: obj.id }, recordTypeName: d.recordTypeName } });
    if (!exists) {
      await repo.save(
        repo.create({
          object: obj,
          recordTypeName: d.recordTypeName,
          sortOrder: d.sortOrder,
          isActive: true,
        })
      );
      console.log(`✅ Record type definition: ${objectName}.${d.recordTypeName}`);
    }
  }
}

async function ensureObjectFieldDefinitions(
  manager: EntityManager,
  objectName: string,
  defs: { fieldName: string; dataType: string; notes?: string; sortOrder: number }[]
): Promise<void> {
  const obj = await manager.getRepository(ObjectEntity).findOne({ where: { name: objectName, isDeleted: false } });
  if (!obj) return;
  const repo = manager.getRepository(ObjectFieldDefinition);
  for (const d of defs) {
    const exists = await repo.findOne({ where: { object: { id: obj.id }, fieldName: d.fieldName } });
    if (!exists) {
      await repo.save(
        repo.create({
          object: obj,
          fieldName: d.fieldName,
          dataType: d.dataType,
          notes: d.notes,
          sortOrder: d.sortOrder,
          isActive: true,
        })
      );
      console.log(`✅ Field definition: ${objectName}.${d.fieldName}`);
    }
  }
}

async function ensureProfile(
  manager: EntityManager,
  profileName: string,
  opts: { userLicence: string; remarks: string; department: string; createdBy: IUserReference }
): Promise<Profile> {
  const repo = manager.getRepository(Profile);
  let row = await repo.findOne({ where: { profileName } });
  if (!row) {
    row = repo.create({
      profileName,
      userLicence: opts.userLicence,
      remarks: opts.remarks,
      department: opts.department,
      createdBy: opts.createdBy,
    });
    row = await repo.save(row);
    console.log(`✅ Profile created: ${profileName}`);
  }
  return row;
}

async function main(): Promise<void> {
  await DbConnections.AppDbConnection.initialize();
  const ds = DbConnections.AppDbConnection.getConnection();

  const user = await ds.getRepository(User).findOne({ where: {} });
  if (!user) {
    console.error("No user found — seed a user first.");
    process.exit(1);
  }
  const createdBy: IUserReference = {
    id: user.emp_id,
    name: `${user.firstname} ${user.lastname || ""}`.trim(),
  };

  await ds.transaction(async (manager) => {
    for (const n of OBJECT_NAMES) {
      await ensureObject(manager, n, n);
    }
    await ensureObjectFieldDefinitions(manager, "Customer", CUSTOMER_FIELD_DEFS);
    await ensureObjectRecordTypeDefinitions(manager, "Customer", CUSTOMER_RECORD_TYPES);
    let order = 1;
    for (const n of NAV_TABS) {
      await ensureTab(manager, n, order++);
    }

    const systemAdmin = await ensureProfile(manager, "System Admin", {
      userLicence: "Enterprise",
      remarks: "Full system access - all modules",
      department: "All Departments",
      createdBy,
    });

    const salesManager = await ensureProfile(manager, "Sales Manager", {
      userLicence: "Enterprise",
      remarks: "Full sales + read finance",
      department: "Sales",
      createdBy,
    });

    const tabPayload = NAV_TABS.map((tabName) => ({
      tabName,
      readOnly: true,
      defaultOn: true,
    }));

    await applyProfilePermissions(manager, systemAdmin.profileId, {
      tabPermissions: tabPayload,
      objectPermissions: OBJECT_NAMES.map((objectName) => ({
        objectName,
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      })),
      fieldPermissions: [
        { objectName: "Customer", fieldName: "Parent Customer", mandatory: false, readOnly: false, editable: true, notes: "Hierarchy" },
        { objectName: "Customer", fieldName: "Customer Name", mandatory: true, readOnly: false, editable: true },
        {
          objectName: "Customer",
          fieldName: "Customer Type",
          mandatory: true,
          readOnly: false,
          editable: true,
          notes: "GT | MT | Ecom | Horeca",
        },
        { objectName: "Customer", fieldName: "Channel Type", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Phone", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Alternate Mobile", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Email", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Billing Address Line 1", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Billing Address Line 2", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Billing Country", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Billing State", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Billing District", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Billing City", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Billing Street", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Billing Pin Code", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Shipping City", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Shipping State", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "GST No", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "PAN", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Category", mandatory: false, readOnly: false, editable: true, notes: "A | B | Platinum" },
        { objectName: "Customer", fieldName: "Account Owner", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Beat Route", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Default Warehouse", mandatory: false, readOnly: false, editable: true },
        {
          objectName: "Customer",
          fieldName: "Payment Terms",
          mandatory: false,
          readOnly: false,
          editable: true,
          notes: "COD | 7 | 15 | 30 Days",
        },
        { objectName: "Customer", fieldName: "Credit Limit", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Opening Balance", mandatory: false, readOnly: false, editable: true },
        { objectName: "Customer", fieldName: "Outstanding Amount", mandatory: false, readOnly: true, editable: false, notes: "Derived" },
        { objectName: "Customer", fieldName: "Discount Eligibility", mandatory: false, readOnly: false, editable: true, notes: "Yes | No" },
      ],
      recordTypeAccesses: ["GT", "MT", "Ecom", "Horeca"].map((recordTypeName) => ({
        objectName: "Customer",
        recordTypeName,
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      })),
    });

    const financeModules = [
      "Invoice Control Center",
      "Invoice",
      "Warehouse",
      "GRN",
      "Pricebook",
      "Scheme",
      "Discount",
      "Beat",
    ];
    const salesManagerObjects = [...NAV_TABS, ...financeModules];
    await applyProfilePermissions(manager, salesManager.profileId, {
      tabPermissions: tabPayload,
      objectPermissions: salesManagerObjects.map((objectName) => ({
        objectName,
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: false,
      })),
    });
  });

  console.log("\n✅ Profile permission seed finished (System Admin + Sales Manager).");
  await DbConnections.AppDbConnection.close();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
