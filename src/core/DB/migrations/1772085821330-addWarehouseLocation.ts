import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWarehouseLocation1772085821330 implements MigrationInterface {
    name = 'AddWarehouseLocation1772085821330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouses" ADD "shipping_country_name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "warehouses" ADD "shipping_state_name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "warehouses" ADD "shipping_district_name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "delivery_header" ADD "remarks" text`);
        await queryRunner.query(`ALTER TABLE "sales_order_item" ALTER COLUMN "warehouse_name" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales_order_item" ALTER COLUMN "warehouse_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "delivery_header" DROP COLUMN "remarks"`);
        await queryRunner.query(`ALTER TABLE "warehouses" DROP COLUMN "shipping_district_name"`);
        await queryRunner.query(`ALTER TABLE "warehouses" DROP COLUMN "shipping_state_name"`);
        await queryRunner.query(`ALTER TABLE "warehouses" DROP COLUMN "shipping_country_name"`);
    }

}
