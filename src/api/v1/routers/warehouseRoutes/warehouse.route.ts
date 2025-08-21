import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateWarehouse, DeleteWarehouseById, GetWarehouseById, GetWarehouseList, UpdateWarehouse } from "../../../../core/types/warehouseService/warehouseService";
import { WarehouseService } from "../../Controllers/warehouseController/warehouseController";
const router = express.Router();

router.post(
	'/create',
	validateDtoMiddleware(CreateWarehouse),
	AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
	async (req: Request, res: Response) => {
		try {
			const input: CreateWarehouse = RequestHandler.Defaults.getBody<CreateWarehouse>(req, CreateWarehouse);
			const payload: IUser = RequestHandler.Custom.getUser(req);
			const service = new WarehouseService();
			const data = await service.create(input, payload);
			ResponseHandler.sendResponse(res, data);
		} catch (error) {
			ResponseHandler.sendErrorResponse(res, error);
		}
	}
);

router.get(
	'/getById/:warehouseId',
	validateDtoMiddleware(GetWarehouseById),
	AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
	async (req: Request, res: Response) => {
		try {
			const input: GetWarehouseById = RequestHandler.Defaults.getParams<GetWarehouseById>(req, GetWarehouseById);
			const service = new WarehouseService();
			const data = await service.getById(input);
			ResponseHandler.sendResponse(res, data);
		} catch (error) {
			ResponseHandler.sendErrorResponse(res, error);
		}
	}
);

router.get(
	'/list',
	validateDtoMiddleware(GetWarehouseList),
	AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
	async (req: Request, res: Response) => {
		try {
			const input: GetWarehouseList = RequestHandler.Defaults.getQuery<GetWarehouseList>(req, GetWarehouseList);
			const service = new WarehouseService();
			const data = await service.list(input);
			ResponseHandler.sendResponse(res, data);
		} catch (error) {
			ResponseHandler.sendErrorResponse(res, error);
		}
	}
);

router.post(
	'/update',
	validateDtoMiddleware(UpdateWarehouse),
	AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
	async (req: Request, res: Response) => {
		try {
			const input: UpdateWarehouse = RequestHandler.Defaults.getBody<UpdateWarehouse>(req, UpdateWarehouse);
			const payload: IUser = RequestHandler.Custom.getUser(req);
			const service = new WarehouseService();
			const data = await service.update(input, payload);
			ResponseHandler.sendResponse(res, data);
		} catch (error) {
			ResponseHandler.sendErrorResponse(res, error);
		}
	}
);

router.delete(
	'/delete/:warehouseId',
	validateDtoMiddleware(DeleteWarehouseById),
	AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
	async (req: Request, res: Response) => {
		try {
			const input: DeleteWarehouseById = RequestHandler.Defaults.getParams<DeleteWarehouseById>(req, DeleteWarehouseById);
			const service = new WarehouseService();
			const data = await service.delete(input);
			ResponseHandler.sendResponse(res, data);
		} catch (error) {
			ResponseHandler.sendErrorResponse(res, error);
		}
	}
);

export { router as WarehouseRouter };