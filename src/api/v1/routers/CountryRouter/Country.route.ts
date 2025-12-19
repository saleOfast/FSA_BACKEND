import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateCountry,
  UpdateCountry,
  DeleteCountryById,
  GetCountryById,
  CountryListFilter
} from "../../../../core/types/CountryService/CountryService";
import { CountryService } from "../../Controllers/CountryController/Country.controller";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreateCountry), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: CreateCountry = RequestHandler.Defaults.getBody<CreateCountry>(req, CreateCountry);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const countryService = new CountryService();
    const data = await countryService.createCountry(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.post('/update', validateDtoMiddleware(UpdateCountry), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: UpdateCountry = RequestHandler.Defaults.getBody<UpdateCountry>(req, UpdateCountry);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const countryService = new CountryService();
    const data = await countryService.updateCountry(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.delete('/delete/:countryId', validateDtoMiddleware(DeleteCountryById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: DeleteCountryById = RequestHandler.Defaults.getParams<DeleteCountryById>(req, DeleteCountryById);
    const countryService = new CountryService();
    const data = await countryService.deleteCountry(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/getById/:countryId', validateDtoMiddleware(GetCountryById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: GetCountryById = RequestHandler.Defaults.getParams<GetCountryById>(req, GetCountryById);
    const countryService = new CountryService();
    const data = await countryService.getCountryById(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/list', validateDtoMiddleware(CountryListFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: CountryListFilter = RequestHandler.Defaults.getQuery<CountryListFilter>(req, CountryListFilter);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const countryService = new CountryService();
    const data = await countryService.countryList(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

export { router as CountryRoute };

