import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeliveryTables1770900000000 implements MigrationInterface {
  name = "AddDeliveryTables1770900000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create DeliveryStatus enum
    await queryRunner.query(`
      CREATE TYPE "public"."delivery_header_delivery_status_enum" AS ENUM(
        'DRAFT', 'PICK_LIST', 'PICKED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'
      )
    `);

    // Add warehouse_id to sales_order_header if not exists (for SO/Customer mapping)
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sales_order_header' AND column_name='warehouse_id') THEN
          ALTER TABLE "sales_order_header" ADD COLUMN "warehouse_id" uuid;
          ALTER TABLE "sales_order_header" ADD CONSTRAINT "FK_so_warehouse" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END $$
    `);

    // Create delivery_header table
    await queryRunner.query(`
      CREATE TABLE "delivery_header" (
        "delivery_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "delivery_status" "public"."delivery_header_delivery_status_enum" NOT NULL DEFAULT 'DRAFT',
        "sales_order_id" integer NOT NULL,
        "customer_id" integer NOT NULL,
        "warehouse_id" uuid NOT NULL,
        "delivery_date" date,
        "vehicle_number" character varying(50),
        "transporter_name" character varying(200),
        "driver_name" character varying(100),
        "driver_mobile" character varying(20),
        "eway_bill_no" character varying(50),
        "dispatch_date" date,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "is_deleted" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_delivery_header" PRIMARY KEY ("delivery_id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "delivery_header" ADD CONSTRAINT "FK_delivery_sales_order"
      FOREIGN KEY ("sales_order_id") REFERENCES "sales_order_header"("so_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "delivery_header" ADD CONSTRAINT "FK_delivery_customer"
      FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "delivery_header" ADD CONSTRAINT "FK_delivery_warehouse"
      FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // Create delivery_items table
    await queryRunner.query(`
      CREATE TABLE "delivery_items" (
        "delivery_item_id" SERIAL NOT NULL,
        "delivery_id" uuid NOT NULL,
        "order_item_id" integer NOT NULL,
        "sku_id" integer NOT NULL,
        "product_id" integer NOT NULL,
        "ordered_qty" integer NOT NULL,
        "batch_id" integer,
        "dispatched_qty" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "is_deleted" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_delivery_items" PRIMARY KEY ("delivery_item_id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_di_delivery"
      FOREIGN KEY ("delivery_id") REFERENCES "delivery_header"("delivery_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_di_order_item"
      FOREIGN KEY ("order_item_id") REFERENCES "sales_order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_di_sku"
      FOREIGN KEY ("sku_id") REFERENCES "sku"("sku_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_di_product"
      FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "delivery_items" ADD CONSTRAINT "FK_di_batch"
      FOREIGN KEY ("batch_id") REFERENCES "batches"("batch_id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_di_batch"`);
    await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_di_product"`);
    await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_di_sku"`);
    await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_di_order_item"`);
    await queryRunner.query(`ALTER TABLE "delivery_items" DROP CONSTRAINT "FK_di_delivery"`);
    await queryRunner.query(`DROP TABLE "delivery_items"`);

    await queryRunner.query(`ALTER TABLE "delivery_header" DROP CONSTRAINT "FK_delivery_warehouse"`);
    await queryRunner.query(`ALTER TABLE "delivery_header" DROP CONSTRAINT "FK_delivery_customer"`);
    await queryRunner.query(`ALTER TABLE "delivery_header" DROP CONSTRAINT "FK_delivery_sales_order"`);
    await queryRunner.query(`DROP TABLE "delivery_header"`);

    await queryRunner.query(`DROP TYPE "public"."delivery_header_delivery_status_enum"`);

    try {
      await queryRunner.query(`ALTER TABLE "sales_order_header" DROP CONSTRAINT "FK_so_warehouse"`);
      await queryRunner.query(`ALTER TABLE "sales_order_header" DROP COLUMN "warehouse_id"`);
    } catch {
      // warehouse_id may not exist
    }
  }
}
