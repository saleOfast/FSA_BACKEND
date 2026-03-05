import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceDeliveryWithDispatch1772448454780 implements MigrationInterface {
    name = 'ReplaceDeliveryWithDispatch1772448454780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."dispatch_item_dispatch_status_enum" AS ENUM('PENDING', 'PARTIALLY_DISPATCHED', 'FULLY_DISPATCHED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "dispatch_item" ("dispatch_item_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ordered_qty" integer NOT NULL, "dispatched_qty" integer NOT NULL, "remaining_qty" integer NOT NULL, "dispatch_status" "public"."dispatch_item_dispatch_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "dispatch_id" uuid, "sales_order_item_id" integer, "product_id" integer, "batch_id" integer, CONSTRAINT "PK_b8c342a5dcd1293b11f6fe7d13b" PRIMARY KEY ("dispatch_item_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."dispatch_header_dispatch_status_enum" AS ENUM('PENDING', 'PARTIALLY_DISPATCHED', 'FULLY_DISPATCHED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "dispatch_header" ("dispatch_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dispatch_status" "public"."dispatch_header_dispatch_status_enum" NOT NULL DEFAULT 'PENDING', "sales_order_id" integer NOT NULL, "customer_name" character varying(200) NOT NULL, "warehouse_name" character varying(200) NOT NULL, "vehicle_number" character varying(50), "transporter_name" character varying(200), "driver_name" character varying(100), "driver_mobile" character varying(20), "eway_bill_no" character varying(50), "dispatch_date" date, "remarks" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_954a1fdd6877e73bec801545fe4" PRIMARY KEY ("dispatch_id"))`);
        await queryRunner.query(`ALTER TABLE "dispatch_item" ADD CONSTRAINT "FK_cd12c018b128a712f7eeb29f140" FOREIGN KEY ("dispatch_id") REFERENCES "dispatch_header"("dispatch_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dispatch_item" ADD CONSTRAINT "FK_76b67a2e5a8a6afddf1f2b23875" FOREIGN KEY ("sales_order_item_id") REFERENCES "sales_order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dispatch_item" ADD CONSTRAINT "FK_af59289a1520cad5a70a840d2f7" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dispatch_item" ADD CONSTRAINT "FK_97a29bba265240f25172a0bf508" FOREIGN KEY ("batch_id") REFERENCES "batches"("batch_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dispatch_header" ADD CONSTRAINT "FK_d2969fb451dd8cb3480b444f39c" FOREIGN KEY ("sales_order_id") REFERENCES "sales_order_header"("so_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dispatch_header" DROP CONSTRAINT "FK_d2969fb451dd8cb3480b444f39c"`);
        await queryRunner.query(`ALTER TABLE "dispatch_item" DROP CONSTRAINT "FK_97a29bba265240f25172a0bf508"`);
        await queryRunner.query(`ALTER TABLE "dispatch_item" DROP CONSTRAINT "FK_af59289a1520cad5a70a840d2f7"`);
        await queryRunner.query(`ALTER TABLE "dispatch_item" DROP CONSTRAINT "FK_76b67a2e5a8a6afddf1f2b23875"`);
        await queryRunner.query(`ALTER TABLE "dispatch_item" DROP CONSTRAINT "FK_cd12c018b128a712f7eeb29f140"`);
        await queryRunner.query(`DROP TABLE "dispatch_header"`);
        await queryRunner.query(`DROP TYPE "public"."dispatch_header_dispatch_status_enum"`);
        await queryRunner.query(`DROP TABLE "dispatch_item"`);
        await queryRunner.query(`DROP TYPE "public"."dispatch_item_dispatch_status_enum"`);
    }

}
