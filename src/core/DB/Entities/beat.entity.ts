import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn, ManyToMany, OneToMany } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IBeat } from "../../../core/types/BeatService/Beat";
// import { User } from "./User.entity";
import { Stores } from "./stores.entity";
import { User } from "../Entities/User.entity";
import { Customer } from "../Entities/customer.entity";
import { Warehouse } from "../Entities/warehouse.entity";
import {Country} from "./country.entity"
import { District } from "./district.entity";
import { State } from "./state.entity";
import { Scheme } from "./scheme.entity";

import {
  BeatPriority,
  BeatStatus,
  BeatType,
  VisitFrequency,
  VisitDay,
} from "../../../core/types/Constent/common";

@Entity("beat")
export class Beat extends BaseEntity {
  /* ================= Identity ================= */

  @PrimaryGeneratedColumn({ name: "beat_id" })
  beatId: number;

  @Column({ name: "beat_code", unique: true })
  beatCode: string; // BT-S-001 (generated in service)

  @Column({ name: "beat_name" })
  beatName: string;
  
  @OneToMany(() => Scheme, (scheme) => scheme.beat)
 schemes: Scheme[];

  /* ================= Ownership ================= */

  @Column({ name: "customer_id" })
  customerId: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @Column({ name: "warehouse_id", nullable: true })
  warehouseId?: string;

  @ManyToOne(() => Warehouse, { nullable: true })
  @JoinColumn({ name: "warehouse_id" })
  warehouse?: Warehouse;

  @Column({ name: "user_id", nullable: true })
  userId?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user?: User;

  /* ================= Business ================= */

  get channel(): string | undefined {
    return this.customer?.channelType; // GT / MT / HORECA
  }

 @Column({
  type: "enum",
  enum: BeatType,
  name: "beat_type",
//   default: BeatType.SALES, // default for existing rows
})
beatType!: BeatType;

  @Column({
    type: "enum",
    enum: VisitFrequency,
    name: "visit_frequency",
  })
  visitFrequency: VisitFrequency;

  @Column({
    type: "enum",
    enum: VisitDay,
    array: true,
    nullable: true,
    name: "default_visit_days",
  })
  defaultVisitDays?: VisitDay[];

  @Column({
    type: "enum",
    enum: BeatPriority,
    name: "priority",
  })
  priority: BeatPriority;

  @Column({
    type: "enum",
    enum: BeatStatus,
    default: BeatStatus.ACTIVE,
    name: "status",
  })
  status: BeatStatus;

  /* ================= Location ================= */

  @Column({ name: "country_id" })
  countryId: number;

  @ManyToOne(() => Country)
  @JoinColumn({ name: "country_id" })
  country: Country;

  @Column({ name: "state_id" })
  stateId: number;

  @ManyToOne(() => State)
    @JoinColumn({ name: "state_id" })
    state: State;

  @Column({ name: "district_id" })
  districtId: number;

    @ManyToOne(() => District)
    @JoinColumn({ name: "district_id" })
    district: District;

  @Column({ name: "area", nullable: true })
  area?: string;

  @Column({ name: "zone", nullable: true })
  zone?: string;

  /* ================= Route Planning ================= */

  @Column({ type: "decimal", precision: 9, scale: 6, nullable: true, name: "start_lat" })
  startLat?: number;

  @Column({ type: "decimal", precision: 9, scale: 6, nullable: true, name: "start_lng" })
  startLng?: number;

  @Column({ type: "decimal", precision: 9, scale: 6, nullable: true, name: "end_lat" })
  endLat?: number;

  @Column({ type: "decimal", precision: 9, scale: 6, nullable: true, name: "end_lng" })
  endLng?: number;

  @Column({ type: "timestamp", nullable: true, name: "planned_start_time" })
  plannedStartTime?: Date;

  @Column({ type: "timestamp", nullable: true, name: "planned_end_time" })
  plannedEndTime?: Date;

  /* ================= Audit ================= */

  @Column({ name: "created_by" })
  createdBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  createdByUser: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: 'is_deleted', default: false })
isDeleted!: boolean;
}

export const BeatRepository = (): Repository<IBeat> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Beat);
}