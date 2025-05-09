import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, OneToMany, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { SessionTypeEnum } from "core/types/Constent/common";
import { Stores } from "./stores.entity";
import { User } from "./User.entity";
import { Products } from "./products.entity";

@Entity({ name: 'sessions' })
export class Sessions extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'session_id' })
    sessionId: number;

    @ManyToOne(() => Products, (product) => product.sessions, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'product_id' })
    product?: Products;

    @Column({ name: 'product_id' })
    productId: number;

    @ManyToOne(() => Stores, (store) => store.sessions, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'store_id' }) // Creates the store_id foreign key column
    store?: Stores;

    @Column({ name: 'store_id', nullable: true }) // Store ID column
    storeId?: number;

    @Column({ name: 'date', nullable: true  })
    date: Date;

    @ManyToOne(() => User, (user) => user.sessions, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'added_by', referencedColumnName: 'emp_id' })
    user: User;

    @Column({ name: 'added_by', nullable: true })
    addedBy: number;

    @Column({ type: 'interval', name: 'duration', nullable: true })
    duration: string;

    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'about', nullable: true })
    about: string;

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

export const SessionsRepository = (): Repository<Sessions> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Sessions);
};
