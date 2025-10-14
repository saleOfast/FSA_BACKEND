import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
   Repository,
 ManyToOne,
 BaseEntity ,
 JoinColumn
} from "typeorm";
import { DbConnections } from "../postgresdb"
import { User } from "./User.entity"
import {IDiscountList} from "../../types/DiscountListService/DiscountListService"
import {DiscountItem} from "../Entities/discountItem.entity"
export enum DiscountType {
  PERCENTAGE = "Percentage",
  FIXED_AMOUNT = "Fixed Amount",
  TIERED = "Tiered",
  VOLUME_BASED = "Volume-Based",
}

export enum DiscountStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  EXPIRED = "Expired",
}

@Entity({ name: "discount_lists" })
export class DiscountList  extends BaseEntity implements IDiscountList {
  @PrimaryGeneratedColumn("uuid")
  discountListId: string; // Discount List ID

  @Column({ length: 50 })
  discountListName: string; // Discount List Name

  @Column({ type: "text", nullable: true })
  description: string; // Description

  @Column({ type: "date" })
  startDate: Date; // Start Date

  @Column({ type: "date" })
  endDate: Date; // End Date

  @Column({ type: "enum", enum: DiscountType })
  discountType: DiscountType; // Discount Type

  @Column({ type: "simple-json", nullable: true })
applicableProducts: string[];

  @Column({ type: "simple-json", nullable: true })
  applicableCategories: string[]; // Can be JSON or CSV of category IDs

  @Column({ type: "text", nullable: true })
  customerSegment: string; // Customer Segment

  @Column({ type: "decimal", nullable: true })
  minOrderValue: number; // Minimum Order Value

  @Column({ type: "decimal", nullable: true })
  maxDiscountAmount: number; // Maximum Discount Amount

  @Column({ type: "int", nullable: true })
  usageLimit: number; // Usage Limit

  @Column({ type: "enum", enum: DiscountStatus, default: DiscountStatus.ACTIVE })
  status: DiscountStatus; // Status

  @CreateDateColumn()
  createdDate: Date; // Created Date

  @UpdateDateColumn()
  lastUpdatedDate: Date; // Last Updated Date
  
  @Column({name:"is_delete",default:"false",type:"boolean"})
  is_deleted:boolean


  @ManyToOne(() => User, { eager: true }) // eager: true loads user automatically
  @JoinColumn({ name: "createdBy" }) // matches the column name
  createdByUser: User|null;

  @ManyToOne(()=>User,{eager:true})
  @JoinColumn({name:"lastModifiedBy"})
  lastModifiedByUser: User|null;

  // Getter to satisfy the interface requirement
  get createdBy(): string | null {
    return this.createdByUser?.emp_id?.toString() || null;
  }

  // Getter to satisfy the interface requirement
  get lastModifiedBy(): string | null {
    return this.lastModifiedByUser?.emp_id?.toString() || null;
  }

//   Relation with Discount Items
  @OneToMany(() => DiscountItem, (item) => item.discountList, { cascade: true })
  items: DiscountItem[];
}

export const DiscountListRepository = (): Repository<DiscountList> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(DiscountList);
}
