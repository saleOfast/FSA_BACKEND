import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, Repository, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { DbConnections } from "../../postgresdb";
import { ICourse } from "core/types/LearningModule/CourseService";
import { Course } from "./course.entity";
import { User } from "../User.entity";
import { ILearningSession } from "core/types/LearningModule/LearningSessionService";

@Entity()
export class LearningSession extends BaseEntity implements ILearningSession {
    @PrimaryGeneratedColumn({ name: 'learning_id' })
    learningSessionId: number

    @Column({ name: 'course_id' })
    courseId: number

    @ManyToOne(() => Course)
    @JoinColumn({ name: 'course_id' })
    course?: Course;

    @Column({ name: 'user_id' })
    userId: number

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const LearningSessionRepository = (): Repository<ILearningSession> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(LearningSession);
}