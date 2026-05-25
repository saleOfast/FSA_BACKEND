import { MigrationInterface, QueryRunner } from "typeorm";

/** Removes legacy `emp_id` / `key` from `role` (replaced by profile + parent + created_by). */
export class DropRoleEmpIdColumn1779437000000 implements MigrationInterface {
  name = "DropRoleEmpIdColumn1779437000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN IF EXISTS "emp_id"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN IF EXISTS "key"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" ADD COLUMN IF NOT EXISTS "emp_id" integer`);
    await queryRunner.query(`ALTER TABLE "role" ADD COLUMN IF NOT EXISTS "key" character varying`);
  }
}
