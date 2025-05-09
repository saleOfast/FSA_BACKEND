import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn, ManyToMany } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IBeat } from "../../../core/types/BeatService/Beat";
import { User } from "./User.entity";
import { Stores } from "./stores.entity";

@Entity()
export class Beat extends BaseEntity implements IBeat {
    @PrimaryGeneratedColumn({ name: 'beat_id' })
    beatId: number;

    @Column({ name: 'emp_id' })
    empId: number;

    @ManyToOne(() => User, user => user.emp_id)
    @JoinColumn({ name: 'emp_id' })
    user?: User;

    
    @Column({name: 'beat_name'})
    beatName: string;

    @Column({ name: 'store', type: 'json' })
    store: number[];

    // @ManyToOne(() => Stores, store => store.storeId)
    // @JoinColumn({ name: 'store'})
    // stores?: Stores;

    @Column({name: 'area', nullable: true})
    area: string
    @Column({name: 'country', nullable: true})
    country: string;

    @Column({name: 'state', nullable: true})
    state: string;

    @Column({name: 'district', nullable: true})
    district: string;

    @Column({name: 'city', nullable: true})
    city: string;

    @Column({ name: 'is_enable', default: true })
    IsEnable: boolean;

    @Column({ name: "is_deleted", default: false })
    isDeleted: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const BeatRepository = (): Repository<IBeat> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Beat);
}