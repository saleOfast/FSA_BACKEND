import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, OneToMany, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { SessionTypeEnum } from "core/types/Constent/common";
import { Stores } from "./stores.entity";
import { Products } from "./products.entity";
import { User } from "./User.entity";

@Entity({ name: 'samples' })
export class Samples extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'samples_id' })
    samplesId: number;

    @ManyToOne(() => Stores, (store) => store.samples, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'store_id' })
    store?: Stores;

    @Column({ name: 'store_id', nullable: true }) // Store ID column
    storeId?: number;

    @ManyToOne(() => Products, (product) => product.samples, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'product_id' })
    product?: Products;

    @Column({ name: 'product_id' })
    productId: number;

    @Column({ name: 'date', nullable: true })
    date: Date;

    @ManyToOne(() => User, (user) => user.samples, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'added_by', referencedColumnName: 'emp_id' })
    user: User;

    @Column({ name: 'added_by', nullable: true })
    addedBy: number;

    @Column({ name: 'quantity', nullable: true })
    quantity: number;

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

export const SamplesRepository = (): Repository<Samples> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Samples);
};
