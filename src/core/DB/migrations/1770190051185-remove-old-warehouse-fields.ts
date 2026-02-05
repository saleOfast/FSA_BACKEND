import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveOldWarehouseFields1770190051185 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

            await queryRunner.query(`
      ALTER TABLE warehouses
      DROP COLUMN IF EXISTS city,
      DROP COLUMN IF EXISTS address,
      DROP COLUMN IF EXISTS zip,
      DROP COLUMN IF EXISTS manager_id,
      DROP COLUMN IF EXISTS email,
      DROP COLUMN IF EXISTS manager_phone,
      DROP COLUMN IF EXISTS capacity,
      DROP COLUMN IF EXISTS oprational_hours,
      DROP COLUMN IF EXISTS contact_person,
      DROP COLUMN IF EXISTS contact_name,
      DROP COLUMN IF EXISTS type,
      DROP COLUMN IF EXISTS last_modified_by_name,
      DROP COLUMN IF EXISTS created_by_name,
      DROP COLUMN IF EXISTS created_by,
      DROP COLUMN IF EXISTS last_modified_by
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

         await queryRunner.query(`
      ALTER TABLE warehouses
      ADD COLUMN city VARCHAR(100),
      ADD COLUMN address TEXT,
      ADD COLUMN zip VARCHAR(20),
      ADD COLUMN manager_id VARCHAR(50),
      ADD COLUMN email VARCHAR(100),
      ADD COLUMN manager_phone VARCHAR(20),
      ADD COLUMN capacity INTEGER,
      ADD COLUMN oprational_hours VARCHAR(100),
      ADD COLUMN contact_person VARCHAR(100),
      ADD COLUMN contact_name VARCHAR(100),
      ADD COLUMN type VARCHAR(50),
      ADD COLUMN last_modified_by_name VARCHAR(100),
      ADD COLUMN created_by_name VARCHAR(100),
      ADD COLUMN created_by VARCHAR(50),
      ADD COLUMN last_modified_by VARCHAR(50)
    `);
    }

}
