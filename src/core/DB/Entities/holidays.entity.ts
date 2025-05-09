import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, OneToMany, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { HolidayType } from "../../../core/types/Constent/common";
import { User } from "./User.entity";

@Entity({ name: 'holidays' })
export class Holiday extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'holidayid' })
    holidayId: number;

    @Column({ name: 'name', nullable: true })
    name: string;

    @Column({ name: 'holiday_type', type: 'enum', enum: HolidayType, default: HolidayType.GAZETTED })
    holidayType: HolidayType

    @Column({ name: 'date', nullable: true })
    date: Date;

    @Column({ name: 'day', nullable: true })
    day: string;

    @ManyToOne(() => User, (user) => user.holiday, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'added_by', referencedColumnName: 'emp_id' })
    user: User;

    @Column({ name: 'added_by', nullable: true })
    addedBy: number;

    @Column({ name: 'remarks', nullable: true })
    remarks: string;

    @Column({ name: 'status', default: true })
    status: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}

export const HolidayRepository = (): Repository<Holiday> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Holiday);
};
