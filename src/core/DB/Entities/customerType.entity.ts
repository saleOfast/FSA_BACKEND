import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Repository,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn
} from "typeorm";
import { DbConnections } from "../postgresdb";
import { ICustomerType } from "../../types/CustomerTypeService/CustomerTypeService";
import { User } from "./User.entity";
import { IUserReference } from "../../types/Profile/Profile.types";

@Entity({ name: "customer_types" })
export class CustomerType extends BaseEntity implements ICustomerType {
  @PrimaryGeneratedColumn({ name: 'customer_type_id' })
  customerTypeId: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId?: number | null;

  @ManyToOne(() => CustomerType, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: CustomerType;

  @Column({ name: 'trade_category', nullable: true })
  tradeCategory?: string;

  @Column({ name: 'can_purchase', type: 'boolean', default: false })
  canPurchase!: boolean;

  @Column({ name: 'can_sell', type: 'boolean', default: false })
  canSell!: boolean;

  @Column({ name: 'inventory_visibility_scope' })
  inventoryVisibilityScope!: string; // Self/Child/Full/None

  // Audit Fields
  @Column({ name: 'created_by', type: 'jsonb', nullable: false })
  createdBy!: IUserReference;

  @CreateDateColumn({ name: 'created_date', type: 'timestamp' })
  createdDate!: Date;

  @Column({ name: 'last_modified_by', type: 'jsonb', nullable: true })
  lastModifiedBy?: IUserReference;

  @UpdateDateColumn({ name: 'last_modified_date', type: 'timestamp', nullable: true })
  lastModifiedDate?: Date;

  @Column({ name: 'is_deleted', default: false })
  isDeleted!: boolean;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Helper method to set createdBy from a User entity
  setCreatedByUser(user: User) {
    const firstName = user.firstname || '';
    const lastName = user.lastname || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Unknown User';
    
    this.createdBy = {
      id: user.emp_id,
      name: fullName
    };
  }

  // Helper method to set modifiedBy from a User entity
  setModifiedByUser(user: User) {
    const firstName = user.firstname || '';
    const lastName = user.lastname || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Unknown User';
    
    this.lastModifiedBy = {
      id: user.emp_id,
      name: fullName
    };
  }
}

export const CustomerTypeRepository = (): Repository<CustomerType> => {
  return DbConnections.AppDbConnection.getConnection().getRepository(CustomerType);
}

