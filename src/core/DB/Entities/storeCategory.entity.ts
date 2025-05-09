import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IStoreCategory } from "../../../core/types/StoreService/StoreService";

@Entity()
export class StoreCategory extends BaseEntity implements IStoreCategory {
    @PrimaryGeneratedColumn({ name: 'store_category_id' })
    storeCategoryId: number

    @Column({ name: 'category_name' })
    categoryName: string

    @Column({ name: 'emp_id' })
    empId: number

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const StoreCategoryRepository = (): Repository<IStoreCategory> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(StoreCategory);
}