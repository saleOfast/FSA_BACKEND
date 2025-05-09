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
exports.LeaveCountRoute = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const LeaveCountController_1 = require("../../Controllers/LeaveController/LeaveCountController");
const LeaveCountService_1 = require("../../../../core/types/LeaveService/LeaveCountService");
const router = express_1.default.Router();
exports.LeaveCountRoute = router;
router.post('/addLeaveCount', (0, validationMiddleware_1.validateDtoMiddleware)(LeaveCountService_1.LeaveHeadCountC), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, LeaveCountService_1.LeaveHeadCountC);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const leaveCountService = new LeaveCountController_1.LeaveCountController();
        const data = yield leaveCountService.createLeaveCount(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getCount', (0, validationMiddleware_1.validateDtoMiddleware)(LeaveCountService_1.LeaveHeadCountR), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, LeaveCountService_1.LeaveHeadCountR);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const leaveCountService = new LeaveCountController_1.LeaveCountController();
        const data = yield leaveCountService.getLeaveHeadOfCurrentYear(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getLeaveCount/:headLeaveCntId', (0, validationMiddleware_1.validateDtoMiddleware)(LeaveCountService_1.LeaveHeadCountR), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, LeaveCountService_1.LeaveHeadCountR);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const leaveCountService = new LeaveCountController_1.LeaveCountController();
        const data = yield leaveCountService.getLeaveCount(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.put('/updateLeaveCount', (0, validationMiddleware_1.validateDtoMiddleware)(LeaveCountService_1.LeaveHeadCountU), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, LeaveCountService_1.LeaveHeadCountU);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const leaveCountService = new LeaveCountController_1.LeaveCountController();
        const data = yield leaveCountService.updateLeaveCount(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/deleteLeaveCount', (0, validationMiddleware_1.validateDtoMiddleware)(LeaveCountService_1.LeaveHeadCountD), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, LeaveCountService_1.LeaveHeadCountD);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const leaveCountService = new LeaveCountController_1.LeaveCountController();
        const data = yield leaveCountService.deleteLeaveCount(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
