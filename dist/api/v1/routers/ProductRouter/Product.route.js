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
exports.ProductRoute = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const ProductService_1 = require("../../../../core/types/ProductService/ProductService");
const common_1 = require("../../../../core/types/Constent/common");
const Product_controller_1 = require("../../Controllers/ProductController/Product.controller");
const router = express_1.default.Router();
exports.ProductRoute = router;
router.post('/add', (0, validationMiddleware_1.validateDtoMiddleware)(ProductService_1.CreateProductRequest), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ProductService_1.CreateProductRequest);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const productService = new Product_controller_1.ProductService();
        const data = yield productService.createProduct(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/update', (0, validationMiddleware_1.validateDtoMiddleware)(ProductService_1.UpdateProductRequest), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ProductService_1.UpdateProductRequest);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const productService = new Product_controller_1.ProductService();
        const data = yield productService.updateProduct(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getById/:productId', (0, validationMiddleware_1.validateDtoMiddleware)(ProductService_1.GetProductById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ProductService_1.GetProductById);
        const productService = new Product_controller_1.ProductService();
        const data = yield productService.getById(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/list', (0, validationMiddleware_1.validateDtoMiddleware)(ProductService_1.GetProductListRequest), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, ProductService_1.GetProductListRequest);
        const productService = new Product_controller_1.ProductService();
        const data = yield productService.list(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/delete/:productId', (0, validationMiddleware_1.validateDtoMiddleware)(ProductService_1.DeleteProductById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ProductService_1.DeleteProductById);
        const productService = new Product_controller_1.ProductService();
        const data = yield productService.deleteProduct(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
/**
 * Product Category Routes
 */
router.post('/category/add', (0, validationMiddleware_1.validateDtoMiddleware)(ProductService_1.CreateProductCategory), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ProductService_1.CreateProductCategory);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const productService = new Product_controller_1.ProductService();
        const data = yield productService.createProductCategory(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/category/list', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productService = new Product_controller_1.ProductService();
        const data = yield productService.categoryList();
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/category/getById/:catId', (0, validationMiddleware_1.validateDtoMiddleware)(ProductService_1.GetCategoryById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ProductService_1.GetCategoryById);
        const productService = new Product_controller_1.ProductService();
        const data = yield productService.getCategoryById(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.put('/category/update', (0, validationMiddleware_1.validateDtoMiddleware)(ProductService_1.UpdateCategoryById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ProductService_1.UpdateCategoryById);
        const productService = new Product_controller_1.ProductService();
        const data = yield productService.updateCategory(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.delete('/category/delete/:catId', (0, validationMiddleware_1.validateDtoMiddleware)(ProductService_1.DeleteCategoryById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, ProductService_1.DeleteCategoryById);
        const productService = new Product_controller_1.ProductService();
        const data = yield productService.deleteCategoryById(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/import', (0, validationMiddleware_1.validateDtoMiddleware)(ProductService_1.CreateProductRequest), // Validate a single product DTO
validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Directly get the array of products from the request body
        const inputs = RequestHander_1.RequestHandler.Defaults.getBody(req);
        // Get the user payload
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        // Create an instance of the ProductService and pass the array of products
        const productService = new Product_controller_1.ProductService();
        const data = yield productService.createProducts(inputs, payload);
        // Send the response back
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        // Handle any errors
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/category/import', (0, validationMiddleware_1.validateDtoMiddleware)(ProductService_1.CreateProductCategory), // Validate an array of category DTOs
validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Directly get the array of categories from the request body
        const inputs = RequestHander_1.RequestHandler.Defaults.getBody(req);
        // Get the user payload
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        // Create an instance of the ProductService and pass the array of categories
        const productService = new Product_controller_1.ProductService();
        const data = yield productService.createImportProductCategories(inputs, payload);
        // Send the response back
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        // Handle any errors
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
