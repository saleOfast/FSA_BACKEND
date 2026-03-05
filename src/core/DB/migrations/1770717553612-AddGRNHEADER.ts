import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGRNHEADER1770717553612 implements MigrationInterface {
    name = 'AddGRNHEADER1770717553612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "collection_store_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "collection_order_id_fkey"`);
        await queryRunner.query(`CREATE TYPE "public"."grn_headers_status_enum" AS ENUM('PENDING', 'VERIFIED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "grn_headers" ("grnId" uuid NOT NULL DEFAULT uuid_generate_v4(), "warehouseId" uuid NOT NULL, "poId" uuid, "created_by" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."grn_headers_status_enum" NOT NULL DEFAULT 'PENDING', "isDeleted" boolean NOT NULL DEFAULT false, "warehouse_id" uuid, CONSTRAINT "PK_e2b9cc759177e8efd42823289ef" PRIMARY KEY ("grnId"))`);
        await queryRunner.query(`ALTER TABLE "batches" ALTER COLUMN "storage_condition" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "batches" ALTER COLUMN "storage_condition" SET DEFAULT 'AMBIENT'`);
        await queryRunner.query(`ALTER TABLE "collection" ALTER COLUMN "order_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection" ALTER COLUMN "store_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection" DROP COLUMN "order_amount"`);
        await queryRunner.query(`ALTER TABLE "collection" ADD "order_amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection" DROP COLUMN "collected_amount"`);
        await queryRunner.query(`ALTER TABLE "collection" ADD "collected_amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection" DROP COLUMN "pending_amount"`);
        await queryRunner.query(`ALTER TABLE "collection" ADD "pending_amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "collection" ALTER COLUMN "updated_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "grn_headers" ADD CONSTRAINT "FK_0b0983b27659a9d3a8bc646d3ba" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grn_headers" ADD CONSTRAINT "FK_449e1a22c866d4cefe6ef016f31" FOREIGN KEY ("created_by") REFERENCES "users"("emp_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_d80b66bc2db759acb1c223e9490" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_6057f49d314d9d37b0940552b8c" FOREIGN KEY ("store_id") REFERENCES "stores"("store_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_6057f49d314d9d37b0940552b8c"`);
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_d80b66bc2db759acb1c223e9490"`);
        await queryRunner.query(`ALTER TABLE "grn_headers" DROP CONSTRAINT "FK_449e1a22c866d4cefe6ef016f31"`);
        await queryRunner.query(`ALTER TABLE "grn_headers" DROP CONSTRAINT "FK_0b0983b27659a9d3a8bc646d3ba"`);
        await queryRunner.query(`ALTER TABLE "collection" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "collection" ALTER COLUMN "updated_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "collection" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection" DROP COLUMN "pending_amount"`);
        await queryRunner.query(`ALTER TABLE "collection" ADD "pending_amount" numeric`);
        await queryRunner.query(`ALTER TABLE "collection" DROP COLUMN "collected_amount"`);
        await queryRunner.query(`ALTER TABLE "collection" ADD "collected_amount" numeric`);
        await queryRunner.query(`ALTER TABLE "collection" DROP COLUMN "order_amount"`);
        await queryRunner.query(`ALTER TABLE "collection" ADD "order_amount" numeric`);
        await queryRunner.query(`ALTER TABLE "collection" ALTER COLUMN "store_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection" ALTER COLUMN "order_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "batches" ALTER COLUMN "storage_condition" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "batches" ALTER COLUMN "storage_condition" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "grn_headers"`);
        await queryRunner.query(`DROP TYPE "public"."grn_headers_status_enum"`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "collection_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "collection_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("store_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
