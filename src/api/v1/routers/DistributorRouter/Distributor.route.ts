import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { CreateDistributorDto, GetDistributorByIdDto, ListDistributorsFilterDto, UpdateDistributorDto } from "../../../../core/types/DistributorService/DistributorService";
import { DistributorService } from "../../Controllers/DistributorController/Distributor.Controller";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreateDistributorDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
	try {
		const input: CreateDistributorDto = RequestHandler.Defaults.getBody<CreateDistributorDto>(req, CreateDistributorDto);
		const service = new DistributorService();
		const data = await service.create(input);
		ResponseHandler.sendResponse(res, data);
	} catch (error) {
		ResponseHandler.sendErrorResponse(res, error);
	}
});

router.put('/update', validateDtoMiddleware(UpdateDistributorDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
	try {
		const input: UpdateDistributorDto = RequestHandler.Defaults.getBody<UpdateDistributorDto>(req, UpdateDistributorDto);
		const service = new DistributorService();
		const data = await service.update(input);
		ResponseHandler.sendResponse(res, data);
	} catch (error) {
		ResponseHandler.sendErrorResponse(res, error);
	}
});

router.get('/getById/:distributorId', validateDtoMiddleware(GetDistributorByIdDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
	try {
		const input: GetDistributorByIdDto = RequestHandler.Defaults.getParams<GetDistributorByIdDto>(req, GetDistributorByIdDto);
		const service = new DistributorService();
		const data = await service.getById(input);
		ResponseHandler.sendResponse(res, data);
	} catch (error) {
		ResponseHandler.sendErrorResponse(res, error);
	}
});

router.get('/list', validateDtoMiddleware(ListDistributorsFilterDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
	try {
		const input: ListDistributorsFilterDto = RequestHandler.Defaults.getQuery<ListDistributorsFilterDto>(req, ListDistributorsFilterDto);
		const service = new DistributorService();
		const data = await service.list(input);
		ResponseHandler.sendResponse(res, data);
	} catch (error) {
		ResponseHandler.sendErrorResponse(res, error);
	}
});

export { router as DistributorRouter }
