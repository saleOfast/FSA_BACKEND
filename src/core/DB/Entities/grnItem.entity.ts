import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Repository,
} from "typeorm";

import { GrnHeader } from "./grnHeader.entity";
import { Inventory } from "./inventory";
import { Batch } from "./inventoryBatch.entity";
import { DbConnections } from "../postgresdb";

export interface IGrnItem {
  grnItemId: number;
  grnId: string;
  skuId: number;
  inventoryId: number;
  batchId: number;
  receivedQty: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

@Entity("grn_items")
export class GrnItem extends BaseEntity implements IGrnItem {
  @PrimaryGeneratedColumn({ name: "grn_item_id" })
  grnItemId: number;

  @Column({ name: "grn_id", type: "uuid" })
  grnId: string;

  @ManyToOne(() => GrnHeader, { onDelete: "CASCADE" })
  @JoinColumn({ name: "grn_id" })
  grnHeader: GrnHeader;

  @Column({ name: "sku_id", type: "int" })
  skuId: number;

  // We keep skuId as scalar; relation can be added later if needed

  @Column({ name: "inventory_id", type: "int" })
  inventoryId: number;

  @ManyToOne(() => Inventory)
  @JoinColumn({ name: "inventory_id" })
  inventory: Inventory;

  @Column({ name: "batch_id", type: "int" })
  batchId: number;

  @ManyToOne(() => Batch)
  @JoinColumn({ name: "batch_id" })
  batch: Batch;

  @Column({ name: "received_qty", type: "int" })
  receivedQty: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "is_deleted", default: false })
  isDeleted: boolean;
}

export const GrnItemRepository = (): Repository<GrnItem> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(GrnItem);
};

