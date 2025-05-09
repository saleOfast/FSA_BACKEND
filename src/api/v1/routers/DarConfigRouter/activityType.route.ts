import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { ActivityTypeController } from "../../../../api/v1/Controllers/darConfigController/activityTypeController";

const router = express.Router();

router.post('/add', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input:any = RequestHandler.Defaults.getBody(req);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const activityTypeService = new ActivityTypeController();
        const data = await activityTypeService.createActivityType(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input:any = RequestHandler.Defaults.getQuery(req);
        const activityTypeService:any = new ActivityTypeController();
        const data = await activityTypeService.getActivityTypes(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: any = RequestHandler.Defaults.getQuery(req);
        const activityTypeService = new ActivityTypeController();
        const data = await activityTypeService.getActivityTypeById(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/update', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input = RequestHandler.Defaults.getBody(req);
        const activityTypeService = new ActivityTypeController();
        const data = await activityTypeService.editActivityType(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:activity_type_id', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: any = RequestHandler.Defaults.getParams(req);
        const activityTypeService = new ActivityTypeController();
        const data = await activityTypeService.deleteActivityType(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as ActivityTypeRouter };
