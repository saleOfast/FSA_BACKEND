import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateDiscount,
  UpdateDiscount,
  DeleteDiscountById,
  GetDiscountById,
  DiscountListFilter
} from "../../../../core/types/DiscountService/DiscountService";
import { DiscountService } from "../../Controllers/DiscountController/Discount.controller";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreateDiscount), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: CreateDiscount = RequestHandler.Defaults.getBody<CreateDiscount>(req, CreateDiscount);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const discountService = new DiscountService();
    const data = await discountService.createDiscount(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.post('/update', validateDtoMiddleware(UpdateDiscount), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: UpdateDiscount = RequestHandler.Defaults.getBody<UpdateDiscount>(req, UpdateDiscount);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const discountService = new DiscountService();
    const data = await discountService.updateDiscount(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.delete('/delete/:discountId', validateDtoMiddleware(DeleteDiscountById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: DeleteDiscountById = RequestHandler.Defaults.getParams<DeleteDiscountById>(req, DeleteDiscountById);
    const discountService = new DiscountService();
    const data = await discountService.deleteDiscount(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/getById/:discountId', validateDtoMiddleware(GetDiscountById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: GetDiscountById = RequestHandler.Defaults.getParams<GetDiscountById>(req, GetDiscountById);
    const discountService = new DiscountService();
    const data = await discountService.getDiscountById(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/list', validateDtoMiddleware(DiscountListFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: DiscountListFilter = RequestHandler.Defaults.getQuery<DiscountListFilter>(req, DiscountListFilter);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const discountService = new DiscountService();
    const data = await discountService.discountList(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

export { router as DiscountRoute };

