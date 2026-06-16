import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  Repository,
} from "typeorm";
import { Customer } from "./customer.entity"
import { Warehouse } from "./warehouse.entity";
import { DbConnections } from "../postgresdb";
import { PurchaseOrderLineItem } from "../Entities/PurchaseOrderLineItem.entity";


@Entity({ name: "purchase_order" })
export class PurchaseOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  purchaseOrderId: number;

  @Column({ unique: true })
  poNumber: string;

  @Column({ type: "date" })
  poDate: Date;

  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: "customerId" })
  customer: Customer;
  @Column({ name: "customerId" })
  customerId: number;

 @ManyToOne(() => Warehouse, { eager: true })
 @JoinColumn({
  name: "warehouseId",
  referencedColumnName: "warehouseId",
})
warehouse: Warehouse;

@Column({
  type: "uuid",
  name: "warehouseId",
})
warehouseId: string;

  @Column({ name: "expectedDeliveryDate", type: "date", nullable: true })
  expectedDeliveryDate: Date|null;

  @Column({name: "paymentTerms",type:"varchar", length: 255, nullable: true })
  paymentTerms: string |null;

  @Column({ name: "status", nullable: false,
    default: "Draft",
  })
  status: string;

  @Column({name: "remarks", type: "text",
    nullable: true,
  })
  remarks: string|null;

  @Column({
    type: "decimal",
    precision: 18,
    scale: 2,
    default: 0,
  })
  subTotal: number;

  @Column({
    type: "decimal",
    precision: 18,
    scale: 2,
    default: 0,
  })
  totalDiscount: number;

  @Column({
    type: "decimal",
    precision: 18,
    scale: 2,
    default: 0,
  })
  totalTax: number;

  @Column({
    type: "decimal",
    precision: 18,
    scale: 2,
    default: 0,
  })
  grandTotal: number;

  @Column({
    default: false,
  })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


}

export const PurchasedOrderDetailsRepository = (): Repository<PurchaseOrder> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(PurchaseOrder);
}