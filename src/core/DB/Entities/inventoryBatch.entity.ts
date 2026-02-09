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

import { Expose } from "class-transformer";
import {BatchStatusEnum,QualityStatusEnum,StorageConditionEnum} from "../../../core/types/Constent/common"
import { Inventory } from "../Entities/inventory"
import { DbConnections } from "../postgresdb";


export interface IInventoryBatch {
  // Primary
  batchId: number;

  // FK
  inventoryId: number;   // SKU + Warehouse level inventory
  grnId?: number;
  supplierId?: number;

  // Batch details
  batchNo: string;
  mfgDate?: Date;
  expiryDate?: Date;
  receivedDate?: Date;

  // Stock
  currentStock: number;
  reservedStock: number;

  // Unit & Status
  unit: string; // pcs / kg / ltr
  status: BatchStatusEnum;
  qualityStatus: QualityStatusEnum;
  storageCondition: StorageConditionEnum;

  // QC / Inspection
  inspectionRef?: string;

  // 🔹 Derived (NOT stored)
  availableQty?: number;
  isExpired?: boolean;

  // Audit
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}


@Entity({ name: "batches" })
export class Batch
  extends BaseEntity
  implements IInventoryBatch
{
  @PrimaryGeneratedColumn({ name: "batch_id" })
  batchId: number;

  // 🔹 Inventory FK
  @Column({ name: "inventory_id" })
  inventoryId: number;

  @ManyToOne(() => Inventory)
  @JoinColumn({ name: "inventory_id" })
  inventory: Inventory;

  // 🔹 Batch Info
  @Column({ name: "batch_no" })
  batchNo: string;

  @Column({ name: "mfg_date", type: "date", nullable: true })
  mfgDate?: Date;

  @Column({ name: "expiry_date", type: "date", nullable: true })
  expiryDate?: Date;

  @Column({ name: "received_date", type: "date", nullable: true })
  receivedDate?: Date;

  // 🔹 Stock
  @Column({ name: "current_stock", type: "int", default: 0 })
  currentStock: number;

  @Column({ name: "reserved_stock", type: "int", default: 0 })
  reservedStock: number;

  // 🔹 Units & Status
  @Column({ name: "unit" })
  unit: string;

  @Column({
    name: "status",
    type: "enum",
    enum: BatchStatusEnum,
    default: BatchStatusEnum.ACTIVE,
  })
  status: BatchStatusEnum;

  @Column({
    name: "quality_status",
    type: "enum",
    enum: QualityStatusEnum,
    default: QualityStatusEnum.PENDING,
  })
  qualityStatus: QualityStatusEnum;

  @Column({
    name: "storage_condition",
    type: "enum",
    enum: StorageConditionEnum,
    nullable: true,
  })
  storageCondition: StorageConditionEnum;


  // 🔹 Traceability
  @Column({ name: "supplier_id", nullable: true })
  supplierId?: number;

  @Column({ name: "grn_id", nullable: true })
  grnId?: number;

  @Column({ name: "inspection_ref", nullable: true })
  inspectionRef?: string;

  // 🔹 Derived fields
  @Expose()
  get availableQty(): number {
    return this.currentStock - this.reservedStock;
  }

  @Expose()
  get isExpired(): boolean {
    if (!this.expiryDate) return false;
    return new Date(this.expiryDate) < new Date();
  }

  // 🔹 Audit
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "is_deleted", default: false })
  isDeleted: boolean;
}

export const BatchRepository = (): Repository<IInventoryBatch> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Batch);
} 