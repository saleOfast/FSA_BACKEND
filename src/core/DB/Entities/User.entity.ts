import { ExpenseReportClaimType, UserRole } from "../../types/Constent/common";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IUser } from "../../../core/types/AuthService/AuthService";
import { UserTypes } from "./userType.entity";
import { Activities } from "./activities.entity";
import { Sessions } from "./sessions.entity";
import { FeedBack } from "./feedback.entity";
import { Samples } from "./samples.entity";
import { JointWork } from "./activities.jointWork.entity";
import { Workplace } from "./workplace.entity";
import { Holiday } from "./holidays.entity";
import { RCPA } from "./rcpa.entity";
import { Taxes } from "./tax.entity";
import { Gifts } from "./giftDistribution.entity";
import { NewTarget } from "./new.target.entity";

@Entity({ name: "users" })
export class User extends BaseEntity implements IUser {
    @PrimaryGeneratedColumn()
    emp_id: number

    @Column({ name: 'user_type_id', nullable: true })
    userTypeId: string

    @ManyToOne(() => UserTypes, { nullable: true })
    @JoinColumn({ name: 'user_type_id' })
    userType?: UserTypes;

    @Column()
    firstname: string

    @Column({ nullable: true })
    lastname: string

    @Column({ nullable: true })
    orgName: string

    // @Column({
    //     nullable: true,
    //     name: 'practice_type',
    //     enum: PracticeTypeEnum,
    // })
    // practice_type: PracticeTypeEnum

    @Column({ nullable: true })
    age: number

    @Column({ nullable: true })
    address: string

    @Column({ nullable: true })
    city: string

    @Column({ nullable: true })
    state: string

    @Column({ nullable: true })
    pincode: string

    @Column()
    phone: string

    @Column({ nullable: true })
    email: string

    @Column({ nullable: true })
    zone: string

    @Column()
    joining_date: Date

    @Column({ nullable: true })
    dob: Date

    @Column()
    password: string

    @Column({ nullable: true })
    image: string;

    @Column({ name: 'manager_id' })
    managerId: number

    @Column({ name: 'availability', nullable: true })
    availability: number

    @Column({ name: 'patient_volume', nullable: true })
    patientVolume: number

    @Column({ name: 'value_target', nullable: true })
    valueTarget: number

    @Column({ name: 'store_target', nullable: true })
    storeTarget: number

    @Column({ name: 'learning_role', nullable: true })
    learningRole?: string

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.SSM, // Set default role to USER  
    })
    role: UserRole

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;

    @OneToMany(() => Activities, (activity) => activity.user)
    activities: Activities[];

    @OneToMany(() => Taxes, (tax) => tax.user)
    taxes: Taxes[];

    @OneToMany(() => Workplace, (workplace) => workplace.user)
    workplace: Workplace[];

    @OneToMany(() => Sessions, (sessions) => sessions.user)
    sessions: Sessions[];

    @OneToMany(() => FeedBack, (feedback) => feedback.user)
    feedback: FeedBack[];

    @OneToMany(() => Samples, (samples) => samples.user)
    samples: Samples[];

    @OneToMany(() => Gifts, (samples) => samples.user)
    gift: Gifts[];

    @OneToMany(() => Holiday, (holiday) => holiday.user)
    holiday: Holiday[];

    @OneToMany(() => JointWork, (jointWork) => jointWork.user)
    jointWorks?: JointWork;

    @OneToMany(() => RCPA, (rcpa) => rcpa.user)
    rcpa: RCPA[];

    @OneToMany(() => NewTarget, (target) => target.user)
    target: NewTarget[];
}

export const UserRepository = (): Repository<any> => {
    const connection = DbConnections.AppDbConnection.getConnection();
    return connection.getRepository(User);
}
