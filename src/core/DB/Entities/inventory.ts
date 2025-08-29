import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";

import { Products } from "../Entities/products.entity";

export enum InventoryStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

@Entity({ name: "inventory_item" })
@Unique(["product", "warehouseId"]) // unique per product per warehouse
export class InventoryItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Products, { eager: true })
  @JoinColumn({ name: "product_id" })
  product: Products;

  @Column({ name: "batch_number", type: "varchar", length: 50, nullable: true })
  batchNumber: string | null;

  @Column({ type: "int", nullable: false })
  warehouseId: number;

  @Column({ name: "serial_number", type: "varchar", length: 50, nullable: true })
  serialNumber: string | null;

  @Column({ name: "quantity_on_hand", type: "int", default: 0 })
  quantityOnHand: number;

  @Column({ name: "quantity_reserved", type: "int", default: 0 })
  quantityReserved: number;

  @Column({ name: "quantity_available", type: "int", default: 0 })
  quantityAvailable: number;

  @Column({ name: "reorder_level", type: "int", nullable: true })
  reorderLevel: number | null;

  @Column({ name: "date_received", type: "date", nullable: true })
  dateReceived: Date | null;

  @Column({ name: "expiry_date", type: "date", nullable: true })
  expiryDate: Date | null;

  @Column({
    name: "cost_price",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => (value !== null ? parseFloat(value) : null),
    },
  })
  costPrice: number | null;

  @Column({
    name: "average_cost",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => (value !== null ? parseFloat(value) : null),
    },
  })
  averageCost: number | null;

  @Column({ name: "unit_of_measure", type: "varchar", length: 50, nullable: true })
  unitOfMeasure: string | null;

  @Column({ type: "enum", enum: InventoryStatus, default: InventoryStatus.ACTIVE })
  status: InventoryStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt: Date;

  @Column({ name: "created_by", type: "varchar", length: 100, nullable: true })
  createdBy: string | null;

  @Column({ name: "last_modified_by", type: "varchar", length: 100, nullable: true })
  lastModifiedBy: string | null;
}
