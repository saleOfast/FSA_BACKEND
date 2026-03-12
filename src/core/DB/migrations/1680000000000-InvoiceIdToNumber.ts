import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeInvoiceIdToSerial1680000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop existing FK from invoice_items
    await queryRunner.query(`
      ALTER TABLE invoice_items DROP CONSTRAINT IF EXISTS "FK_invoice_items_header";
    `);

    // 2. Drop PK from invoice_header
    await queryRunner.query(`
      ALTER TABLE invoice_header DROP CONSTRAINT IF EXISTS "PK_invoice_header";
    `);

    // 3. Drop old invoice_id columns if needed
    // (optional if already exists in new column)
    // await queryRunner.query(`ALTER TABLE invoice_header DROP COLUMN IF EXISTS invoice_id`);
    // await queryRunner.query(`ALTER TABLE invoice_items DROP COLUMN IF EXISTS invoice_id`);

    // 4. Add new serial column to invoice_header
    await queryRunner.query(`
      ALTER TABLE invoice_header
      ADD COLUMN invoice_id_new SERIAL PRIMARY KEY;
    `);

    // 5. Add new integer column to invoice_items
    await queryRunner.query(`
      ALTER TABLE invoice_items
      ADD COLUMN invoice_id_new INT;
    `);

    // 6. Migrate invoice_id from header to items
    await queryRunner.query(`
      UPDATE invoice_items ii
      SET invoice_id_new = ih.invoice_id_new
      FROM invoice_header ih
      WHERE ii.invoice_id = ih.invoice_id;
    `);

    // 7. Drop old invoice_id columns
    await queryRunner.query(`
      ALTER TABLE invoice_items DROP COLUMN invoice_id;
    `);
    await queryRunner.query(`
      ALTER TABLE invoice_header DROP COLUMN invoice_id;
    `);

    // 8. Rename new columns
    await queryRunner.query(`
      ALTER TABLE invoice_header RENAME COLUMN invoice_id_new TO invoice_id;
    `);
    await queryRunner.query(`
      ALTER TABLE invoice_items RENAME COLUMN invoice_id_new TO invoice_id;
    `);

    // 9. Add foreign key back
    await queryRunner.query(`
      ALTER TABLE invoice_items
      ADD CONSTRAINT "FK_invoice_items_header"
      FOREIGN KEY (invoice_id) REFERENCES invoice_header(invoice_id) ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // You can write reverse steps if needed
  }
}