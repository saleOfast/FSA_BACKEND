import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeliveryRecordTables1772300000000 implements MigrationInterface {
  name = "AddDeliveryRecordTables1772300000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop old delivery tables and enums if they exist
    await queryRunner.query(`DROP TABLE IF EXISTS "delivery_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "delivery_item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "delivery_header"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."delivery_item_delivery_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."delivery_header_delivery_status_enum"`);

    await queryRunner.query(`
      CREATE TYPE "public"."delivery_header_delivery_status_enum" AS ENUM(
        'IN_TRANSIT', 'PARTIAL_DELIVERED', 'FULLY_DELIVERED'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "delivery_header" (
        "delivery_id" SERIAL NOT NULL,
        "dispatch_id" integer NOT NULL,
        "delivery_status" "public"."delivery_header_delivery_status_enum" NOT NULL DEFAULT 'IN_TRANSIT',
        "customer_name" character varying(200) NOT NULL,
        "delivery_address" text,
        "customer_mobile" character varying(20),
        "warehouse_name" character varying(200) NOT NULL,
        "vehicle_number" character varying(50),
        "transporter_name" character varying(200),
        "driver_name" character varying(100),
        "driver_mobile" character varying(20),
        "eway_bill_no" character varying(50),
        "delivery_date" date,
        "remarks" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "is_deleted" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_delivery_header" PRIMARY KEY ("delivery_id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "delivery_header" ADD CONSTRAINT "FK_delivery_dispatch"
      FOREIGN KEY ("dispatch_id") REFERENCES "dispatch_header"("dispatch_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "delivery_item" (
        "delivery_item_id" SERIAL NOT NULL,
        "delivery_id" integer NOT NULL,
        "dispatch_item_id" integer,
        "sku_id" integer NOT NULL,
        "product_id" integer NOT NULL,
        "ordered_qty" integer NOT NULL,
        "batch_id" integer,
        "deliverable_qty" integer NOT NULL,
        "delivered_qty" integer NOT NULL DEFAULT 0,
        "delivery_date" date,
        "remaining_qty" integer NOT NULL DEFAULT 0,
        "delivery_status" "public"."delivery_header_delivery_status_enum" NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "is_deleted" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_delivery_item" PRIMARY KEY ("delivery_item_id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "delivery_item" ADD CONSTRAINT "FK_delivery_item_delivery"
      FOREIGN KEY ("delivery_id") REFERENCES "delivery_header"("delivery_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "delivery_item" ADD CONSTRAINT "FK_delivery_item_dispatch_item"
      FOREIGN KEY ("dispatch_item_id") REFERENCES "dispatch_item"("dispatch_item_id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "delivery_item" ADD CONSTRAINT "FK_delivery_item_sku"
      FOREIGN KEY ("sku_id") REFERENCES "sku"("sku_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "delivery_item" ADD CONSTRAINT "FK_delivery_item_product"
      FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "delivery_item" ADD CONSTRAINT "FK_delivery_item_batch"
      FOREIGN KEY ("batch_id") REFERENCES "batches"("batch_id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "delivery_item" DROP CONSTRAINT "FK_delivery_item_batch"`);
    await queryRunner.query(`ALTER TABLE "delivery_item" DROP CONSTRAINT "FK_delivery_item_product"`);
    await queryRunner.query(`ALTER TABLE "delivery_item" DROP CONSTRAINT "FK_delivery_item_sku"`);
    await queryRunner.query(`ALTER TABLE "delivery_item" DROP CONSTRAINT "FK_delivery_item_dispatch_item"`);
    await queryRunner.query(`ALTER TABLE "delivery_item" DROP CONSTRAINT "FK_delivery_item_delivery"`);
    await queryRunner.query(`DROP TABLE "delivery_item"`);

    await queryRunner.query(`ALTER TABLE "delivery_header" DROP CONSTRAINT "FK_delivery_dispatch"`);
    await queryRunner.query(`DROP TABLE "delivery_header"`);
    await queryRunner.query(`DROP TYPE "public"."delivery_header_delivery_status_enum"`);
  }
}
