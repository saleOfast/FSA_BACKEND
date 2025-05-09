import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IReason } from "core/types/ReasonService/ReasonService";

@Entity()
export class Reason extends BaseEntity implements IReason {
    @PrimaryGeneratedColumn({ name: 'reason_id' })
    reasonId: number

    @Column({ name: 'emp_id' })
    empId: number

    @Column({ name: 'description', nullable: true })
    description: string

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const ReasonRepository = (): Repository<IReason> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Reason);
}