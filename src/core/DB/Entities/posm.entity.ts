import {
    Entity,  PrimaryGeneratedColumn,
    JoinColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Repository,
    BaseEntity
} from "typeorm"
import { Distributor } from "./distributors.entity"
import{IPosm} from "../../types/PosmService/PosmService"
import { DbConnections } from "../postgresdb"
@Entity({name:"posm"})
export class Posm extends BaseEntity implements IPosm {
   @PrimaryGeneratedColumn()
   posmId: number;
   @Column({type:"varchar",length:50,unique:true})
   posmCode:string;

   @Column({type:"varchar", length:255})
  posmName:string;

  @Column({type:"varchar",length:100})
  posmType:string;

  @Column({type:"int"})
  quantityAllocated:number;

   @Column({type:"int",default:0})
  quantityDistributed:number;

  @Column({type:"int", default:0, nullable:true})
  quantityReturned?: number

  @Column({ nullable: true })
  distributorId?: number;

   @ManyToOne(() => Distributor, { onDelete: "CASCADE", nullable: true })
   @JoinColumn({ name: "distributorId" }) // <--- FK column name in posm table
   distributor?: Distributor;
    
    @Column({type:"varchar"})
  outletId:string;
  @Column({type:"varchar"})
  campaignId:string
    
  @Column({ type: "date" })
  startDate: string;

  @Column({ type: "date", nullable: true })
  endDate?: string;
  
   @Column({
    type: "enum",
    enum: ["Active", "Inactive", "Returned", "Lost"],
    default: "Active",
  })
  status: "Active" | "Inactive" | "Returned" | "Lost";
 
  @Column({ type: "varchar", length: 100, nullable: true })
  assignedTo?: string;

  @CreateDateColumn({ type: "timestamp" })
  createdDate: Date;

  @UpdateDateColumn({ type: "timestamp" })
  lastUpdatedDate: Date;
  @Column({type:"boolean",default:false})
  is_deleted:boolean
   
}

export const PosmRepository = (): Repository<Posm> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Posm);
}