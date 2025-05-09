import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { ActivityRelToController } from "../../../../api/v1/Controllers/darConfigController/activityRelToController";

const router = express.Router();

router.post('/add', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input = RequestHandler.Defaults.getBody(req);
        const activityRelToService = new ActivityRelToController();
        const data = await activityRelToService.createActivityRelTo(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input:any = RequestHandler.Defaults.getQuery(req);
        const activityRelToService = new ActivityRelToController();
        const data = await activityRelToService.getActivityRelToList(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: any = RequestHandler.Defaults.getQuery(req);
        const activityRelToService = new ActivityRelToController();
        const data = await activityRelToService.getActivityRelToById(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/update', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input = RequestHandler.Defaults.getBody(req);
        const activityRelToService = new ActivityRelToController();
        const data = await activityRelToService.editActivityRelTo(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:activity_rel_to_id', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: any = RequestHandler.Defaults.getParams(req);
        const activityRelToService = new ActivityRelToController();
        const data = await activityRelToService.deleteActivityRelTo(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as ActivityRelToRouter };