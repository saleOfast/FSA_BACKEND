import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDeletedToProfiles1778052700000 implements MigrationInterface {
  name = "AddIsDeletedToProfiles1778052700000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "profiles"
      ADD COLUMN IF NOT EXISTS "isDeleted" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "profiles"
      DROP COLUMN IF EXISTS "isDeleted"
    `);
  }
}
