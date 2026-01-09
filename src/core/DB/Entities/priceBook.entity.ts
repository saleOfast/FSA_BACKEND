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
import { DbConnections } from "../postgresdb"
import { CustomerType } from "./customerType.entity"
import { Customer } from "./customer.entity"
import { Country } from "./country.entity"
import {State} from "./state.entity"
import {District} from "./district.entity"
import { Beat } from "./beat.entity"
import { IPriceBook } from "../../types/PriceBookService/PriceBookService"

import {PriceBookType , PriceBookStatus, ApprovalStatus, Channel, CurrencyType, PriorityType} from "../../../core/types/Constent/common"

import { User } from "./User.entity";

@Entity({ name: "price_book" })
export class PriceBook extends BaseEntity implements IPriceBook {

  // ================== Identifiers ==================
  @PrimaryGeneratedColumn({ name: "price_book_id" })
  priceBookId: number;

  @Column({ name: "tenant_id", type: "uuid", nullable: true })
  tenantId?: string;

  // ================== Basic Details ==================
  @Column({ name: "price_book_code", type: "text", unique: true })
  priceBookCode: string;

  @Column({ name: "price_book_name", type: "text" })
  priceBookName: string;

  @Column({
    name: "price_book_type",
    type: "enum",
    enum: PriceBookType,
  })
  priceBookType: PriceBookType;

  // ================== Channel & Customer ==================
  @Column({
    name: "channel",
    type: "enum",
    enum: Channel,
  })
 Channel: Channel;

  @ManyToOne(() => CustomerType, { nullable: true })
  @JoinColumn({ name: "customer_type_id" })
  customerType?: CustomerType;

  @ManyToOne(() => Customer, { nullable: true, eager: true })
  @JoinColumn({ name: "customer_id" })
  customer?: Customer;

  // ================== Geography ==================
  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: "country_id" })
  country?: Country;

  @ManyToOne(() => State, { nullable: true })
  @JoinColumn({ name: "state_id" })
  state?: State;

  @ManyToOne(() => District, { nullable: true })
  @JoinColumn({ name: "district_id" })
  district?: District;

  @ManyToOne(() => Beat, { nullable: true })
  @JoinColumn({ name: "beat_route_id" })
  beatRoute?: Beat;

  // ================== Currency & Priority ==================
  @Column({
    name: "currency",
    type: "enum",
    enum: CurrencyType,
  })
  currency: CurrencyType;

  @Column({
    name: "priority",
    type: "enum",
    enum: PriorityType,
  })
  priority: PriorityType;

  // ================== Validity ==================
  @Column({ name: "effective_from", type: "date" })
  effectiveFrom: Date;

  @Column({ name: "effective_to", type: "date", nullable: true })
  effectiveTo?: Date;

  // ================== Versioning & Lifecycle ==================
  @Column({ name: "version", type: "int", default: 1 })
  version: number;

  @Column({
    name: "status",
    type: "enum",
    enum: PriceBookStatus,
    default: PriceBookStatus.DRAFT,
  })
  status: PriceBookStatus;

  @Column({
    name: "approval_status",
    type: "enum",
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  approvalStatus: ApprovalStatus;

  // ================== Audit ==================

  @Column({ name: "created_by" })
  createdBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  createdByUser: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  // // ================== Governance ==================
  // @Column({ name: "approved_by", type: "int", nullable: true })
  // approvedBy?: number;

  //  @ManyToOne(() => User)
  // @JoinColumn({ name: "approved_by" })
  // approveByUser: User;

  // @Column({ name: "approved_at", type: "timestamp", nullable: true })
  // approvedAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;


  get channel(): string | undefined {
    return this.customer?.channelType; // GT / MT / HORECA
  }
@Column({ name: "is_deleted", type: "boolean", default: false })
isDeleted!: boolean;
}

export const PriceBookRepository = (): Repository<PriceBook> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(PriceBook);
}