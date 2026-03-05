import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSkuIdToDispatchItem1772691629576 implements MigrationInterface {
    name = 'AddSkuIdToDispatchItem1772691629576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dispatch_item" ADD "sku_id" integer`);
        await queryRunner.query(`ALTER TABLE "dispatch_item" ADD CONSTRAINT "FK_9fe33666c83575669273ad2fde6" FOREIGN KEY ("sku_id") REFERENCES "sku"("sku_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dispatch_item" DROP CONSTRAINT "FK_9fe33666c83575669273ad2fde6"`);
        await queryRunner.query(`ALTER TABLE "dispatch_item" DROP COLUMN "sku_id"`);
    }

}
