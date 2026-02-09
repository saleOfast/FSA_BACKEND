import express, { Request, Response } from "express";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateInventoryBatchDto,
  GetInventoryBatchByIdDto,DeleteInventoryBatchByIdDto,
  GetInventoryBatchListDto,
  UpdateInventoryBatchDto} from "../../../../core/types/InventoryBatchService/InventoryBatchService";
import { InventoryBatchService } from "../../Controllers/InventoryBatchController/InventoryBatch";

const router = express.Router();
const inventoryBatchService = new InventoryBatchService();

router.post(
  "/create",
  validateDtoMiddleware(CreateInventoryBatchDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: CreateInventoryBatchDto = RequestHandler.Defaults.getBody<CreateInventoryBatchDto>(req, CreateInventoryBatchDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const data = await inventoryBatchService.createInventoryBatch(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.put(
  "/update",
  validateDtoMiddleware(UpdateInventoryBatchDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: UpdateInventoryBatchDto = RequestHandler.Defaults.getBody<UpdateInventoryBatchDto>(req, UpdateInventoryBatchDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const data = await inventoryBatchService.updateInventoryBatchById(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/getById",
  validateDtoMiddleware(GetInventoryBatchByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: GetInventoryBatchByIdDto = RequestHandler.Defaults.getQuery<GetInventoryBatchByIdDto>(req, GetInventoryBatchByIdDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const data = await inventoryBatchService.getInventoryBatchById(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/list",
  validateDtoMiddleware(GetInventoryBatchListDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: GetInventoryBatchListDto = RequestHandler.Defaults.getQuery<GetInventoryBatchListDto>(req, GetInventoryBatchListDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const data = await inventoryBatchService.getInventoryBatchList(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.delete(
  "/delete/:batchId",
  validateDtoMiddleware(DeleteInventoryBatchByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: DeleteInventoryBatchByIdDto = RequestHandler.Defaults.getParams<DeleteInventoryBatchByIdDto>(req, DeleteInventoryBatchByIdDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const data = await inventoryBatchService.DeleteInventoryBatch(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

export { router as BatchRoute };