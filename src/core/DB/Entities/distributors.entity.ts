import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";

export interface IDistributor {
    distributorId: number;
    distributorName: string;
    type: string;
    address: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

@Entity({ name: 'Distributor' })
export class Distributor extends BaseEntity implements IDistributor {
    @PrimaryGeneratedColumn({name: 'distributor_id'})
    distributorId: number

    @Column({name: 'distributor_name'})
    distributorName: string

    @Column()
    type: string

    @Column()
    address: string

    @Column({ default: false, name: 'is_active' })
    isActive: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const DistributorRepository = (): Repository<IDistributor> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Distributor);
}