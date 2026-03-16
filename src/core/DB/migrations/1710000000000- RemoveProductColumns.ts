import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveProductColumns1710000000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE products DROP COLUMN IF EXISTS tax_category_id`);

        await queryRunner.query(`ALTER TABLE products DROP COLUMN IF EXISTS hsn_code`);

        await queryRunner.query(`ALTER TABLE products DROP COLUMN IF EXISTS scheme_id`);

        await queryRunner.query(`ALTER TABLE products DROP COLUMN IF EXISTS discount_id`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE products ADD COLUMN tax_category_id integer`);

        await queryRunner.query(`ALTER TABLE products ADD COLUMN hsn_code varchar`);

        await queryRunner.query(`ALTER TABLE products ADD COLUMN scheme_id integer`);

        await queryRunner.query(`ALTER TABLE products ADD COLUMN discount_id integer`);

    }
}