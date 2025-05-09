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
exports.LeaveApplicationRoute = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const userLeaveApplicationController_1 = require("../../Controllers/LeaveController/userLeaveApplicationController");
const userLeaveApplicationService_1 = require("../../../../core/types/LeaveService/userLeaveApplicationService");
const router = express_1.default.Router();
exports.LeaveApplicationRoute = router;
router.post('/add', (0, validationMiddleware_1.validateDtoMiddleware)(userLeaveApplicationService_1.CreateUserLeaveApplication), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, userLeaveApplicationService_1.CreateUserLeaveApplication);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new userLeaveApplicationController_1.LeaveApplicationController();
        const data = yield service.createUserLeaveApplication(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
// router.get('/getLeave', validateDtoMiddleware(HeadLeaveR), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: HeadLeaveR = RequestHandler.Defaults.getQuery<HeadLeaveR>(req, HeadLeaveR);
//         const payload: IUser = RequestHandler.Custom.getUser(req);
//         const leaveHeadService = new LeaveHeadController()
//         const data = await leaveHeadService.getLeadHead(input, payload);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });
router.get('/get', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, userLeaveApplicationService_1.GetUserLeaveApplication);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new userLeaveApplicationController_1.LeaveApplicationController();
        const data = yield service.getLeaveApplication(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.put('/update', (0, validationMiddleware_1.validateDtoMiddleware)(userLeaveApplicationService_1.UpdateLeaveApp), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, userLeaveApplicationService_1.UpdateLeaveApp);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new userLeaveApplicationController_1.LeaveApplicationController();
        const data = yield service.updateLeaveApplication(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/delete/:head_leave_id', (0, validationMiddleware_1.validateDtoMiddleware)(userLeaveApplicationService_1.DeleteUserLeaveAppl), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, userLeaveApplicationService_1.DeleteUserLeaveAppl);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new userLeaveApplicationController_1.LeaveApplicationController();
        const data = yield service.deleteLeaveApplication(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
