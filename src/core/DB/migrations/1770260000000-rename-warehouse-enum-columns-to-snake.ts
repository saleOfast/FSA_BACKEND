import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Renames warehouse enum columns from camelCase to snake_case so they match
 * the entity's explicit column names (ownership_type, business_role).
 * Safe to run: renames only if the old columns exist.
 */
export class RenameWarehouseEnumColumnsToSnake1770260000000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("warehouses");
    if (!table) return;

    const hasOwnershipType = table.columns.some((c) => c.name === "ownershipType");
    const hasBusinessRole = table.columns.some((c) => c.name === "businessRole");

    if (hasOwnershipType) {
      await queryRunner.query(
        `ALTER TABLE warehouses RENAME COLUMN "ownershipType" TO ownership_type`
      );
    }
    if (hasBusinessRole) {
      await queryRunner.query(
        `ALTER TABLE warehouses RENAME COLUMN "businessRole" TO business_role`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("warehouses");
    if (!table) return;

    const hasOwnershipType = table.columns.some((c) => c.name === "ownership_type");
    const hasBusinessRole = table.columns.some((c) => c.name === "business_role");

    if (hasOwnershipType) {
      await queryRunner.query(
        `ALTER TABLE warehouses RENAME COLUMN ownership_type TO "ownershipType"`
      );
    }
    if (hasBusinessRole) {
      await queryRunner.query(
        `ALTER TABLE warehouses RENAME COLUMN business_role TO "businessRole"`
      );
    }
  }
}
