import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes, UserRole } from "../../../../core/types/Constent/common";
import { IRCPA, RCPAC, RCPAD, RCPAR, RCPAU } from "../../../../core/types/RCPAService/RCPAService";
import { RCPA } from "../../Controllers/RCPAController/RCPAController";

import { IUser } from "../../../../core/types/AuthService/AuthService";

const router = express.Router();

router.post('/addRCPA', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: RCPAC = RequestHandler.Defaults.getBody<RCPAC>(req, RCPAC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const RCPAServices = new RCPA()
        const data = await RCPAServices.createRCPA(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getRCPA', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: RCPAR = RequestHandler.Defaults.getQuery<RCPAR>(req, RCPAR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const RCPAServices = new RCPA()
        const data = await RCPAServices.getRCPA(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getRCPAById/:rcpaId', validateDtoMiddleware(RCPAR), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: RCPAR = RequestHandler.Defaults.getParams<RCPAR>(req, RCPAR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new RCPA();
        const data = await service.getRCPAById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/updateRCPA', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: RCPAU = RequestHandler.Defaults.getBody<RCPAU>(req, RCPAU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const RCPAServices = new RCPA();
        const data = await RCPAServices.editRCPA(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/deleteRCPA/:rcpaId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: RCPAD = RequestHandler.Defaults.getParams<RCPAD>(req, RCPAD);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const RCPAServices = new RCPA();
        const data = await RCPAServices.deleteRCPA(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as RCPARouter };