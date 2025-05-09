import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, OneToMany, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../postgresdb";
import { ActivityTypeEnum } from "../../types/Constent/common";
import { JointWork } from "./activities.jointWork.entity";
import { Stores } from "./stores.entity";
import { Products } from "./products.entity";
import { User } from "./User.entity";

@Entity({ name: 'taxes' })
export class Taxes extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'tax_id' })
    taxId: number;

    @Column({ name: 'tax_name' })
    taxName: string;

    @Column({ name: 'tax_amount' })
    taxAmount: number;

    @Column({ name: 'description' })
    description: string;

    @ManyToOne(() => User, (user) => user.taxes, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'added_by', referencedColumnName: 'emp_id' })
    user: User;

    @Column({ name: 'added_by' })
    addedBy: number;

    @Column({ name: 'status', default: true })
    status: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}

export const TaxesRepository = (): Repository<Taxes> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Taxes);
};
