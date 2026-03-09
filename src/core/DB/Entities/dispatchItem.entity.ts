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
import { DbConnections } from "../postgresdb";
import { DispatchHeader } from "./dispatchHeader.entity";
import { SalesOrderItem } from "./salesOrderItem.entity";
import { Sku } from "./sku.entity";
import { Products } from "./products.entity";
import { Batch } from "./inventoryBatch.entity";
import { DispatchedStatusEnum } from "../../types/Constent/common";

@Entity("dispatch_item")
export class DispatchItem extends BaseEntity {

  @PrimaryGeneratedColumn( { name: "dispatch_item_id" })
  dispatchItemId: number;

  // ✅ Dispatch FK
  @ManyToOne(() => DispatchHeader, (dispatch) => dispatch.items, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "dispatch_id" })
  dispatch: DispatchHeader;

  // ✅ Sales Order Item FK
  @ManyToOne(() => SalesOrderItem)
  @JoinColumn({ name: "sales_order_item_id" })
  salesOrderItem: SalesOrderItem;

  // ✅ SKU FK
  @ManyToOne(() => Sku)
  @JoinColumn({ name: "sku_id" })
  sku: Sku;

  // ✅ Product FK
  @ManyToOne(() => Products)
  @JoinColumn({ name: "product_id" })
  product: Products;

  // ✅ Batch FK
  @ManyToOne(() => Batch)
  @JoinColumn({ name: "batch_id" })
  batch: Batch;

  @Column({ name: "ordered_qty", type: "int" })
  orderedQty: number;

  @Column({ name: "dispatched_qty", type: "int" })
  dispatchedQty: number;

  @Column({ name: "remaining_qty", type: "int" })
  remainingQty: number;

  @Column({
    type: "enum",
    enum: DispatchedStatusEnum,
    name: "dispatch_status",
  })
  dispatchStatus: DispatchedStatusEnum;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "is_deleted", default: false })
  isDeleted: boolean;

}

export const DispatchItemRepository = (): Repository<DispatchItem> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(DispatchItem);
};
