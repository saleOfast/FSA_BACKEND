import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDeletedToWarehouses1770272082064 implements MigrationInterface {

 public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE warehouses
      ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE warehouses
      DROP COLUMN IF EXISTS is_deleted
    `);
  }

}
