import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { StatusController } from "../../Controllers/darConfigController/statusController";

const router = express.Router();

router.post('/add', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input = RequestHandler.Defaults.getBody(req);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const statusService = new StatusController();
        const data = await statusService.createStatus(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input:any = RequestHandler.Defaults.getQuery(req);
        const statusService = new StatusController();
        const data = await statusService.getStatusList(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input:any = RequestHandler.Defaults.getQuery(req);
        const statusService = new StatusController();
        const data = await statusService.getStatusById(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/update', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input = RequestHandler.Defaults.getBody(req);
        const statusService = new StatusController();
        const data = await statusService.editStatus(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:status_id', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input:any = RequestHandler.Defaults.getParams(req);
        const statusService = new StatusController();
        const data = await statusService.deleteStatus(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as StatusRouter };