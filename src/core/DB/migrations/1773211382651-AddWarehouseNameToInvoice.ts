import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWarehouseNameToInvoice1773211382651 implements MigrationInterface {
  name = "AddWarehouseNameToInvoice1773211382651";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "invoice_header"
      ADD COLUMN "warehouse_name" character varying(200)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "invoice_header"
      DROP COLUMN "warehouse_name"
    `);
  }
}