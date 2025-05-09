import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, OneToMany } from "typeorm";
import { DbConnections } from "../postgresdb";
import { ICompetitorBrand } from "../../types/CompetitorBrandService/CompetitorBrandService";
import { RCPA } from "./rcpa.entity";

@Entity()
export class CompetitorBrand extends BaseEntity implements ICompetitorBrand {
    @PrimaryGeneratedColumn({ name: 'competitor_brand_id' })
    CompetitorBrandId: number

    @Column({ name: 'emp_id' })
    empId: number

    @Column({ name: 'name' })
    name: string

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => RCPA, (rcpa) => rcpa.competitorBrand)
    rcpa: RCPA[];

}

export const CompetitorBrandRepository = (): Repository<ICompetitorBrand> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(CompetitorBrand);
}