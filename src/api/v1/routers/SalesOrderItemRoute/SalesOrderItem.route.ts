import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateSalesOrderItemDto,
  UpdateSalesOrderItemDto,
  GetSalesOrderItemById,
  DeleteSalesOrderItemById,
  GetSalesOrderItemsByOrderId,
  SalesOrderItemListFilter
} from '../../../../core/types/SalesOderItemService/salesOrderItemService';
import { SalesOrderItemService } from "../../Controllers/SalesOrderItemsController/salesOrderItem.Controller";

const router = express.Router();

// Create
router.post('/create', validateDtoMiddleware(CreateSalesOrderItemDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: CreateSalesOrderItemDto = RequestHandler.Defaults.getBody<CreateSalesOrderItemDto>(req, CreateSalesOrderItemDto);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const service = new SalesOrderItemService();
    const data = await service.createSalesOrderItem(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

// Update
router.post('/update', validateDtoMiddleware(UpdateSalesOrderItemDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: UpdateSalesOrderItemDto = RequestHandler.Defaults.getBody<UpdateSalesOrderItemDto>(req, UpdateSalesOrderItemDto);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const service = new SalesOrderItemService();
    const data = await service.updateSalesOrderItem(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

// Get by ID
router.get('/getById/:id', validateDtoMiddleware(GetSalesOrderItemById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: GetSalesOrderItemById = RequestHandler.Defaults.getParams<GetSalesOrderItemById>(req, GetSalesOrderItemById);
    const service = new SalesOrderItemService();
    const data = await service.getSalesOrderItemById(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

// Delete
router.delete('/delete/:id', validateDtoMiddleware(DeleteSalesOrderItemById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: DeleteSalesOrderItemById = RequestHandler.Defaults.getParams<DeleteSalesOrderItemById>(req, DeleteSalesOrderItemById);
    const service = new SalesOrderItemService();
    const data = await service.deleteSalesOrderItem(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

// Get items by Sales Order ID
// router.get('/getByOrderId/:salesOrderId', validateDtoMiddleware(GetSalesOrderItemsByOrderId), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//   try {
//     const input: GetSalesOrderItemsByOrderId = RequestHandler.Defaults.getParams<GetSalesOrderItemsByOrderId>(req, GetSalesOrderItemsByOrderId);
//     const service = new SalesOrderItemService();
//     const data = await service.getSalesOrderItemsByOrderId(input);
//     ResponseHandler.sendResponse(res, data);
//   } catch (error) {
//     ResponseHandler.sendErrorResponse(res, error);
//   }
// });

// List with pagination
router.get('/list', validateDtoMiddleware(SalesOrderItemListFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: SalesOrderItemListFilter = RequestHandler.Defaults.getQuery<SalesOrderItemListFilter>(req, SalesOrderItemListFilter);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const service = new SalesOrderItemService();
    const data = await service.salesOrderItemList(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

export { router as SalesOrderItemRoute };