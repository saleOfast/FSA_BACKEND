import { AddCourse, DeleteCourse, GetCourse, ICourse, UpdateCourse } from "core/types/LearningModule/CourseService";
import { STATUSCODES } from "../../../../core/types/Constent/common";
import { Course, CourseRepository } from "../../../../core/DB/Entities/LearningModule/course.entity";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { LearningSession, LearningSessionRepository } from "../../../../core/DB/Entities/LearningModule/learningSession.entity";
import { In } from "typeorm";
import { Quiz, QuizRepository } from "../../../../core/DB/Entities/LearningModule/quiz.entity";
import { AddQuiz, DeleteQuiz, GetQuiz, IQuiz, UpdateQuiz } from "../../../../core/types/LearningModule/QuizService";
import { ILearningSession } from "core/types/LearningModule/LearningSessionService";


class CourseController {
    private course = CourseRepository();
    private userListRepositry = UserRepository();
    private learningSession = LearningSessionRepository();
    private quizRepository = QuizRepository();
    constructor() { }

    async addCourse(courseInput: AddCourse, payload: IUser) {
        try {
            const { courseName, description, isActive, dueDate, videoLink, thumbnailUrl, targetAudience, quizDuration, launchedDate } = courseInput;
            const { emp_id } = payload;
            // Create a new course instance
            const newCourse = new Course();
            newCourse.courseName = courseName;
            newCourse.description = description;
            newCourse.isActive = Boolean(isActive);
            newCourse.dueDate = dueDate;
            newCourse.thumbnailUrl = thumbnailUrl
            newCourse.videoLink = videoLink;
            newCourse.targetAudience = targetAudience;
            newCourse.quizDuration = quizDuration;
            newCourse.launchedDate = launchedDate;
            newCourse.empId = emp_id
            // Save the new course
            const newCourseData = await this.course.save(newCourse);
            // Fetch users based on learning roles
            const usersWithLearningRoles: any[] = await this.userListRepositry.find({
                select: ["emp_id"],
                where: {
                    learningRole: In(targetAudience) 
                }
            });
          
            // Save learning session for each user with the specified learning roles
            for (const user of usersWithLearningRoles) {
                const newLearningSession = new LearningSession();
                newLearningSession.courseId = newCourseData.courseId;
                newLearningSession.userId = user.emp_id;
                // console.log({newLearningSession})
                
                // Save the new learning session
                await this.learningSession.save(newLearningSession);
            }
    
            return { message: "Success.", status: STATUSCODES.SUCCESS };
        } catch (error) {
            console.log({error})
            throw error;
        }
    }
    

