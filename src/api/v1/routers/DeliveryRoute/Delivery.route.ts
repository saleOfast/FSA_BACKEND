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
  CreateDeliveryDto,
  UpdateDeliveryHeaderDto,
  UpdateDeliveryItemDto,
  GetDeliveryByIdDto,
  DeleteDeliveryDto,
  ListDeliveryDto,
  CreateDeliveryItemDto,
  CancelDeliveryDto,
  ListDeliveryItemDto,
  GetDeliveryItemByIdDto,
} from "../../../../core/types/DeliveryService/DeliveryService";
import { DeliveryService } from "../../Controllers/DeliveryController/Delivery.Controller";

const router = express.Router();

router.post(
  "/create",
  validateDtoMiddleware(CreateDeliveryDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getBody<CreateDeliveryDto>(req, CreateDeliveryDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.createDeliveryHeader(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.put(
  "/dispatch/:deliveryId",
  validateDtoMiddleware(UpdateDeliveryHeaderDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const deliveryId = req.params.deliveryId;
      const input = RequestHandler.Defaults.getBody<UpdateDeliveryHeaderDto>(req, UpdateDeliveryHeaderDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.dispatchDelivery(deliveryId, input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);



router.put(
  "/update/:deliveryId",
  validateDtoMiddleware(UpdateDeliveryHeaderDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const deliveryId = req.params.deliveryId;
      const input = RequestHandler.Defaults.getBody<UpdateDeliveryHeaderDto>(req, UpdateDeliveryHeaderDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.updateDeliveryHeader(deliveryId, input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.put(
  "/items/update",
  validateDtoMiddleware(UpdateDeliveryItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getBody<UpdateDeliveryItemDto>(req, UpdateDeliveryItemDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.updateDeliveryItem(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/get/:deliveryId",
  validateDtoMiddleware(GetDeliveryByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<GetDeliveryByIdDto>(req, GetDeliveryByIdDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.getDeliveryById(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/list",
  validateDtoMiddleware(ListDeliveryDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getQuery<ListDeliveryDto>(req, ListDeliveryDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.listDeliveries(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.delete(
  "/delete/:deliveryId",
  validateDtoMiddleware(DeleteDeliveryDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<DeleteDeliveryDto>(req, DeleteDeliveryDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.deleteDelivery(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);


router.post(
  "/:deliveryId/items/create",
  validateDtoMiddleware(CreateDeliveryItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const { deliveryId } = req.params;

      const input = RequestHandler.Defaults.getBody<CreateDeliveryItemDto>(
        req,
        CreateDeliveryItemDto
      );

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const service = new DeliveryService();

      const data = await service.createDeliveryItem(
        deliveryId,
        input,
        payload
      );

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

// Cancel a delivery
router.patch(
  "/cancel/:deliveryId",
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const { deliveryId } = req.params; // <-- get deliveryId from URL
      const input = { deliveryId } as CancelDeliveryDto;
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();

      const data = await service.cancelDelivery(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/items/list",
  validateDtoMiddleware(ListDeliveryItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getQuery<ListDeliveryItemDto>(
        req,
        ListDeliveryItemDto
      );
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.listDeliveryItems(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/items/:deliveryItemId",
  validateDtoMiddleware(GetDeliveryItemByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<GetDeliveryItemByIdDto>(
        req,
        GetDeliveryItemByIdDto
      );

      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.getDeliveryItemById(input,payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.delete('/items/delete/:deliveryItemId',
  validateDtoMiddleware(GetDeliveryItemByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<GetDeliveryItemByIdDto>(
        req,
        GetDeliveryItemByIdDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new DeliveryService();
      const data = await service.deleteDeliveryItem(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

export { router as DeliveryRoute };
