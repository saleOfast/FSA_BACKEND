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
exports.PaymentRouter = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const PaymentService_1 = require("../../../../core/types/PaymentService/PaymentService");
const Payment_controller_1 = require("../../../../api/v1/Controllers/PaymentController/Payment.controller");
const router = express_1.default.Router();
exports.PaymentRouter = router;
router.post('/addByCash', (0, validationMiddleware_1.validateDtoMiddleware)(PaymentService_1.OrderPayment), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, PaymentService_1.OrderPayment);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const paymentService = new Payment_controller_1.PaymentService();
        const data = yield paymentService.addByCash(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/addByOnline', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, PaymentService_1.OnlinePayment);
        // const payload: IUser = RequestHandler.Custom.getUser(req);
        const paymentService = new Payment_controller_1.PaymentService();
        const data = yield paymentService.addByOnline(input);
        console.log({ data });
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/paymentCapture', (0, validationMiddleware_1.validateDtoMiddleware)(PaymentService_1.OrderPayment), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, PaymentService_1.OnlinePayment);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const paymentService = new Payment_controller_1.PaymentService();
        const data = yield paymentService.paymentCapture(input, payload);
        console.log({ data });
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/recordByOrderId/:orderId', (0, validationMiddleware_1.validateDtoMiddleware)(PaymentService_1.GetPayment), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, PaymentService_1.GetPayment);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const paymentService = new Payment_controller_1.PaymentService();
        const data = yield paymentService.getPaymentHistoryByOrderID(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
