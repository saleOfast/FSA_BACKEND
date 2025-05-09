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
exports.BrandRouter = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const BrandService_1 = require("../../../../core/types/BrandService/BrandService");
const Brand_controller_1 = require("../../Controllers/BrandController/Brand.controller");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const router = express_1.default.Router();
exports.BrandRouter = router;
router.post('/add', (0, validationMiddleware_1.validateDtoMiddleware)(BrandService_1.CreateBrand), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, BrandService_1.CreateBrand);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const brandService = new Brand_controller_1.BrandService();
        const data = yield brandService.add(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/list', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, BrandService_1.GetBrandList);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const brandService = new Brand_controller_1.BrandService();
        const data = yield brandService.list(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/update', (0, validationMiddleware_1.validateDtoMiddleware)(BrandService_1.UpdateBrand), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, BrandService_1.UpdateBrand);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const brandService = new Brand_controller_1.BrandService();
        const data = yield brandService.update(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getById/:brandId', (0, validationMiddleware_1.validateDtoMiddleware)(BrandService_1.GetBrand), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, BrandService_1.GetBrand);
        const query = RequestHander_1.RequestHandler.Defaults.getQuery(req, BrandService_1.GetBrandList);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const brandService = new Brand_controller_1.BrandService();
        const data = yield brandService.getBrandById(payload, input, query);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/delete/:brandId', (0, validationMiddleware_1.validateDtoMiddleware)(BrandService_1.DeleteBrand), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, BrandService_1.DeleteBrand);
        const query = RequestHander_1.RequestHandler.Defaults.getQuery(req, BrandService_1.GetBrandList);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const brandService = new Brand_controller_1.BrandService();
        const data = yield brandService.delete(payload, input, query);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/import', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the array of CreateBrand inputs from the request body
        const inputs = RequestHander_1.RequestHandler.Defaults.getBody(req);
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, BrandService_1.GetBrandList);
        // Validate if the input is an array
        if (!Array.isArray(inputs)) {
            return res.status(400).json({ message: 'Expected an array of brands.' });
        }
        // Validate each input in the array manually
        for (const input of inputs) {
            const errors = (0, class_validator_1.validateSync)((0, class_transformer_1.plainToInstance)(BrandService_1.CreateBrand, input));
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }
        }
        // Retrieve user payload from request
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        // Instantiate the BrandService
        const brandService = new Brand_controller_1.BrandService();
        // Call the service to handle multiple brand creation
        const results = yield brandService.addMultipleBrands(inputs, payload, input.isCompetitor);
        // Send the successful response with the results
        validationMiddleware_1.ResponseHandler.sendResponse(res, results);
    }
    catch (error) {
        // Send error response in case of failure
        console.error("Error while adding multiple brands:", error);
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
