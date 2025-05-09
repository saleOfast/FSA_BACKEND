import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";

export interface IOutletInventory {
    outletInventoryId: number;
    productName: string;
    caseQty: number;
    pieces: number;
    mrp: number;
    rlp: number;
    createdAt: Date;
    updatedAt: Date;
}

@Entity()
export class OutletInventory extends BaseEntity implements IOutletInventory {
    @PrimaryGeneratedColumn({name: 'outlet_inventory_id'})
    outletInventoryId: number

    @Column({name: 'product_name'})
    productName: string

    @Column({name: 'case_qty'})
    caseQty: number

    @Column()
    pieces: number;

    @Column()
    mrp: number

    @Column()
    rlp: number

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const OutletInventoryRepository = (): Repository<IOutletInventory>=>{
    return DbConnections.AppDbConnection.getConnection().getRepository(OutletInventory);
}