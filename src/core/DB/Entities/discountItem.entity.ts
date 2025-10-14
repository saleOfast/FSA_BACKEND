import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Repository,
  BaseEntity
} from "typeorm";
import { DiscountList } from "../Entities/discountList.entity";
import { DbConnections } from "../postgresdb";
import { IDiscountItem } from '../../types/DiscountListService/DiscountListService';
import { User } from "./User.entity";
import{Products} from './products.entity'

@Entity({ name: "discount_items" })
export class DiscountItem extends BaseEntity implements IDiscountItem {
  @PrimaryGeneratedColumn()
  discountItemId: number;

  // FK should match referenced PK type (uuid) and must not specify length for uuid
  @Column()
  discountListId: string;

  @ManyToOne(() => DiscountList, list => list.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "discountListId" })
  discountList: DiscountList;

  @Column({ type: "int", nullable: true })
  productId: number;

   @ManyToOne(() => Products, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product: Products;

  @Column({ type: "numeric" })
  discountValue: number;

  @Column({ type: "text", nullable: true })
  discountConditionRules?: string;

  @Column({ type: "int", nullable: true })
  priorityLevel?: number;

  @Column({ type: "text", nullable: true })
  remarks?: string;

  @CreateDateColumn({ type: "timestamp" })
  createdDate: Date;

  @Column({type:"boolean", default:"false"})
  deleted:boolean;

  @UpdateDateColumn({ type: "timestamp" })
  lastUpdatedDate: Date;


  // Relations to User
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "createdBy" })
  createdByUser: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "lastModifiedBy" })
  lastModifiedByUser: User;

  // Getters to satisfy interface as strings
  get createdBy(): string {
    return this.createdByUser?.emp_id?.toString();
  }

  get lastModifiedBy(): string {
    return this.lastModifiedByUser?.emp_id?.toString();
  }
}

// Repository function
export const DiscountItemRepository = (): Repository<DiscountItem> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(DiscountItem);
}
