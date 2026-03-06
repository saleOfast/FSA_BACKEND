import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWarehouseNameToCustomer1772429430474 implements MigrationInterface {
    name = 'AddWarehouseNameToCustomer1772429430474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ADD "warehouse_name" character varying`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "warehouse_id" uuid`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_37ed2f9431422c668a8c2157e0d" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_37ed2f9431422c668a8c2157e0d"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "warehouse_id"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "warehouse_name"`);
    }

}
