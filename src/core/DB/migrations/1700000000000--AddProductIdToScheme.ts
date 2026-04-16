import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductIdToScheme1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "scheme"
      ADD COLUMN IF NOT EXISTS "product_id" INT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "scheme"
      DROP COLUMN IF EXISTS "product_id";
    `);
  }
}