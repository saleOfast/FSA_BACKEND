import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDeliveryIdTypeInInvoice1710000000000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`
      ALTER TABLE "invoice_header"
      DROP COLUMN "delivery_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "invoice_header"
      ADD COLUMN "delivery_id" integer
    `);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`
      ALTER TABLE "invoice_header"
      DROP COLUMN "delivery_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "invoice_header"
      ADD COLUMN "delivery_id" uuid
    `);

  }

}