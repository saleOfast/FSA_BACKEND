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
const Inventory_controller_1 = require("../../Controllers/InventoryController/Inventory.controller");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const common_1 = require("../../../../core/types/Constent/common");
const InventoryService_1 = require("../../../../core/types/InventoryService/InventoryService");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.InventoryRouter = router;
router.get('/getList/:storeId', (0, validationMiddleware_1.validateDtoMiddleware)(InventoryService_1.GetInventoryList), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, InventoryService_1.GetInventoryList);
        const inventoryService = new Inventory_controller_1.InventoryService();
        const data = yield inventoryService.getInventoryByStoreId(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.put('/update', (0, validationMiddleware_1.validateDtoMiddleware)(InventoryService_1.UpdateInventoryDto), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, InventoryService_1.UpdateInventoryDto);
        const inventoryService = new Inventory_controller_1.InventoryService();
        const data = yield inventoryService.updateInventory(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
