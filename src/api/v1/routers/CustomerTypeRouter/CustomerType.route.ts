import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateCustomerType,
  UpdateCustomerType,
  DeleteCustomerTypeById,
  GetCustomerTypeById,
  CustomerTypeListFilter
} from "../../../../core/types/CustomerTypeService/CustomerTypeService";
import { CustomerTypeService } from "../../Controllers/CustomerTypeController/CustomerType.controller";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreateCustomerType), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: CreateCustomerType = RequestHandler.Defaults.getBody<CreateCustomerType>(req, CreateCustomerType);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const customerTypeService = new CustomerTypeService();
    const data = await customerTypeService.createCustomerType(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.post('/update', validateDtoMiddleware(UpdateCustomerType), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: UpdateCustomerType = RequestHandler.Defaults.getBody<UpdateCustomerType>(req, UpdateCustomerType);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const customerTypeService = new CustomerTypeService();
    const data = await customerTypeService.updateCustomerType(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.delete('/delete/:customerTypeId', validateDtoMiddleware(DeleteCustomerTypeById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: DeleteCustomerTypeById = RequestHandler.Defaults.getParams<DeleteCustomerTypeById>(req, DeleteCustomerTypeById);
    const customerTypeService = new CustomerTypeService();
    const data = await customerTypeService.deleteCustomerType(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/getById/:customerTypeId', validateDtoMiddleware(GetCustomerTypeById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: GetCustomerTypeById = RequestHandler.Defaults.getParams<GetCustomerTypeById>(req, GetCustomerTypeById);
    const customerTypeService = new CustomerTypeService();
    const data = await customerTypeService.getCustomerTypeById(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/list', validateDtoMiddleware(CustomerTypeListFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    // After validation middleware, the validated object is stored in req.body
    const input: CustomerTypeListFilter = req.body as CustomerTypeListFilter;
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const customerTypeService = new CustomerTypeService();
    const data = await customerTypeService.customerTypeList(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

export { router as CustomerTypeRoute };

