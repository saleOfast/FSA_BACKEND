import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveLineTotalFromInvoiceItems1773736992695 implements MigrationInterface {
    name = 'RemoveLineTotalFromInvoiceItems1773736992695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_items" DROP COLUMN "line_total"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_items" ADD "line_total" numeric(12,2) NOT NULL`);
    }

}
