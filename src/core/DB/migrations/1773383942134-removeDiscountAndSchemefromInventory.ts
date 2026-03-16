import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDiscountAndSchemefromInventory1773383942134 implements MigrationInterface {
    name = 'RemoveDiscountAndSchemefromInventory1773383942134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "scheme_id"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "discount_id"`);
        await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_dc991d555664682cfe892eea2c1"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "invoice_header_invoice_id_seq" OWNED BY "invoice_header"."invoice_id"`);
        await queryRunner.query(`ALTER TABLE "invoice_header" ALTER COLUMN "invoice_id" SET DEFAULT nextval('"invoice_header_invoice_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_dc991d555664682cfe892eea2c1" FOREIGN KEY ("invoice_id") REFERENCES "invoice_header"("invoice_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_dc991d555664682cfe892eea2c1"`);
        await queryRunner.query(`ALTER TABLE "invoice_header" ALTER COLUMN "invoice_id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "invoice_header_invoice_id_seq"`);
        await queryRunner.query(`ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_dc991d555664682cfe892eea2c1" FOREIGN KEY ("invoice_id") REFERENCES "invoice_header"("invoice_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "discount_id" integer`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "scheme_id" integer`);
    }

}
