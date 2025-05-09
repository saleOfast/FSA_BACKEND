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
exports.PolicyHeadTypeRouter = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const PolicyTypeHeadService_1 = require("../../../../core/types/PolicyTypeHeadService/PolicyTypeHeadService");
const PolicyHeadTypeController_1 = require("../../Controllers/PolicyHeadTypeController/PolicyHeadTypeController");
const router = express_1.default.Router();
exports.PolicyHeadTypeRouter = router;
router.post('/addPolicyType', (0, validationMiddleware_1.validateDtoMiddleware)(PolicyTypeHeadService_1.PolicyTypeHeadC), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, PolicyTypeHeadService_1.PolicyTypeHeadC);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const attendanceService = new PolicyHeadTypeController_1.PolicyHeadType();
        const data = yield attendanceService.addPolicyType(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getPolicyType/:policy_id', (0, validationMiddleware_1.validateDtoMiddleware)(PolicyTypeHeadService_1.PolicyTypeHeadR), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, PolicyTypeHeadService_1.PolicyTypeHeadR);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const attendanceService = new PolicyHeadTypeController_1.PolicyHeadType();
        const data = yield attendanceService.getPolicyHeadTypeIDWise(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getPolicyTypeById/:policy_type_id', (0, validationMiddleware_1.validateDtoMiddleware)(PolicyTypeHeadService_1.PolicyTypeHeadR), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, PolicyTypeHeadService_1.PolicyTypeHeadR);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new PolicyHeadTypeController_1.PolicyHeadType();
        const data = yield service.getPolicyTypeById(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.put('/updatePolicyType', (0, validationMiddleware_1.validateDtoMiddleware)(PolicyTypeHeadService_1.PolicyTypeHeadU), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, PolicyTypeHeadService_1.PolicyTypeHeadU);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const attendanceService = new PolicyHeadTypeController_1.PolicyHeadType();
        const data = yield attendanceService.editPolicyHeadType(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/deletePolicyType/:policy_type_id', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, PolicyTypeHeadService_1.PolicyTypeHeadD);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const attendanceService = new PolicyHeadTypeController_1.PolicyHeadType();
        const data = yield attendanceService.deletePolicyHeadType(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
