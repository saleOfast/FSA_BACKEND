import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn, DeleteDateColumn, } from "typeorm";
import { DbConnections } from "../postgresdb";
import { User } from "./User.entity";

@Entity({ name: 'dar' })
export class Dar extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'dar_id' })
    dar_id: number;

    @Column({ name: 'activity_type', nullable: true })
    activity_type: string;

    @Column({ name: 'related_to', nullable: true })
    related_to: string;

    @Column({ name: 'remarks', nullable: true })
    remarks: string;

    @Column({ name: 'manager_id', nullable: true })
    manager_id: number;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'manager_id' })
    manager: User;

    @Column({ name: 'emp_id' })
    emp_id: number;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'emp_id' })
    user: User;

    @Column({ name: 'activity_related', nullable: true })
    activity_related: string;


    @Column({ name: 'date', nullable: true })
    date: Date;

    @Column({ name: 'subject', nullable: true })
    subject: string;

    @Column({ name: 'next_action_on', nullable: true })
    next_action_on: string;

    @Column({ name: 'status', nullable: true })
    status: string;

    @CreateDateColumn({ type: 'timestamp', name: 'createdat', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updatedat', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deletedat', nullable: true })
    deletedAt: Date | null;
    
}

export const DARRepository = (): Repository<Dar> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Dar);
};
