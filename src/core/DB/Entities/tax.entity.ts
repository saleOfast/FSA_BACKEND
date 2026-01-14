import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, OneToMany, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { ActivityTypeEnum } from "../../types/Constent/common";
import { JointWork } from "./activities.jointWork.entity";
import { Stores } from "./stores.entity";
import { Products } from "./products.entity";
import { User } from "./User.entity";
import {Country} from "./country.entity"
import { TaxClassification ,TaxComponent,SupplyType,YesNo} from "../../types/Constent/common";
import { State } from "./state.entity";


@Entity({ name: 'taxes' })
export class Taxes extends BaseEntity {
@PrimaryGeneratedColumn({ name: 'tax_id' }) // renamed
taxId: number;

   @Column({
    type: "enum",
    enum: TaxClassification,
  })
  taxClassification: TaxClassification;

  
  @Column({ type: "varchar", length: 20, nullable: true })
  hsnCode: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  sacCode: string;

  @Column({
    type: "enum",
    enum: TaxComponent,
  })
  taxComponent: TaxComponent;

  @Column({ type: "numeric", precision: 5, scale: 2 })
  taxPercentage: number;

    @Column({
    type: "enum",
    enum: SupplyType,
  })
  supplyType: SupplyType;

  @ManyToOne(() => Country , {nullable :false})
  @JoinColumn({ name: "country_id" })
  country: Country;

  @ManyToOne(() => State,{nullable:false})
  @JoinColumn({ name: "state_id" })
  state: State;

  @Column({
    type: "enum",
    enum: YesNo,
    default: YesNo.NO,
  })
  isSez: YesNo;

  @Column({
    type: "enum",
    enum: YesNo,
    default: YesNo.NO,
  })
  isExport: YesNo;

  @Column({
    type: "enum",
    enum: YesNo,
    default: YesNo.NO,
  })
  isRcm: YesNo;

  @Column({
    type: "enum",
    enum: YesNo,
    default: YesNo.YES,
  })
  isTaxable: YesNo;

  @Column({ type: "date" })
  effectiveFrom: Date;

  @Column({ type: "date", nullable: true })
  effectiveTo: Date |null;

  // ================= Rule Control =================
  @Column({ type: "int", default: 1 })
  priority: number;

  @Column({
    type: "enum",
    enum: YesNo,
    default: YesNo.YES,
  })
  isActive: YesNo;



    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: "is_deleted", default: false })
isDeleted: boolean;


}

export const TaxesRepository = (): Repository<Taxes> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Taxes);
};
