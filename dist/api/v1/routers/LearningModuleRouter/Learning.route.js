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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRouter = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const CourseService_1 = require("../../../../core/types/LearningModule/CourseService");
const Learning_controller_1 = require("../../Controllers/LearningModuleController/Learning.controller");
const QuizService_1 = require("../../../../core/types/LearningModule/QuizService");
const router = express_1.default.Router();
exports.CourseRouter = router;
router.post('/add', (0, validationMiddleware_1.validateDtoMiddleware)(CourseService_1.AddCourse), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, CourseService_1.AddCourse);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const courseService = new Learning_controller_1.CourseService();
        const data = yield courseService.addCourse(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/list', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const courseService = new Learning_controller_1.CourseService();
        const data = yield courseService.courseList(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getById/:courseId', (0, validationMiddleware_1.validateDtoMiddleware)(CourseService_1.GetCourse), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, CourseService_1.GetCourse);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const courseService = new Learning_controller_1.CourseService();
        const data = yield courseService.getCourseById(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/update', (0, validationMiddleware_1.validateDtoMiddleware)(CourseService_1.UpdateCourse), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, CourseService_1.UpdateCourse);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const courseService = new Learning_controller_1.CourseService();
        const data = yield courseService.updateCourse(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/delete/:courseId', (0, validationMiddleware_1.validateDtoMiddleware)(CourseService_1.DeleteCourse), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, CourseService_1.DeleteCourse);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const courseService = new Learning_controller_1.CourseService();
        const data = yield courseService.deleteCourse(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/quiz/add', (0, validationMiddleware_1.validateDtoMiddleware)(QuizService_1.AddQuiz), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, QuizService_1.AddQuiz);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const courseService = new Learning_controller_1.CourseService();
        const data = yield courseService.addQuiz(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/quiz/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const quizService = new Learning_controller_1.CourseService();
        const data = yield quizService.quizList();
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/quiz/getById/:quizId', (0, validationMiddleware_1.validateDtoMiddleware)(QuizService_1.GetQuiz), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, QuizService_1.GetQuiz);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const courseService = new Learning_controller_1.CourseService();
        const data = yield courseService.getQuizById(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/quiz/update', (0, validationMiddleware_1.validateDtoMiddleware)(QuizService_1.UpdateQuiz), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, QuizService_1.UpdateQuiz);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const quizService = new Learning_controller_1.CourseService();
        const data = yield quizService.updateQuiz(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/quiz/delete/:quizId', (0, validationMiddleware_1.validateDtoMiddleware)(QuizService_1.DeleteQuiz), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, QuizService_1.DeleteQuiz);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const courseService = new Learning_controller_1.CourseService();
        const data = yield courseService.deleteQuiz(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
