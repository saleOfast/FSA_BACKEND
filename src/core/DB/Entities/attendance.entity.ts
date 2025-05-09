import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IAttendance } from "../../../core/types/AttendanceService/AttendanceService";
import { User } from "./User.entity";

@Entity()
export class Attendance extends BaseEntity implements IAttendance {
    @PrimaryGeneratedColumn({ name: 'attendance_id' })
    attendanceId: number

    @Column({ name: 'emp_id' })
    empId: number

    @ManyToOne(() => User, user => user.emp_id)
    @JoinColumn({ name: 'emp_id' })
    user?: User;

    @Column({ type: 'timestamp', name: 'check_in', nullable: false })
    checkIn: Date

    @Column({ type: 'timestamp', name: 'check_out', nullable: true })
    checkOut: Date

    @Column({ type: 'interval' })
    duration: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'now()', onUpdate: 'now()', name: 'udpated_at' })
    updatedAt: Date;
}

export const AttendanceRepository = (): Repository<IAttendance> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Attendance);
}