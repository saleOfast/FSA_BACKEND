import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, JoinColumn, ManyToOne } from "typeorm";
import { DbConnections } from "../postgresdb";
import { Stores } from "./stores.entity";
import { Orders } from "./orders.entity";

export interface ICollecion {
    collectionId: number;
    orderId: number;
    storeId: number;
    orderAmount: number;
    collectedAmount: number;
    pendingAmount: number;
    createdAt: Date;
    updatedAt: Date;

}

@Entity()
export class Collection extends BaseEntity implements ICollecion {
    @PrimaryGeneratedColumn({ name: 'collection_id' })
    collectionId: number

    @Column({ name: 'order_id' })
    orderId: number

    @ManyToOne(() => Orders)
    @JoinColumn({ name: 'order_id' })
    orders: Orders;

    @Column({ name: 'store_id' })
    storeId: number

    @ManyToOne(() => Stores)
    @JoinColumn({ name: 'store_id' })
    stores: Stores;

    @Column({ name: 'order_amount' })
    orderAmount: number

    @Column({ name: 'collected_amount' })
    collectedAmount: number

    @Column({ name: 'pending_amount' })
    pendingAmount: number

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const CollectionRepository = (): Repository<ICollecion> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Collection);
}