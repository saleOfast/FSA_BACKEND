import express, { Request, Response } from "express";
import { InventoryService } from "../../Controllers/inventory/inventory";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { 
  CreateInventoryDto,
  InventoryItemDto,
  UpdateInventoryDto,
  DeleteInventoryDto,
  GetInventoryList
} from "../../../../core/types/InventoryService/InventoryService";

const router = express.Router();
const inventoryService = new InventoryService();

// =======================
// CREATE INVENTORY
// =======================
router.post(
  "/create",
  validateDtoMiddleware(CreateInventoryDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: CreateInventoryDto = RequestHandler.Defaults.getBody<CreateInventoryDto>(req, CreateInventoryDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const data = await inventoryService.createInventory(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

// =======================
// GET INVENTORY LIST
// =======================
router.get(
  "/getAll",
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const data = await inventoryService.getAllInventory(payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);


router.get(
  "/getList/:warehouseId",
  validateDtoMiddleware(GetInventoryList),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: GetInventoryList = RequestHandler.Defaults.getParams<GetInventoryList>(req, GetInventoryList);
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const data = await inventoryService.getInventory(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);




// =======================
// UPDATE INVENTORY
// =======================
router.put(
  "/update",
  validateDtoMiddleware(UpdateInventoryDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: UpdateInventoryDto = RequestHandler.Defaults.getBody<UpdateInventoryDto>(req, UpdateInventoryDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const data = await inventoryService.updateInventory(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

// =======================
// DELETE INVENTORY
// =======================
router.delete(
  "/delete",
  validateDtoMiddleware(DeleteInventoryDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: DeleteInventoryDto = RequestHandler.Defaults.getBody<DeleteInventoryDto>(req, DeleteInventoryDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const data = await inventoryService.deleteInventory(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

export { router as InventoryRouter };
