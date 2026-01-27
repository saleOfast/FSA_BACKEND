import { Column,Repository,OneToMany,ManyToMany,PrimaryGeneratedColumn ,Entity,JoinColumn,BaseEntity,ManyToOne,CreateDateColumn,UpdateDateColumn} from "typeorm";
import {Customer} from './customer.entity'
import { User } from "./User.entity";
import {OrderStatusEnum,OrderTypeEnum,PaymentModeEnum} from '../../types/Constent/common'
import { DbConnections} from "../postgresdb";
import {ISalesOrderHeader } from '../../types/SalesOrderHeaderService/SalesOrderHeaderService'
import {SalesOrderItem } from '../Entities/salesOrderItem.entity'

@Entity("sales_order_header")
export class SalesOrderHeader extends BaseEntity implements ISalesOrderHeader {
@PrimaryGeneratedColumn({ name: "so_id" })
soId: number;

@Column({
  type: "enum",
  enum: OrderTypeEnum,
  name: "order_type",
})
orderType: OrderTypeEnum;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @Column({ nullable: true })
  paymentTerms: string; // Cash / Credit / Credit days

  @Column({
    type: "enum",
    enum: PaymentModeEnum,
    name: "payment_mode",
    nullable: true,
  })
  paymentMode: PaymentModeEnum;

  @Column({ nullable: true })
  poNumber: string;

  @Column({ type: "date", nullable: true })
  poDate: Date;

  @Column({ type: "date" })
  orderDate: Date;

  @Column({
    type: "enum",
    enum: OrderStatusEnum,
    default: OrderStatusEnum.DRAFT,
  })
  status: OrderStatusEnum;

  @Column({ type: "text", nullable: true })
  remarks: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "sales_user_id" })
  salesUser: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  createdBy: User;


  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "approved_by" })
  approvedBy: User;

  /* ================== AMOUNT FIELDS ================== */
  /* ⚠️ These will be AUTO-UPDATED from child table */

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  otherCharges: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  totalDiscount: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  schemeAmount: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  grandTotal: number;

 @OneToMany(
    () => SalesOrderItem,
    (Item) => Item.salesOrder,
    { cascade: true }
  )
  Items: SalesOrderItem[];

@CreateDateColumn({ name: "created_on" })
createdDate: Date;

@UpdateDateColumn({ name: "updated_on" })
updatedAt: Date;

@Column({name:"is_deleted" , default:false})
isDeleted:boolean

}

export const SalesOrderHeaderRepository = (): Repository<SalesOrderHeader> => {
  return DbConnections.AppDbConnection
    .getConnection()
    .getRepository(SalesOrderHeader);
};


