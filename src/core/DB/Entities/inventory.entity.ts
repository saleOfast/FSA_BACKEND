import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, OneToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { Products } from "./products.entity";

export interface IInventory {
    inventoryId: number;
    storeId: number;
    productId: number;
    empId: number;
    noOfCase: number;
    noOfPiece: number;
    createdAt: Date;
    updatedAt: Date;
}

@Entity()
// @Index(["storeId", "productId"], { unique: true })
export class Inventory extends BaseEntity implements IInventory {
    @PrimaryGeneratedColumn({ name: 'inventory_id' })
    inventoryId: number;

    @Column({ name: 'emp_id' })
    empId: number

    @Column({ name: "store_id" })
    storeId: number;

    @OneToOne(() => Products)
    @JoinColumn({ name: 'product_id' })
    product?: Products;

    @Column({ name: "product_id", unique: false })
    productId: number;

    @Column({ name: "no_of_case", default: 0 })
    noOfCase: number;

    @Column({ name: "no_of_piece", default: 0 })
    noOfPiece: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'udpated_at' })
    updatedAt: Date;
}

export const InventoryRepository = (): Repository<IInventory> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Inventory);
}