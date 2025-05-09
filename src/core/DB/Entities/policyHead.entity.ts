import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";

@Entity({ name: "policy_head" })
export class PolicyHead extends BaseEntity {
    @PrimaryGeneratedColumn()
    policy_id: number;

    @Column({ type: 'varchar', length: 200, nullable: false })
    policy_name: string;

    @Column({ type: 'boolean', nullable: true })
    is_travel: boolean;

    @Column({ type: 'varchar', length: 200, nullable: false })
    policy_code: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;

    
}

export const PolicyHeadRepository = (): Repository<PolicyHead> => {
    const connection = DbConnections.AppDbConnection.getConnection();
    return connection.getRepository(PolicyHead);
};
