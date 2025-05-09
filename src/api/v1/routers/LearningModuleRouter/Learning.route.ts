import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { AddCourse, DeleteCourse, GetCourse, UpdateCourse } from "../../../../core/types/LearningModule/CourseService";
import { CourseService } from "../../Controllers/LearningModuleController/Learning.controller";
import { AddQuiz, DeleteQuiz, GetQuiz, UpdateQuiz } from "../../../../core/types/LearningModule/QuizService";
const router = express.Router();

router.post('/add', validateDtoMiddleware(AddCourse),AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: AddCourse = RequestHandler.Defaults.getBody<AddCourse>(req, AddCourse);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const courseService = new CourseService();
        const data = await courseService.addCourse(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const courseService = new CourseService();
        const data = await courseService.courseList(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});
router.get('/getById/:courseId', validateDtoMiddleware(GetCourse), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetCourse = RequestHandler.Defaults.getParams<GetCourse>(req, GetCourse);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const courseService = new CourseService();
        const data = await courseService.getCourseById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/update', validateDtoMiddleware(UpdateCourse), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateCourse = RequestHandler.Defaults.getBody<UpdateCourse>(req, UpdateCourse);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const courseService = new CourseService();
        const data = await courseService.updateCourse(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:courseId', validateDtoMiddleware(DeleteCourse), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteCourse = RequestHandler.Defaults.getParams<DeleteCourse>(req, DeleteCourse);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const courseService = new CourseService();
        const data = await courseService.deleteCourse(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/quiz/add', validateDtoMiddleware(AddQuiz), async (req: Request, res: Response) => {
    try {
        const input: AddQuiz = RequestHandler.Defaults.getBody<AddQuiz>(req, AddQuiz);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const courseService = new CourseService();
        const data = await courseService.addQuiz(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/quiz/list', async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const quizService = new CourseService();
        const data = await quizService.quizList();
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/quiz/getById/:quizId', validateDtoMiddleware(GetQuiz), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetQuiz = RequestHandler.Defaults.getParams<GetQuiz>(req, GetQuiz);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const courseService = new CourseService();
        const data = await courseService.getQuizById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/quiz/update', validateDtoMiddleware(UpdateQuiz), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateQuiz = RequestHandler.Defaults.getBody<UpdateQuiz>(req, UpdateQuiz);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const quizService = new CourseService();
        const data = await quizService.updateQuiz(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/quiz/delete/:quizId', validateDtoMiddleware(DeleteQuiz), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteQuiz = RequestHandler.Defaults.getParams<DeleteQuiz>(req, DeleteQuiz);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const courseService = new CourseService();
        const data = await courseService.deleteQuiz(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

// router.get('/learningSession/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const payload: IUser = RequestHandler.Custom.getUser(req);
//         const courseService = new CourseService();
//         const data = await courseService.learningSessionList(payload);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });

export { router as CourseRouter }