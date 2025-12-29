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

import { Products } from "../Entities/products.entity";
import { Taxes } from "../Entities/tax.entity";

import { Warehouse } from "../Entities/warehouse.entity";

import { DbConnections } from "../postgresdb";


export interface IInventory {
  // Primary key
  inventoryId: number;

  // Relations (store IDs, not full objects)
  productId?: number; // optional now
  skuId?: number; // Foreign key, derived from SKU relation
  warehouseId?: number;

  // Stock (source of truth)
  stockQuantity: number;
  reservedQuantity: number;

  // Optional tracking
  batchNumber?: string;
  expiryDate?: Date;
  reorderLevel?: number;
  stockInDate?: Date;
  stockOutDate?: Date;

  // Optional references
  taxId?: number;
  schemeId?: number;
  discountId?: number;

  // 🔹 Derived / Formula based (NOT stored in DB)
  availableQuantity?: number;      // stockQuantity - reservedQuantity
  isExpired?: boolean;
  isBelowReorderLevel?: boolean;
  daysToExpiry?: number | null;
  shelfLife?: number | null;

  // Audit
  createdAt: Date;
  updatedAt: Date;
}




@Entity({ name: "inventory" })
export class Inventory extends BaseEntity implements IInventory {

  @PrimaryGeneratedColumn({ name: "inventory_id" })
  inventoryId: number;

@Column({ name: "sku_id", nullable: true })
skuId?: number;

// @ManyToOne(() => sku, { nullable: true })
// @JoinColumn({ name: "sku_id" })
// sku?: sku;

@Column({ name: "product_id", nullable: true })
productId?: number;

@ManyToOne(() => Products, { nullable: true })
@JoinColumn({ name: "product_id" })
product?: Products;



  @Column({ name: "warehouse_id", nullable: true })
  warehouseId?: number;


  @ManyToOne(() => Warehouse, { nullable: true })
  @JoinColumn({ name: "warehouse_id" })
  warehouse?: Warehouse;


  @Column({ name: "stock_quantity", type: "int", default: 0 })
  stockQuantity: number;

  @Column({ name: "reserved_quantity", type: "int", default: 0 })
  reservedQuantity: number;

  @Column({ name: "batch_number", nullable: true })
  batchNumber?: string;

  @Column({ name: "expiry_date", type: "date", nullable: true })
  expiryDate?: Date;

  @Column({ name: "reorder_level", type: "int", nullable: true })
  reorderLevel?: number;

  @Column({ name: "stock_in_date", type: "date", nullable: true })
  stockInDate?: Date;

  @Column({ name: "stock_out_date", type: "date", nullable: true })
  stockOutDate?: Date;

 @Column({ name: "tax_id", nullable: true })
taxId?: number;

@ManyToOne(() => Taxes, { nullable: true })
@JoinColumn({ name: "tax_id" })
tax?: Taxes;

  @Column({ name: "scheme_id", type: "int", nullable: true })
schemeId?: number;

@Column({ name: "discount_id", type: "int", nullable: true })
discountId?: number;


  // Available = Stock - Reserved
  get availableQuantity(): number {
    return this.stockQuantity - this.reservedQuantity;
  }

  // Is stock below reorder level?
  get isBelowReorderLevel(): boolean {
    if (this.reorderLevel == null) return false;
    return this.stockQuantity <= this.reorderLevel;
  }

  // Is product expired?
  get isExpired(): boolean {
    if (!this.expiryDate) return false;
    return new Date(this.expiryDate) < new Date();
  }

  // Days to expiry
  get daysToExpiry(): number | null {
    if (!this.expiryDate) return null;
    const diff =
      new Date(this.expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Shelf life (derived if stock_in_date exists)
  get shelfLife(): number | null {
    if (!this.stockInDate || !this.expiryDate) return null;
    const diff =
      new Date(this.expiryDate).getTime() -
      new Date(this.stockInDate).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

export const InventoryRepository = (): Repository<Inventory> => {
  return DbConnections.AppDbConnection
    .getConnection()
    .getRepository(Inventory);
};
