import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";
import { User } from "./User.entity";
import { HeadLeaveCountRepository, LeaveHeadCount } from "./LeaveCount.entity";
import { LeaveHead } from "./Leave.entity";

@Entity()
export class UserLeave extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'user_leave_id' })
    user_leave_id: number;

    @Column({ name: 'user_id'})
    user_id: number; 

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'head_leave_id'})
    head_leave_id: number; 

    @ManyToOne(() => LeaveHead, { nullable: true })
    @JoinColumn({ name: 'head_leave_id' })
    LeaveHead: LeaveHead;
    
    @Column({ name: 'head_leave_cnt_id'})
    head_leave_cnt_id: number; 

    @ManyToOne(() => LeaveHeadCount, { nullable: true })
    @JoinColumn({ name: 'head_leave_cnt_id' })
    LeaveHeadCount: LeaveHeadCount;

    @Column({ name: 'left_leave', type: 'int', nullable: true })
    left_leave: number;

    @Column({ name: 'extra_leaves', type: 'int', nullable: true })
    extra_leaves: number;

    @Column({ name: 'remarks', type: 'text', nullable: true })
    remarks: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'now()', name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()', name: 'updated_at' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}

export const UserLeaveRepository = (): Repository<UserLeave> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(UserLeave);
};
