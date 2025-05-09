import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, DeleteDateColumn } from "typeorm";
import { DbConnections } from "../postgresdb";

@Entity({ name: 'status' })
export class Status extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'status_id' })
    status_id: number;

    @Column({ name: 'status_code', unique: true })
    status_code: string;

    @Column({ name: 'status_name' })
    status_name: string;

    @Column({ name: 'status', default: true })
    status: boolean;

    @CreateDateColumn({ type: 'timestamp', name: 'createdAt', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updatedAt', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deletedAt', nullable: true })
    deletedAt: Date | null;
}

export const StatusRepository = (): Repository<Status> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Status);
};