import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomerNameToInvoice1710000000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "invoice_header" ADD COLUMN "customer_name" character varying(200)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "invoice_header" DROP COLUMN "customer_name"`
        );
    }
}