import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  Repository,
} from "typeorm";
import { Customer } from "./customer.entity"
import { Warehouse } from "./warehouse.entity";
import { DbConnections } from "../postgresdb";
import { PurchaseOrder } from "./purchaseOrder.entity";
import {Products} from "./products.entity";
import {Sku} from './sku.entity'
import {Scheme} from './scheme.entity'
import {Discount} from './discount.entity'
import {Taxes} from './tax.entity'
import {PriceBookItem} from "./price_book_item.entity"


@Entity("purchase_order_line_item")
export class PurchaseOrderLineItem {

  @PrimaryGeneratedColumn()
  purchaseOrderLineItemId: number;


  @JoinColumn({ name: "purchaseOrderId" })
  purchaseOrder: PurchaseOrder;

  @Column()
  purchaseOrderId: number;

  @ManyToOne(() => Products, { eager: true })
  @JoinColumn({ name: "productId" })
  product: Products;

  @ManyToOne(() => Sku, { eager: true })
    @JoinColumn({ name: "skuId" })
    sku: Sku;

  @Column("decimal")
  orderedQty: number;

  @Column("decimal")
  unitPrice: number;

 @ManyToOne(() => Scheme, { eager: true })
    @JoinColumn({ name: "schemeId" })
    scheme: Scheme;

  @ManyToOne(() => Discount, { eager: true })
    @JoinColumn({ name: "discountId" })
    discount: Discount;

    @ManyToOne(() => Taxes, { eager: true })
    @JoinColumn({ name: "taxId" })
    tax: Taxes;

  @Column("decimal")
  netAmount: number;
}

export const PurchasedOrderDetailsRepository = (): Repository<PurchaseOrderLineItem> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(PurchaseOrderLineItem);
}