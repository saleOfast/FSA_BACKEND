import express, { Request, Response } from "express";
import catchAsync from '../../../../core/utils/catch-async';
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { CreateScheme, GetScheme, UpdateScheme } from "../../../../core/types/SchemeService/SchemeService";
import { SchemeService } from "../../Controllers/SchemeController/Scheme.controller";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreateScheme), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), catchAsync(async (req: Request, res: Response) => {
    try {
        const input: CreateScheme = RequestHandler.Defaults.getBody<CreateScheme>(req, CreateScheme);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const SchemeController = new SchemeService();
        const data = await SchemeController.createScheme(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

router.get('/getActiveScheme', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), catchAsync(async (req: Request, res: Response) => {
    try {
        const SchemeController = new SchemeService();
        const data = await SchemeController.getScheme();
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

router.get('/schemeList', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), catchAsync(async (req: Request, res: Response) => {
    try {
        const input: GetScheme = RequestHandler.Defaults.getParams<GetScheme>(req, GetScheme);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const SchemeController = new SchemeService();
        const data = await SchemeController.schemeList(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

router.post('/update', validateDtoMiddleware(UpdateScheme), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateScheme = RequestHandler.Defaults.getBody<UpdateScheme>(req, UpdateScheme);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new SchemeService();
        const data = await service.update(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as SchemeRoute };