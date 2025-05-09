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
exports.SizeRouter = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const ReasonService_1 = require("../../../../core/types/ReasonService/ReasonService");
const Size_controller_1 = require("../../../../api/v1/Controllers/SizeController/Size.controller");
const router = express_1.default.Router();
exports.SizeRouter = router;
router.post('/add', (0, validationMiddleware_1.validateDtoMiddleware)(ReasonService_1.CreateSize), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ReasonService_1.CreateSize);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new Size_controller_1.SizeService();
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
        const service = new Size_controller_1.SizeService();
        const data = yield service.list(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/update', (0, validationMiddleware_1.validateDtoMiddleware)(ReasonService_1.UpdateSize), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ReasonService_1.UpdateSize);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new Size_controller_1.SizeService();
        const data = yield service.update(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getById/:sizeId', (0, validationMiddleware_1.validateDtoMiddleware)(ReasonService_1.GetSize), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, ReasonService_1.GetSize);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new Size_controller_1.SizeService();
        const data = yield service.getSizeById(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/delete/:sizeId', (0, validationMiddleware_1.validateDtoMiddleware)(ReasonService_1.DeleteSize), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, ReasonService_1.DeleteSize);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new Size_controller_1.SizeService();
        const data = yield service.delete(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/import', (0, validationMiddleware_1.validateDtoMiddleware)(ReasonService_1.CreateSize), // Validate an array of CreateSize DTOs
validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the array of sizes from the request body
        const inputs = RequestHander_1.RequestHandler.Defaults.getBody(req);
        // Get the user payload
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        // Create an instance of the SizeService and pass the array of sizes
        const sizeService = new Size_controller_1.SizeService();
        const data = yield sizeService.addMultiple(inputs, payload); // Ensure `addMultiple` method exists
        // Send the response back
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        // Handle any errors
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
