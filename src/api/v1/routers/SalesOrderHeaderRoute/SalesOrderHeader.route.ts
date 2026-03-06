import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {CreateSalesOrderDto,UpdateSalesOrderDto,DeleteSalesOrderDto,GetSalesOrderByIdDto,ListSalesOrderDto, ListApprovedOrdersForDeliveryDto} from "../../../../core/types/SalesOrderHeaderService/SalesOrderHeaderService"
import {SalesOrderHeaderService}from "../../Controllers/SalesOrderHeaderController/SalesOrderHeader.Controller"

const router = express.Router();

router.post(
  "/create",
  validateDtoMiddleware(CreateSalesOrderDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: CreateSalesOrderDto =
        RequestHandler.Defaults.getBody<CreateSalesOrderDto>(
          req,
          CreateSalesOrderDto
        );

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const salesOrderHeaderService = new SalesOrderHeaderService();

      const data = await salesOrderHeaderService.createSalesOrderHeader(
        input,
        payload
      );

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.delete('/delete/:soId', validateDtoMiddleware(DeleteSalesOrderDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response)=>{
    try{
      const input:DeleteSalesOrderDto= RequestHandler.Defaults.getParams<DeleteSalesOrderDto>(
          req,
        DeleteSalesOrderDto
        );

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const salesOrderHeaderService = new SalesOrderHeaderService();

      const data = await salesOrderHeaderService.DeleteSalesOrderHeader(
        input,
        payload
      );

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
    

  })

router.get('/get/:soId', validateDtoMiddleware(GetSalesOrderByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response)=>{
    try{
      const input:GetSalesOrderByIdDto= RequestHandler.Defaults.getParams<GetSalesOrderByIdDto>(
          req,
        GetSalesOrderByIdDto
        );

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const salesOrderHeaderService = new SalesOrderHeaderService();

      const data = await salesOrderHeaderService.GetSalesOrderHeaderById(
        input,
        payload
      );

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
    

  })

router.get('/list', validateDtoMiddleware(ListSalesOrderDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response)=>{
    try{
      const input:ListSalesOrderDto= RequestHandler.Defaults.getQuery<ListSalesOrderDto>(
          req,
       ListSalesOrderDto
        );

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const salesOrderHeaderService = new SalesOrderHeaderService();

      const data = await salesOrderHeaderService.listSalesOrderHeader(
        input,
        payload
      );

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
    

  })

  router.put(
  '/update/:soId',
  // ✅ Validate request body
  validateDtoMiddleware(UpdateSalesOrderDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),

  async (req: Request, res: Response) => {
    try {
      
      const soId = Number(req.params.soId);

     
      const input: UpdateSalesOrderDto = RequestHandler.Defaults.getParams<UpdateSalesOrderDto>(
        req,
        UpdateSalesOrderDto,
      );

      // ✅ Extract logged-in user
      const payload: IUser = RequestHandler.Custom.getUser(req);

      // ✅ Call service
      const salesOrderService = new SalesOrderHeaderService();
      const data = await salesOrderService.updateSalesOrderHeader(soId, input, payload);

      // ✅ Send response
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);


router.get(['/approved-for-delivery'], validateDtoMiddleware( ListApprovedOrdersForDeliveryDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response)=>{
    try{
      const input: ListApprovedOrdersForDeliveryDto= RequestHandler.Defaults.getQuery< ListApprovedOrdersForDeliveryDto>(
          req,
        ListApprovedOrdersForDeliveryDto
        );

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const salesOrderHeaderService = new SalesOrderHeaderService();

      const data = await salesOrderHeaderService.getConfirmedOrdersForDelivery(
        input,
        payload
      );

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
    

  })



export { router as SalesOrderHeaderRoute };