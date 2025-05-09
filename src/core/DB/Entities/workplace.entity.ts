import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, OneToMany, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { PracticeTypeEnum, WorkplaceTypeEnum } from "../../types/Constent/common";
import { Stores } from "./stores.entity";
import { User } from "./User.entity";

@Entity({ name: 'workplace' })
export class Workplace extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'workplace_id' })
    workplaceId: number;

    @ManyToOne(() => Stores, (store) => store.workplace, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'store_id' }) 
    store?: Stores;

    @Column({ name: 'store_id', nullable: true }) 
    storeId?: number;

    @ManyToOne(() => User, (user) => user.workplace, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'added_by', referencedColumnName: 'emp_id' })
    user: User;

    @Column({ name: 'added_by' })
    addedBy: number;

    @Column({ nullable: true, name: 'workplace_type', enum: WorkplaceTypeEnum, default: WorkplaceTypeEnum.OTHERS })
    workplaceType: WorkplaceTypeEnum;

    @Column({ nullable: true, name: 'practice_type', enum: PracticeTypeEnum, })
    practiceType: PracticeTypeEnum;

    @Column({ name: 'orgName', nullable: true })
    orgName: string;

    @Column({ name: 'town_city' })
    townCity: string;

    @Column({ name: 'territory', nullable: true })
    territory?: string;

    @Column({ name: 'patient_volume', nullable: true })
    patientVolume: number;

    @Column({ name: 'availability', nullable: true })
    availability: number;

    @Column({ name: 'status', default: true })
    status: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}

export const WorkplaceRepository = (): Repository<Workplace> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Workplace);
};
