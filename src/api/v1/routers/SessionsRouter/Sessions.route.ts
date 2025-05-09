import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes, UserRole } from "../../../../core/types/Constent/common";
import { ISessions, SessionsC, SessionsR, SessionsU, SessionsD } from "../../../../core/types/SessionsService/SessionsService";
import { Sessions } from "../../Controllers/SessionsController/SessionsController";
import { IUser } from "../../../../core/types/AuthService/AuthService";

const router = express.Router();

router.post('/addSessions', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: SessionsC = RequestHandler.Defaults.getBody<SessionsC>(req, SessionsC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const SessionsServices = new Sessions()
        const data = await SessionsServices.createSessions(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getSessions', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: SessionsR = RequestHandler.Defaults.getQuery<SessionsR>(req, SessionsR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const SessionsServices = new Sessions()
        const data = await SessionsServices.getSessions(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getSessionsById/:sessionId', validateDtoMiddleware(SessionsR), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: SessionsR = RequestHandler.Defaults.getParams<SessionsR>(req, SessionsR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new Sessions();
        const data = await service.getSessionsById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/updateSessions', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: SessionsU = RequestHandler.Defaults.getBody<SessionsU>(req, SessionsU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const SessionsServices = new Sessions();
        const data = await SessionsServices.editSessions(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/deleteSessions/:sessionId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: SessionsD = RequestHandler.Defaults.getParams<SessionsD>(req, SessionsD);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const SessionsServices = new Sessions();
        const data = await SessionsServices.deleteSessions(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


export { router as SessionsRouter };