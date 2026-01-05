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
import { Sku } from "../Entities/sku.entity";

import { DbConnections } from "../postgresdb";


export interface IInventory {
  // Primary
  inventoryId: number;
  inventoryName?: string;

  // Lookups
  skuId: number;
  productId: number;       // derived from SKU at save time
  warehouseId?: number;

  // Quantities
  stockQuantity: number;   // physical stock
  // reservedQuantity: number;

  // Optional tracking
  batchNumber?: string;
  expiryDate?: Date;
  stockInDate?: Date;
  stockOutDate?: Date;
  reorderLevel?: number;

  // Lookups
  taxId?: number;
  schemeId?: number;
  discountId?: number;

  // 🔹 Formula / Derived (NOT stored)
  soldQuantity?: number;       // from orders
  availableQuantity?: number;  // stock - reserved
  returns?: number;            // from return table
  shelfLife?: number | null;   // today → expiry
  isExpired?: boolean;
  isBelowReorderLevel?: boolean;

  // Audit
  createdAt: Date;
  updatedAt: Date;


}




@Entity({ name: "inventory" })
export class Inventory extends BaseEntity implements IInventory {

  @PrimaryGeneratedColumn({ name: "inventory_id" })
  inventoryId: number;

  @Column({ name:"inventory_name", type: "varchar", nullable: true})
  inventoryName?: string;

@Column({ name: "sku_id" })
 skuId: number;

@ManyToOne(() => Sku)
@JoinColumn({ name: "sku_id" })
sku: Sku;

@Column({ name: "product_id" })
productId: number;

@ManyToOne(() => Products)
@JoinColumn({ name: "product_id" })
product: Products;

// product ref from sku table , (now from product table)


  @Column({ name: "warehouse_id",nullable: true })
  warehouseId?: number;


  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: "warehouse_id"})
  warehouse?: Warehouse;


  @Column({ name: "stock_quantity", type: "int", default: 0 })
  stockQuantity: number;

  // @Column({ name: "reserved_quantity", type: "int", default: 0 })
  // reservedQuantity: number;

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
    return this.stockQuantity 
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

  get soldQuantity(): number {
  return 0;
}

// Return Quantity – future Return module
get returns(): number {
  return 0;
}

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

    @Column({ name: "is_deleted", default: false })
isDeleted: boolean;
}

export const InventoryRepository = (): Repository<Inventory> => {
  return DbConnections.AppDbConnection
    .getConnection()
    .getRepository(Inventory);
};
