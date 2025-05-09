import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, Repository, UpdateDateColumn } from "typeorm";
import { DbConnections } from "../../postgresdb";
import { ICourse } from "core/types/LearningModule/CourseService";
import { IQuiz } from "core/types/LearningModule/QuizService";

@Entity()
export class Quiz extends BaseEntity implements IQuiz {
    @PrimaryGeneratedColumn({ name: 'quiz_id' })
    quizId: number
    
    @Column({ name: 'course_id' })
    courseId: number

    @Column({name: 'question'})
    question: string

    @Column({name: 'marks'})
    marks: number
    
    @Column({name: 'option1'})
    option1: string

    @Column({name: 'option2'})
    option2: string

    @Column({name: 'option3'})
    option3: string
    
    @Column({name: 'option4'})
    option4: string

    @Column({name: 'answer'})
    answer: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const QuizRepository = (): Repository<IQuiz> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Quiz);
}