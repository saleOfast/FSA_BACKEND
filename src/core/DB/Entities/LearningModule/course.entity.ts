import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, Repository, UpdateDateColumn } from "typeorm";
import { DbConnections } from "../../postgresdb";
import { ICourse } from "core/types/LearningModule/CourseService";

@Entity()
export class Course extends BaseEntity implements ICourse {
    @PrimaryGeneratedColumn({ name: 'course_id' })
    courseId: number

    @Column({ name: 'emp_id', nullable: true })
    empId: number

    @Column({ name: 'course_name', nullable: true })
    courseName: string

    @Column({ name: 'description', nullable: true })
    description: string

    @Column({ name: 'is_active', default: false })
    isActive: boolean

    @Column({ name: "due_date", nullable: true })
    dueDate: Date;

    @Column({ name: "thumbnail_url", nullable: true })
    thumbnailUrl?: string;

    @Column({ name: "video_link", nullable: true })
    videoLink?: string;

    @Column({ name: "target_audience", type: 'json', nullable: true })
    targetAudience: string[];

    @Column({ name: "quiz_time_duration_min", nullable: true })
    quizDuration: number;

    @Column({ name: "launched_date", nullable: true })
    launchedDate: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;
}

export const CourseRepository = (): Repository<ICourse> => {
    return DbConnections.AppDbConnection.getConnection().getRepository(Course);
}