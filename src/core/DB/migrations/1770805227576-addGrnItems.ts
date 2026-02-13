import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGrnItems1770805227576 implements MigrationInterface {
    name = 'AddGrnItems1770805227576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "grn_items" ("grn_item_id" SERIAL NOT NULL, "grn_id" uuid NOT NULL, "sku_id" integer NOT NULL, "inventory_id" integer NOT NULL, "batch_id" integer NOT NULL, "received_qty" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_ff0433d4822c2715714337fb8c7" PRIMARY KEY ("grn_item_id"))`);
        await queryRunner.query(`ALTER TABLE "grn_items" ADD CONSTRAINT "FK_da6ce3400a7f56c78218ba32c3a" FOREIGN KEY ("grn_id") REFERENCES "grn_headers"("grnId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grn_items" ADD CONSTRAINT "FK_f25c1fbed97be081b90a56f6682" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("inventory_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grn_items" ADD CONSTRAINT "FK_204cada091a71de3e2903dce682" FOREIGN KEY ("batch_id") REFERENCES "batches"("batch_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grn_items" DROP CONSTRAINT "FK_204cada091a71de3e2903dce682"`);
        await queryRunner.query(`ALTER TABLE "grn_items" DROP CONSTRAINT "FK_f25c1fbed97be081b90a56f6682"`);
        await queryRunner.query(`ALTER TABLE "grn_items" DROP CONSTRAINT "FK_da6ce3400a7f56c78218ba32c3a"`);
        await queryRunner.query(`DROP TABLE "grn_items"`);
    }

}
