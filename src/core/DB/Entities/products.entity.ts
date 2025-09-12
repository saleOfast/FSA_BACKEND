import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IProducts, ISkuDiscount } from "../../../core/types/ProductService/ProductService";
import { Brand } from "./brand.entity";
import { ProductCategory } from "./productCategory.entity";
import { Samples } from "./samples.entity";
import { Activities } from "./activities.entity";
import { Sessions } from "./sessions.entity";
import { FeedBack } from "./feedback.entity";
import { RCPA } from "./rcpa.entity";
import { Gifts } from "./giftDistribution.entity";

@Entity()
export class Products extends BaseEntity implements IProducts {
    @PrimaryGeneratedColumn({ name: 'product_id' })
    productId: number;
    
    @Column({ name: 'sku', unique: true, nullable: true })
    sku: string;

    @Column({ name: 'emp_id' })
    empId: number;

    @Column({ name: 'product_name' })
    productName: string;

    @Column({ name: 'brand_id' })
    brandId: number;

    @ManyToOne(() => Brand, { eager: true })
    @JoinColumn({ name: 'brand_id' })
    brand?: Brand;

    @Column({ name: 'category_id' })
    categoryId: number;

    @ManyToOne(() => ProductCategory)
    @JoinColumn({ name: 'category_id' })
    category?: ProductCategory;

    @Column()
    mrp: number;

    @Column({ nullable: true })
    rlp: number;

    @Column({ name: 'case_qty' })
    caseQty: number;

    @Column({ name: 'sku_discount', type: 'json', nullable: true })
    skuDiscount: ISkuDiscount;

    @Column({ name: 'batch_number', nullable: true })
    batchNumber?: string;

    @Column({ name: 'manufacturing_date', nullable: true })
    manufacturingDate?: string;

    @Column({ name: 'expiry_date', nullable: true })
    expiryDate?: string;

    @Column({ nullable: true })
    subcategory?: string;

    @Column({ name: 'shelf_life', nullable: true })
    shelf_life?: number;

    @Column({ name: 'product_state', nullable: true })
    product_state?: string;

    @Column({ name: 'unit_of_measure', nullable: true })
    unitOfMeasure?: string;

    @Column({ name: 'total_quantity', nullable: true })
    total_quantity?: number;

    @Column({ name: 'max_stock_level', nullable: true })
    maxStockLevel?: number;

    @Column({ nullable: true })
    currency?: string;

    @Column({ name: 'purchase_price', nullable: true })
    purchase_price?: number;

    @Column({ name: 'selling_price', nullable: true })
    selling_price?: number;

    @Column({ name: 'storage_location', nullable: true })
    storage_location?: string;

    @Column({ name: 'stock_in_date', nullable: true })
    stock_in_date?: string;

    @Column({ name: 'stock_out_date', nullable: true })
    stock_out_date?: string;

   
    @Column({ name: "damaged_quantity", default: 0 })
  damagedQuantity: number;

   @Column({ type: 'text', nullable: true })
   image?: string;

    
    @Column({name:'colour', nullable: true})
    colour?: string;

    @Column({ name: "reorder_level", nullable: true })
    reorderLevel?: number;

   
  @Column({ name: "total_sold", default: 0 })
  totalSold: number;

  
  @Column({ name: "quantity_in_stock", default: 0 })
  quantityInStock: number;

  @Column({ name: "storage_condition", nullable: true })
  storageCondition?: string;
    @Column({ name: 'is_focused', default: false })
    isFocused: boolean;

    @Column({ name: 'is_active', default: false })
    isActive: boolean;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Sessions, (session) => session.store)
    sessions: Sessions[];

    @OneToMany(() => FeedBack, (session) => session.store)
    feedBack: FeedBack[];

    @OneToMany(() => Samples, (samples) => samples.product)
    samples: Samples[];

    @OneToMany(() => Gifts, (gifts) => gifts.product)
    gift: Gifts[];

    @OneToMany(() => Activities, (activities) => activities.product)
    activities: Activities[];

    @OneToMany(() => RCPA, (rcpa) => rcpa.product)
    rcpa: RCPA[];
}

export const ProductRepository = (): Repository<Products> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Products);
};
