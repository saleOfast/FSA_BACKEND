import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";
import { ITarget, IUserTarget } from "core/types/TargetService/TargetService";

@Entity()
export class Target extends BaseEntity implements ITarget {
    @PrimaryGeneratedColumn({ name: 'target_id' })
    targetId: number

    @Column({ name: 'emp_id' })
    empId: number

    @Column({ type: 'json', nullable: true })
    target: IUserTarget[]

    @Column({ name: 'manager_id', nullable: true })
    managerId: number

    @Column({ name: 'store_target', nullable: true })
    storeTarget: number

    @Column({ name: 'amount_target', nullable: true })
    amountTarget: number

    @Column({ name: 'collection_target', nullable: true })
    collectionTarget: number

    @Column({type: 'timestamp', name: 'month' })
    month: Date

    @Column({type: 'timestamp', name: 'year' })
    year: Date

    @Column({ name: 'is_active', default: true })
    isActive: boolean

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    forEach(callback: (target: ITarget) => void): void {
        // Assuming `this` is an array or iterable collection of targets
        const targets: ITarget[] = [this]; // Placeholder, modify based on actual implementation
        targets.forEach(callback);
    }
}

export const TargetRepository = (): Repository<ITarget> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Target);
}