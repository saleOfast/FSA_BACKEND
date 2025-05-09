import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";
import { PolicyHead } from "./policyHead.entity";
import { ExpenseReportClaimType } from "../../../core/types/Constent/common";

@Entity({ name: "policy_type_head" })
export class PolicyTypeHead extends BaseEntity {
    @PrimaryGeneratedColumn()
    policy_type_id: number;

    @Column({ type: 'varchar', nullable: true })
    policy_type_name: string;

    @Column({ type: 'integer', nullable: true })
    policy_id: number;

    @ManyToOne(() => PolicyHead, policyHead => policyHead.policy_id)
    @JoinColumn({ name: "policy_id" })
    policy: PolicyHead;

    @Column({ type: 'date', nullable: true })
    from_date: Date;

    @Column({ type: 'date', nullable: true })
    to_date: Date;

    @Column({
        nullable: true,
        type: 'enum',
        enum: ExpenseReportClaimType,
    })
    claim_type: ExpenseReportClaimType

    @Column({ type: 'float', nullable: true })
    cost_per_km: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}

export const PolicyTypeHeadRepository = (): Repository<PolicyTypeHead> => {
    const connection = DbConnections.AppDbConnection.getConnection();
    return connection.getRepository(PolicyTypeHead);
};
