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
exports.InventoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const inventory_1 = require("../../Controllers/inventory/inventory");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const common_1 = require("../../../../core/types/Constent/common");
const InventoryService_1 = require("../../../../core/types/InventoryService/InventoryService");
const router = express_1.default.Router();
exports.InventoryRouter = router;
const inventoryService = new inventory_1.InventoryService();
// =======================
// CREATE INVENTORY
// =======================
router.post("/create", (0, validationMiddleware_1.validateDtoMiddleware)(InventoryService_1.CreateInventoryDto), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, InventoryService_1.CreateInventoryDto);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const data = yield inventoryService.createInventory(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
// =======================
// GET INVENTORY LIST
// =======================
router.get("/getAll", validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const data = yield inventoryService.getAllInventory(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get("/getList/:warehouseId", (0, validationMiddleware_1.validateDtoMiddleware)(InventoryService_1.GetInventoryList), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, InventoryService_1.GetInventoryList);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const data = yield inventoryService.getInventory(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get("/getById/:inventoryId", (0, validationMiddleware_1.validateDtoMiddleware)(InventoryService_1.GetInventoryById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, InventoryService_1.GetInventoryById);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const data = yield inventoryService.getInventoryById(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
// =======================
// UPDATE INVENTORY
// =======================
router.put("/update", (0, validationMiddleware_1.validateDtoMiddleware)(InventoryService_1.UpdateInventoryDto), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, InventoryService_1.UpdateInventoryDto);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const data = yield inventoryService.updateInventory(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
// =======================
// DELETE INVENTORY
// =======================
router.delete("/delete", (0, validationMiddleware_1.validateDtoMiddleware)(InventoryService_1.DeleteInventoryDto), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, InventoryService_1.DeleteInventoryDto);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const data = yield inventoryService.deleteInventory(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
