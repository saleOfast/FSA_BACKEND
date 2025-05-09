import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IOrderValueDiscount, IStore, IStoreFlatDiscount, IStoreVisibilityDiscount } from "../../../core/types/StoreService/StoreService";
import { StoreCategory } from "./storeCategory.entity";
import { User } from "./User.entity";
import { Activities } from "./activities.entity";
import { Sessions } from "./sessions.entity";
import { FeedBack } from "./feedback.entity";
import { Samples } from "./samples.entity";
import { PracticeTypeEnum } from "../../../core/types/Constent/common";
import { Workplace } from "./workplace.entity";
import { Visits } from "./Visit.entity";
import { RCPA } from "./rcpa.entity";
import { Gifts } from "./giftDistribution.entity";

@Entity({ name: 'stores' })
export class Stores extends BaseEntity implements IStore {
    @PrimaryGeneratedColumn({ name: 'store_id' })
    storeId: number

    @ManyToOne(() => User, user => user.emp_id)
    @JoinColumn({ name: 'emp_id' })
    user?: User;

    @Column({ name: 'emp_id' })
    empId: number

    @Column({ name: 'retailor_id' })
    retailorId: number

    @Column({ name: 'store_name' })
    storeName: string

    @Column({ name: 'uid', nullable: true })
    uid: string

    @Column({ name: 'store_type', nullable: true })
    storeType: number;

    @ManyToOne(() => StoreCategory, { nullable: true })
    @JoinColumn({ name: 'store_type' })
    storeCat?: StoreCategory;

    @Column({ name: 'lat', nullable: true })
    lat: string

    @Column({ name: 'long', nullable: true })
    long: string

    @Column({ name: 'address_line1' })
    addressLine1: string

    @Column({ name: 'address_line2' })
    addressLine2?: string

    @Column({ name: 'town_city' })
    townCity: string

    @Column()
    state: string

    @Column({ nullable: true })
    district: string

    @Column({ nullable: true })
    email?: string

    @Column({ name: 'pin_code' })
    pinCode: string

    @Column({ name: 'owner_name' })
    ownerName: string

    @Column({ name: 'mobile_number' })
    mobileNumber: string

    @Column({ name: 'alter_mobile', nullable: true })
    alterMobile: string

    @Column({ name: 'opening_time', nullable: true })
    openingTime: string

    @Column({ name: 'closing_time', nullable: true })
    closingTime: string

    @Column({ name: 'opening_time_am_pm', nullable: true })
    openingTimeAmPm: string

    @Column({ name: 'closing_time_am_pm', nullable: true })
    closingTimeAmPm: string

    @Column({ name: 'payment_mode', nullable: true })
    paymentMode: string

    @Column({ default: false, name: 'is_premium_store' })
    isPremiumStore: boolean

    @Column({ name: 'flat_discount', type: 'json', nullable: true })
    flatDiscount?: IStoreFlatDiscount

    @Column({ name: 'visibility_discount', type: 'json', nullable: true })
    visibilityDiscount?: IStoreVisibilityDiscount

    @Column({ name: 'order_value_discount', type: 'json', nullable: true })
    orderValueDiscount?: IOrderValueDiscount[];

    @Column({ name: 'is_active_order_value_discount', type: 'boolean', nullable: true })
    isActiveOrderValueDiscount?: boolean;

    @Column({ default: false, name: 'is_active' })
    isActive: boolean

    @Column({ name: 'qualification', nullable: true })
    qualification?: string

    @Column({ name: 'doctor_code', nullable: true })
    doctorCode?: string

    @Column({ name: 'chem_reg_number', nullable: true })
    RegistrationNumber?: string

    @Column({ name: 'speciality', nullable: true })
    speciality?: string

    @Column({ name: 'language_known', nullable: true })
    language_known?: string

    @Column({ name: 'territory', nullable: true })
    territory?: string

    @Column({ name: 'orgName', nullable: true })
    orgName: string

    @Column({ name: 'DOB', nullable: true })
    DOB?: string

    @Column({ name: 'clinic_name', nullable: true })
    clinicName?: string

    @Column({ name: 'date_of_wedding', nullable: true })
    dateOfWedding?: string

    @Column({ name: 'availability', nullable: true })
    availability: number

    @Column({ name: 'patient_volume', nullable: true })
    patientVolume: number

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;

    @OneToMany(() => Activities, (activity) => activity.store)
    activities: Activities[];

    @OneToMany(() => Workplace, (workplace) => workplace.store)
    workplace: Workplace[];

    @OneToMany(() => Sessions, (session) => session.store)
    sessions: Sessions[];

    @OneToMany(() => FeedBack, (feedback) => feedback.store)
    feedback: FeedBack[];

    @OneToMany(() => Samples, (samples) => samples.store)
    samples: Samples[];

    @OneToMany(() => Gifts, (gifts) => gifts.store)
    gift: Gifts[];

    @OneToMany(() => Visits, (visits) => visits.stores)
    visits: Visits[];

    @OneToMany(() => RCPA, (rcpa) => rcpa.store)
    rcpa: RCPA[];
}

export const StoreRepository = (): Repository<IStore> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Stores);
}