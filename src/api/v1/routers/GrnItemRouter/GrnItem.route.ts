import express, { Request, Response } from "express";
import {
  AccessTokenService,
  ResponseHandler,
  validateDtoMiddleware,
} from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateGrnItemByIdsDto,
  DeleteGrnItemDto,
  GetGrnItemByIdDto,
  GrnItemListDto,
  ProcessGrnItemDto,
  UpdateGrnItemDto,
} from "../../../../core/types/GrnItemService/GrnItemService";
import { GrnItemService } from "../../Controllers/GrnItemController/GrnItemsController";

const router = express.Router();
const grnItemService = new GrnItemService();

// UI-driven create (Inventory & Batch already created/selected)
router.post(
  "/create",
  validateDtoMiddleware(CreateGrnItemByIdsDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: CreateGrnItemByIdsDto =
        RequestHandler.Defaults.getBody<CreateGrnItemByIdsDto>(
          req,
          CreateGrnItemByIdsDto
        );
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const data = await grnItemService.createGrnItemByIds(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

// Process a single GRN item:
// - Find/create Inventory by (skuId + warehouseId)
// - Find/create Batch by (inventoryId + batchNo)
// - Increment quantities in both Batch and Inventory
// router.post(
//   "/processItem",
//   validateDtoMiddleware(ProcessGrnItemDto),
//   AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
//   async (req: Request, res: Response) => {
//     try {
//       const input: ProcessGrnItemDto =
//         RequestHandler.Defaults.getBody<ProcessGrnItemDto>(
//           req,
//           ProcessGrnItemDto
//         );
//       const payload: IUser = RequestHandler.Custom.getUser(req);

//       const data = await grnItemService.processGrnItem(input, payload);
//       ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//       ResponseHandler.sendErrorResponse(res, error);
//     }
//   }
// );

// Get GRN Item by ID
router.get(
  "/getById/:grnItemId",
  validateDtoMiddleware(GetGrnItemByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: GetGrnItemByIdDto =
        RequestHandler.Defaults.getParams<GetGrnItemByIdDto>(
          req,
          GetGrnItemByIdDto
        );
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const data = await grnItemService.getGrnItemById(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

// List GRN Items
router.get(
  "/list",
  validateDtoMiddleware(GrnItemListDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: GrnItemListDto =
        RequestHandler.Defaults.getQuery<GrnItemListDto>(req, GrnItemListDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const data = await grnItemService.listGrnItems(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

// Update GRN Item (adjusts stock based on delta)
router.put(
  "/update",
  validateDtoMiddleware(UpdateGrnItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: UpdateGrnItemDto =
        RequestHandler.Defaults.getBody<UpdateGrnItemDto>(
          req,
          UpdateGrnItemDto
        );
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const data = await grnItemService.updateGrnItem(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

// Delete GRN Item (rolls back stock impact)
router.delete(
  "/delete/:grnItemId",
  validateDtoMiddleware(DeleteGrnItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: DeleteGrnItemDto =
        RequestHandler.Defaults.getParams<DeleteGrnItemDto>(
          req,
          DeleteGrnItemDto
        );
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const data = await grnItemService.deleteGrnItem(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

export { router as GrnItemRouter };

