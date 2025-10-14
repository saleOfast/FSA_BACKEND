import {  IStore} from "../../../core/types/StoreService/StoreService";
// import { StoreCategory } from "./storeCategory.entity";
import { User } from "./User.entity";
import { Activities } from "./activities.entity";
import { Sessions } from "./sessions.entity";
import { FeedBack } from "./feedback.entity";
import { Samples } from "./samples.entity";
import { PracticeTypeEnum } from "../../../core/types/Constent/common";
import { Workplace } from "./workplace.entity";
import { Visits } from "./Visit.entity";
import { RCPA } from "./rcpa.entity";
import { Gifts } from "./giftDistribution.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Repository,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { DbConnections } from "../postgresdb";

@Entity({ name: "stores" })
export class Stores extends BaseEntity implements IStore{
  // StoreId (unique identifier, auto-generated)
  @PrimaryGeneratedColumn({ name: "store_id" })
  storeId: number;

@Column({ name: "store_name", type: "varchar", length: 100, nullable: true, unique: true })
storeName: string;


  // CustomerId (assuming foreign key string/id)
  @Column({ name: "customer_id", type: "varchar", length: 50, nullable: true })
  customerId: string | null;

  // Address fields
  @Column({ name: "address", type: "varchar", length: 200, nullable: true })
  address: string |null;

  @Column({ name: "city", type: "varchar", length: 100, nullable: true })
  city: string |null;

  @Column({ name: "state", type: "varchar", length: 100, nullable: true })
  state: string| null;

  @Column({ name: "zip", type: "varchar", length: 20, nullable: true })
  zip: string| null;

  // Contact Person
  @Column({ name: "contact_person", type: "varchar", length: 50, nullable: true })
  contactPerson: string | null;

  // Contact Phone
  @Column({ name: "contact_phone", type: "varchar", length: 50, nullable: true})
  contactPhone: string | null;

  // Email
  @Column({ name: "email", type: "varchar", length: 100, nullable: true })
  email: string| null;

  // Capacity
  @Column({ name: "capacity", type: "varchar", length: 50, nullable: true })
  capacity: string| null;

  // Store Type (Picklist)
  @Column({
    name: "store_type",
    type: "enum",
    enum: ["Distribution Center", "Cold Storage", "Storage"],
    nullable: true,
  })
  storeType: "Distribution Center" | "Cold Storage" | "Storage"| null;

  // Operational Hours
  @Column({ name: "operational_hours", type: "varchar", length: 30, nullable: true })
  operationalHours: string | null;

  @Column({ name: "manager_name", nullable: true })
  managerId: number | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: "manager_name" })
  managerName: User | null;

  @Column({ name: "manager_contact", nullable: true })
  managerContactId: number | null;
  // Manager Contact (User Ref → User table)
  @ManyToOne(() => User)
  @JoinColumn({ name: "manager_contact" })
  managerContact: User | null;

  // Status (Active/Inactive picklist, default Active)
  @Column({
    name: "status",
    type: "enum",
    enum: ["Active", "Inactive"],
    default: "Active",
  })
  status: "Active" | "Inactive";

  // Audit fields
  @CreateDateColumn({ name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ name: "last_updated_date" })
  lastUpdatedDate: Date;

  @Column({ name: "created_by", nullable: true })
  createdById: number | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  createdBy: User | null;

  @Column({ name: "last_modified_by", nullable: true })
  lastModifiedById: number | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: "last_modified_by" })
  lastModifiedBy: User | null;

  // Optional soft delete
@Column({ name: "is_deleted", type: "boolean", default: false })
deleted: boolean;


  @OneToMany(() => Samples, (samples) => samples.store)
  samples: Samples[];

  @OneToMany(() => Activities, (activity) => activity.store)
  activities: Activities[];

  @OneToMany(() => FeedBack, (feedback) => feedback.store)
  feedback: FeedBack[];
  
  @OneToMany(() => Gifts, (gifts) => gifts.store)
  gift: Gifts[];

  @OneToMany(() => Visits, (visits) => visits.stores)
  visits: Visits[];

  @OneToMany(() => RCPA, (rcpa) => rcpa.store)
  rcpa: RCPA[];

  @OneToMany(() => Workplace, (workplace) => workplace.store)
  workplace: Workplace[];
  
  @OneToMany(() => Sessions, (sessions) => sessions.store)
  sessions: Sessions[];


//   @Column({ type: "integer", nullable: true })
// emp_id: number;

  // Store Category related fields - COMMENTED OUT
  // @Column({ name: "store_category_id", nullable: true })
  // storeCategoryId?: number | null;
  // 
  // @ManyToOne(() => StoreCategory)
  // @JoinColumn({ name: "store_category_id" })
  // storeCategory?: StoreCategory | null;

}
export const StoreRepository = (): Repository<Stores> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(Stores);
};