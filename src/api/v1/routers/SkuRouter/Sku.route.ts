import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { CreateSkuRequest, DeleteSkuById, GetSkuById, GetSkuListRequest, UpdateSkuRequest } from "../../../../core/types/SkuService/SkuService";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { SkuService } from "../../Controllers/SkuController/Sku.controller";
import { IUser } from "../../../../core/types/AuthService/AuthService";

const router = express.Router();

router.post(
    '/create',
    validateDtoMiddleware(CreateSkuRequest),
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
        try {
            const input: CreateSkuRequest = RequestHandler.Defaults.getBody<CreateSkuRequest>(req, CreateSkuRequest);
            const payload: IUser = RequestHandler.Custom.getUser(req);
            const skuService = new SkuService();
            const data = await skuService.createSku(input, payload);
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
);

router.post(
    '/update',
    validateDtoMiddleware(UpdateSkuRequest),
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
        try {
            const input: UpdateSkuRequest = RequestHandler.Defaults.getBody<UpdateSkuRequest>(req, UpdateSkuRequest);
            const payload: IUser = RequestHandler.Custom.getUser(req);
            const skuService = new SkuService();
            const data = await skuService.updateSku(input, payload);
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
);

router.get(
    '/getById/:skuId',
    validateDtoMiddleware(GetSkuById),
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
        try {
            const input: GetSkuById = RequestHandler.Defaults.getParams<GetSkuById>(req, GetSkuById);
            const skuService = new SkuService();
            const data = await skuService.getById(input);
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
);

router.get(
    '/list',
    validateDtoMiddleware(GetSkuListRequest),
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
        try {
            const payload: IUser = RequestHandler.Custom.getUser(req);
            const input: GetSkuListRequest = RequestHandler.Defaults.getQuery<GetSkuListRequest>(req, GetSkuListRequest);
            const skuService = new SkuService();
            const data = await skuService.list(input, payload);
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
);

router.delete(
    '/delete/:skuId',
    validateDtoMiddleware(DeleteSkuById),
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
        try {
            const input: DeleteSkuById = RequestHandler.Defaults.getParams<DeleteSkuById>(req, DeleteSkuById);
            const skuService = new SkuService();
            const data = await skuService.deleteSku(input);
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
);

export { router as SkuRoute };

