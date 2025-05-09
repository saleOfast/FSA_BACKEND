import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { DbConnections } from "../postgresdb";

@Entity()
export class Edetailing extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'e_detailing_id' })
    e_detailing_id: number;

    @Column({ name: 'course_name', nullable: true })
    course_name: string;

    @Column({ name: 'learning_category', nullable: true })
    learning_category: string;

    @Column({ name: 'course_material', nullable: true })
    course_material: string;

    @Column({ name: 'product_category', nullable: true })
    product_category: string;

    @Column({ name: 'doctor_specialisation', nullable: true })
    doctor_specialisation: string;

    @Column({ name: 'expire_date', nullable: true })
    expire_date: Date;

    @Column({ name: 'status', default: true })
    status: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'now()', name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
    deleted_at: Date | null;
}

export const EdetailingRepository = (): Repository<any> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Edetailing);
}