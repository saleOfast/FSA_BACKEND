import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IHeadLeave } from "../../types/LeaveService/LeaveService";
import { LeaveHeadCount } from "./LeaveCount.entity";

@Entity()
export class LeaveHead extends BaseEntity implements IHeadLeave {
    @PrimaryGeneratedColumn({ name: 'head_leave_id' })
    head_leave_id: number

    @OneToMany(() => LeaveHeadCount, (leaveHeadCount) => leaveHeadCount.headLeave, { nullable: true })
    leave_head_count: LeaveHeadCount[];


    @Column({ name: 'head_leave_code', nullable: true })
    head_leave_code: string

    @Column({ name: 'head_leave_short_name', nullable: true })
    head_leave_short_name: string

    @Column({ name: 'head_leave_name', nullable: true })
    head_leave_name: string

    @Column({ name: 'status', default: true })
    status: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'now()', name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()', name: 'udpated_at' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}

export const HeadLeaveRepository = (): Repository<IHeadLeave> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(LeaveHead);
}