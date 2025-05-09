import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn, DeleteDateColumn } from "typeorm";
import { DbConnections } from "../postgresdb";

@Entity({ name: 'user_types' })
export class UserTypes extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'user_type_id' })
    userTypeId: number

    @Column({ name: 'user_type_name' })
    userTypeName: string

    @Column({ name: 'user_type_code' })
    userTypeCode: string

    @Column({ name: 'status', default: true })
    status: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}

export const UserTypesRepository = (): Repository<UserTypes> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(UserTypes);
}