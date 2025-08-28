import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateSalesReturn, GetSalesReturnById, ListSalesReturnsFilter, UpdateSalesReturn, UploadFile } from "../../../../core/types/SalesReturnService/SalesReturnService";
import { GetSalesReturnAnalytics } from "../../../../core/types/SalesReturnService/SalesReturnAnalytics";
import { SalesReturnService } from "../../Controllers/SalesReturnController/SalesReturn.controller";
import { S3Service } from "../../../../core/helper/s3";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreateSalesReturn), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
	try {
		const input: CreateSalesReturn = RequestHandler.Defaults.getBody<CreateSalesReturn>(req, CreateSalesReturn);
		const payload: IUser = RequestHandler.Custom.getUser(req);
		const service = new SalesReturnService();
		const data = await service.create(input, payload);
		ResponseHandler.sendResponse(res, data);
	} catch (error) {
		ResponseHandler.sendErrorResponse(res, error);
	}
});

router.put('/update', validateDtoMiddleware(UpdateSalesReturn), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
	try {
		const input: UpdateSalesReturn = RequestHandler.Defaults.getBody<UpdateSalesReturn>(req, UpdateSalesReturn);
		const payload: IUser = RequestHandler.Custom.getUser(req);
		const service = new SalesReturnService();
		const data = await service.update(input, payload);
		ResponseHandler.sendResponse(res, data);
	} catch (error) {
		ResponseHandler.sendErrorResponse(res, error);
	}
});

router.get('/getById/:returnId', validateDtoMiddleware(GetSalesReturnById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
	try {
		const input: GetSalesReturnById = RequestHandler.Defaults.getParams<GetSalesReturnById>(req, GetSalesReturnById);
		const service = new SalesReturnService();
		const data = await service.getById(input);
		ResponseHandler.sendResponse(res, data);
	} catch (error) {
		ResponseHandler.sendErrorResponse(res, error);
	}
});

router.get('/list', validateDtoMiddleware(ListSalesReturnsFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
	try {
		const input: ListSalesReturnsFilter = RequestHandler.Defaults.getQuery<ListSalesReturnsFilter>(req, ListSalesReturnsFilter);
		const service = new SalesReturnService();
		const data = await service.list(input);
		ResponseHandler.sendResponse(res, data);
	} catch (error) {
		ResponseHandler.sendErrorResponse(res, error);
	}
});

router.get('/analytics', validateDtoMiddleware(GetSalesReturnAnalytics), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
	try {
		const input: GetSalesReturnAnalytics = RequestHandler.Defaults.getQuery<GetSalesReturnAnalytics>(req, GetSalesReturnAnalytics);
		const service = new SalesReturnService();
		const data = await service.getAnalytics(input);
		ResponseHandler.sendResponse(res, data);
	} catch (error) {
		ResponseHandler.sendErrorResponse(res, error);
	}
});

// S3 signed URL endpoint
router.get('/signedUrl', validateDtoMiddleware(UploadFile), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
	try {
		const input: UploadFile = RequestHandler.Defaults.getQuery<UploadFile>(req, UploadFile);
		const payload: IUser = RequestHandler.Custom.getUser(req);
		const s3Service = new S3Service();
		const signed = await s3Service.getSignedUrlForStore(input.fileName, payload.emp_id);
		ResponseHandler.sendResponse(res, signed);
	} catch (error) {
		ResponseHandler.sendErrorResponse(res, error);
	}
});

export { router as SalesReturnRouter }