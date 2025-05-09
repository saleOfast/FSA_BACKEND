import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateFeature, DeleteFeature, GetFeature, UpdateFeature } from "../../../../core/types/ReasonService/ReasonService";
import { FeatureService } from "../../../../api/v1/Controllers/FeatureController/Feature.controller";
const router = express.Router();

router.post('/add', validateDtoMiddleware(CreateFeature), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateFeature = RequestHandler.Defaults.getBody<CreateFeature>(req, CreateFeature);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new FeatureService();
        const data = await service.add(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new FeatureService();
        const data = await service.list(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/update', validateDtoMiddleware(UpdateFeature), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateFeature = RequestHandler.Defaults.getBody<UpdateFeature>(req, UpdateFeature);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new FeatureService();
        const data = await service.update(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById/:featureId', validateDtoMiddleware(GetFeature), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetFeature = RequestHandler.Defaults.getParams<GetFeature>(req, GetFeature);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new FeatureService();
        const data = await service.getFeatureById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:featureId', validateDtoMiddleware(DeleteFeature), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteFeature = RequestHandler.Defaults.getParams<DeleteFeature>(req, DeleteFeature);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new FeatureService();
        const data = await service.delete(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as FeatureRouter }