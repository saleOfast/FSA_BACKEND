import { MigrationInterface, QueryRunner } from "typeorm";

export class DispatchStringToInt1773047987025 implements MigrationInterface {
  name = "DispatchStringToInt1773047987025";

  public async up(queryRunner: QueryRunner): Promise<void> {

    /* -----------------------------
       DROP CONSTRAINTS
    ----------------------------- */

    await queryRunner.query(`ALTER TABLE "delivery_item" DROP CONSTRAINT "FK_delivery_item_delivery"`);
    await queryRunner.query(`ALTER TABLE "delivery_item" DROP CONSTRAINT "FK_delivery_item_dispatch_item"`);
    await queryRunner.query(`ALTER TABLE "delivery_item" DROP CONSTRAINT "FK_delivery_item_sku"`);
    await queryRunner.query(`ALTER TABLE "delivery_item" DROP CONSTRAINT "FK_delivery_item_product"`);
    await queryRunner.query(`ALTER TABLE "delivery_item" DROP CONSTRAINT "FK_delivery_item_batch"`);

    await queryRunner.query(`ALTER TABLE "delivery_header" DROP CONSTRAINT "FK_delivery_dispatch"`);

    await queryRunner.query(`ALTER TABLE "dispatch_item" DROP CONSTRAINT "FK_cd12c018b128a712f7eeb29f140"`);


    /* -----------------------------
       CHANGE DISPATCH ITEM PK
    ----------------------------- */

    await queryRunner.query(`ALTER TABLE "dispatch_item" DROP CONSTRAINT "PK_b8c342a5dcd1293b11f6fe7d13b"`);

    await queryRunner.query(`ALTER TABLE "dispatch_item" DROP COLUMN "dispatch_item_id"`);

    await queryRunner.query(`ALTER TABLE "dispatch_item" ADD "dispatch_item_id" SERIAL`);

    await queryRunner.query(`
      ALTER TABLE "dispatch_item"
      ADD CONSTRAINT "PK_b8c342a5dcd1293b11f6fe7d13b"
      PRIMARY KEY ("dispatch_item_id")
    `);

    await queryRunner.query(`ALTER TABLE "dispatch_item" DROP COLUMN "dispatch_id"`);

    await queryRunner.query(`ALTER TABLE "dispatch_item" ADD "dispatch_id" integer`);


    /* -----------------------------
       CHANGE DISPATCH HEADER PK
    ----------------------------- */

    await queryRunner.query(`ALTER TABLE "dispatch_header" DROP CONSTRAINT "PK_954a1fdd6877e73bec801545fe4"`);

    await queryRunner.query(`ALTER TABLE "dispatch_header" DROP COLUMN "dispatch_id"`);

    await queryRunner.query(`ALTER TABLE "dispatch_header" ADD "dispatch_id" SERIAL`);

    await queryRunner.query(`
      ALTER TABLE "dispatch_header"
      ADD CONSTRAINT "PK_954a1fdd6877e73bec801545fe4"
      PRIMARY KEY ("dispatch_id")
    `);


    /* -----------------------------
       DELIVERY ITEM COLUMN CHANGE
    ----------------------------- */

    await queryRunner.query(`ALTER TABLE "delivery_item" DROP COLUMN "delivery_id"`);

    await queryRunner.query(`ALTER TABLE "delivery_item" ADD "delivery_id" integer`);

    await queryRunner.query(`
      UPDATE "delivery_item"
      SET "delivery_id" = 1
      WHERE "delivery_id" IS NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "delivery_item"
      ALTER COLUMN "delivery_id" SET NOT NULL
    `);

    await queryRunner.query(`ALTER TABLE "delivery_item" DROP COLUMN "dispatch_item_id"`);

    await queryRunner.query(`ALTER TABLE "delivery_item" ADD "dispatch_item_id" integer`);


    /* -----------------------------
       ENUM MIGRATION
    ----------------------------- */

    await queryRunner.query(`
      ALTER TYPE "public"."delivery_header_delivery_status_enum"
      RENAME TO "delivery_header_delivery_status_enum_old"
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."delivery_item_delivery_status_enum"
      AS ENUM ('IN_TRANSIT','PARTIAL_DELIVERED','FULLY_DELIVERED')
    `);


    /* -----------------------------
       DROP DEFAULT BEFORE CAST
    ----------------------------- */

    await queryRunner.query(`
      ALTER TABLE "delivery_item"
      ALTER COLUMN "delivery_status" DROP DEFAULT
    `);

    await queryRunner.query(`
      ALTER TABLE "delivery_header"
      ALTER COLUMN "delivery_status" DROP DEFAULT
    `);


    /* -----------------------------
       CHANGE COLUMN TYPE
    ----------------------------- */

    await queryRunner.query(`
      ALTER TABLE "delivery_item"
      ALTER COLUMN "delivery_status"
      TYPE "public"."delivery_item_delivery_status_enum"
      USING "delivery_status"::text::"public"."delivery_item_delivery_status_enum"
    `);

    await queryRunner.query(`
      ALTER TABLE "delivery_header"
      ALTER COLUMN "delivery_status"
      TYPE "public"."delivery_item_delivery_status_enum"
      USING "delivery_status"::text::"public"."delivery_item_delivery_status_enum"
    `);


    /* -----------------------------
       SET DEFAULT AGAIN
    ----------------------------- */

    await queryRunner.query(`
      ALTER TABLE "delivery_header"
      ALTER COLUMN "delivery_status"
      SET DEFAULT 'IN_TRANSIT'
    `);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`DROP TYPE "public"."delivery_item_delivery_status_enum"`);

    await queryRunner.query(`
      ALTER TYPE "public"."delivery_header_delivery_status_enum_old"
      RENAME TO "delivery_header_delivery_status_enum"
    `);

  }
}