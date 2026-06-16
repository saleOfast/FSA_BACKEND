
import { MigrationInterface, QueryRunner } from "typeorm";

export class PurchaseOrder1781249660647 implements MigrationInterface {
    name = "PurchaseOrder1781249660647";

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE TABLE "purchase_order" (
                "purchaseOrderId" SERIAL NOT NULL,
                "poNumber" character varying NOT NULL,
                "poDate" date NOT NULL,
                "customerId" integer NOT NULL,
                "warehouseId" uuid NOT NULL,
                "expectedDeliveryDate" date,
                "paymentTerms" character varying(255),
                "status" character varying NOT NULL DEFAULT 'Draft',
                "remarks" text,
                "subTotal" numeric(18,2) NOT NULL DEFAULT '0',
                "totalDiscount" numeric(18,2) NOT NULL DEFAULT '0',
                "totalTax" numeric(18,2) NOT NULL DEFAULT '0',
                "grandTotal" numeric(18,2) NOT NULL DEFAULT '0',
                "isDeleted" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_purchase_order" PRIMARY KEY ("purchaseOrderId"),
                CONSTRAINT "UQ_purchase_order_poNumber" UNIQUE ("poNumber")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "purchase_order"
            ADD CONSTRAINT "FK_purchase_order_customer"
            FOREIGN KEY ("customerId")
            REFERENCES "customers"("customer_id")
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "purchase_order"
            ADD CONSTRAINT "FK_purchase_order_warehouse"
            FOREIGN KEY ("warehouseId")
            REFERENCES "warehouses"("warehouse_id")
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            ALTER TABLE "purchase_order"
            DROP CONSTRAINT "FK_purchase_order_warehouse"
        `);

        await queryRunner.query(`
            ALTER TABLE "purchase_order"
            DROP CONSTRAINT "FK_purchase_order_customer"
        `);

        await queryRunner.query(`
            DROP TABLE "purchase_order"
        `);
    }
}

