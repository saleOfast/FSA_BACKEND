import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IPaymentMode } from "core/types/PaymentModeService/PaymentModeService";

@Entity()
export class PaymentMode extends BaseEntity implements IPaymentMode {
    @PrimaryGeneratedColumn({ name: 'payment_mode_id' })
    paymentModeId: number

    @Column({ name: 'emp_id' })
    empId: number

    @Column({ name: 'name', nullable: true })
    name: string

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const PaymentModeRepository = (): Repository<IPaymentMode> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(PaymentMode);
}