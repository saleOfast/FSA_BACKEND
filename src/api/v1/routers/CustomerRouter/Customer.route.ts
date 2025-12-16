import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateCustomer,
  UpdateCustomer,
  DeleteCustomerById,
  GetCustomerById,
  CustomerListFilter
} from "../../../../core/types/CustomerService/CustomerService";
import { CustomerService } from "../../Controllers/CustomerController/Customer.controller";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreateCustomer), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: CreateCustomer = RequestHandler.Defaults.getBody<CreateCustomer>(req, CreateCustomer);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const customerService = new CustomerService();
    const data = await customerService.createCustomer(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.post('/update', validateDtoMiddleware(UpdateCustomer), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: UpdateCustomer = RequestHandler.Defaults.getBody<UpdateCustomer>(req, UpdateCustomer);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const customerService = new CustomerService();
    const data = await customerService.updateCustomer(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.delete('/delete/:customerId', validateDtoMiddleware(DeleteCustomerById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: DeleteCustomerById = RequestHandler.Defaults.getParams<DeleteCustomerById>(req, DeleteCustomerById);
    const customerService = new CustomerService();
    const data = await customerService.deleteCustomer(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/getById/:customerId', validateDtoMiddleware(GetCustomerById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: GetCustomerById = RequestHandler.Defaults.getParams<GetCustomerById>(req, GetCustomerById);
    const customerService = new CustomerService();
    const data = await customerService.getCustomerById(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/list', validateDtoMiddleware(CustomerListFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: CustomerListFilter = RequestHandler.Defaults.getQuery<CustomerListFilter>(req, CustomerListFilter);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const customerService = new CustomerService();
    const data = await customerService.customerList(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

export { router as CustomerRoute };

