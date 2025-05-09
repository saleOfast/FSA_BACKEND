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
exports.LeaveRoute = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const LeaveController_1 = require("../../Controllers/LeaveController/LeaveController");
const LeaveService_1 = require("../../../../core/types/LeaveService/LeaveService");
const router = express_1.default.Router();
exports.LeaveRoute = router;
router.post('/addLeave', (0, validationMiddleware_1.validateDtoMiddleware)(LeaveService_1.HeadLeaveC), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, LeaveService_1.HeadLeaveC);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const leaveHeadService = new LeaveController_1.LeaveHeadController();
        const data = yield leaveHeadService.createLeadHead(input, payload);
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
router.get('/getLeave', (0, validationMiddleware_1.validateDtoMiddleware)(LeaveService_1.HeadLeaveR), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, LeaveService_1.HeadLeaveR);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const leaveHeadService = new LeaveController_1.LeaveHeadController();
        const data = yield leaveHeadService.getLeadHead(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getLeaveById/:head_leave_id', (0, validationMiddleware_1.validateDtoMiddleware)(LeaveService_1.HeadLeaveR), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, LeaveService_1.HeadLeaveR);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new LeaveController_1.LeaveHeadController();
        const data = yield service.getLeaveHeadById(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.put('/updateLeave', (0, validationMiddleware_1.validateDtoMiddleware)(LeaveService_1.HeadLeaveU), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, LeaveService_1.HeadLeaveU);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const leaveHeadService = new LeaveController_1.LeaveHeadController();
        const data = yield leaveHeadService.updateLeadHead(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/deleteLeave/:head_leave_id', (0, validationMiddleware_1.validateDtoMiddleware)(LeaveService_1.HeadLeaveD), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, LeaveService_1.HeadLeaveD);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const leaveHeadService = new LeaveController_1.LeaveHeadController();
        const data = yield leaveHeadService.deleteLeadHead(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
