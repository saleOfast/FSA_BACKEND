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
import { Customer } from "../../DB/Entities/customer.entity";

// ✅ ENUM imports
import {
  PosmTypeEnum,
  PosmCategoryEnum,
  POSMMaterialTypeEnum,
  POSMChannelTargetEnum,
  POSMAllocationTargetEnum,
  PosmStatusEnum,
} from "../../types/Constent/common";


@Entity({ name: "posm" })
export class Posm extends BaseEntity implements IPosm  {

  @PrimaryGeneratedColumn()
  posmId: number;

  @Column({ type: "varchar", length: 255 })
  posmName: string;

  @Column({
    type: "enum",
    enum: PosmTypeEnum,
  })
  posmType: PosmTypeEnum;

  @Column({
    type: "enum",
    enum: PosmCategoryEnum,
  })
  posmCategory: PosmCategoryEnum;

  @Column({
    type: "enum",
    enum: POSMMaterialTypeEnum,
  })
  materialType: POSMMaterialTypeEnum;

  @Column({ type: "text", nullable: true })
  dimensionsSpecs?: string;

  @Column({ type: "varchar", length: 100 })
  campaignId: string;

  @Column({
    type: "enum",
    enum: POSMChannelTargetEnum,
  })
  channelTarget: POSMChannelTargetEnum;

  @Column({ type: "varchar", length: 100 })
  regionTarget: string;

  @Column({
    type: "enum",
    enum: POSMAllocationTargetEnum,
  })
  allocationTarget: POSMAllocationTargetEnum;

  @Column({ type: "int" })
  quantityAllocated: number;

  @Column({ type: "date" })
  allocationDate: string;

  @Column({ type: "varchar", length: 50 })
  sku: string;


@Column()
customerId: number;

@ManyToOne(() => Customer)
@JoinColumn({ name: "customerId" })
customer: Customer;



  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  unitCost?: number;

  @Column({ type: "int", nullable: true })
  claimedTarget?: number;

    @Column({ type: "boolean", default: false })
  is_deleted: boolean;

}

export const PosmRepository = (): Repository<Posm> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Posm);
}