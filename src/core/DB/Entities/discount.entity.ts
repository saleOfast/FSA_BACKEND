import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { CustomerType } from "./customerType.entity";
import { Customer } from "./customer.entity";
import { Sku } from "./sku.entity";
import { Country } from "./country.entity";
import { State } from "./state.entity";
import { District } from "./district.entity";
import { Beat } from "./beat.entity";

export enum DiscountType {
    FLAT = "Flat",
    PERCENTAGE = "%age",
    SLAB = "Slab",
    // BILL_LEVEL = "Bill Level",
    // SKU_LEVEL = "SKU Level",
    // PRODUCT_LEVEL = "Product Level"
}

export enum DiscountCategory {
    TRADE_DISCOUNT = "Trade discount (Distributor / Retailer margin)",
    CASH_DISCOUNT = "Cash discount (early payment)",
    SPECIAL_CUSTOMER = "Special customer discount",
    VOLUME_BASED = "Volume-based discount (₹ or %)",
    TERRITORY_CHANNEL = "Territory / channel-specific discount",
    LOYALTY = "Loyalty",
    SEASONAL = "Seasonal",
    FESTIVAL = "Festival"
}

export enum DiscountStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}

export enum ApprovalStatus {
    APPROVED = "Approved",
    REJECTED = "Rejected"
}

export enum PktType {
    BOX = "Box",
    PIECES = "Pieces",
    BAGS = "Bags"
}

export enum scopeType {
    LINE="LINE",
    ORDER="ORDER"
}
export enum DiscountValueType {
    PERCENTAGE = "Percentage",
    AMOUNT = "Amount"
}

export interface IDiscount {
    discountId: number;
    discountName: string;
    discountType: DiscountType;
    discountCategory: DiscountCategory;
    customerTypeId?: number;
    customerId?: number;
    skuId: number|null;
    countryId?: number;
    stateId?: number;
    districtId?: number;
    beatId?: number;
    validFrom?: Date;
    validTill?: Date;
    status: DiscountStatus;
    approvalStatus: ApprovalStatus;
    pktType?: PktType;
    minQty?: number;
    maxQty?: number;
    minimumOrderValue?: number;
    discountValueType: DiscountValueType;
    discountValue?: number;
    discountPercentage?: number;
    createdAt: Date;
    updatedAt: Date;
}

@Entity({ name: "discounts" })
export class Discount extends BaseEntity implements IDiscount {
    @PrimaryGeneratedColumn({ name: 'discount_id' })
    discountId: number;

    @Column({ name: 'discount_name' })
    discountName: string;

    @Column({ name: 'discount_type', type: 'enum', enum: DiscountType })
    discountType: DiscountType;

    @Column({ name: 'discount_category', type: 'enum', enum: DiscountCategory })
    discountCategory: DiscountCategory;

    @Column({ name: 'customer_type_id', nullable: true })
    customerTypeId?: number;

    @ManyToOne(() => CustomerType, { nullable: true })
    @JoinColumn({ name: 'customer_type_id' })
    customerType?: CustomerType;

    @Column({ name: 'customer_id', nullable: true })
    customerId?: number;

    @ManyToOne(() => Customer, { nullable: true })
    @JoinColumn({ name: 'customer_id' })
    customer?: Customer;

    @Column({ name: 'sku_id', nullable: true })
    skuId: number| null;

    @ManyToOne(() => Sku, { nullable: true })
    @JoinColumn({ name: 'sku_id' })
    sku?: Sku;

    @Column({ name: 'country_id', nullable: true })
    countryId?: number;

    @ManyToOne(() => Country, { nullable: true })
    @JoinColumn({ name: 'country_id' })
    country?: Country;

    @Column({ name: 'state_id', nullable: true })
    stateId?: number;

    @ManyToOne(() => State, { nullable: true })
    @JoinColumn({ name: 'state_id' })
    state?: State;

    @Column({ name: 'district_id', nullable: true })
    districtId?: number;

    @ManyToOne(() => District, { nullable: true })
    @JoinColumn({ name: 'district_id' })
    district?: District;

    @Column({ name: 'beat_id', nullable: true })
    beatId?: number;

    @ManyToOne(() => Beat, { nullable: true })
    @JoinColumn({ name: 'beat_id' })
    beat?: Beat;

    @Column({ name: 'valid_from', type: 'date', nullable: true })
    validFrom?: Date;

    @Column({ name: 'valid_till', type: 'date', nullable: true })
    validTill?: Date;

    @Column({ type: 'enum', enum: DiscountStatus, default: DiscountStatus.ACTIVE })
    status: DiscountStatus;

    @Column({ name: 'approval_status', type: 'enum', enum: ApprovalStatus, default: ApprovalStatus.APPROVED })
    approvalStatus: ApprovalStatus;

    @Column({ name: 'pkt_type', type: 'enum', enum: PktType, nullable: true })
    pktType?: PktType;

    @Column({ name: 'min_qty', type: 'decimal', precision: 10, scale: 2, nullable: true })
    minQty?: number;

    @Column({ name: 'max_qty', type: 'decimal', precision: 10, scale: 2, nullable: true })
    maxQty?: number;

    @Column({ name: 'minimum_order_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
    minimumOrderValue?: number;

    @Column({ name: 'discount_value_type', type: 'enum', enum: DiscountValueType })
    discountValueType: DiscountValueType;

    @Column({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
    discountValue?: number;

    @Column({ name: 'discount_percentage', type: 'decimal', precision: 10, scale: 2, nullable: true })
    discountPercentage?: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
    @Column({ name: 'is_deleted', default: false })
    isDeleted!: boolean;

    @Column({ name:'priority', type: 'int', default: 0 })
    priority: number;

    @Column({ name:'isStackable', type: 'boolean', default: false })
    isStackable: boolean;

    @Column({name:'isStickable', type:'boolean', default:false})
    isStickable:boolean
@Column({
  name: 'scope_type',
  type: 'enum',
  enum:  scopeType ,
  default: scopeType.LINE, 
})
scopeType?: scopeType;

    @Column({ name: 'line_cap', type: 'decimal', precision: 10, scale: 2, nullable: true })
    lineCap?: number;

    @Column({ name: 'order_cap', type: 'decimal', precision: 10, scale: 2, nullable: true })
    orderCap?: number;

}

export const DiscountRepository = (): Repository<Discount> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Discount);
}