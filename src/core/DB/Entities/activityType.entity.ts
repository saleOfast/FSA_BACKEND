import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, DeleteDateColumn } from "typeorm";
import { DbConnections } from "../postgresdb";

@Entity({ name: 'activity_type' })
export class ActivityType extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'activity_type_id' })
    activity_type_id: number;

    @Column({ name: 'activity_type_code', unique: true })
    activity_type_code: string;

    @Column({ name: 'activity_type_name' })
    activity_type_name: string;

    @Column({ name: 'status', default: true })
    status: boolean;

    @CreateDateColumn({ type: 'timestamp', name: 'createdAt', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updatedAt', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deletedAt', nullable: true })
    deletedAt: Date | null;
}

export const ActivityTypeRepository = (): Repository<ActivityType> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(ActivityType);
};
