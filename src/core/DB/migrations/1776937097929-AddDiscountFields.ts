import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDiscountFields1776937097929 implements MigrationInterface {
    name = 'AddDiscountFields1776937097929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discounts" ADD "isStickable" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discounts" DROP COLUMN "isStickable"`);
    }

}
