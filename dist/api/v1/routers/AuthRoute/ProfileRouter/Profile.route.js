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
exports.ProfileRoute = void 0;
const express_1 = __importDefault(require("express"));
const catch_async_1 = __importDefault(require("../../../../../core/utils/catch-async"));
const validationMiddleware_1 = require("../../../../../core/helper/validationMiddleware");
const AuthService_1 = require("../../../../../core/types/AuthService/AuthService");
const RequestHander_1 = require("../../../../../core/helper/RequestHander");
const common_1 = require("../../../../../core/types/Constent/common");
const Profile_Controller_1 = require("../../../Controllers/AuthController/ProfileController/Profile.Controller");
const router = express_1.default.Router();
exports.ProfileRoute = router;
router.get('/get', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const profileController = new Profile_Controller_1.profileService();
        const data = yield profileController.getProfile(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
router.put('/updateProfile', (0, validationMiddleware_1.validateDtoMiddleware)(AuthService_1.UpdateUserProfile), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, AuthService_1.UpdateUserProfile);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const profileController = new Profile_Controller_1.profileService();
        const data = yield profileController.updateImage(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
router.get('/dashboard', (0, validationMiddleware_1.validateDtoMiddleware)(AuthService_1.DashboardFilter), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, AuthService_1.DashboardFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const profileController = new Profile_Controller_1.profileService();
        const data = yield profileController.dashboard(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
router.get('/retailor/dashboard', (0, validationMiddleware_1.validateDtoMiddleware)(AuthService_1.DashboardFilter), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, AuthService_1.DashboardFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const profileController = new Profile_Controller_1.profileService();
        const data = yield profileController.retailorDashboard(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
router.get('/admin/dashboard', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, AuthService_1.DashboardFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const profileController = new Profile_Controller_1.profileService();
        const data = yield profileController.adminDashboard(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
router.get('/admin/dashboard/revenue-chart', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const profileController = new Profile_Controller_1.profileService();
        const data = yield profileController.revenueChart(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
router.post('/admin/update/approvalStore', (0, validationMiddleware_1.validateDtoMiddleware)(AuthService_1.UpdateApprovalStore), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, AuthService_1.UpdateApprovalStore);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const profileController = new Profile_Controller_1.profileService();
        const data = yield profileController.updateApprovalStore(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.put('/deleteProfilePic/:empId', (0, validationMiddleware_1.validateDtoMiddleware)(AuthService_1.DeleteUserProfile), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, AuthService_1.DeleteUserProfile);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const profileController = new Profile_Controller_1.profileService();
        const data = yield profileController.deleteProfile(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
router.get('/home/today-achievement', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const input: dayTrackingFilter = RequestHandler.Defaults.getQuery<dayTrackingFilter>(req, dayTrackingFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new Profile_Controller_1.profileService();
        const data = yield service.homeTodayAchievement(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/home/today-order-value', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const input: dayTrackingFilter = RequestHandler.Defaults.getQuery<dayTrackingFilter>(req, dayTrackingFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new Profile_Controller_1.profileService();
        const data = yield service.homeTodayOrderValue(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/home/month-achievement', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const input: dayTrackingFilter = RequestHandler.Defaults.getQuery<dayTrackingFilter>(req, dayTrackingFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new Profile_Controller_1.profileService();
        const data = yield service.homeCurrentMonthAchievement(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
