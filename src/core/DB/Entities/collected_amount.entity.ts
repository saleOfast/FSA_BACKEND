import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";

export interface ICollectAmount {
    collectAmountId: number;
    orderId: number;
    orderAmount: number;
    pendingAmount: number;
    totalCollectedAmount: number;
    totalPendingAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

@Entity()
export class CollectAmount extends BaseEntity implements ICollectAmount {
    orderAmount: number;
    @PrimaryGeneratedColumn({ name: 'collect_amount_id' })
    collectAmountId: number

    @Column({ name: 'order_id' })
    orderId: number

    @Column({ name: 'collect_amount' })
    collectAmount: number

    @Column({ name: 'pending_amount' })
    pendingAmount: number

    @Column({ name: 'total_collected_amount' })
    totalCollectedAmount: number

    @Column({ name: 'total_pending_amount' })
    totalPendingAmount: number

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const CollectAmountRepository = (): Repository<ICollectAmount> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(CollectAmount);
}