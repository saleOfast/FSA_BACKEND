import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDeletedToDistrict1774433287794 implements MigrationInterface {
    name = 'AddIsDeletedToDistrict1774433287794'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "districts" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "scheme" ADD CONSTRAINT "FK_06c7a3723ededb87b94c745b1e5" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheme" DROP CONSTRAINT "FK_06c7a3723ededb87b94c745b1e5"`);
        await queryRunner.query(`ALTER TABLE "districts" DROP COLUMN "is_deleted"`);
    }

}
