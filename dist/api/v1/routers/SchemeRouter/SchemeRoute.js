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
exports.SchemeRoute = void 0;
const express_1 = __importDefault(require("express"));
const catch_async_1 = __importDefault(require("../../../../core/utils/catch-async"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const SchemeService_1 = require("../../../../core/types/SchemeService/SchemeService");
const Scheme_controller_1 = require("../../Controllers/SchemeController/Scheme.controller");
const router = express_1.default.Router();
exports.SchemeRoute = router;
router.post('/create', (0, validationMiddleware_1.validateDtoMiddleware)(SchemeService_1.CreateScheme), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, SchemeService_1.CreateScheme);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const SchemeController = new Scheme_controller_1.SchemeService();
        const data = yield SchemeController.createScheme(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
router.get('/getActiveScheme', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const SchemeController = new Scheme_controller_1.SchemeService();
        const data = yield SchemeController.getScheme();
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
router.get('/schemeList', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, SchemeService_1.GetScheme);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const SchemeController = new Scheme_controller_1.SchemeService();
        const data = yield SchemeController.schemeList(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
router.post('/update', (0, validationMiddleware_1.validateDtoMiddleware)(SchemeService_1.UpdateScheme), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, SchemeService_1.UpdateScheme);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new Scheme_controller_1.SchemeService();
        const data = yield service.update(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
