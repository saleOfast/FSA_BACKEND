"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const course_entity_1 = require("../../../../core/DB/Entities/LearningModule/course.entity");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
const learningSession_entity_1 = require("../../../../core/DB/Entities/LearningModule/learningSession.entity");
const typeorm_1 = require("typeorm");
const quiz_entity_1 = require("../../../../core/DB/Entities/LearningModule/quiz.entity");
class CourseController {
    constructor() {
        this.course = (0, course_entity_1.CourseRepository)();
        this.userListRepositry = (0, User_entity_1.UserRepository)();
        this.learningSession = (0, learningSession_entity_1.LearningSessionRepository)();
        this.quizRepository = (0, quiz_entity_1.QuizRepository)();
    }
    addCourse(courseInput, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseName, description, isActive, dueDate, videoLink, thumbnailUrl, targetAudience, quizDuration, launchedDate } = courseInput;
                const { emp_id } = payload;
                // Create a new course instance
                const newCourse = new course_entity_1.Course();
                newCourse.courseName = courseName;
                newCourse.description = description;
                newCourse.isActive = Boolean(isActive);
                newCourse.dueDate = dueDate;
                newCourse.thumbnailUrl = thumbnailUrl;
                newCourse.videoLink = videoLink;
                newCourse.targetAudience = targetAudience;
                newCourse.quizDuration = quizDuration;
                newCourse.launchedDate = launchedDate;
                newCourse.empId = emp_id;
                // Save the new course
                const newCourseData = yield this.course.save(newCourse);
                // Fetch users based on learning roles
                const usersWithLearningRoles = yield this.userListRepositry.find({
                    select: ["emp_id"],
                    where: {
                        learningRole: (0, typeorm_1.In)(targetAudience)
                    }
                });
                // Save learning session for each user with the specified learning roles
                for (const user of usersWithLearningRoles) {
                    const newLearningSession = new learningSession_entity_1.LearningSession();
                    newLearningSession.courseId = newCourseData.courseId;
                    newLearningSession.userId = user.emp_id;
                    // console.log({newLearningSession})
                    // Save the new learning session
                    yield this.learningSession.save(newLearningSession);
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    courseList(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseList = yield this.course.find({ order: {
                        createdAt: 'DESC'
                    } });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: courseList };
            }
            catch (error) {
                throw error;
            }
        });
    }
    userCourseList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseList = yield this.course.find({ order: {
                        createdAt: 'DESC'
                    } });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: courseList };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCourseById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = input;
                const course = yield this.course.findOne({ where: { courseId: Number(courseId) } });
                const quizList = yield this.quizRepository.find({
                    where: { courseId: Number(courseId) },
                    order: { createdAt: 'DESC' }
                });
                const learningSessionUserList = yield this.learningSession.createQueryBuilder("learning_session")
                    .leftJoinAndSelect("learning_session.user", "user")
                    .where("learning_session.courseId = :courseId", { courseId })
                    .getMany();
                if (!course) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: { course, quizList, learningSessionUserList } };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateCourse(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId, courseName, description, isActive, dueDate, videoLink, targetAudience, quizDuration, launchedDate } = input;
                // if (!name) {
                //     return { message: "Name can't be empty.", status: STATUSCODES.BAD_REQUEST }
                // }
                yield this.course.createQueryBuilder().update({ courseName, description, isActive, dueDate, videoLink, targetAudience, quizDuration, launchedDate }).where({ courseId }).execute();
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
                return { message: "Updated.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteCourse(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = input;
                yield this.learningSession.createQueryBuilder().delete().where({ courseId: Number(courseId) }).execute();
                yield this.course.createQueryBuilder().delete().where({ courseId: Number(courseId) }).execute();
                return { message: "Deleted.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getLearningSessionById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = input;
                const course = yield this.course.findOne({ where: { courseId: Number(courseId) } });
                const quizList = yield this.quizRepository.find({
                    where: { courseId: Number(courseId) },
                    order: { createdAt: 'DESC' }
                });
                if (!course) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: { course, quizList } };
            }
            catch (error) {
                throw error;
            }
        });
    }
    addQuiz(quizInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { question, answer, marks, option1, option2, option3, option4, courseId } = quizInput;
                // Create a new quiz instance
                const newQuiz = new quiz_entity_1.Quiz();
                newQuiz.question = question;
                newQuiz.answer = answer;
                newQuiz.marks = marks;
                newQuiz.option1 = option1;
                newQuiz.option2 = option2;
                newQuiz.option3 = option3;
                newQuiz.option4 = option4;
                newQuiz.courseId = courseId;
                // Save the new quiz question
                yield this.quizRepository.save(newQuiz);
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    quizList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quizList = yield this.quizRepository.find({ order: {
                        createdAt: 'DESC'
                    } });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: quizList };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getQuizById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { quizId } = input;
                const quiz = yield this.quizRepository.findOne({ where: { quizId: Number(quizId) } });
                if (!quiz) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: quiz };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateQuiz(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { quizId, question, answer, option1, option2, option3, option4, courseId, marks } = input;
                yield this.quizRepository.createQueryBuilder().update({ question, answer, option1, option2, option3, option4, marks }).where({ quizId, courseId }).execute();
                return { message: "Updated.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteQuiz(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { quizId } = input;
                yield this.quizRepository.createQueryBuilder().delete().where({ quizId: Number(quizId) }).execute();
                return { message: "Deleted.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.CourseService = CourseController;
