import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, DeleteDateColumn } from "typeorm";
import { DbConnections } from "../postgresdb";

@Entity({ name: 'activity_rel_to' })
export class ActivityRelTo extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'activity_rel_to_id' })
    activity_rel_to_id: number;

    @Column({ name: 'activity_rel_to_code', unique: true })
    activity_rel_to_code: string;

    @Column({ name: 'activity_rel_to_name' })
    activity_rel_to_name: string;

    @Column({ name: 'status', default: true })
    status: boolean;

    @CreateDateColumn({ type: 'timestamp', name: 'createdAt', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updatedAt', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deletedAt', nullable: true })
    deletedAt: Date | null;
}

export const ActivityRelToRepository = (): Repository<ActivityRelTo> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(ActivityRelTo);
};
