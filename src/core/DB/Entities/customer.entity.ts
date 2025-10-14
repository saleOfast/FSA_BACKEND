import { v4 as uuidv4 } from 'uuid';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    BaseEntity,
    Repository,
    JoinColumn
} from "typeorm"
import { DbConnections } from "../postgresdb"
import { User } from "./User.entity"
import {ICustomer} from "../../types/CustomerService/CustomerService"
import {IAddress} from "../../types/CustomerService/CustomerService"
import {Beat} from './beat.entity'

@Entity ({name:"customers"})
export class Customer extends BaseEntity implements ICustomer {
@PrimaryGeneratedColumn('uuid')
id:string= uuidv4();

 @Column({type:"varchar",length:100,nullable:false})
  customerName: string;

@Column({ type: "varchar", length: 30, unique: true, nullable: false })
  customerCode: string; // Unique & auto-generated (business logic side)

   @Column({ type: "varchar", length: 100, nullable: false })
  contactPersonName: string;

    @Column({ type: "varchar", length: 13, nullable: false })
  contactNumber: string;

    @Column({ type: "varchar", length: 100, nullable: false })
  email: string;

 @Column({ type: "simple-json", nullable: true })
shippingAddress?: IAddress;

@Column({ type: "simple-json", nullable: true })
billingAddress?: IAddress;


    // Region/Territory persisted in DB; synced from Beat.area when Beat is assigned
@Column({ name: "region_or_territory", type: "varchar", length: 100, nullable: true, unique: true })
regionOrTerritory?: string;

  // ManyToOne relation to Beat
@ManyToOne(() => Beat, { nullable: true })
@JoinColumn({ name: "beat_id" })
beat?: Beat;

// Note: regionOrTerritory is now a physical column; populate it from Beat.area in the controller

   @Column({
    type:"enum",
    enum: ["Dealer","Distributor","Retailer","Super Stockes"],
    nullable:true,
})
distributorType: "Dealer" | "Distributor" | "Retailer" | "Super Stockes";

   @Column({ type: "varchar", length: 30, nullable: true })
  taxIdOrGSTIN: string;

  
  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  creditLimit: number;

  @Column({
    type: "enum",
    enum: ["Cash", "Credit", "Online", "Other"],
    default: "Cash",
})
paymentMethod: "Cash" | "Credit" | "Online" | "Other";

@Column({
    type: "enum",
    enum: ["Active", "Inactive"],
    default: "Active",
})
status: "Active" | "Inactive";

   @Column({ type: "date", default: () => "CURRENT_DATE" })
  registrationDate: Date;

  @ManyToOne(() => User, { nullable: true })
@JoinColumn({ name: 'salesManagerEmpId' })    // choose the exact DB column name
salesManager: User;

@Column({ name: 'salesManagerEmpId', nullable: true })
salesManagerId: string;     

@Column({
    type: "enum",
    enum: ["Primary", "Secondary"],
    nullable: true,
})
distributorCategory: "Primary" | "Secondary";

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  performanceTarget: number;

  
  @Column({ type: "text", nullable: true })
  remarks: string;

  @CreateDateColumn({ name: "created_date" })
  createdDate: Date;

  @Column({ name: "created_by", type: "varchar", length: 50 })
  createdBy: string;

  @UpdateDateColumn({ name: "modified_date" })
  modifiedDate: Date;

  @Column({ name: "modified_by", type: "varchar", length: 50 })
  modifiedBy: string;

  
@Column({ name: "is_deleted", type: "boolean", default: false }) 
deleted: boolean;
}





export const CustomerRepository = (): Repository<Customer> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Customer);
}