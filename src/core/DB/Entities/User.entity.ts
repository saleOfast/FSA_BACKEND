import { ExpenseReportClaimType, UserRole } from "../../types/Constent/common";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, BeforeUpdate, BeforeInsert, } from "typeorm";
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
import { Profile } from "./profile.entity";
import { Role } from "./role.entity";



@Entity({ name: "users" })
export class User extends BaseEntity implements IUser {
@PrimaryGeneratedColumn()
emp_id: number

@Column({ type: "varchar", length: 100 })
firstname: string;

@Column({ type: "varchar", length: 100, nullable: true })
middlename: string;

@Column({ type: "varchar", length: 100 })
lastname: string;


@Column({ type: "varchar", length: 255, nullable: true })
name: string;

@BeforeInsert()
@BeforeUpdate()
generateFullName() {
  this.name = [
    this.firstname,
    this.middlename,
    this.lastname,
  ]
    .filter((part) => part?.trim())
    .join(" ");
}


@Column({ type: "varchar", length: 100, unique: true,nullable: true })
username: string;

@Column ({name:'nickname' , type: "varchar", length: 100, nullable: true})
nickname: string;

@Column({ nullable: true })
email: string

@Column({ type: "varchar", length: 255 })
password: string;

@Column({ default: true })
active: boolean;

@Column({ type: "varchar", length: 100, nullable: true })
country: string;
@Column({ type: "varchar", length: 100, nullable: true })
state: string;
@Column({ nullable: true })
city: string

@Column({ type: "varchar", length: 100, nullable: true })
region: string;
@Column({ nullable: true })
pincode: string

@Column({ type: "text", nullable: true })
street: string;

@Column({ type: "varchar", length: 20, nullable: true })
phone: string;

@Column({ type:"varchar", length: 20, nullable: true })
mobile: string;

@Column({ type: "varchar", length: 100, nullable: true })
department: string;

@Column({ type: "varchar", length: 100, nullable: true })
division: string;

@Column({ type: "varchar", length: 100, nullable: true })
team: string;

@Column({ type: "varchar", length: 100, nullable: true })
vertical: string;

@Column({ type: "varchar", length: 100, nullable: true })
title: string;

@Column({ type: "varchar", length: 100, nullable: true })
language: string;

@Column({ type: "varchar", length: 100, nullable: true })
timeZone: string;

@Column({ type: "varchar", length: 100, nullable: true, unique: true })
employeeId: string;

@Column({ type: "date", nullable: true })
joining_date: Date

@Column({ type: "date", nullable: true })
resignationDate: Date;

@ManyToOne(() => User, { nullable: true })
@JoinColumn({ name: "delegatedApproverId" })
delegatedApprover: User;

@Column({ nullable: true })
delegatedApproverId: number;

    // Role
  @Column({ nullable: true })
  roleId: number;

  
  @ManyToOne(() => Role)
  @JoinColumn({ name: "roleId" })
  role: Role;
  

  @Column({ default: false })
  isDeleted: boolean;

@ManyToOne(() => User, { nullable: true })
@JoinColumn({ name: "manager_id" })
manager: User;

@Column({ name: "manager_id", nullable: true })
managerId: number;

    @Column({ name: 'profile_id', nullable: true })
    profileId?: number;

    @ManyToOne(() => Profile, (profile) => profile.users, { eager: true, nullable: true })
    @JoinColumn({ name: 'profile_id' })
    profile?: Profile;


    // @Column({
    //     type: 'enum',
    //     enum: UserRole,
    //     default: UserRole.SSM, // Set default role to USER  
    // })
    // role: UserRole



    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;

    @OneToMany(() => Activities, (activity) => activity.user)
    activities: Activities[];

    // @OneToMany(() => Taxes, (tax) => tax.user)
    // taxes: Taxes[];

    // @OneToMany(() => Workplace, (workplace) => workplace.user)
    // workplace: Workplace[];

    // @OneToMany(() => Sessions, (sessions) => sessions.user)
    // sessions: Sessions[];

    // @OneToMany(() => FeedBack, (feedback) => feedback.user)
    // feedback: FeedBack[];

    // @OneToMany(() => Samples, (samples) => samples.user)
    // samples: Samples[];

    // @OneToMany(() => Gifts, (samples) => samples.user)
    // gift: Gifts[];

    // @OneToMany(() => Holiday, (holiday) => holiday.user)
    // holiday: Holiday[];

    // @OneToMany(() => JointWork, (jointWork) => jointWork.user)
    // jointWorks?: JointWork;

    // @OneToMany(() => RCPA, (rcpa) => rcpa.user)
    // rcpa: RCPA[];

    // @OneToMany(() => NewTarget, (target) => target.user)
    // target: NewTarget[];
}

export const UserRepository = (): Repository<any> => {
    const connection = DbConnections.AppDbConnection.getConnection();
    return connection.getRepository(User);
}
