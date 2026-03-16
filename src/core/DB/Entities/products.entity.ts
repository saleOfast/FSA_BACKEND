import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IProducts } from "../../../core/types/ProductService/ProductService";
import { ProductCategory } from "./productCategory.entity";
import { Samples } from "./samples.entity";
import { Activities } from "./activities.entity";
import { Sessions } from "./sessions.entity";
import { FeedBack } from "./feedback.entity";
import { RCPA } from "./rcpa.entity";
import { Gifts } from "./giftDistribution.entity";
import { Taxes } from "./tax.entity";
import { Scheme } from "./scheme.entity";
import { Discount } from "./discount.entity";

@Entity()
export class Products extends BaseEntity implements IProducts {
    // Product ID - Auto (Primary key)
    @PrimaryGeneratedColumn({ name: 'product_id' })
    productId: number

    // Product Type - Pick List (FG / POSM)
    @Column({ name: 'product_type', type: 'enum', enum: ['FG', 'POSM'], nullable: true })
    productType?: 'FG' | 'POSM'

    // Product Name - Text
    @Column({ name: 'product_name' })
    productName: string

    // Product Code - Auto
    @Column({ name: 'product_code', nullable: true, unique: true })
    productCode?: string

    // Category - Pick List (references categories table)
    @Column({ name: 'category_id' })
    categoryId: number

    @ManyToOne(() => ProductCategory)
    @JoinColumn({ name: 'category_id' })
    category?: ProductCategory;

    // Sub Category - Pick List (optional, references subcategories table)
    @Column({ name: 'sub_category_id', nullable: true })
    subCategoryId?: number

    @ManyToOne(() => ProductCategory, { nullable: true })
    @JoinColumn({ name: 'sub_category_id' })
    subCategory?: ProductCategory;

    // Description - TEXT
    @Column({ type: 'text', nullable: true })
    description?: string

    // Status - Pick List (Active/Inactive)
    @Column({ name: 'status', type: 'enum', enum: ['Active', 'Inactive'], default: 'Active' })
    status: 'Active' | 'Inactive'

    // Launch Date - DATE
    @Column({ name: 'launch_date', type: 'date', nullable: true })
    launchDate?: Date

    // Discontinue Date - DATE
    @Column({ name: 'discontinue_date', type: 'date', nullable: true })
    discontinueDate?: Date

    // Vol. - Pick List (Default unit of measure e.g., 'Piece', 'Pack')
    @Column({ name: 'vol', nullable: true })
    vol?: string

    // Tax Category - Lookup (references Tax Table)
    // @Column({ name: 'tax_category_id', nullable: true })
    // taxCategoryId?: number

    // @ManyToOne(() => Taxes, { nullable: true })
    // @JoinColumn({ name: 'tax_category_id' })
    // taxCategory?: Taxes;

    // HSN Code - Lookup (references Tax Table)
    // @Column({ name: 'hsn_code', nullable: true })
    // hsnCode?: string

    // Image - VARCHAR(255)
    @Column({ name: 'image', type: 'varchar', length: 255, nullable: true })
    image?: string

    // Created Date - TIMESTAMP
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_date' })
    createdDate: Date;

    // Updated Date - TIMESTAMP
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_date' })
    updatedDate: Date;

    // Market Segment - Pick List (Urban, Rural, General Trade, Modern Trade)
    @Column({ name: 'market_segment', nullable: true })
    marketSegment?: string

    // Product Life Cycle Stage - Pick List (new, growth, mature, decline)
    @Column({ name: 'product_life_cycle_stage', nullable: true })
    productLifeCycleStage?: string


    @Column({ name: 'storage_condition', nullable: true })
    storageCondition?: string

   
    // @Column({ name: 'scheme_id', nullable: true })
    // schemeId?: number

    // @ManyToOne(() => Scheme, { nullable: true })
    // @JoinColumn({ name: 'scheme_id' })
    // scheme?: Scheme;

   
    // @Column({ name: 'discount_id', nullable: true })
    // discountId?: number

    // @ManyToOne(() => Discount, { nullable: true })
    // @JoinColumn({ name: 'discount_id' })
    // discount?: Discount;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean

   
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    // Relations for other entities
    @OneToMany(() => Sessions, (session) => session.store)
    sessions: Sessions[];

    // @OneToMany(() => FeedBack, (session) => session.store)
    // feedBack: FeedBack[];

    // @OneToMany(() => Samples, (samples) => samples.product)
    // samples: Samples[];

    // @OneToMany(() => Gifts, (gifts) => gifts.product)
    // gift: Gifts[];

    // @OneToMany(() => Activities, (activities) => activities.product)
    // activities: Activities[];

    // @OneToMany(() => RCPA, (rcpa) => rcpa.product)
    // rcpa: RCPA[];
}

export const ProductRepository = (): Repository<Products> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Products);
}