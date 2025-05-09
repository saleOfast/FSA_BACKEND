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
exports.VisitRoute = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const VisitService_1 = require("../../../../core/types/VisitService/VisitService");
const Visit_controller_1 = require("../../Controllers/VisitController/Visit.controller");
const router = express_1.default.Router();
exports.VisitRoute = router;
router.post('/create', (0, validationMiddleware_1.validateDtoMiddleware)(VisitService_1.CreateVisit), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, VisitService_1.CreateVisit);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const visitService = new Visit_controller_1.VisitService();
        const data = yield visitService.createVisit(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/visitList', (0, validationMiddleware_1.validateDtoMiddleware)(VisitService_1.VisitListFilter), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, VisitService_1.VisitListFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const visitService = new Visit_controller_1.VisitService();
        const data = yield visitService.visitList(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getVisit/:visitId', (0, validationMiddleware_1.validateDtoMiddleware)(VisitService_1.GetVisitById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, VisitService_1.GetVisitById);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const visitService = new Visit_controller_1.VisitService();
        const data = yield visitService.getVisitById(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/updateImage', (0, validationMiddleware_1.validateDtoMiddleware)(VisitService_1.UpdateImage), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, VisitService_1.UpdateImage);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const visitService = new Visit_controller_1.VisitService();
        const data = yield visitService.updateImage(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/checkIn', (0, validationMiddleware_1.validateDtoMiddleware)(VisitService_1.CheckInRequest), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, VisitService_1.CheckInRequest);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const visitService = new Visit_controller_1.VisitService();
        const data = yield visitService.checkIn(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/checkOut', (0, validationMiddleware_1.validateDtoMiddleware)(VisitService_1.CheckOutRequest), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, VisitService_1.CheckOutRequest);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const visitService = new Visit_controller_1.VisitService();
        const data = yield visitService.checkOut(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/day-track-report', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, VisitService_1.dayTrackingFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const dayTrackingService = new Visit_controller_1.VisitService();
        const data = yield dayTrackingService.dayTrackingReport(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.put('/update/no-order-reason', (0, validationMiddleware_1.validateDtoMiddleware)(VisitService_1.UpdateVisitByNoOrder), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, VisitService_1.UpdateVisitByNoOrder);
        const service = new Visit_controller_1.VisitService();
        const data = yield service.updateOrderBySpecialDiscount(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/past-no-order', (0, validationMiddleware_1.validateDtoMiddleware)(VisitService_1.PastNoOrderList), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, VisitService_1.PastNoOrderList);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const visitService = new Visit_controller_1.VisitService();
        const data = yield visitService.getPastNoOrder(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/picture', (0, validationMiddleware_1.validateDtoMiddleware)(VisitService_1.PictureList), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, VisitService_1.PictureList);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const visitService = new Visit_controller_1.VisitService();
        const data = yield visitService.getPictureByStoreId(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/visitReport', (0, validationMiddleware_1.validateDtoMiddleware)(VisitService_1.VisitListFilter), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visitService = new Visit_controller_1.VisitService();
        const data = yield visitService.visitReport();
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
// router.put('/track/activity', validateDtoMiddleware(UpdateActivityById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: UpdateActivityById = RequestHandler.Defaults.getBody<UpdateActivityById>(req, UpdateActivityById);
//         const service = new VisitService();
//         const data = await service.updateActivity(input);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });
router.post('/import', (0, validationMiddleware_1.validateDtoMiddleware)([VisitService_1.CreateVisit]), // Validate an array of CreateVisit DTOs
validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the array of visits from the request body
        const inputs = RequestHander_1.RequestHandler.Defaults.getBody(req);
        // Get the user payload
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        // Create an instance of VisitService and handle the array of visits
        const visitService = new Visit_controller_1.VisitService();
        const data = yield visitService.createMultipleVisits(inputs, payload);
        // Send the response back
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        // Handle any errors
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
