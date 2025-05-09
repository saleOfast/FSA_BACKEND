import { IExpenseManagement } from "../../types/ExpenseManagement/ExpenseManagement";
import { ExpenseReportClaimType, ExpenseReportStatus } from "../../types/Constent/common";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Repository, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { User } from "./User.entity";
import { PolicyHead } from "./policyHead.entity";
import { PolicyTypeHead } from "./policyHeadType.entity";

@Entity({ name: "expense_reports" })
export class ExpenseManagement extends BaseEntity implements IExpenseManagement {
    @PrimaryGeneratedColumn()
    expence_id: number;

    @Column({
        nullable: true,
        type: 'enum',
        enum: ExpenseReportClaimType,
    })
    claim_type: ExpenseReportClaimType

    @Column({ type: 'date', nullable: true, default: null })
    from_date: Date;

    @Column({ type: 'date', nullable: true, default: null })
    to_date: Date;

    @Column({ type: 'integer', nullable: true })
    policy_id: number;

    @ManyToOne(() => PolicyHead)
    @JoinColumn({ name: "policy_id" })
    policy: PolicyHead;

    @Column({ type: 'integer', nullable: true })
    policy_type_id: number;

    @ManyToOne(() => PolicyTypeHead)
    @JoinColumn({ name: "policy_type_id" })
    policyType: PolicyTypeHead;

    @Column({ type: 'integer', nullable: true })
    manager_id: number;

    @ManyToOne(() => User, user => user, { nullable: true })
    @JoinColumn({ name: "manager_id" }) // Specifies the foreign key column in the ExpenseManagement table
    manager: User;

    @Column({ type: 'integer', nullable: true })
    emp_id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "emp_id" })
    user: User;

    @Column({ type: 'varchar', nullable: true })
    from_location: string;

    @Column({ type: 'varchar', nullable: true })
    to_location: string;

    @Column({ type: 'float', nullable: true })
    kms: number;

    @Column({ type: 'float', nullable: true })
    total_expence: number;

    @Column({ type: 'text', nullable: true })
    detail: string;

    @Column({ type: 'varchar', nullable: true })
    remark: string;

    @Column({
        // nullable: true,
        type: 'enum',
        default: ExpenseReportStatus.PENDING,
        enum: ExpenseReportStatus,
    })
    report_status: ExpenseReportStatus

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}

export const ExpenseManagementRepository = (): Repository<ExpenseManagement> => {
    const connection = DbConnections.AppDbConnection.getConnection();
    return connection.getRepository(ExpenseManagement);
};
