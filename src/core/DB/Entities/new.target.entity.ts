import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { ITarget, IUserTarget } from "core/types/TargetService/TargetService";
import { User } from "./User.entity";

@Entity()
export class NewTarget extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'target_id' })
    targetId: number;

    @Column({ name: 'emp_id' })
    empId: number;

    @ManyToOne(() => User, (user) => user.target, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'emp_id', referencedColumnName: 'emp_id' })
    user: User;

    @Column({ name: 'store_target', nullable: true })
    storeTarget: number

    @Column({ name: 'amount_target', nullable: true })
    amountTarget: number

    @Column({ name: 'collection_target', nullable: true })
    collectionTarget: number

    @Column({ type: 'timestamp', name: 'month' })
    month: Date

    @Column({ type: 'timestamp', name: 'year' })
    year: Date

    @Column({ type: 'timestamp', name: 'date' })
    date: Date

    @Column({ name: 'is_active', default: true })
    isActive: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}

export const TargetRepository = (): Repository<NewTarget> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(NewTarget);
}