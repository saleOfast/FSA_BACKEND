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
exports.StoreRoute = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const StoreService_1 = require("../../../../core/types/StoreService/StoreService");
const Store_Controller_1 = require("../../Controllers/StoreController/Store.Controller");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const router = express_1.default.Router();
exports.StoreRoute = router;
router.post('/create', (0, validationMiddleware_1.validateDtoMiddleware)(StoreService_1.CreateStore), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, StoreService_1.CreateStore);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const storeService = new Store_Controller_1.StoreService();
        const data = yield storeService.createStore(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/update', (0, validationMiddleware_1.validateDtoMiddleware)(StoreService_1.UpdateStore), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, StoreService_1.UpdateStore);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const storeService = new Store_Controller_1.StoreService();
        const data = yield storeService.update(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/delete/:storeId', (0, validationMiddleware_1.validateDtoMiddleware)(StoreService_1.DeleteStoreById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, StoreService_1.DeleteStoreById);
        const storeService = new Store_Controller_1.StoreService();
        const data = yield storeService.delete(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/storeList', (0, validationMiddleware_1.validateDtoMiddleware)(StoreService_1.StoreListFilter), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, StoreService_1.StoreListFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const storeService = new Store_Controller_1.StoreService();
        const data = yield storeService.storeList(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getStore', (0, validationMiddleware_1.validateDtoMiddleware)(StoreService_1.GetStoreById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, StoreService_1.GetStoreById);
        const storeService = new Store_Controller_1.StoreService();
        const data = yield storeService.getStoreById(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getStoreByType', (0, validationMiddleware_1.validateDtoMiddleware)(StoreService_1.GetStoreByType), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, StoreService_1.GetStoreByType);
        const storeService = new Store_Controller_1.StoreService();
        const data = yield storeService.getStoreByType(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/createCategory', (0, validationMiddleware_1.validateDtoMiddleware)(StoreService_1.CreateCategory), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, StoreService_1.CreateCategory);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const storeService = new Store_Controller_1.StoreService();
        const data = yield storeService.createCategory(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/categoryList', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const storeService = new Store_Controller_1.StoreService();
        const data = yield storeService.categoryList(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getCategoryById/:categoryId', (0, validationMiddleware_1.validateDtoMiddleware)(StoreService_1.GetCategoryById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, StoreService_1.GetCategoryById);
        const storeService = new Store_Controller_1.StoreService();
        const data = yield storeService.getCatoryById(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/updateCategory', (0, validationMiddleware_1.validateDtoMiddleware)(StoreService_1.UpdateCategory), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, StoreService_1.UpdateCategory);
        const storeService = new Store_Controller_1.StoreService();
        const data = yield storeService.udpateCategory(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/deleteCategory/:categoryId', (0, validationMiddleware_1.validateDtoMiddleware)(StoreService_1.DeleteCategoryById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, StoreService_1.DeleteCategoryById);
        const storeService = new Store_Controller_1.StoreService();
        const data = yield storeService.deleteCategory(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/add/importStore', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inputs = RequestHander_1.RequestHandler.Defaults.getBody(req);
        // Manually validate array of inputs
        if (!Array.isArray(inputs)) {
            return res.status(400).json({ message: 'Expected an array of stores.' });
        }
        for (const input of inputs) {
            const errors = (0, class_validator_1.validateSync)((0, class_transformer_1.plainToInstance)(StoreService_1.CreateStore, input));
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }
        }
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const storeService = new Store_Controller_1.StoreService();
        const results = yield storeService.createImportStores(inputs, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, results);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/importStoreCategories', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inputs = RequestHander_1.RequestHandler.Defaults.getBody(req);
        // Validate that the input is an array
        if (!Array.isArray(inputs)) {
            return res.status(400).json({ message: 'Expected an array of categories.' });
        }
        // Validate each input object
        for (const input of inputs) {
            const errors = (0, class_validator_1.validateSync)((0, class_transformer_1.plainToInstance)(StoreService_1.CreateCategory, input));
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }
        }
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const storeService = new Store_Controller_1.StoreService();
        // Process the array of categories
        const results = yield storeService.createCategories(inputs, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, results);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
