import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IColour, IFeature } from "core/types/ReasonService/ReasonService";

@Entity()
export class Feature extends BaseEntity implements IFeature {
    @PrimaryGeneratedColumn({ name: 'feature_id' })
    featureId: number

    @Column({ name: 'emp_id' })
    empId: number

    @Column({ name: 'name', nullable: true })
    name: string

    @Column({ name: 'key', nullable: true })
    key: string

    @Column({ name: 'is_active', default: true })
    isActive: boolean

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const FeatureRepository = (): Repository<IFeature> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Feature);
}