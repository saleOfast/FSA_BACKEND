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
exports.ActivityRouter = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const ActivitiesService_1 = require("../../../../core/types/ActivitiesService/ActivitiesService");
const ActivitiesController_1 = require("../../Controllers/ActivitiesController/ActivitiesController");
const router = express_1.default.Router();
exports.ActivityRouter = router;
router.post('/addActivities', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ActivitiesService_1.ActivitiesC);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const ActivitiesServices = new ActivitiesController_1.Activities();
        const data = yield ActivitiesServices.createActivities(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getActivities', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, ActivitiesService_1.ActivitiesR);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const ActivitiesServices = new ActivitiesController_1.Activities();
        const data = yield ActivitiesServices.getActivities(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getActivitiesById/:activityId', (0, validationMiddleware_1.validateDtoMiddleware)(ActivitiesService_1.ActivitiesR), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, ActivitiesService_1.ActivitiesR);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new ActivitiesController_1.Activities();
        const data = yield service.getActivitiesById(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.put('/updateActivities', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ActivitiesService_1.ActivitiesU);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const ActivitiesServices = new ActivitiesController_1.Activities();
        const data = yield ActivitiesServices.editActivities(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/deleteActivities/:activityId', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, ActivitiesService_1.ActivitiesD);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const ActivitiesServices = new ActivitiesController_1.Activities();
        const data = yield ActivitiesServices.deleteActivities(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
