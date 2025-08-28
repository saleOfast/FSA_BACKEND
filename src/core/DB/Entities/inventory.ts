import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,      
  JoinColumn 
} from "typeorm";

import { Products } from "../Entities/products.entity"; 

export enum InventoryStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

@Entity({ name: "inventory_item" })
export class InventoryItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Products, { eager: true })
  @JoinColumn({ name: "product_id" })
  product: Products;


  @Column({ name: "batch_number", type: "varchar", length: 50, nullable: true })
  batchNumber: string | null;

  // TEMP: nullable so TypeORM can add on existing rows; will tighten later
@Column({ type: "int", unique: true , nullable: true })
warehouseId: number | null;


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

  @Column({ name: "cost_price", type: "numeric", precision: 10, scale: 2, nullable: true })
  costPrice: number | null;

  @Column({ name: "average_cost", type: "numeric", precision: 10, scale: 2, nullable: true })
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
