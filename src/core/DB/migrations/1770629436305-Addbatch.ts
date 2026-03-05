import { MigrationInterface, QueryRunner } from "typeorm";

export class Addbatch1770629436305 implements MigrationInterface {
    name = 'Addbatch1770629436305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."warehouse_status_enum" AS ENUM('DRAFT', 'ACTIVE', 'SUSPENDED', 'CLOSED')`);
        await queryRunner.query(`CREATE TYPE "public"."warehouses_ownership_type_enum" AS ENUM('COMPANY', 'DISTRIBUTOR')`);
        await queryRunner.query(`CREATE TYPE "public"."warehouses_business_role_enum" AS ENUM('PLANT', 'PRIMARY')`);
        await queryRunner.query(`CREATE TYPE "public"."warehouses_franchise_enum" AS ENUM('YES', 'NO')`);
        await queryRunner.query(`CREATE TYPE "public"."warehouses_sez_enum" AS ENUM('YES', 'NO')`);
        await queryRunner.query(`CREATE TYPE "public"."warehouses_custom_zone_enum" AS ENUM('NORTH', 'SOUTH', 'EAST', 'WEST')`);
        await queryRunner.query(`CREATE TABLE "warehouses" ("warehouse_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "warehouse_code" character varying(30) NOT NULL, "warehouse_name" character varying(100) NOT NULL, "status" "public"."warehouse_status_enum" NOT NULL DEFAULT 'DRAFT', "active_flag" boolean NOT NULL DEFAULT true, "effective_from" date NOT NULL, "effective_to" date, "ownership_type" "public"."warehouses_ownership_type_enum" NOT NULL, "business_role" "public"."warehouses_business_role_enum" NOT NULL, "legal_entity_id" integer NOT NULL, "parent_partner_id" integer NOT NULL, "franchise" "public"."warehouses_franchise_enum" NOT NULL, "shipping_street" text NOT NULL, "shipping_city" character varying(100) NOT NULL, "shipping_pin_code" character varying(20) NOT NULL, "gst_no" character varying(20), "vat_registration_no" character varying(50), "tax_registration_type" character varying(50), "sez" "public"."warehouses_sez_enum" NOT NULL, "custom_zone" "public"."warehouses_custom_zone_enum" NOT NULL, "allows_sales" boolean NOT NULL, "allows_purchase" boolean NOT NULL, "allows_returns" boolean NOT NULL, "supports_batch" boolean NOT NULL DEFAULT false, "supports_expiry" boolean NOT NULL DEFAULT false, "supports_serial" boolean NOT NULL DEFAULT false, "temperature_controlled" boolean NOT NULL DEFAULT false, "cross_docking_flag" boolean NOT NULL DEFAULT false, "consignment_flag" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "shipping_country_id" integer, "shipping_state_id" integer, "shipping_district_id" integer, CONSTRAINT "UQ_182bbb8c4c53a982923d40f2bdc" UNIQUE ("warehouse_code"), CONSTRAINT "PK_02702eca36a8790626984c68de1" PRIMARY KEY ("warehouse_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."batches_status_enum" AS ENUM('ACTIVE', 'BLOCKED', 'EXPIRED', 'QUARANTINE')`);
        await queryRunner.query(`CREATE TYPE "public"."batches_quality_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`);
        await queryRunner.query(`CREATE TYPE "public"."batches_storage_condition_enum" AS ENUM('AMBIENT', 'COLD_CHAIN', 'FROZEN')`);
        await queryRunner.query(`CREATE TABLE "batches" ("batch_id" SERIAL NOT NULL, "inventory_id" integer NOT NULL, "batch_no" character varying NOT NULL, "mfg_date" date, "expiry_date" date, "received_date" date, "current_stock" integer NOT NULL DEFAULT '0', "reserved_stock" integer NOT NULL DEFAULT '0', "unit" character varying NOT NULL, "status" "public"."batches_status_enum" NOT NULL DEFAULT 'ACTIVE', "quality_status" "public"."batches_quality_status_enum" NOT NULL DEFAULT 'PENDING', "storage_condition" "public"."batches_storage_condition_enum", "supplier_id" integer, "grn_id" integer, "inspection_ref" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_b2f5936e453fef1dac6094ce11f" PRIMARY KEY ("batch_id"))`);
        await queryRunner.query(`ALTER TABLE "beat" DROP COLUMN "warehouse_id"`);
        await queryRunner.query(`ALTER TABLE "beat" ADD "warehouse_id" uuid`);
        await queryRunner.query(`ALTER TABLE "scheme" DROP COLUMN "warehouse_id"`);
        await queryRunner.query(`ALTER TABLE "scheme" ADD "warehouse_id" uuid`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "warehouse_id"`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "warehouse_id" uuid`);
        await queryRunner.query(`ALTER TABLE "warehouses" ADD CONSTRAINT "FK_bbd59657210f8b7719e354b5305" FOREIGN KEY ("shipping_country_id") REFERENCES "countries"("country_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouses" ADD CONSTRAINT "FK_3979460db105ad4c415bc0822fa" FOREIGN KEY ("shipping_state_id") REFERENCES "states"("state_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouses" ADD CONSTRAINT "FK_70cb43a4fb184713d53cd70a978" FOREIGN KEY ("shipping_district_id") REFERENCES "districts"("district_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "beat" ADD CONSTRAINT "FK_4824221144527237e4872917c81" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheme" ADD CONSTRAINT "FK_494f1b41b8f902e12510095716d" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "profiles"("profileId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_5d9d73a4c5fe0202714a51e4649" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_f5221735ace059250daac9d9803" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales_returns" ADD CONSTRAINT "FK_04e51727f731856085ba7ec8588" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "batches" ADD CONSTRAINT "FK_42b34bdf49df7e2f6c446e9efd7" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("inventory_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "batches" DROP CONSTRAINT "FK_42b34bdf49df7e2f6c446e9efd7"`);
        await queryRunner.query(`ALTER TABLE "sales_returns" DROP CONSTRAINT "FK_04e51727f731856085ba7ec8588"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_f5221735ace059250daac9d9803"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_5d9d73a4c5fe0202714a51e4649"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`ALTER TABLE "scheme" DROP CONSTRAINT "FK_494f1b41b8f902e12510095716d"`);
        await queryRunner.query(`ALTER TABLE "beat" DROP CONSTRAINT "FK_4824221144527237e4872917c81"`);
        await queryRunner.query(`ALTER TABLE "warehouses" DROP CONSTRAINT "FK_70cb43a4fb184713d53cd70a978"`);
        await queryRunner.query(`ALTER TABLE "warehouses" DROP CONSTRAINT "FK_3979460db105ad4c415bc0822fa"`);
        await queryRunner.query(`ALTER TABLE "warehouses" DROP CONSTRAINT "FK_bbd59657210f8b7719e354b5305"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "warehouse_id"`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "warehouse_id" integer`);
        await queryRunner.query(`ALTER TABLE "scheme" DROP COLUMN "warehouse_id"`);
        await queryRunner.query(`ALTER TABLE "scheme" ADD "warehouse_id" integer`);
        await queryRunner.query(`ALTER TABLE "beat" DROP COLUMN "warehouse_id"`);
        await queryRunner.query(`ALTER TABLE "beat" ADD "warehouse_id" integer`);
        await queryRunner.query(`DROP TABLE "batches"`);
        await queryRunner.query(`DROP TYPE "public"."batches_storage_condition_enum"`);
        await queryRunner.query(`DROP TYPE "public"."batches_quality_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."batches_status_enum"`);
        await queryRunner.query(`DROP TABLE "warehouses"`);
        await queryRunner.query(`DROP TYPE "public"."warehouses_custom_zone_enum"`);
        await queryRunner.query(`DROP TYPE "public"."warehouses_sez_enum"`);
        await queryRunner.query(`DROP TYPE "public"."warehouses_franchise_enum"`);
        await queryRunner.query(`DROP TYPE "public"."warehouses_business_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."warehouses_ownership_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."warehouse_status_enum"`);
    }

}
