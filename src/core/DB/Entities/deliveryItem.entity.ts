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
import { DeliveryHeader } from "./deliveryHeader.entity";
import { SalesOrderItem } from "./salesOrderItem.entity";
import { Sku } from "./sku.entity";
import { Products } from "./products.entity";
import { Batch } from "./inventoryBatch.entity";

@Entity("delivery_items")
export class DeliveryItem extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "delivery_item_id" })
  deliveryItemId: number;

  @Column({ name: "delivery_id", type: "uuid" })
  deliveryId: string;

  @ManyToOne(() => DeliveryHeader, (d) => d.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "delivery_id" })
  delivery: DeliveryHeader;

  @Column({ name: "order_item_id" })
  orderItemId: number;

  @ManyToOne(() => SalesOrderItem)
  @JoinColumn({ name: "order_item_id" })
  orderItem: SalesOrderItem;

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

  @Column({ name: "dispatched_qty", type: "int", default: 0 })
  dispatchedQty: number;

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
