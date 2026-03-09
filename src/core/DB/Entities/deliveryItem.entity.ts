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
import { DeliveryStatusEnum } from "../../types/Constent/common";
import { DeliveryHeader } from "./deliveryHeader.entity";
import { DispatchItem } from "./dispatchItem.entity";
import { Sku } from "./sku.entity";
import { Products } from "./products.entity";
import { Batch } from "./inventoryBatch.entity";

@Entity("delivery_item")
export class DeliveryItem extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "delivery_item_id" })
  deliveryItemId: number;

  @Column({ name: "delivery_id", type: "int" })
  deliveryId: number;

  @ManyToOne(() => DeliveryHeader, (d) => d.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "delivery_id" })
  delivery: DeliveryHeader;

  @Column({ name: "dispatch_item_id", type: "int", nullable: true })
  dispatchItemId: number | null;

  @ManyToOne(() => DispatchItem, { nullable: true })
  @JoinColumn({ name: "dispatch_item_id" })
  dispatchItem: DispatchItem | null;

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

  @Column({ name: "ordered_qty", type: "int" })
  orderedQty: number;

  @Column({ name: "batch_id", nullable: true })
  batchId: number | null;

  @ManyToOne(() => Batch, { nullable: true })
  @JoinColumn({ name: "batch_id" })
  batch: Batch | null;

  /** From Dispatch Item - dispatched qty becomes deliverable qty */
  @Column({ name: "deliverable_qty", type: "int" })
  deliverableQty: number;

  @Column({ name: "delivered_qty", type: "int", default: 0 })
  deliveredQty: number;

  @Column({ name: "delivery_date", type: "date", nullable: true })
  deliveryDate: Date | null;

  /** Formula: deliverable_qty - delivered_qty */
  @Column({ name: "remaining_qty", type: "int", default: 0 })
  remainingQty: number;

  @Column({
    type: "enum",
    enum: DeliveryStatusEnum,
    name: "delivery_status",
  })
  deliveryStatus: DeliveryStatusEnum;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "is_deleted", default: false })
  isDeleted: boolean;
}

export const DeliveryItemRepository = (): Repository<DeliveryItem> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(DeliveryItem);
};
