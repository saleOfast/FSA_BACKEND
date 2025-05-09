import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";

export interface IDiscount {
    discountId: number;
    isPremium: boolean;
    isVisibility: boolean;
    isBilled: boolean;
    isOrderValue: boolean;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}

@Entity()
export class Discount extends BaseEntity implements IDiscount {
    @PrimaryGeneratedColumn({ name: 'discount_id' })
    discountId: number

    @Column({ name: 'is_premium' })
    isPremium: boolean

    @Column({ name: 'is_visibility' })
    isVisibility: boolean

    @Column({ name: 'is_billed' })
    isBilled: boolean

    @Column({ name: 'is_order_value' })
    isOrderValue: boolean

    @Column()
    amount: number

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const DiscountRepository = (): Repository<IDiscount> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Discount);
}