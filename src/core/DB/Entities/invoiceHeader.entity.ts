import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Repository,
} from "typeorm";
import { DbConnections } from "../postgresdb";
import { InvoiceDocumentTypeEnum, InvoiceStatusEnum } from "../../types/Constent/common";
import { DeliveryHeader } from "./dispatchHeader.entity";
import { SalesOrderHeader } from "./SalesOrderHeader.entity";
import { Customer } from "./customer.entity";
import { Warehouse } from "./warehouse.entity";
import { User } from "./User.entity";
import { InvoiceItem } from "./invoiceItem.entity";

@Entity("invoice_header")
export class InvoiceHeader extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "invoice_id" })
  invoiceId: string;

  @Column({
    type: "enum",
    enum: InvoiceDocumentTypeEnum,
    name: "document_type",
    default: InvoiceDocumentTypeEnum.TAX_INVOICE,
  })
  documentType: InvoiceDocumentTypeEnum;

  @Column({ name: "invoice_number", type: "varchar", length: 50, unique: true })
  invoiceNumber: string;

  @Column({ name: "invoice_date", type: "date" })
  invoiceDate: Date;

  @Column({ name: "delivery_id", type: "uuid" })
  deliveryId: string;

  @ManyToOne(() => DeliveryHeader)
  @JoinColumn({ name: "delivery_id" })
  delivery: DeliveryHeader;

  @Column({ name: "sales_order_id", type: "int" })
  salesOrderId: number;

  @ManyToOne(() => SalesOrderHeader)
  @JoinColumn({ name: "sales_order_id" })
  salesOrder: SalesOrderHeader;

  @Column({ name: "customer_id", type: "int" })
  customerId: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @Column({ name: "billing_address", type: "text", nullable: true })
  billingAddress: string;

  @Column({ name: "shipping_address", type: "text", nullable: true })
  shippingAddress: string;

  @Column({ name: "warehouse_id", type: "uuid" })
  warehouseId: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse;

  @Column({ name: "seller_gstin", type: "varchar", length: 20, nullable: true })
  sellerGstin: string;

  @Column({ name: "customer_gstin", type: "varchar", length: 20, nullable: true })
  customerGstin: string;

  @Column({ name: "place_of_supply", type: "varchar", length: 100, nullable: true })
  placeOfSupply: string;

  @Column({ name: "transporter_name", type: "varchar", length: 200, nullable: true })
  transporterName: string;

  @Column({ name: "vehicle_number", type: "varchar", length: 50, nullable: true })
  vehicleNumber: string;

  @Column({ name: "eway_bill_no", type: "varchar", length: 50, nullable: true })
  ewayBillNo: string;

  /* ================== AMOUNT FIELDS ================== */
  
  @Column({ name: "net_amount", type: "decimal", precision: 12, scale: 2, default: 0 })
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

  @Column({ name: "gross_amount", type: "decimal", precision: 12, scale: 2, default: 0 })
  grossAmount: number;

  @Column({
    type: "enum",
    enum: InvoiceStatusEnum,
    default: InvoiceStatusEnum.DRAFT,
  })
  status: InvoiceStatusEnum;

  @Column({ type: "text", nullable: true })
  remarks: string;

  @Column({ name: "irn_no", type: "text", nullable: true })
  irnNo: string;

  @Column({ name: "qr_code", type: "text", nullable: true })
  qrCode: string;

  @Column({ name: "created_by", type: "int", nullable: true })
  createdBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by", referencedColumnName: "emp_id" })
  createdByUser: User;

  @OneToMany(() => InvoiceItem, (item) => item.invoice)
  items: InvoiceItem[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "is_deleted", default: false })
  isDeleted: boolean;
}

export const InvoiceHeaderRepository = (): Repository<InvoiceHeader> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(InvoiceHeader);
};
