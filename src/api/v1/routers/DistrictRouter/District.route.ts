import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateDistrict,
  UpdateDistrict,
  DeleteDistrictById,
  GetDistrictById,
  DistrictListFilter,
  GetDistrictsByStateId
} from "../../../../core/types/DistrictService/DistrictService";
import { DistrictService } from "../../Controllers/DistrictController/District.controller";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreateDistrict), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: CreateDistrict = RequestHandler.Defaults.getBody<CreateDistrict>(req, CreateDistrict);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const districtService = new DistrictService();
    const data = await districtService.createDistrict(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.post('/update', validateDtoMiddleware(UpdateDistrict), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: UpdateDistrict = RequestHandler.Defaults.getBody<UpdateDistrict>(req, UpdateDistrict);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const districtService = new DistrictService();
    const data = await districtService.updateDistrict(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.delete('/delete/:districtId', validateDtoMiddleware(DeleteDistrictById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: DeleteDistrictById = RequestHandler.Defaults.getParams<DeleteDistrictById>(req, DeleteDistrictById);
    const districtService = new DistrictService();
    const data = await districtService.deleteDistrict(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/getById/:districtId', validateDtoMiddleware(GetDistrictById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: GetDistrictById = RequestHandler.Defaults.getParams<GetDistrictById>(req, GetDistrictById);
    const districtService = new DistrictService();
    const data = await districtService.getDistrictById(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/list', validateDtoMiddleware(DistrictListFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: DistrictListFilter = RequestHandler.Defaults.getQuery<DistrictListFilter>(req, DistrictListFilter);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const districtService = new DistrictService();
    const data = await districtService.districtList(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/getByStateId/:stateId', validateDtoMiddleware(GetDistrictsByStateId), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: GetDistrictsByStateId = RequestHandler.Defaults.getParams<GetDistrictsByStateId>(req, GetDistrictsByStateId);
    const districtService = new DistrictService();
    const data = await districtService.getDistrictsByStateId(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

export { router as DistrictRoute };

