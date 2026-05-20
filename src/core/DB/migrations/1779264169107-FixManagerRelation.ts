import { MigrationInterface, QueryRunner } from "typeorm";

export class FixManagerRelation1779264169107 implements MigrationInterface {

    name = 'FixManagerRelation1779264169107'

    public async up(queryRunner: QueryRunner): Promise<void> {

        // Drop wrong FK if exists
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP CONSTRAINT IF EXISTS "FK_874662e039ab7d31a71450eb501"
        `);

        // Drop wrong camelCase column
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN IF EXISTS "managerId"
        `);

        // Ensure correct column exists
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD COLUMN IF NOT EXISTS "manager_id" integer
        `);

        // Add proper FK
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_users_manager_id"
            FOREIGN KEY ("manager_id")
            REFERENCES "users"("emp_id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE "users"
            DROP CONSTRAINT IF EXISTS "FK_users_manager_id"
        `);

        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN IF EXISTS "manager_id"
        `);

        await queryRunner.query(`
            ALTER TABLE "users"
            ADD COLUMN "managerId" integer
        `);
    }
}