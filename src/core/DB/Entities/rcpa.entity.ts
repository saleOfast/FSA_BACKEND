import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, OneToMany, DeleteDateColumn, ManyToOne, JoinColumn, Check } from "typeorm";
import { DbConnections } from "../postgresdb";
import { StockLevelComparison } from "../../../core/types/Constent/common";
import { Stores } from "./stores.entity";
import { Products } from "./products.entity";
import { User } from "./User.entity";
import { CompetitorBrand } from "./brand.competitor.entity";

@Entity({ name: 'rcpa' })
@Check(`"rating" BETWEEN 1 AND 5`)
export class RCPA extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'rcpa_id' })
    rcpaId: number;

    @ManyToOne(() => Stores, (store) => store.rcpa, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'store_id' })
    store?: Stores;

    @Column({ name: 'store_id', nullable: true }) // Store ID column
    storeId?: number;

    @ManyToOne(() => User, (user) => user.rcpa, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'added_by', referencedColumnName: 'emp_id' })
    user: User;

    @Column({ name: 'added_by', nullable: true })
    addedBy: number;

    @ManyToOne(() => Products, (product) => product.rcpa, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'product_id' })
    product?: Products;

    @Column({ name: 'product_id' })
    productId: number;

    @Column({ name: 'quantity_sold', nullable: true })
    quantitySold: number;

    @Column({ name: 'stock_level', nullable: true })
    stockLevel: number;

    @Column({ name: 'stock_level_competitor', nullable: true })
    stockLevelCompetitor: number;

    @ManyToOne(() => CompetitorBrand, (brand) => brand.rcpa, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'competitor_brand_id', referencedColumnName: 'CompetitorBrandId' })
    competitorBrand: CompetitorBrand;

    @Column({ name: 'competitor_brand_id', nullable: true })
    competitorBrandId: number;

    @Column({ type: 'enum', enum: StockLevelComparison, })
    priceComparison: StockLevelComparison;

    @Column({ name: 'promotional_offers', nullable: true })  // By Competitor
    PromotionalOffers: string;

    @Column({ name: 'delivery_issues', nullable: true })
    deliveryIssues: boolean;

    @Column({ name: 'services_provided', nullable: true })  // By Competitor
    ServicesProvided: string;

    @Column({ name: 'rating', type: 'int' })
    rating: number;

    @Column({ name: 'remarks', nullable: true })
    remarks: string;

    @Column({ name: 'date', nullable: true })
    date: Date;

    @Column({ name: 'status', default: true })
    status: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}

export const RCPARepository = (): Repository<RCPA> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(RCPA);
};
