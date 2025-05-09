import { 
    Entity, PrimaryGeneratedColumn, Column, BaseEntity, 
    CreateDateColumn, UpdateDateColumn, Repository, 
    ManyToOne, JoinColumn, DeleteDateColumn 
} from "typeorm";
import { DbConnections } from "../postgresdb";
import { ILeaveHeadCount } from "../../types/LeaveService/LeaveCountService";
import { LeaveHead } from "./Leave.entity";
// import { HeadLeave } from "./HeadLeave"; // Assuming there's a HeadLeave entity

@Entity({ name: 'leave_head_count' })  // Explicit table name
export class LeaveHeadCount extends BaseEntity implements ILeaveHeadCount {
    @PrimaryGeneratedColumn({ name: 'head_leave_cnt_id' })
    headLeaveCntId: number;
    
    @Column({ name: 'head_leave_id'})
    headLeaveId: number; 

    @ManyToOne(() => LeaveHead, { nullable: false })  // Assuming relation with HeadLeave
    @JoinColumn({ name: 'head_leave_id' })
    headLeave: LeaveHead;

    @Column({ name: 'status', default: true })
    status: boolean;

    @Column({ name: 'financial_start', type: 'date' })
    financialStart: Date;

    @Column({ name: 'financial_end', type: 'date' })
    financialEnd: Date;

    @Column({ name: 'total_head_leave', type: 'int' })
    totalHeadLeave: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
    deletedAt: Date;
}

export const HeadLeaveCountRepository = (): Repository<ILeaveHeadCount> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(LeaveHeadCount);
};
