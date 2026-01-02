import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository,ManyToOne, JoinColumn,OneToMany } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IScheme } from "../../../core/types/SchemeService/SchemeService";
import { IUser} from "../../../core/types/AuthService/AuthService";


import { Customer } from "./customer.entity";
import { Products } from "./products.entity";
import { Sku } from "./sku.entity";
import { Warehouse } from "./warehouse.entity";
import { Posm } from "./posm.entity";
import { CustomerType } from "./customerType.entity";
import { SchemeType, SchemeNature, SchemeStatus, BenefitType, ClaimPeriod } from "../../types/Constent/common"

@Entity()
export class Scheme extends BaseEntity implements IScheme {
   @PrimaryGeneratedColumn({ name: "scheme_id" })
  id: number;

  @Column({ name: "scheme_name" })
  schemeName: string;

  @Column({ type: "enum", enum: SchemeType, name: "scheme_type" })
  schemeType: SchemeType;

  @Column({ type: "enum", enum: SchemeNature, name: "scheme_nature" })
  schemeNature: SchemeNature;

  @Column({ type: "date", name: "start_date" })
  startDate: Date;

  @Column({ type: "date", name: "end_date" })
  endDate: Date;

  @Column({ type: "enum", enum: SchemeStatus, default: SchemeStatus.ACTIVE })
  status: SchemeStatus;

  @Column({ name: "priority", nullable: true })
  priority: number;

  @Column({ name: "auto_apply", default: true })
  autoApply: boolean;

  /* ================= LOOKUPS ================= */

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: "customer_id" })
  customer?: Customer;

  @ManyToOne(()=>CustomerType, { nullable: true })
    @JoinColumn({ name: "customer_type_id" })
    customerType?: CustomerType;

//   @ManyToOne(() => Products, { nullable: true })
//   @JoinColumn({ name: "product_id" })
//   product?: Products;
 @OneToMany(() => Products, (products) => products.scheme)
products?: Products[];

  @ManyToOne(() => Sku, { nullable: true })
  @JoinColumn({ name: "sku_id" })
  sku?: Sku;

  @ManyToOne(() => Warehouse, { nullable: true })
  @JoinColumn({ name: "warehouse_id" })
  warehouse?: Warehouse;

  @ManyToOne(() => Posm, { nullable: true })
  @JoinColumn({ name: "posm_id" })
  posm?: Posm;
  
  @Column({ name:"beat_id"})
    beatId?: number;

//   @ManyToOne(() => Beat, { nullable: true })
//   @JoinColumn({ name: "beat_id" })
//   beat?: Beat;
  /* ================= CONDITIONS ================= */

  @Column({ name: "min_qty", type: "int", nullable: true })
  minQty?: number;

  @Column({ name: "min_value", type: "decimal", precision: 10, scale: 2, nullable: true })
  minValue?: number;

  @Column({ name: "slab_from", type: "int", nullable: true })
  slabFrom?: number;

  @Column({ name: "slab_to", type: "int", nullable: true })
  slabTo?: number;

  /* ================= BENEFIT ================= */

  @Column({ type: "enum", enum: BenefitType, name: "benefit_type" })
  benefitType: BenefitType;

  @Column({ name: "benefit_qty", type: "int", nullable: true })
  benefitQty?: number;

  @Column({ name: "benefit_limit", type: "int", nullable: true })
  BenefitLimit?: number;

  @Column({ name: "is_claimable", default: false })
  isClaimable: boolean;

  @Column({ type: "enum", enum: ClaimPeriod, nullable: true, name: "claim_period" })
  claimPeriod?: ClaimPeriod;

  /* ================= AUDIT ================= */

@Column({ name: "created_by" })
createdBy: number;

  @Column({ name: "is_enable", default: true })
  isEnable: boolean;

  @Column({ name: "is_deleted", default: false })
  isDeleted: boolean;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    name: "created_at",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
    name: "updated_at",
  })
  updatedAt: Date;

}

export const getSchemeRepository = (): Repository<IScheme> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Scheme);
}