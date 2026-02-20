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
import { DeliveryStatusEnum } from "../../types/Constent/common";
import { SalesOrderHeader } from "./SalesOrderHeader.entity";
import { Warehouse } from "./warehouse.entity";
import { Customer } from "./customer.entity";
import { DeliveryItem } from "./deliveryItem.entity";

@Entity("delivery_header")
export class DeliveryHeader extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "delivery_id" })
  deliveryId: string;

  @Column({
    type: "enum",
    enum: DeliveryStatusEnum,
    name: "delivery_status",
    default: DeliveryStatusEnum.DRAFT,
  })
  deliveryStatus: DeliveryStatusEnum;

  @Column({ name: "sales_order_id" })
  salesOrderId: number;

  @ManyToOne(() => SalesOrderHeader)
  @JoinColumn({ name: "sales_order_id" })
  salesOrder: SalesOrderHeader;

  @Column({ name: "customer_id" })
  customerId: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @Column({ name: "warehouse_id", type: "uuid" })
  warehouseId: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse;

  @Column({ name: "delivery_date", type: "date", nullable: true })
  deliveryDate: Date | null;

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

  @OneToMany(() => DeliveryItem, (item) => item.delivery)
  items: DeliveryItem[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "is_deleted", default: false })
  isDeleted: boolean;
}

export const DeliveryHeaderRepository = (): Repository<DeliveryHeader> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(DeliveryHeader);
};
