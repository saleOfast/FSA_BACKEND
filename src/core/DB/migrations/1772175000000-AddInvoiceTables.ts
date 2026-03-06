import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInvoiceTables1772175000000 implements MigrationInterface {
  name = "AddInvoiceTables1772175000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Enums
    await queryRunner.query(`
      CREATE TYPE "public"."invoice_header_document_type_enum" AS ENUM(
        'Tax Invoice', 'Proforma Invoice', 'Credit Note', 'Debit Note', 'Reverse Invoice'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."invoice_header_status_enum" AS ENUM(
        'Draft', 'Approved', 'Sent', 'Cancelled', 'Paid', 'Partial Paid'
      )
    `);

    // Create Invoice Header Table
    await queryRunner.query(`
      CREATE TABLE "invoice_header" (
        "invoice_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "document_type" "public"."invoice_header_document_type_enum" NOT NULL DEFAULT 'Tax Invoice',
        "invoice_number" character varying(50) NOT NULL,
        "invoice_date" date NOT NULL,
        "delivery_id" uuid NOT NULL,
        "sales_order_id" integer NOT NULL,
        "customer_id" integer NOT NULL,
        "billing_address" text,
        "shipping_address" text,
        "warehouse_id" uuid NOT NULL,
        "seller_gstin" character varying(20),
        "customer_gstin" character varying(20),
        "place_of_supply" character varying(100),
        "transporter_name" character varying(200),
        "vehicle_number" character varying(50),
        "eway_bill_no" character varying(50),
        "net_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "discount_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "cgst_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "sgst_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "igst_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "cess_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "tax_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "gross_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "status" "public"."invoice_header_status_enum" NOT NULL DEFAULT 'Draft',
        "remarks" text,
        "irn_no" text,
        "qr_code" text,
        "created_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "is_deleted" boolean NOT NULL DEFAULT false,
        CONSTRAINT "UQ_invoice_number" UNIQUE ("invoice_number"),
        CONSTRAINT "PK_invoice_header" PRIMARY KEY ("invoice_id")
      )
    `);

    // Add Foreign Keys for Invoice Header
    await queryRunner.query(`
      ALTER TABLE "invoice_header" ADD CONSTRAINT "FK_invoice_delivery"
      FOREIGN KEY ("delivery_id") REFERENCES "delivery_header"("delivery_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "invoice_header" ADD CONSTRAINT "FK_invoice_sales_order"
      FOREIGN KEY ("sales_order_id") REFERENCES "sales_order_header"("so_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "invoice_header" ADD CONSTRAINT "FK_invoice_customer"
      FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "invoice_header" ADD CONSTRAINT "FK_invoice_warehouse"
      FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "invoice_header" ADD CONSTRAINT "FK_invoice_user"
      FOREIGN KEY ("created_by") REFERENCES "users"("emp_id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    // Create Invoice Items Table
    await queryRunner.query(`
      CREATE TABLE "invoice_items" (
        "invoice_item_id" SERIAL NOT NULL,
        "invoice_id" uuid NOT NULL,
        "sku_id" integer NOT NULL,
        "product_id" integer NOT NULL,
        "hsn_code" character varying(20),
        "unit_price" numeric(12,2) NOT NULL,
        "quantity" integer NOT NULL,
        "order_item_id" integer,
        "net_amount" numeric(12,2) NOT NULL,
        "discount_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "cgst_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "sgst_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "igst_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "cess_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "tax_amount" numeric(12,2) NOT NULL DEFAULT 0,
        "gross_amount" numeric(12,2) NOT NULL,
        "line_total" numeric(12,2) NOT NULL,
        "tax_id" integer,
        "discount_id" integer,
        "scheme_id" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "is_deleted" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_invoice_items" PRIMARY KEY ("invoice_item_id")
      )
    `);

    // Add Foreign Keys for Invoice Items
    await queryRunner.query(`
      ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_invoice_items_header"
      FOREIGN KEY ("invoice_id") REFERENCES "invoice_header"("invoice_id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_invoice_items_sku"
      FOREIGN KEY ("sku_id") REFERENCES "sku"("sku_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_invoice_items_product"
      FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_invoice_items_order_item"
      FOREIGN KEY ("order_item_id") REFERENCES "sales_order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_invoice_items_tax"
      FOREIGN KEY ("tax_id") REFERENCES "taxes"("tax_id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_invoice_items_discount"
      FOREIGN KEY ("discount_id") REFERENCES "discount"("discount_id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_invoice_items_scheme"
      FOREIGN KEY ("scheme_id") REFERENCES "scheme"("scheme_id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop Foreign Keys
    await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_invoice_items_scheme"`);
    await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_invoice_items_discount"`);
    await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_invoice_items_tax"`);
    await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_invoice_items_order_item"`);
    await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_invoice_items_product"`);
    await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_invoice_items_sku"`);
    await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_invoice_items_header"`);

    await queryRunner.query(`ALTER TABLE "invoice_header" DROP CONSTRAINT "FK_invoice_user"`);
    await queryRunner.query(`ALTER TABLE "invoice_header" DROP CONSTRAINT "FK_invoice_warehouse"`);
    await queryRunner.query(`ALTER TABLE "invoice_header" DROP CONSTRAINT "FK_invoice_customer"`);
    await queryRunner.query(`ALTER TABLE "invoice_header" DROP CONSTRAINT "FK_invoice_sales_order"`);
    await queryRunner.query(`ALTER TABLE "invoice_header" DROP CONSTRAINT "FK_invoice_delivery"`);

    // Drop Tables
    await queryRunner.query(`DROP TABLE "invoice_items"`);
    await queryRunner.query(`DROP TABLE "invoice_header"`);

    // Drop Enums
    await queryRunner.query(`DROP TYPE "public"."invoice_header_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."invoice_header_document_type_enum"`);
  }
}
