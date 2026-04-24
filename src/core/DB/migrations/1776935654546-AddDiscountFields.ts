import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDiscountFields1776935654546 implements MigrationInterface {
    name = 'AddDiscountFields1776935654546'

    public async up(queryRunner: QueryRunner): Promise<void> {

        /* =====================================================
           1️⃣ Add New Columns
        ===================================================== */
        await queryRunner.query(`
            ALTER TABLE "discounts"
            ADD "priority" integer NOT NULL DEFAULT '0'
        `);

        await queryRunner.query(`
            ALTER TABLE "discounts"
            ADD "isStackable" boolean NOT NULL DEFAULT false
        `);

        await queryRunner.query(`
            CREATE TYPE "public"."discounts_scope_type_enum"
            AS ENUM('LINE', 'ORDER')
        `);

        await queryRunner.query(`
            ALTER TABLE "discounts"
            ADD "scope_type"
            "public"."discounts_scope_type_enum"
            NOT NULL DEFAULT 'LINE'
        `);

        await queryRunner.query(`
            ALTER TABLE "discounts"
            ADD "line_cap" numeric(10,2)
        `);

        await queryRunner.query(`
            ALTER TABLE "discounts"
            ADD "order_cap" numeric(10,2)
        `);

        /* =====================================================
           2️⃣ 🔥 FIX OLD DATA BEFORE ENUM CHANGE
        ===================================================== */
        await queryRunner.query(`
            UPDATE "discounts"
            SET "discount_type" = 'Flat'
            WHERE "discount_type" IN ('SKU Level', 'Product Level', 'Bill Level')
        `);

        /* =====================================================
           3️⃣ Change ENUM Safely
        ===================================================== */
        await queryRunner.query(`
            ALTER TYPE "public"."discounts_discount_type_enum"
            RENAME TO "discounts_discount_type_enum_old"
        `);

        await queryRunner.query(`
            CREATE TYPE "public"."discounts_discount_type_enum"
            AS ENUM('Flat', '%age', 'Slab')
        `);

        await queryRunner.query(`
            ALTER TABLE "discounts"
            ALTER COLUMN "discount_type"
            TYPE "public"."discounts_discount_type_enum"
            USING "discount_type"::text::"public"."discounts_discount_type_enum"
        `);

        await queryRunner.query(`
            DROP TYPE "public"."discounts_discount_type_enum_old"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        /* =====================================================
           1️⃣ Recreate Old ENUM
        ===================================================== */
        await queryRunner.query(`
            CREATE TYPE "public"."discounts_discount_type_enum_old"
            AS ENUM('Flat', '%age', 'Slab', 'Bill Level', 'SKU Level', 'Product Level')
        `);

        await queryRunner.query(`
            ALTER TABLE "discounts"
            ALTER COLUMN "discount_type"
            TYPE "public"."discounts_discount_type_enum_old"
            USING "discount_type"::text::"public"."discounts_discount_type_enum_old"
        `);

        await queryRunner.query(`
            DROP TYPE "public"."discounts_discount_type_enum"
        `);

        await queryRunner.query(`
            ALTER TYPE "public"."discounts_discount_type_enum_old"
            RENAME TO "discounts_discount_type_enum"
        `);

        /* =====================================================
           2️⃣ Remove Added Columns
        ===================================================== */
        await queryRunner.query(`
            ALTER TABLE "discounts" DROP COLUMN "order_cap"
        `);

        await queryRunner.query(`
            ALTER TABLE "discounts" DROP COLUMN "line_cap"
        `);

        await queryRunner.query(`
            ALTER TABLE "discounts" DROP COLUMN "scope_type"
        `);

        await queryRunner.query(`
            DROP TYPE "public"."discounts_scope_type_enum"
        `);

        await queryRunner.query(`
            ALTER TABLE "discounts" DROP COLUMN "isStackable"
        `);

        await queryRunner.query(`
            ALTER TABLE "discounts" DROP COLUMN "priority"
        `);
    }
}