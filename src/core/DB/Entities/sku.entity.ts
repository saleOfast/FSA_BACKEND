import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { ISku } from "../../../core/types/SkuService/SkuService";
import { Products } from "./products.entity";
import { Taxes } from "./tax.entity";
import { Scheme } from "./scheme.entity";
import { Discount } from "./discount.entity";

export enum SkuStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DISCONTINUED = "discontinued"
}

@Entity({ name: "sku" })
export class Sku extends BaseEntity implements ISku {
    @PrimaryGeneratedColumn({ name: 'sku_id' })
    skuId: number;

    @Column({ name: 'sku_name' })
    skuName: string;

    @Column({ name: 'product_id', nullable: true })
    productId?: number;

    @ManyToOne(() => Products, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product?: Products;

    @Column({ name: 'pack_size', nullable: true })
    packSize?: string; // e.g., "100g", "500ml", "1L", "12x500ml"

    @Column({ name: 'vom', nullable: true })
    vom?: string; // Unit of Measure (e.g., Bottle, Pouch, Box)

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    mrp?: number; // Maximum Retail Price

    @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
    basePrice?: number; // Standard price before tax or discount

    @Column({ name: 'tax_id', nullable: true })
    taxId?: number;

    @ManyToOne(() => Taxes, { nullable: true })
    @JoinColumn({ name: 'tax_id' })
    tax?: Taxes;

    @Column({ nullable: true })
    barcode?: string; // EAN/UPC/GTIN for POS or warehouse scanning

    @Column({ name: 'case_size', nullable: true })
    caseSize?: string; // Number of units in one case/carton

    @Column({ name: 'shelf_life_days', nullable: true })
    shelfLifeDays?: string; // Fix date of Each SKU of Expiry

    @Column({ name: 'net_weight', nullable: true })
    netWeight?: string; // Net weight per pack (e.g., 0.10 for 100g)

    @Column({ name: 'gross_weight', nullable: true })
    grossWeight?: string; // Weight with packaging

    @Column({ type: 'text', nullable: true })
    dimension?: string; // e.g., "10x5x3 cm" for logistics purposes

    @Column({ type: 'enum', enum: SkuStatus, default: SkuStatus.ACTIVE })
    status: SkuStatus; // active, inactive, discontinued

    @Column({ name: 'launch_date', type: 'date', nullable: true })
    launchDate?: Date; // SKU introduction date

    @Column({ name: 'discontinue_date', type: 'date', nullable: true })
    discontinueDate?: Date; // If discontinued, when it ended

    @Column({ type: 'text', nullable: true })
    image?: string; // Image for mobile apps / POS systems

    @Column({ name: 'scheme_id', nullable: true })
    schemeId?: number;

    @ManyToOne(() => Scheme, { nullable: true })
    @JoinColumn({ name: 'scheme_id' })
    scheme?: Scheme;

    @Column({ name: 'discount_id', nullable: true })
    discountId?: number;

    @ManyToOne(() => Discount, { nullable: true })
    @JoinColumn({ name: 'discount_id' })
    discount?: Discount;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;

    @Column({ type: 'text', nullable: true })
    remarks?: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const SkuRepository = (): Repository<Sku> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Sku);
}

