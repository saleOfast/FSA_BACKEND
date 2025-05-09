import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Repository, ManyToOne, JoinColumn, DeleteDateColumn, OneToOne } from "typeorm";
import { DbConnections } from "../postgresdb";
import { Activities } from "./activities.entity";
import { User } from "./User.entity";

@Entity({ name: 'joint_work' })  // Table name should be different from 'activities'
export class JointWork extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'joint_work_id' })
    jwId: number;

    @ManyToOne(() => User, (user) => user.jointWorks, { onDelete: "CASCADE" }) // Many joint works can belong to one user
    @JoinColumn({ name: 'emp_id' })
    user: User;

    @ManyToOne(() => Activities, (activity) => activity.jointWorks, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'activity_id' })  // Correct placement of @JoinColumn
    activity?: Activities;

    @Column({ name: 'status', default: true })
    status: boolean;

    @Column({ name: 'emp_id' })
    emp_id: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}

export const JointWorkRepository = (): Repository<JointWork> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(JointWork);
};
