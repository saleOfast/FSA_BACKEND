import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";
import { User } from "./User.entity"; // Make sure to import the User entity
import { LeaveHeadCount } from "./LeaveCount.entity"; // Make sure to import the HeadLeaveCount entity
import { LeaveHead } from "./Leave.entity";

@Entity()
export class LeaveApplication extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'leave_app_id' })
    leave_app_id: number;

    @Column({ name: 'manager_id', nullable: true})
    manager_id?: any; 

    @Column({ name: 'emp_id'})
    emp_id: number; 

    @ManyToOne(() => User,  { nullable: true })
    @JoinColumn({ name: 'manager_id' })
    manager: User;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'emp_id' })
    user: User;

    @Column({ name: 'head_leave_id'})
    head_leave_id: number; 

    @ManyToOne(() => LeaveHead,  { nullable: true })
    @JoinColumn({ name: 'head_leave_id' })
    LeaveHead: LeaveHead;

    @Column({ name: 'head_leave_cnt_id'})
    head_leave_cnt_id: number; 

    @ManyToOne(() => LeaveHeadCount,  { nullable: true })
    @JoinColumn({ name: 'head_leave_cnt_id' })
    LeaveHeadCount: LeaveHeadCount;
    
    @Column({ name: 'leave_type', type: 'varchar', length: 255, nullable: true })
    leave_type: string;

    @Column({ name: 'reason', type: 'varchar', length: 255, nullable: true })
    reason: string;

    @Column({ name: 'no_of_days', type: 'int', nullable: true })
    no_of_days: number;

    @Column({ name: 'from_date', type: 'date', nullable: true })
    from_date: Date;

    @Column({ name: 'to_date', type: 'date', nullable: true })
    to_date: Date;

    @Column({ name: 'leave_app_status', type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending', nullable: true })
    leave_app_status: 'pending' | 'approved' | 'rejected';

    @Column({ name: 'remarks', type: 'text', nullable: true })
    remarks: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'now()', name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()', name: 'updated_at' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}

export const LeaveApplicationRepository = (): Repository<LeaveApplication> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(LeaveApplication);
};
