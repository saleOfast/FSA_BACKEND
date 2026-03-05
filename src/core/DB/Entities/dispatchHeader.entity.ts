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
import { DispatchedStatusEnum } from "../../types/Constent/common";
import { SalesOrderHeader } from "./SalesOrderHeader.entity";
import { Warehouse } from "./warehouse.entity";
import { Customer } from "./customer.entity";
import { DispatchItem } from "./dispatchItem.entity";

@Entity("dispatch_header")
export class DispatchHeader extends BaseEntity {

  @PrimaryGeneratedColumn("uuid", { name: "dispatch_id" })
  dispatchId: string;

  @Column({
    type: "enum",
    enum: DispatchedStatusEnum,
    name: "dispatch_status",
    default:DispatchedStatusEnum.PENDING,
  })
  dispatchStatus: DispatchedStatusEnum;

  @Column({ name: "sales_order_id" })
  salesOrderId: number;

  @ManyToOne(() => SalesOrderHeader)
  @JoinColumn({ name: "sales_order_id" })
  salesOrder: SalesOrderHeader;

  @Column({ name: "customer_name", type: "varchar", length: 200 })
  customerName: string;

  // @ManyToOne(() => Customer)
  // @JoinColumn({ name: "customer_id" })
  // customer: Customer;

  // ✅ Warehouse Name Instead of ID
  @Column({ name: "warehouse_name", type: "varchar", length: 200 })
  warehouseName: string;

  @Column({ name: "vehicle_number", type: "varchar", length: 50, nullable: true })
  vehicleNumber: string | null;

  @Column({ name: "transporter_name", type: "varchar", length: 200, nullable: true })
  transporterName: string | null;

  @Column({ name: "driver_name", type: "varchar", length: 100, nullable: true })
  driverName: string | null;

  @Column({ name: "driver_mobile", type: "varchar", length: 20, nullable: true })
  driverMobile: string | null;

  @Column({ name: "eway_bill_no", type: "varchar", length: 50, nullable: true })
  ewayBillNo: string | null;

  @Column({ name: "dispatch_date", type: "date", nullable: true })
  dispatchDate: Date | null;

  @Column({ name: "remarks", type: "text", nullable: true })
  remarks: string | null;

    @OneToMany(() => DispatchItem, (item) => item.dispatch, {
    cascade: true,   // optional (agar header ke sath items save karna ho)
  })
  items: DispatchItem[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "is_deleted", default: false })
  isDeleted: boolean;
}

export const DispatchHeaderRepository = (): Repository<DispatchHeader> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(DispatchHeader);
};
