import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IBrand } from "../../../core/types/BrandService/BrandService";

@Entity()
export class Brand extends BaseEntity implements IBrand {
    @PrimaryGeneratedColumn({ name: 'brand_id' })
    brandId: number

    @Column({ name: 'emp_id' })
    empId: number
    
    @Column({ name: 'name' })
    name: string

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const BrandRepository = (): Repository<IBrand> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Brand);
}