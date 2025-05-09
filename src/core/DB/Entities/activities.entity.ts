import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, OneToMany, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { ActivityTypeEnum } from "../../../core/types/Constent/common";
import { JointWork } from "./activities.jointWork.entity";
import { Stores } from "./stores.entity";
import { Products } from "./products.entity";
import { User } from "./User.entity";

@Entity({ name: 'activities' })
export class Activities extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'activity_id' })
    activityId: number;

    @ManyToOne(() => Stores, (store) => store.activities, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'store_id' }) // Creates the store_id foreign key column
    store?: Stores;

    @Column({ name: 'store_id', nullable: true }) // Store ID column
    storeId?: number;

    @Column({ nullable: true, name: 'activity_type', enum: ActivityTypeEnum })
    activityType: ActivityTypeEnum;

    @Column({ name: 'date' })
    date: Date;

    @Column({ type: 'interval', name: 'duration', nullable: true })
    duration: string;

    @ManyToOne(() => User, (user) => user.activities, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'added_by', referencedColumnName: 'emp_id' })
    user: User;

    @Column({ name: 'added_by' })
    addedBy: number;

    @ManyToOne(() => Products, (product) => product.activities, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'product_id' })
    product?: Products;

    @Column({ name: 'product_id' })
    productId: number;

    @Column({ name: 'remarks' })
    remarks: string;

    @Column({ name: 'status', default: true })
    status: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @OneToMany(() => JointWork, (jointWork) => jointWork.activity)
    jointWorks: JointWork[];
}

export const ActivitiesRepository = (): Repository<Activities> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Activities);
};
