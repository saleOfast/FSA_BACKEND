import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Repository,
} from "typeorm";
import { DbConnections } from "../postgresdb";
import { InvoiceHeader } from "./invoiceHeader.entity";
import { Products } from "./products.entity";
import { Sku } from "./sku.entity";
import { SalesOrderItem } from "./salesOrderItem.entity";
import { Discount } from "./discount.entity";
import { Scheme } from "./scheme.entity";
import { Taxes } from "./tax.entity";

@Entity("invoice_items")
export class InvoiceItem extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "invoice_item_id" })
  invoiceItemId: number;

  @Column({ name: "invoice_id", type: "uuid" })
  invoiceId: string;

  @ManyToOne(() => InvoiceHeader, (header) => header.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "invoice_id" })
  invoice: InvoiceHeader;

  @Column({ name: "sku_id", type: "int" })
  skuId: number;

  @ManyToOne(() => Sku)
  @JoinColumn({ name: "sku_id" })
  sku: Sku;

  @Column({ name: "product_id", type: "int" })
  productId: number;

  @ManyToOne(() => Products)
  @JoinColumn({ name: "product_id" })
  product: Products;

  @Column({ name: "hsn_code", type: "varchar", length: 20, nullable: true })
  hsnCode: string;

  @Column({ name: "unit_price", type: "decimal", precision: 12, scale: 2 })
  unitPrice: number;

  @Column({ name: "quantity", type: "int" })
  quantity: number;

  @Column({ name: "order_item_id", type: "int", nullable: true })
  orderItemId: number;

  @ManyToOne(() => SalesOrderItem)
  @JoinColumn({ name: "order_item_id" })
  orderItem: SalesOrderItem;

  /* ================== CALCULATED AMOUNTS ================== */

  @Column({ name: "net_amount", type: "decimal", precision: 12, scale: 2 })
  netAmount: number;

  @Column({ name: "discount_amount", type: "decimal", precision: 12, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: "cgst_amount", type: "decimal", precision: 12, scale: 2, default: 0 })
  cgstAmount: number;

  @Column({ name: "sgst_amount", type: "decimal", precision: 12, scale: 2, default: 0 })
  sgstAmount: number;

  @Column({ name: "igst_amount", type: "decimal", precision: 12, scale: 2, default: 0 })
  igstAmount: number;

  @Column({ name: "cess_amount", type: "decimal", precision: 12, scale: 2, default: 0 })
  cessAmount: number;

  @Column({ name: "tax_amount", type: "decimal", precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: "gross_amount", type: "decimal", precision: 12, scale: 2 })
  grossAmount: number;

  @Column({ name: "line_total", type: "decimal", precision: 12, scale: 2 })
  lineTotal: number;

  /* ================== REFERENCES ================== */

  @Column({ name: "tax_id", type: "int", nullable: true })
  taxId: number;

  @ManyToOne(() => Taxes)
  @JoinColumn({ name: "tax_id" })
  tax: Taxes;

  @Column({ name: "discount_id", type: "int", nullable: true })
  discountId: number;

  @ManyToOne(() => Discount)
  @JoinColumn({ name: "discount_id" })
  discount: Discount;

  @Column({ name: "scheme_id", type: "int", nullable: true })
  schemeId: number;

  @ManyToOne(() => Scheme)
  @JoinColumn({ name: "scheme_id" })
  scheme: Scheme;

  // @Column({ name: "price_code_id", type: "int", nullable: true })
  // priceCodeId: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "is_deleted", default: false })
  isDeleted: boolean;
}

export const InvoiceItemRepository = (): Repository<InvoiceItem> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(InvoiceItem);
};
