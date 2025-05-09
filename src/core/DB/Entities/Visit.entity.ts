import { CallType, VisitStatus } from "../../types/Constent/common";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Repository, UpdateDateColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IVisit } from "../../../core/types/VisitService/VisitService";
import { User } from "./User.entity";
import { Stores } from "./stores.entity";

@Entity()
export class Visits extends BaseEntity implements IVisit {
    @PrimaryGeneratedColumn({ name: 'visit_id' })
    visitId: number;

    @Column({ name: 'emp_id' })
    empId: number;

    @ManyToOne(() => User, user => user.emp_id)
    @JoinColumn({ name: 'emp_id' })
    user?: User;

    @Column()
    beat: number;

    @Column({ name: 'store', type: 'json' })
    store: number[];

    @ManyToOne(() => Stores, (store) => store.visits, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'store_id' })
    stores?: Stores;

    @Column({ name: 'store_id' })
    storeId?: number;

    @Column({ name: 'visit_date' })
    visitDate: Date;

    @Column({ name: 'check_in', nullable: true })
    checkIn?: string;

    @Column({ name: 'check_in_lat', nullable: true })
    checkInLat?: string;

    @Column({ name: 'check_in_long', nullable: true })
    checkInLong?: string;

    @Column({ name: 'check_out', nullable: true })
    checkOut?: string;

    @Column({ nullable: true, name: 'check_out_lat' })
    checkOutLat?: string;

    @Column({ name: 'check_out_long', nullable: true })
    checkOutLong?: string;

    @Column({ type: 'interval', nullable: true })
    duration: string;

    @Column({ name: 'no_order_reason', nullable: true })
    noOrderReason: string;

    @Column({
        type: 'enum',
        enum: CallType,
        default: CallType.TELEVISIT,
        name: 'is_call_type'
    })
    isCallType?: CallType;

    @Column({
        type: 'enum',
        enum: VisitStatus,
        default: VisitStatus.PENDING
    })
    status: VisitStatus

    @Column({ name: 'image', nullable: true })
    image: string

    @Column({ type: 'json', name: 'activity', nullable: true, default: () => "'[]'" })
    activity: { action: string; time: Date, lat: string, long: string }[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const VisitRepository = (): Repository<IVisit> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Visits);
}