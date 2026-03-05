import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Repository,
  BaseEntity,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';
// import { PurchaseOrder } from './';
import { User } from './User.entity';
import { GrnStatusEnum } from '../../types/Constent/common';
import { DbConnections } from '../postgresdb';



export interface IGrnHeader {
    grnId: string;
    warehouseId: string;
    poId?: string;
    createdBy: number;
    createdAt: Date;
    status: GrnStatusEnum;
    isDeleted: boolean;

}


@Entity('grn_headers')
export class GrnHeader extends BaseEntity implements IGrnHeader{

  @PrimaryGeneratedColumn('uuid')
  grnId: string;

  // Warehouse FK
  @Column({ type: 'uuid' })
  warehouseId: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  // Purchase Order FK (Optional)
  @Column({ type: 'uuid', nullable: true })
  poId?: string;

//   @ManyToOne(() => PurchaseOrder, { nullable: true })
//   @JoinColumn({ name: 'po_id' })
//   purchaseOrder?: PurchaseOrder;

  // Created By (User)
  @Column({ name: 'created_by' })
  createdBy: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  // Auto Timestamp
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Status
  @Column({
    type: 'enum',
    enum: GrnStatusEnum,
    default: GrnStatusEnum.PENDING,
  })
  status: GrnStatusEnum;

  @Column({ name: "isDeleted", default: false })
  isDeleted: boolean;
}

export const GrnHeaderRepository = (): Repository<GrnHeader> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(GrnHeader);
} 