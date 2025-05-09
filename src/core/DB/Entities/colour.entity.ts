import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository } from "typeorm";
import { DbConnections } from "../postgresdb";
import { IColour } from "core/types/ReasonService/ReasonService";

@Entity()
export class Colour extends BaseEntity implements IColour {
    @PrimaryGeneratedColumn({ name: 'colour_id' })
    colourId: number

    @Column({ name: 'emp_id' })
    empId: number

    @Column({ name: 'name', nullable: true })
    name: string

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const ColourRepository = (): Repository<IColour> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Colour);
}