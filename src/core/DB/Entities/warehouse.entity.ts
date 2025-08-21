import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { User } from "./User.entity";

export enum WarehouseStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export enum WarehouseType {
	DISTRIBUTION_CENTER = 'Distribution Center',
	COLD_STORAGE = 'Cold Storage',
	STORAGE = 'Storage',
}

// Interface for user info object
export interface IUserInfo {
	id: number;
	name: string;
}

@Entity({ name: 'warehouses' })
export class Warehouse extends BaseEntity {
	@PrimaryGeneratedColumn({ name: 'warehouse_id' })
	warehouseId: number;

	@Column({ name: 'warehouse_name', unique: true })
	warehouseName: string;

	// picklist
	@Column({ name: 'type', type: 'enum', enum: WarehouseType, nullable: true, default: WarehouseType.STORAGE })
	warehouseType?: WarehouseType;

	// location
	@Column({ name: 'address' })
	address: string;

	@Column({ name: 'city' })
	city: string;

	@Column({ name: 'state' })
	state: string;

	@Column({ name: 'zip' })
	zip: string;

	// manager refs
	@ManyToOne(() => User, { nullable: true })
	@JoinColumn({ name: 'manager_id' })
	manager?: User;

	@Column({ name: 'manager_id', nullable: true })
	managerId?: number;

	@Column({ name: 'email', nullable: true })
	email?: string;

	// optional duplicate if you want to persist phone even if user changes
	@Column({ name: 'manager_phone', nullable: true })
	managerPhone?: string;

	@Column({ name: 'contact_person', nullable: true })
	contactPerson?: string;

	@Column({ name: 'contact_name', nullable: true })
	contactName?: string;

	@Column({ name: 'capacity', type: 'int', nullable: true })
	capacity?: number;

	@Column({ name: 'status', type: 'enum', enum: WarehouseStatus, default: WarehouseStatus.ACTIVE })
	status: WarehouseStatus;

	@Column({ name: 'operational_hours', nullable: true })
	operationalHours?: string;

	@CreateDateColumn({ type: 'timestamp', name: 'created_date', default: () => 'CURRENT_TIMESTAMP' })
	createdDate: Date;

	@UpdateDateColumn({ type: 'timestamp', name: 'last_updated_date', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
	lastUpdatedDate: Date;

	@ManyToOne(() => User, { nullable: true })
	@JoinColumn({ name: 'created_by' })
	createdByUser?: User;

	@Column({ name: 'created_by', nullable: true })
	createdBy?: number;

	@Column({ name: 'created_by_name', nullable: true })
	createdByName?: string;

	@ManyToOne(() => User, { nullable: true })
	@JoinColumn({ name: 'last_modified_by' })
	lastModifiedByUser?: User;

	@Column({ name: 'last_modified_by', nullable: true })
	lastModifiedBy?: number;

	@Column({ name: 'last_modified_by_name', nullable: true })
	lastModifiedByName?: string;

	// Virtual properties that combine ID and name
	get createdByInfo(): IUserInfo | null {
		if (!this.createdBy) return null;
		return {
			id: this.createdBy,
			name: this.createdByName || 'Unknown User'
		};
	}

	get lastModifiedByInfo(): IUserInfo | null {
		if (!this.lastModifiedBy) return null;
		return {
			id: this.lastModifiedBy,
			name: this.lastModifiedByName || 'Unknown User'
		};
	}

	// Method to get formatted data for API responses
	toResponseFormat() {
		const response: any = { ...this };
		
		// Replace individual fields with combined objects
		if (this.createdBy) {
			response.createdBy = this.createdByInfo;
			delete response.createdByName;
		}
		
		if (this.lastModifiedBy) {
			response.lastModifiedBy = this.lastModifiedByInfo;
			delete response.lastModifiedByName;
		}
		
		return response;
	}
}

export const WarehouseRepository = (): Repository<Warehouse> => {
	return DbConnections.AppDbConnection.getConnection().getRepository(Warehouse);
}