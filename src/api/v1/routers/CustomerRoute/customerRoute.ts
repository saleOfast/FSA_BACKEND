import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { STATUSCODES } from "../../../../core/types/Constent/common";
import {CustomerService} from "../../Controllers/CustomerController/Customer.Controller"
import {CreateCustomerDto,UpdateCustomerDto,deleteCustomerDto,ListCustomersDto,GetStoresByStatusDto,GetCustomerByIdDto} from "../../../../core/types/CustomerService/CustomerService"

const router = express.Router();

router.post('/create',validateDtoMiddleware(CreateCustomerDto),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) =>{
    try{
        const input:CreateCustomerDto= RequestHandler.Defaults.getBody<CreateCustomerDto>(req, CreateCustomerDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const customerService = new CustomerService();
        const data = await customerService.createCustomer(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
})

router.put('/update',validateDtoMiddleware(UpdateCustomerDto ),AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),async (req:Request, res:Response)=>{
    try{
         const input:UpdateCustomerDto = RequestHandler.Defaults.getBody<UpdateCustomerDto>(req, UpdateCustomerDto );
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const customerService = new CustomerService();
        const data = await customerService.updateCustomer(input, payload);
        ResponseHandler.sendResponse(res, data);
    }
    catch(error){
        ResponseHandler.sendErrorResponse(res,error);
      console.log(error)
    }
})

router.delete(
  "/delete/:id",
  validateDtoMiddleware(deleteCustomerDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const payload: IUser = RequestHandler.Custom.getUser(req);

      // Extract the ID from the route params and create the input DTO
      const input: deleteCustomerDto = { id: req.params.id };

      const customerService = new CustomerService();
      const data = await customerService.deleteCustomer(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      console.log(error);
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/listCustomers",
  validateDtoMiddleware(ListCustomersDto),  // Validate query params
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), // Auth middleware
  async (req: Request, res: Response) => {
    try {
      // Extract query params & user payload
      const input: ListCustomersDto = RequestHandler.Defaults.getQuery<ListCustomersDto>(req, ListCustomersDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);

      // Call service
      const customerService = new CustomerService();
      const data = await customerService.listCustomers(input, payload);

      // Send response
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);


router.get(
  "/getCustomerStatus",
  validateDtoMiddleware(GetStoresByStatusDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: GetStoresByStatusDto =
        RequestHandler.Defaults.getQuery<GetStoresByStatusDto>(
          req,
      GetStoresByStatusDto
        );

      const customerService = new CustomerService();
      const data = await customerService.getCustomersByStatus(input);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/getCustomer",
  validateDtoMiddleware(GetCustomerByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {

           const payload: IUser = RequestHandler.Custom.getUser(req);
      const input: GetCustomerByIdDto = RequestHandler.Defaults.getQuery<GetCustomerByIdDto>(
        req,
        GetCustomerByIdDto,
      );

      const customerService = new CustomerService();
      const data = await customerService.getCustomerById(input,payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);





export { router as CustomerRoute };