    async courseList(payload: IUser): Promise<IApiResponse> {
        try {

            const courseList: ICourse[] | null = await this.course.find( {order: {
                createdAt: 'DESC'}});

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: courseList }
        } catch (error) {
            throw error;
        }
    }

    async userCourseList(): Promise<IApiResponse> {
        try {

            const courseList: ICourse[] | null = await this.course.find( {order: {
                createdAt: 'DESC'}});

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: courseList }
        } catch (error) {
            throw error;
        }
    }

    async getCourseById(payload: IUser, input: GetCourse): Promise<IApiResponse> {
        try {
            const { courseId } = input;

            const course: ICourse | null = await this.course.findOne({ where: { courseId: Number(courseId) } });
             const quizList: IQuiz[] | null = await this.quizRepository.find( {
                where: { courseId: Number(courseId) },
                order: { createdAt: 'DESC'}});
             const learningSessionUserList: any[] | null = await this.learningSession.createQueryBuilder("learning_session")
                .leftJoinAndSelect("learning_session.user", "user")
                .where("learning_session.courseId = :courseId", { courseId  })
                .getMany();
               
            if (!course) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: {course, quizList, learningSessionUserList} }
        } catch (error) {
            throw error;
        }
    }
    async updateCourse( input: UpdateCourse): Promise<IApiResponse> {
        try {
            const { courseId, courseName, description, isActive, dueDate, videoLink, targetAudience, quizDuration, launchedDate} = input;

            // if (!name) {
            //     return { message: "Name can't be empty.", status: STATUSCODES.BAD_REQUEST }
            // }

            await this.course.createQueryBuilder().update({ courseName, description, isActive, dueDate, videoLink, targetAudience, quizDuration, launchedDate }).where({ courseId }).execute();
            // const usersWithLearningRoles: any[] = await this.userListRepositry.find({
            //     select: ["emp_id"],
            //     where: {
            //         learningRole: In( ) 
            //     }
            // });
            // console.log({usersWithLearningRoles})
          
            // // Save learning session for each user with the specified learning roles
            // for (const user of usersWithLearningRoles) {
            //     const newLearningSession = new LearningSession();
            //     newLearningSession.courseId = newCourseData.courseId;
            //     newLearningSession.userId = user.emp_id;
            //     console.log({newLearningSession})
                
            //     // Save the new learning session
            //     await this.learningSession.save(newLearningSession);
            // }
            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async deleteCourse( input: DeleteCourse): Promise<IApiResponse> {
        try {
            const { courseId } = input;
            await this.learningSession.createQueryBuilder().delete().where({courseId: Number(courseId) }).execute();
            await this.course.createQueryBuilder().delete().where({courseId: Number(courseId) }).execute();

            return { message: "Deleted.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async getLearningSessionById(payload: IUser, input: GetCourse): Promise<IApiResponse> {
        try {
            const { courseId } = input;

            const course: ICourse | null = await this.course.findOne({ where: { courseId: Number(courseId) } });
             const quizList: IQuiz[] | null = await this.quizRepository.find( {
                where: { courseId: Number(courseId) },
                order: { createdAt: 'DESC'}});

            if (!course) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: {course, quizList} }
        } catch (error) {
            throw error;
        }
    }
    async addQuiz(quizInput: AddQuiz) {
        try {
            const { question, answer, marks, option1, option2, option3, option4, courseId } = quizInput;
             
            // Create a new quiz instance
            const newQuiz = new Quiz();
            newQuiz.question = question;
            newQuiz.answer = answer;
            newQuiz.marks = marks;
            newQuiz.option1 = option1;
            newQuiz.option2 = option2;
            newQuiz.option3 = option3;
            newQuiz.option4 = option4;
            newQuiz.courseId = courseId;
    
            // Save the new quiz question
            await this.quizRepository.save(newQuiz);
    
            return { message: "Success.", status: STATUSCODES.SUCCESS };
        } catch (error) {
            console.log({error})
            throw error;
        }
    }
    async quizList(): Promise<IApiResponse> {
        try {

            const quizList: IQuiz[] | null = await this.quizRepository.find( {order: {
                createdAt: 'DESC'}});

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: quizList }
        } catch (error) {
            throw error;
        }
    }
    async getQuizById(payload: IUser, input: GetQuiz): Promise<IApiResponse> {
        try {
            const { quizId } = input;

            const quiz: IQuiz | null = await this.quizRepository.findOne({ where: { quizId: Number(quizId) } });
           
            if (!quiz) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: quiz }
        } catch (error) {
            throw error;
        }
    }
    async updateQuiz( input: UpdateQuiz): Promise<IApiResponse> {
        try {
            const { quizId, question, answer, option1, option2, option3, option4, courseId, marks } = input;

            await this.quizRepository.createQueryBuilder().update({question, answer, option1, option2, option3, option4, marks }).where({ quizId, courseId }).execute();

            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async deleteQuiz( input: DeleteQuiz): Promise<IApiResponse> {
        try {
            const { quizId } = input;

            await this.quizRepository.createQueryBuilder().delete().where({quizId: Number(quizId) }).execute();

            return { message: "Deleted.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    // async learningSessionList(payload: IUser): Promise<IApiResponse> {
    //     try {
    //         let { emp_id } = payload
    //         console.log("????", emp_id)
    //         const learningSessionUserId: ILearningSession | null = await this.learningSession.findOne( {
    //             where: { userId: Number(1) }});
    //             // const quizList: IQuiz[] | null = await this.quizRepository.find( {
    //             //     where: { courseId: Number(courseId) },
    //             //     order: { createdAt: 'DESC'}});
    //             console.log("????", learningSessionUserId )
    //             const learningSessionList: any[] | null = await this.learningSession.createQueryBuilder("learning_session")
    //             .leftJoinAndSelect("learning_session.course", "course")
    //             .where("learning_session.courseId = :courseId", { emp_id  })
    //             .getMany();
                

    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: learningSessionList }
    //     } catch (error) {
    //         console.log(">>>", error)
    //         throw error;
    //     }
    // }
}



export { CourseController as CourseService }