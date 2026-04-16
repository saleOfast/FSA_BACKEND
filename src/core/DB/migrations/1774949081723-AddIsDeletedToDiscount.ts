import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDeletedToDiscount1774949081723 implements MigrationInterface {
    name = 'AddIsDeletedToDiscount1774949081723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discounts" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "inventory" ALTER COLUMN "inventory_name" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" ALTER COLUMN "inventory_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "discounts" DROP COLUMN "is_deleted"`);
    }

}
