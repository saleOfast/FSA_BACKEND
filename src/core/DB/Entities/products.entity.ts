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
    productId: number

    @Column({ name: 'emp_id' })
    empId: number;

    @Column({ name: 'product_name' })
    productName: string

    @Column({ name: 'brand_id' })
    brandId: number

    @ManyToOne(() => Brand)
    @JoinColumn({ name: 'brand_id' })
    brand?: Brand;

    @Column({ name: 'category_id' })
    categoryId: number

    @ManyToOne(() => ProductCategory)
    @JoinColumn({ name: 'category_id' })
    category?: ProductCategory;

    @Column()
    mrp: number

    @Column({ nullable: true })
    rlp: number

    @Column({ name: 'case_qty' })
    caseQty: number

    @Column({ name: 'sku_discount', type: 'json', nullable: true })
    skuDiscount: ISkuDiscount

    @Column({ name: 'is_focused', default: false })
    isFocused: boolean

    @Column({ name: 'is_active', default: false })
    isActive: boolean

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @Column()
    image: string

    @Column({ name: 'colour', nullable: true })
    colour: string

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

export const ProductRepository = (): Repository<IProducts> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Products);
}