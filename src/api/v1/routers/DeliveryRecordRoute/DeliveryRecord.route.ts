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
  CreateDeliveryRecordDto,
  UpdateDeliveryRecordHeaderDto,
  UpdateDeliveryRecordItemDto,
  GetDeliveryRecordByIdDto,
  DeleteDeliveryRecordDto,
  ListDeliveryRecordDto,
  ListDeliveryRecordItemDto,
  GetDeliveryRecordItemByIdDto,
  DeleteDeliveryRecordItemDto,
} from "../../../../core/types/DeliveryRecordService/DeliveryRecordService";
import { DeliveryRecordService } from "../../Controllers/DeliveryRecordController/DeliveryRecord.Controller";

const router = express.Router();

// ---------- Delivery (Record) Header ----------
// Use auth first so 401 is returned when token is missing; then validate body (CreateDeliveryRecordDto expects only dispatchId).

router.post(
  "/create",
  validateDtoMiddleware(CreateDeliveryRecordDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getBody<CreateDeliveryRecordDto>(req, CreateDeliveryRecordDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryRecordService();
      const data = await service.createDeliveryRecord(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.put(
  "/update/:deliveryId",
  validateDtoMiddleware(UpdateDeliveryRecordHeaderDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
       const deliveryId = Number(req.params.deliveryId); 
      const input = RequestHandler.Defaults.getBody<UpdateDeliveryRecordHeaderDto>(req, UpdateDeliveryRecordHeaderDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryRecordService();
      const data = await service.updateDeliveryRecordHeader(deliveryId, input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/get/:deliveryId",
  validateDtoMiddleware(GetDeliveryRecordByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<GetDeliveryRecordByIdDto>(req, GetDeliveryRecordByIdDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryRecordService();
      const data = await service.getDeliveryRecordById(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/list",
  validateDtoMiddleware(ListDeliveryRecordDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getQuery<ListDeliveryRecordDto>(req, ListDeliveryRecordDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryRecordService();
      const data = await service.listDeliveryRecords(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.delete(
  "/delete/:deliveryId",
  validateDtoMiddleware(DeleteDeliveryRecordDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<DeleteDeliveryRecordDto>(req, DeleteDeliveryRecordDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryRecordService();
      const data = await service.deleteDeliveryRecord(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

// ---------- Delivery (Record) Items ----------

router.put(
  "/items/update",
  validateDtoMiddleware(UpdateDeliveryRecordItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getBody<UpdateDeliveryRecordItemDto>(req, UpdateDeliveryRecordItemDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryRecordService();
      const data = await service.updateDeliveryRecordItem(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/items/list",
  validateDtoMiddleware(ListDeliveryRecordItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getQuery<ListDeliveryRecordItemDto>(req, ListDeliveryRecordItemDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryRecordService();
      const data = await service.listDeliveryRecordItems(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/items/:deliveryItemId",
  validateDtoMiddleware(GetDeliveryRecordItemByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<GetDeliveryRecordItemByIdDto>(req, GetDeliveryRecordItemByIdDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryRecordService();
      const data = await service.getDeliveryRecordItemById(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.delete(
  "/items/delete/:deliveryItemId",
  validateDtoMiddleware(DeleteDeliveryRecordItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<DeleteDeliveryRecordItemDto>(req, DeleteDeliveryRecordItemDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryRecordService();
      const data = await service.deleteDeliveryRecordItem(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

export { router as DeliveryRecordRoute };
