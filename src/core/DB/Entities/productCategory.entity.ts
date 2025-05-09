import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IProductCategory } from "../../../core/types/ProductService/ProductService";

@Entity()
export class ProductCategory extends BaseEntity implements IProductCategory {
    @PrimaryGeneratedColumn({ name: 'product_category_id' })
    productCategoryId: number

    @Column({ name: 'emp_id' })
    empId: number

    @Column({ name: 'name' })
    name: string

    @Column({ name: 'is_active', default: false })
    isActive: boolean

    @Column({ name: "is_deleted", default: false })
    isDeleted: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'parent_id', nullable: true })
    parentId?: number;

    @ManyToOne(() => ProductCategory, category => category.children)
    @JoinColumn({ name: 'parent_id' })
    parent?: ProductCategory;

    @OneToMany(() => ProductCategory, category => category.parent)
    children?: ProductCategory[];
}

export const ProductCategoryRepository = (): Repository<IProductCategory> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(ProductCategory);
}