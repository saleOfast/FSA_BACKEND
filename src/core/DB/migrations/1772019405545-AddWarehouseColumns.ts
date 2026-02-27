import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWarehouseColumns1772019405545 implements MigrationInterface {
    name = 'AddWarehouseColumns1772019405545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_di_delivery"`);
        await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_di_order_item"`);
        await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_di_sku"`);
        await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_di_product"`);
        await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_di_batch"`);
        await queryRunner.query(`ALTER TABLE "delivery_header" DROP CONSTRAINT "FK_delivery_sales_order"`);
        await queryRunner.query(`ALTER TABLE "delivery_header" DROP CONSTRAINT "FK_delivery_customer"`);
        await queryRunner.query(`ALTER TABLE "delivery_header" DROP CONSTRAINT "FK_delivery_warehouse"`);
        await queryRunner.query(`ALTER TABLE "sales_order_item" ADD "warehouse_name" character varying(150) `);
        await queryRunner.query(`ALTER TABLE "sales_order_item" ADD "warehouse_id" uuid`);
        await queryRunner.query(`ALTER TABLE "sales_order_item" ADD CONSTRAINT "FK_012ead786b75e54b1ec480b800b" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grn_headers" ADD CONSTRAINT "FK_f568c6db6236fa93d573c4d27a7" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_0a526afb8ad24fb620f2c3d5014" FOREIGN KEY ("delivery_id") REFERENCES "delivery_header"("delivery_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_865d3ef12d6550e08394e753eb5" FOREIGN KEY ("order_item_id") REFERENCES "sales_order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_fb30f04cfc52deadbc614437f29" FOREIGN KEY ("sku_id") REFERENCES "sku"("sku_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_7e9bb458f408319e13ad4d8e32b" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_0477bc62bbe3f8c92c490518dd1" FOREIGN KEY ("batch_id") REFERENCES "batches"("batch_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_header" ADD CONSTRAINT "FK_280b7c3c01583b49095b26b4859" FOREIGN KEY ("sales_order_id") REFERENCES "sales_order_header"("so_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_header" ADD CONSTRAINT "FK_e23cbd6dd1664a8d0e09f0d812b" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_header" ADD CONSTRAINT "FK_ffa2705595c1a75746ea2c400c3" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_header" DROP CONSTRAINT "FK_ffa2705595c1a75746ea2c400c3"`);
        await queryRunner.query(`ALTER TABLE "delivery_header" DROP CONSTRAINT "FK_e23cbd6dd1664a8d0e09f0d812b"`);
        await queryRunner.query(`ALTER TABLE "delivery_header" DROP CONSTRAINT "FK_280b7c3c01583b49095b26b4859"`);
        await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_0477bc62bbe3f8c92c490518dd1"`);
        await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_7e9bb458f408319e13ad4d8e32b"`);
        await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_fb30f04cfc52deadbc614437f29"`);
        await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_865d3ef12d6550e08394e753eb5"`);
        await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_0a526afb8ad24fb620f2c3d5014"`);
        await queryRunner.query(`ALTER TABLE "grn_headers" DROP CONSTRAINT "FK_f568c6db6236fa93d573c4d27a7"`);
        await queryRunner.query(`ALTER TABLE "sales_order_item" DROP CONSTRAINT "FK_012ead786b75e54b1ec480b800b"`);
        await queryRunner.query(`ALTER TABLE "sales_order_item" DROP COLUMN "warehouse_id"`);
        await queryRunner.query(`ALTER TABLE "sales_order_item" DROP COLUMN "warehouse_name"`);
        await queryRunner.query(`ALTER TABLE "delivery_header" ADD CONSTRAINT "FK_delivery_warehouse" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_header" ADD CONSTRAINT "FK_delivery_customer" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_header" ADD CONSTRAINT "FK_delivery_sales_order" FOREIGN KEY ("sales_order_id") REFERENCES "sales_order_header"("so_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_di_batch" FOREIGN KEY ("batch_id") REFERENCES "batches"("batch_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_di_product" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_di_sku" FOREIGN KEY ("sku_id") REFERENCES "sku"("sku_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_di_order_item" FOREIGN KEY ("order_item_id") REFERENCES "sales_order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_di_delivery" FOREIGN KEY ("delivery_id") REFERENCES "delivery_header"("delivery_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
