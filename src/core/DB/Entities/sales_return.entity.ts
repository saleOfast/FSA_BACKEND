import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Repository, UpdateDateColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { Orders } from "./orders.entity";
import { Stores } from "./stores.entity";
import { User } from "./User.entity";



@Entity({ name: 'sales_returns' })
export class SalesReturn extends BaseEntity {
	@PrimaryGeneratedColumn({ name: 'return_id' })
	returnId: number;

	@Column({ type: 'timestamp', name: 'return_date', default: () => 'CURRENT_TIMESTAMP' })
	returnDate: Date;

	@Column({ name: 'order_id' })
	orderId: number;

	@ManyToOne(() => Orders, { onDelete: "SET NULL" })
	@JoinColumn({ name: 'order_id' })
	order?: Orders;

	@Column({ name: 'store_id' })
	storeId: number;

	@ManyToOne(() => Stores, { onDelete: "SET NULL" })
	@JoinColumn({ name: 'store_id' })
	store?: Stores;

	@Column({ name: 'credit_note_id', type: 'int', nullable: true })
	creditNoteId?: number | null;

	@Column({ name: 'remarks', type: 'text', nullable: true })
	remarks?: string;

	@Column({ name: 'attachments', type: 'json', nullable: true })
	attachments?: string[];

	@Column({ name: 'return_value', type: 'decimal', nullable: true })
	returnValue: number;

	@Column({ name: 'created_by', type: 'varchar', length: 100 })
	createdBy: string;

	@Column({ name: 'created_by_user_id', nullable: true })
	createdByUserId?: number;

	@ManyToOne(() => User, { onDelete: "SET NULL" })
	@JoinColumn({ name: 'created_by_user_id', referencedColumnName: 'emp_id' })
	createdByUser?: User;

	@Column({ name: 'last_modified_by', type: 'varchar', length: 100, nullable: true })
	lastModifiedBy?: string;

	@Column({ name: 'last_modified_by_user_id', nullable: true })
	lastModifiedByUserId?: number;

	@ManyToOne(() => User, { onDelete: "SET NULL" })
	@JoinColumn({ name: 'last_modified_by_user_id', referencedColumnName: 'emp_id' })
	lastModifiedByUser?: User;

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'last_updated_date' })
	lastUpdatedDate: Date;
}

export const SalesReturnRepository = (): Repository<SalesReturn> => {
	return DbConnections.AppDbConnection.getConnection().getRepository(SalesReturn);
}