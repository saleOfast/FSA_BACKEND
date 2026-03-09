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
  CreateDispatchDto,
  UpdateDispatchHeaderDto,
  UpdateDispatchItemDto,
  GetDispatchByIdDto,
  DeleteDispatchDto,
  ListDispatchDto,
  CreateDispatchItemDto,
  ListDispatchItemDto,
  GetDispatchItemByIdDto,
  DeleteDispatchItemDto,
} from "../../../../core/types/DispatchService/DispatchService";
import { DeliveryService } from "../../Controllers/DispatchController/Dispatch.Controller";

const router = express.Router();

// ---------- Dispatch Header ----------

router.post(
  "/create",
  validateDtoMiddleware(CreateDispatchDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getBody<CreateDispatchDto>(req, CreateDispatchDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.createDispatchHeader(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.put(
  "/update/:dispatchId",
  validateDtoMiddleware(UpdateDispatchHeaderDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const dispatchId = req.params.dispatchId;
      const input = RequestHandler.Defaults.getBody<UpdateDispatchHeaderDto>(req, UpdateDispatchHeaderDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.updateDispatchHeader(dispatchId, input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/get/:dispatchId",
  validateDtoMiddleware(GetDispatchByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<GetDispatchByIdDto>(req, GetDispatchByIdDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.getDispatchById(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/list",
  validateDtoMiddleware(ListDispatchDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getQuery<ListDispatchDto>(req, ListDispatchDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.listDispatches(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/for-delivery",
  validateDtoMiddleware(ListDispatchDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getQuery<ListDispatchDto>(req, ListDispatchDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.listDispatchesForDelivery(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.delete(
  "/delete/:dispatchId",
  validateDtoMiddleware(DeleteDispatchDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<DeleteDispatchDto>(req, DeleteDispatchDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.deleteDispatch(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

// ---------- Dispatch Items ----------

router.post(
  "/:dispatchId/items/create",
  validateDtoMiddleware(CreateDispatchItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const dispatchId = req.params.dispatchId;
      const input = RequestHandler.Defaults.getBody<CreateDispatchItemDto>(req, CreateDispatchItemDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.createDispatchItem(dispatchId, input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.put(
  "/items/update",
  validateDtoMiddleware(UpdateDispatchItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getBody<UpdateDispatchItemDto>(req, UpdateDispatchItemDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.updateDispatchItem(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/items/list",
  validateDtoMiddleware(ListDispatchItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getQuery<ListDispatchItemDto>(req, ListDispatchItemDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.listDispatchItems(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/items/:dispatchItemId",
  validateDtoMiddleware(GetDispatchItemByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<GetDispatchItemByIdDto>(req, GetDispatchItemByIdDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.getDispatchItemById(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.delete(
  "/items/delete/:dispatchItemId",
  validateDtoMiddleware(DeleteDispatchItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<DeleteDispatchItemDto>(req, DeleteDispatchItemDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.deleteDispatchItem(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

export { router as DispatchRoute };
