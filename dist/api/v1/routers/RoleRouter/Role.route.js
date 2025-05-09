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
exports.RoleRouter = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const ReasonService_1 = require("../../../../core/types/ReasonService/ReasonService");
const Role_controller_1 = require("../../../../api/v1/Controllers/RoleController/Role.controller");
const router = express_1.default.Router();
exports.RoleRouter = router;
router.post('/add', (0, validationMiddleware_1.validateDtoMiddleware)(ReasonService_1.CreateRole), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ReasonService_1.CreateRole);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new Role_controller_1.RoleService();
        const data = yield service.add(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/list', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, ReasonService_1.IsActiveRole);
        const service = new Role_controller_1.RoleService();
        const data = yield service.list(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/update', (0, validationMiddleware_1.validateDtoMiddleware)(ReasonService_1.UpdateRole), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ReasonService_1.UpdateRole);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new Role_controller_1.RoleService();
        const data = yield service.update(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getById/:roleId', (0, validationMiddleware_1.validateDtoMiddleware)(ReasonService_1.GetRole), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, ReasonService_1.GetRole);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new Role_controller_1.RoleService();
        const data = yield service.getRoleById(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/delete/:roleId', (0, validationMiddleware_1.validateDtoMiddleware)(ReasonService_1.DeleteRole), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, ReasonService_1.DeleteRole);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new Role_controller_1.RoleService();
        const data = yield service.delete(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
