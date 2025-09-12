import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Repository,
  ManyToOne,
  JoinColumn,
  BaseEntity
} from "typeorm";
import { ISku } from "core/types/skuService/skuService";
import { Products } from "./products.entity";
import { Warehouse } from "./warehouse.entity";
import { DbConnections } from "../postgresdb";

@Entity()
@Unique(["skuNumber", "barcode"])
export class Sku extends BaseEntity implements ISku {
  @PrimaryGeneratedColumn({ name: "sku_id" })
  id: number; // Primary key

  // Getter for productName from relation to satisfy ISku interface
  get productName(): string {
    return this.product?.productName ?? '';
  }
  // Map ISku.skuId to this.id
  get skuId(): number {
    return this.id;
  }
  @Column()
  skuNumber: string;

  @Column()
  salesChannel: string;

  @Column()
  channelSku: string;

  @Column()
  barcode: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  attributeColor: string;

  @Column({ nullable: true })
  attributeSize: string;

  @Column("int")
  stockLevel: number;

  // Relation to Product
  @ManyToOne(() => Products, { eager: true })
  @JoinColumn({ name: "productId" })
  product: Products;

  // Relation to Warehouse
  @ManyToOne(() => Warehouse, { eager: true })
  @JoinColumn({ name: "warehouseId" })
  warehouse: Warehouse;

  @Column({ type: "text", nullable: true })
  productDescription: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;


//   // getter for productName from relation
//   get productName(): string {
//     return this.product?.name;
//   }

//   // getter for warehouseLocation from relation
//   get warehouseLocation(): string {
//     return this.warehouse?.location;
//   }
}

export const SkuRepository = (): Repository<Sku> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(Sku);
};
