import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { NextActionOnController } from "../../Controllers/darConfigController/nextActionOnController";

const router = express.Router();

router.post('/add', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input = RequestHandler.Defaults.getBody(req);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const nextActionOnService = new NextActionOnController();
        const data = await nextActionOnService.createNextActionOn(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input:any = RequestHandler.Defaults.getQuery(req);
        const nextActionOnService = new NextActionOnController();
        const data = await nextActionOnService.getNextActionOnList(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: any = RequestHandler.Defaults.getQuery(req);
        const nextActionOnService = new NextActionOnController();
        const data = await nextActionOnService.getNextActionOnById(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/update', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input = RequestHandler.Defaults.getBody(req);
        const nextActionOnService = new NextActionOnController();
        const data = await nextActionOnService.editNextActionOn(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:next_action_on_id', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: any = RequestHandler.Defaults.getParams(req);
        const nextActionOnService = new NextActionOnController();
        const data = await nextActionOnService.deleteNextActionOn(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as NextActionOnRouter };
