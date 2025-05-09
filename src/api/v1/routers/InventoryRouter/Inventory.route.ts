import { InventoryService } from "../../Controllers/InventoryController/Inventory.controller";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { GetInventoryList, UpdateInventoryDto } from "../../../../core/types/InventoryService/InventoryService";
import express, { Request, Response } from "express";

const router = express.Router();

router.get('/getList/:storeId', validateDtoMiddleware(GetInventoryList), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetInventoryList = RequestHandler.Defaults.getParams<GetInventoryList>(req, GetInventoryList);
        const inventoryService = new InventoryService();
        const data = await inventoryService.getInventoryByStoreId(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/update', validateDtoMiddleware(UpdateInventoryDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateInventoryDto = RequestHandler.Defaults.getBody<UpdateInventoryDto>(req, UpdateInventoryDto);
        const inventoryService = new InventoryService();
        const data = await inventoryService.updateInventory(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as InventoryRouter }