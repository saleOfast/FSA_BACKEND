import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn, BeforeUpdate } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IOrders, Products } from "../../../core/types/OrderService/OrderService";
import { Stores } from "./stores.entity";
import { Visits } from "./Visit.entity";
import { CallType, CallTypeOrders, OrderStatus, PaymentStatus, SpecialDiscountStatus } from "../../../core/types/Constent/common";
import { User } from "./User.entity";

@Entity()
export class Orders extends BaseEntity implements IOrders {
    @PrimaryGeneratedColumn({ name: 'order_id' })
    orderId: number

    @Column({ name: 'emp_id' })
    empId: number

    @ManyToOne(() => User, user => user.emp_id)
    @JoinColumn({ name: 'emp_id' })
    user?: User;

    @Column({ name: 'store_id' })
    storeId: number

    @ManyToOne(() => Stores)
    @JoinColumn({ name: 'store_id' })
    store?: Stores;

    @Column({ name: 'is_call_type', type: 'enum', enum: CallType, nullable: true })
    isCallType: CallTypeOrders;

    @Column({ name: 'visit_id', nullable: true })
    visitId: number;

    @ManyToOne(() => Visits, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: 'visit_id' })
    visit?: Visits;

    @Column({ type: 'timestamp', name: 'order_date' })
    orderDate: string;

    @Column({ name: 'order_amount', type: 'decimal', nullable: true })
    orderAmount: number;

    @Column({ name: 'products', type: 'json' })
    products: Products[];

    @Column({ name: 'collected_amount', nullable: true, type: 'decimal' })
    collectedAmount: number

    @Column({ name: 'payment_status', type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus: PaymentStatus

    @Column({ name: 'net_amount', nullable: true, type: 'decimal' })
    netAmount: number

    @Column({ name: 'total_discount', nullable: true, type: 'decimal' })
    totalDiscountAmount: number;

    @Column({ name: 'sku_discount_value', nullable: true, type: 'decimal' })
    skuDiscountValue: number

    @Column({ name: 'flat_discount_value', nullable: true, type: 'decimal' })
    flatDiscountValue: number;

    @Column({ name: 'visibility_discount_value', nullable: true, type: 'decimal' })
    visibilityDiscountValue: number;

    @Column({ name: 'order_discount_value', nullable: true, type: 'decimal' })
    orderValueDiscountValue: number;

    @Column({ name: 'piece_discount', nullable: true, type: 'decimal' })
    pieceDiscount: number;

    @Column({ name: 'special_discount_value', nullable: true, type: 'decimal' })
    specialDiscountValue: number;

    @Column({ name: 'special_discount_id', nullable: true })
    specialDiscountId: number

    @Column({ name: 'special_discount_amount', nullable: true })
    specialDiscountAmount: number

    @Column({
        name: 'special_discount_status',
        type: 'enum',
        enum: SpecialDiscountStatus,
        nullable: true
    })
    specialDiscountStatus: SpecialDiscountStatus

    @Column({ name: 'special_discount_comment', nullable: true })
    specialDiscountComment: string

    @Column({ name: 'order_status', type: 'enum', enum: OrderStatus })
    orderStatus: OrderStatus

    @Column({ type: 'json', name: 'status_history', default: () => "'[]'" })
    statusHistory: { status: OrderStatus; timestamp: string }[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @BeforeUpdate()
    async updateStatusHistory() {
        if (this.orderStatus) {
            const newStatusEntry = { status: this.orderStatus, timestamp: new Date().toISOString() };
            this.statusHistory = [...this.statusHistory, newStatusEntry];
        }
    }
}

export const OrdersRepository = (): Repository<IOrders> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Orders);
}