import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";
import { ISize } from "core/types/ReasonService/ReasonService";

@Entity()
export class Size extends BaseEntity implements ISize {
    @PrimaryGeneratedColumn({ name: 'size_id' })
    sizeId: number

    @Column({ name: 'emp_id' })
    empId: number

    @Column({ name: 'name', nullable: true })
    name: string

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const SizeRepository = (): Repository<ISize> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Size);
}