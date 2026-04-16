import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPriceBookItemToSalesorderItem1776149272400 implements MigrationInterface {
    name = 'AddPriceBookItemToSalesorderItem1776149272400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales_order_item" ADD "pricebook_item_id" integer`);
        await queryRunner.query(`ALTER TABLE "sales_order_item" ADD CONSTRAINT "FK_b15c2c903dca8c34da156e98a41" FOREIGN KEY ("pricebook_item_id") REFERENCES "price_book_items"("priceBookItemId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales_order_item" DROP CONSTRAINT "FK_b15c2c903dca8c34da156e98a41"`);
        await queryRunner.query(`ALTER TABLE "sales_order_item" DROP COLUMN "pricebook_item_id"`);
    }

}
