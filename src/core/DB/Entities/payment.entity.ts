import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, JoinColumn, ManyToOne } from "typeorm";
import { DbConnections } from "../postgresdb";
import { Orders } from "./orders.entity";

export interface IPayment {
    paymentId: number;
    paymentDate: string;
    orderId: number;
    transactionId: string;
    status: string;
    paymentMode: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    paymentRefImg: string;
}

@Entity()
export class Payment extends BaseEntity implements IPayment {
    @PrimaryGeneratedColumn({ name: 'payment_id' })
    paymentId: number

    @Column({ name: 'emp_id' })
    empId: number

    @Column({ name: 'order_id' })
    orderId: number

    @ManyToOne(() => Orders)
    @JoinColumn({ name: 'order_id' })
    order?: Orders;

    @Column({ type: 'timestamp', name: "payment_date" })
    paymentDate: string

    @Column({ name: 'transaction_id', nullable: true })
    transactionId: string

    @Column({ name: 'status', default: true })
    status: string

    @Column({ name: 'payment_mode', nullable: true })
    paymentMode: string

    @Column({ name: 'amount', nullable: true })
    amount: number

    @Column({ name: 'payment_ref_img', nullable: true })
    paymentRefImg: string


    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const PaymentRepository = (): Repository<IPayment> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Payment);
}