import { MigrationInterface, QueryRunner } from "typeorm";

export class Changerolefields1779436361812 implements MigrationInterface {
  name = "Changerolefields1779436361812";

  public async up(queryRunner: QueryRunner): Promise<void> {

    // Remove old unwanted column
    await queryRunner.query(`
      ALTER TABLE "role"
      DROP COLUMN IF EXISTS "emp_id"
    `);

    // Add new columns
    await queryRunner.query(`
      ALTER TABLE "role"
      ADD COLUMN IF NOT EXISTS "profile_id" integer,
      ADD COLUMN IF NOT EXISTS "parent_role_id" integer,
      ADD COLUMN IF NOT EXISTS "description" text,
      ADD COLUMN IF NOT EXISTS "created_by" jsonb,
      ADD COLUMN IF NOT EXISTS "modified_by" jsonb
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_role_profile'
        ) THEN
          ALTER TABLE "role"
          ADD CONSTRAINT "FK_role_profile"
          FOREIGN KEY ("profile_id")
          REFERENCES "profiles"("profileId")
          ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_role_parent'
        ) THEN
          ALTER TABLE "role"
          ADD CONSTRAINT "FK_role_parent"
          FOREIGN KEY ("parent_role_id")
          REFERENCES "role"("role_id")
          ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    // Remove constraints
    await queryRunner.query(`
      ALTER TABLE "role"
      DROP CONSTRAINT IF EXISTS "FK_role_parent"
    `);

    await queryRunner.query(`
      ALTER TABLE "role"
      DROP CONSTRAINT IF EXISTS "FK_role_profile"
    `);

    // Remove added columns
    await queryRunner.query(`
      ALTER TABLE "role"
      DROP COLUMN IF EXISTS "modified_by",
      DROP COLUMN IF EXISTS "created_by",
      DROP COLUMN IF EXISTS "description",
      DROP COLUMN IF EXISTS "parent_role_id",
      DROP COLUMN IF EXISTS "profile_id"
    `);

    // Recreate emp_id if rollback happens
    await queryRunner.query(`
      ALTER TABLE "role"
      ADD COLUMN IF NOT EXISTS "emp_id" integer
    `);
  }
}