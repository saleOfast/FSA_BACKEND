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
import { DispatchHeader } from "./dispatchHeader.entity";
import { DeliveryItem } from "./deliveryItem.entity";

@Entity("delivery_header")
export class DeliveryHeader extends BaseEntity {
  @PrimaryGeneratedColumn( { name: "delivery_id" })
  deliveryId: number;

  @Column({ name: "dispatch_id", type: "int" })
  dispatchId: number;

  @ManyToOne(() => DispatchHeader)
  @JoinColumn({ name: "dispatch_id" })
  dispatch: DispatchHeader;

  @Column({
    type: "enum",
    enum: DeliveryStatusEnum,
    name: "delivery_status",
    default: DeliveryStatusEnum.IN_TRANSIT,
  })
  deliveryStatus: DeliveryStatusEnum;

  @Column({ name: "customer_name", type: "varchar", length: 200 })
  customerName: string;

  @Column({ name: "delivery_address", type: "text", nullable: true })
  deliveryAddress: string | null;

  @Column({ name: "customer_mobile", type: "varchar", length: 20, nullable: true })
  customerMobile: string | null;

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

  @Column({ name: "delivery_date", type: "date", nullable: true })
  deliveryDate: Date | null;

  @Column({ name: "remarks", type: "text", nullable: true })
  remarks: string | null;

  @OneToMany(() => DeliveryItem, (item) => item.delivery, { cascade: true })
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
