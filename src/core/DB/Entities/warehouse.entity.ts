import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { User } from "./User.entity";
import {WarehouseStatusEnum,OwnershipTypeEnum,BusinessRoleEnum ,franchise,SEZ,customerZone} from "../../../core/types/Constent/common"
import{Country} from"./country.entity"
import {State} from"./state.entity"
import {District} from"./district.entity"
import { Taxes } from "./tax.entity";
import { CustomerType } from "./customerType.entity";





@Entity({ name: 'warehouses' })
export class Warehouse extends BaseEntity {
	 @PrimaryGeneratedColumn("uuid", { name: "warehouse_id" })
  warehouseId: string;

  @Column({ name: "warehouse_code", length: 30, unique: true, nullable: false })
  warehouseCode: string;

  @Column({ name: "warehouse_name", length: 100 ,nullable: false})
  warehouseName: string;

@Column({
  type: "enum",
  enum: WarehouseStatusEnum,
  enumName: "warehouse_status_enum",
  default: WarehouseStatusEnum.DRAFT,
})
status: WarehouseStatusEnum;


  @Column({ name: "active_flag", default: true })
  activeFlag: boolean;

  @Column({ type: "date", name: "effective_from" ,nullable: false })
  effectiveFrom: Date;

  @Column({ type: "date", name: "effective_to", nullable: true })
  effectiveTo?: Date;

  @Column({ type: "enum", enum: OwnershipTypeEnum, name: "ownership_type", nullable: false })
  ownershipType: OwnershipTypeEnum;

  @Column({ type: "enum", enum: BusinessRoleEnum, name: "business_role", nullable: false })
  businessRole: BusinessRoleEnum;


  // @ManyToOne(()=>Taxes)
  // @JoinColumn({ name: "tax_id" })
  // tax: Taxes;

  @Column({ name: "legal_entity_id" })
  legalEntityId!:number;


  // @ManyToOne(()=> CustomerType)
  // @JoinColumn({ name: "customer_type_id" })
  // customerType: CustomerType;
  @Column({ name: "parent_partner_id"})
  parentPartnerId!:number;

  @Column({name:"franchise",type:"enum",enum:franchise})
  franchise: franchise;

  @ManyToOne(()=> Country)
  @JoinColumn({ name: "shipping_country_id" })
  shippingCountry: Country;

  @ManyToOne(()=> State)
  @JoinColumn({ name: "shipping_state_id" })
  shippingState: State;


  @ManyToOne(()=> District)
  @JoinColumn({ name: "shipping_district_id" })
  shippingDistrict: District;

  @Column({ name: "shipping_street", type: "text" , nullable: false })
  shippingStreet: string;

  @Column({ name: "shipping_city", length: 100, nullable: false })
  shippingCity: string;

  @Column({ name: "shipping_pin_code", length: 20, nullable: false })
  shippingPinCode: string;

  @Column({ name: "gst_no", length: 20, nullable: true })
  gstNo?: string;

  @Column({ name: "vat_registration_no", length: 50, nullable: true })
  vatRegistrationNo?: string;

  @Column({ name: "tax_registration_type", length: 50, nullable: true })
  taxRegistrationType?: string;

  @Column({ name:"sez",type:"enum",enum:SEZ})
  sez: SEZ;

  @Column({ name: "custom_zone", type:"enum", enum:customerZone })
  customZone: customerZone;

  @Column({ name: "allows_sales", nullable: false })
  allowsSales: boolean;

  @Column({ name: "allows_purchase",  nullable: false })
  allowsPurchase: boolean;


  @Column({ name: "allows_returns", nullable: false })
  allowsReturns: boolean;

  @Column({ name: "supports_batch", default: false })
  supportsBatch: boolean;

  @Column({ name: "supports_expiry", default: false })
  supportsExpiry: boolean;

  @Column({ name: "supports_serial", default: false })
  supportsSerial: boolean;

  @Column({ name: "temperature_controlled", default: false })
  temperatureControlled: boolean;

  @Column({ name: "cross_docking_flag", default: false })
  crossDockingFlag: boolean;

  @Column({ name: "consignment_flag", default: false })
  consignmentFlag: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
  
@Column({ name: "is_deleted", default: false })
isDeleted: boolean;

}

export const WarehouseRepository = (): Repository<Warehouse> => {
	return DbConnections.AppDbConnection.getConnection().getRepository(Warehouse);
}