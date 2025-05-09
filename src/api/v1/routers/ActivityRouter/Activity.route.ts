import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes, UserRole } from "../../../../core/types/Constent/common";
import { IActivities, ActivitiesC, ActivitiesR, ActivitiesU, ActivitiesD } from "../../../../core/types/ActivitiesService/ActivitiesService";
import { Activities } from "../../Controllers/ActivitiesController/ActivitiesController";
import { IUser } from "../../../../core/types/AuthService/AuthService";

const router = express.Router();

router.post('/addActivities', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: ActivitiesC = RequestHandler.Defaults.getBody<ActivitiesC>(req, ActivitiesC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const ActivitiesServices = new Activities()
        const data = await ActivitiesServices.createActivities(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getActivities', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: ActivitiesR = RequestHandler.Defaults.getQuery<ActivitiesR>(req, ActivitiesR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const ActivitiesServices = new Activities()
        const data = await ActivitiesServices.getActivities(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getActivitiesById/:activityId', validateDtoMiddleware(ActivitiesR), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: ActivitiesR = RequestHandler.Defaults.getParams<ActivitiesR>(req, ActivitiesR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new Activities();
        const data = await service.getActivitiesById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/updateActivities', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: ActivitiesU = RequestHandler.Defaults.getBody<ActivitiesU>(req, ActivitiesU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const ActivitiesServices = new Activities();
        const data = await ActivitiesServices.editActivities(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/deleteActivities/:activityId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: ActivitiesD = RequestHandler.Defaults.getParams<ActivitiesD>(req, ActivitiesD);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const ActivitiesServices = new Activities();
        const data = await ActivitiesServices.deleteActivities(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


export { router as ActivityRouter };