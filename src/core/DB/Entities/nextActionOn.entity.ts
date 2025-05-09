import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, DeleteDateColumn } from "typeorm";
import { DbConnections } from "../postgresdb";

@Entity({ name: 'next_action_on' })
export class NextActionOn extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'next_action_on_id' })
    next_action_on_id: number;

    @Column({ name: 'next_action_on_code', unique: true })
    next_action_on_code: string;

    @Column({ name: 'next_action_on_name' })
    next_action_on_name: string;

    @Column({ name: 'status', default: true })
    status: boolean;

    @CreateDateColumn({ type: 'timestamp', name: 'createdAt', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updatedAt', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deletedAt', nullable: true })
    deletedAt: Date | null;
}

export const NextActionOnRepository = (): Repository<NextActionOn> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(NextActionOn);
};
