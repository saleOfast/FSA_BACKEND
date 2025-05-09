import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, OneToMany, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { Stores } from "./stores.entity";
import { Products } from "./products.entity";
import { User } from "./User.entity";

@Entity({ name: 'gifts' })
export class Gifts extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'gift_id' })
    giftId: number;

    @ManyToOne(() => Stores, (store) => store.gift, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'store_id' })
    store?: Stores;

    @Column({ name: 'store_id', nullable: true }) // Store ID column
    storeId?: number;

    @ManyToOne(() => Products, (product) => product.gift, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'product_id' })
    product?: Products;

    @Column({ name: 'product_id', nullable: true })
    productId: number;

    @Column({ name: 'date', nullable: true })
    date: Date;

    @ManyToOne(() => User, (user) => user.gift, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'added_by', referencedColumnName: 'emp_id' })
    user: User;

    @Column({ name: 'added_by', nullable: true })
    addedBy: number;

    @Column({ name: 'quantity', nullable: true })
    quantity: number;

    @Column({ name: 'remarks', nullable: true })
    remarks: string;

    @Column({ name: 'gift', nullable: true })
    gift: string;

    @Column({ name: 'status', default: true })
    status: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}

export const GiftsRepository = (): Repository<Gifts> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Gifts);
};
