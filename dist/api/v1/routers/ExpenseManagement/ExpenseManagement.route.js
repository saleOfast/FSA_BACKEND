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
exports.ExpenseManagementRouter = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const ExpenseManagement_1 = require("../../../../core/types/ExpenseManagement/ExpenseManagement");
const ExpenseManagementController_1 = require("../../Controllers/ExpenseManagementController/ExpenseManagementController");
const router = express_1.default.Router();
exports.ExpenseManagementRouter = router;
router.post('/add', (0, validationMiddleware_1.validateDtoMiddleware)(ExpenseManagement_1.ExpenseC), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ExpenseManagement_1.ExpenseC);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const expenseManagement = new ExpenseManagementController_1.ExpenseManagement();
        const data = yield expenseManagement.createExpenseManagement(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/get', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, ExpenseManagement_1.ExpenseR);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const expenseManagement = new ExpenseManagementController_1.ExpenseManagement();
        const data = yield expenseManagement.getExpenseManagement(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.put('/update', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ExpenseManagement_1.ExpenseU);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const expenseManagement = new ExpenseManagementController_1.ExpenseManagement();
        const data = yield expenseManagement.editExpenseManagement(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/delete', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, ExpenseManagement_1.ExpenseD);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const expenseManagement = new ExpenseManagementController_1.ExpenseManagement();
        const data = yield expenseManagement.deleteExpenseManagement(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
