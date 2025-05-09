import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IScheme } from "../../../core/types/SchemeService/SchemeService";

@Entity()
export class Scheme extends BaseEntity implements IScheme {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'emp_id' })
    empId: number

    @Column({ name: 'name' })
    name: string

    @Column({ name: 'month' })
    month: number

    @Column({ name: 'year' })
    year: number

    @Column({ name: 'file' })
    file: string

    @Column({ name: 'is_enable', default: true })
    isEnable: boolean

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const getSchemeRepository = (): Repository<IScheme> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Scheme);
}