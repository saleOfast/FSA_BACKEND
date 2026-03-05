import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  Repository
} from 'typeorm';

import { SalesOrderHeader } from './SalesOrderHeader.entity';
import { Products } from './products.entity';
import { ItemShippingAddress } from './shippingAddress.entity';
import {Sku} from '../../DB/Entities/sku.entity'
import{ ISalesOrderItem } from '../../types/SalesOderItemService/salesOrderItemService'
import { Discount } from './discount.entity';
import {Scheme} from './scheme.entity'
import { Taxes } from './tax.entity';
import { Warehouse } from './warehouse.entity';
import { DbConnections} from "../postgresdb";

@Entity('sales_order_item')
export class SalesOrderItem extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  /* -------------------- Relations -------------------- */

  @ManyToOne(() => SalesOrderHeader, (so) => so.Items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder: SalesOrderHeader;

  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id' })
  product: Products;

  @ManyToOne(() => ItemShippingAddress)
  @JoinColumn({ name: 'shipping_address_id' })
  shippingAddress: ItemShippingAddress;

  /* -------------------- SKU Details -------------------- */

  @ManyToOne(() => Sku)
  @JoinColumn({ name: 'sku_id' })
  sku: Sku;


 @Column({ type: 'varchar', length: 50 })
 uom: string;

  /* -------------------- Quantity & Pricing -------------------- */

  @Column({ type: 'int' })
  saleQty: number;

  
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @ManyToOne(()=>Discount)
  @JoinColumn({name:'discount_id'})
  discount?:Discount;
  @Column({ name: 'discount_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 })
   discountPercentage: number;


   @ManyToOne(()=>Scheme)
  @JoinColumn({name:'scheme_id'})
  scheme?:Scheme;
  @Column({ name: 'scheme_id', type: 'int', nullable: true })
  schemeId?: number;

  /* -------------------- Calculated Amounts -------------------- */

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalBaseValue: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  discountValue: number;

  // @Column({ name: 'scheme_amount', type: 'decimal', precision: 12, scale: 2, default: 0, nullable: true })
  // schemeAmount: number;

  @ManyToOne(() => Taxes)
  @JoinColumn({ name: 'tax_id' })
tax: Taxes;
  @Column({ name: 'tax_percentage', type: 'decimal', precision: 5, scale: 2 })
  taxPercentage: number;


  @Column({ type: 'decimal', precision: 12, scale: 2 })
  netAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  grossAmount: number;

@ManyToOne(() => Warehouse)
@JoinColumn({ name: 'warehouse_id' })
warehouse: Warehouse;

@Column({ name: 'warehouse_name', type: 'varchar', length: 150 })
warehouseName: string;

  /* -------------------- Audit -------------------- */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({name:'isDeleted', default:false})
  isDeleted:boolean
}

export const SalesOrderItemRepository = (): Repository<SalesOrderItem> => {
  return DbConnections.AppDbConnection
    .getConnection()
    .getRepository(SalesOrderItem);
};