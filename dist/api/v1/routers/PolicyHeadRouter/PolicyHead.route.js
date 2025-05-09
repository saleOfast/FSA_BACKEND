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
exports.PolicyHeadRouter = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const PolicyHeadService_1 = require("../../../../core/types/PolicyHeadService/PolicyHeadService");
const PolicyHeadController_1 = require("../../Controllers/PolicyHeadController/PolicyHeadController");
const router = express_1.default.Router();
exports.PolicyHeadRouter = router;
router.post('/addPolicyHead', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, PolicyHeadService_1.PolicyHeadC);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const policyHeadServices = new PolicyHeadController_1.PolicyHead();
        const data = yield policyHeadServices.createPolicyHead(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getPolicyHead', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, PolicyHeadService_1.PolicyHeadR);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const policyHeadServices = new PolicyHeadController_1.PolicyHead();
        const data = yield policyHeadServices.getPolicyHead(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getPolicyHeadById/:policy_id', (0, validationMiddleware_1.validateDtoMiddleware)(PolicyHeadService_1.PolicyHeadR), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, PolicyHeadService_1.PolicyHeadR);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new PolicyHeadController_1.PolicyHead();
        const data = yield service.getPolicyHeadById(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.put('/updatePolicyHead', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, PolicyHeadService_1.PolicyHeadU);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const policyHeadServices = new PolicyHeadController_1.PolicyHead();
        const data = yield policyHeadServices.editPolicyHead(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/deletePolicyHead/:policyId', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const input: DeleteBeat = RequestHandler.Defaults.getParams<DeleteBeat>(req, DeleteBeat);
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, PolicyHeadService_1.PolicyHeadD);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const policyHeadServices = new PolicyHeadController_1.PolicyHead();
        const data = yield policyHeadServices.deletePolicyHead(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
