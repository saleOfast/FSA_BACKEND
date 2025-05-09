import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";

export interface ICollectPayment {
    collectPaymentId: number;
    date: Date;
    orderId: number;
    orderAmount: number;
    collectAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

@Entity()
export class CollectPayment extends BaseEntity implements ICollectPayment {
    @PrimaryGeneratedColumn({ name: 'collect_payment_id' })
    collectPaymentId: number

    @Column({ type: 'timestamp' })
    date: Date

    @Column({ name: 'order_id' })
    orderId: number

    @Column({ name: 'order_amount' })
    orderAmount: number

    @Column({ name: 'collect_amount' })
    collectAmount: number

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const CollectPaymentRepository = (): Repository<ICollectPayment> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(CollectPayment);
}