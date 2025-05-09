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
exports.TargetRouter = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const AuthService_1 = require("../../../../core/types/AuthService/AuthService");
const TargetService_1 = require("../../../../core/types/TargetService/TargetService");
const New_Target_controller_1 = require("../../../../api/v1/Controllers/NewTargetController copy/New.Target.controller");
const catch_async_1 = __importDefault(require("../../../../core/utils/catch-async"));
const router = express_1.default.Router();
exports.TargetRouter = router;
// router.post('/add', validateDtoMiddleware(CreateTarget), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: any = RequestHandler.Defaults.getBody<CreateTarget>(req, CreateTarget);
//         const payload: IUser = RequestHandler.Custom.getUser(req);
//         const targetService = new TargetService();
//         const data = await targetService.add(input, payload);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });
// router.post('/yearly-chart', validateDtoMiddleware(UpdateTarget), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: UpdateTarget = RequestHandler.Defaults.getBody<UpdateTarget>(req, UpdateTarget);
//         const payload: IUser = RequestHandler.Custom.getUser(req);
//         const targetService = new TargetService();
//         const data = await targetService.getYearlyTargetById(payload, input);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });
//*****************************New Target APIs*************************************
router.get('/getById/:targetId', (0, validationMiddleware_1.validateDtoMiddleware)(TargetService_1.GetTarget), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, TargetService_1.GetTarget);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const targetService = new New_Target_controller_1.TargetService();
        const data = yield targetService.getTargetById(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getAllByEmpId', (0, validationMiddleware_1.validateDtoMiddleware)(TargetService_1.GetAllTarget), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, TargetService_1.GetAllTarget);
        // const payload: IUser = RequestHandler.Custom.getUser(req);
        const targetService = new New_Target_controller_1.TargetService();
        const data = yield targetService.getTargetByEmpId(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/delete/:targetId', (0, validationMiddleware_1.validateDtoMiddleware)(TargetService_1.DeleteTarget), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, TargetService_1.DeleteTarget);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const TargetService = new New_Target_controller_1.TargetService();
        const data = yield TargetService.delete(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/yearly-chart', (0, validationMiddleware_1.validateDtoMiddleware)(AuthService_1.TargetFilter), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, AuthService_1.DashboardFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const profileController = new New_Target_controller_1.TargetService();
        const data = yield profileController.getYearlyTargetById(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
router.post('/update', (0, validationMiddleware_1.validateDtoMiddleware)(TargetService_1.UpsertTarget), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, TargetService_1.UpsertTarget);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const targetService = new New_Target_controller_1.TargetService();
        const data = yield targetService.upsertTarget(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/list', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, TargetService_1.List);
        const targetService = new New_Target_controller_1.TargetService();
        const data = yield targetService.list(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
