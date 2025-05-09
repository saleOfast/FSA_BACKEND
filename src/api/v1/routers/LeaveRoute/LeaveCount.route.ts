import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { LeaveHeadController } from "../../Controllers/LeaveController/LeaveController";
import { LeaveCountController } from "../../Controllers/LeaveController/LeaveCountController";
import { HeadLeaveC, HeadLeaveD, HeadLeaveR, HeadLeaveU } from "../../../../core/types/LeaveService/LeaveService";
import { LeaveHeadCountC, LeaveHeadCountD, LeaveHeadCountR, LeaveHeadCountU } from "../../../../core/types/LeaveService/LeaveCountService";

const router = express.Router();

router.post('/addLeaveCount', validateDtoMiddleware(LeaveHeadCountC), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: LeaveHeadCountC = RequestHandler.Defaults.getBody<LeaveHeadCountC>(req, LeaveHeadCountC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const leaveCountService = new LeaveCountController();
        const data = await leaveCountService.createLeaveCount(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getCount', validateDtoMiddleware(LeaveHeadCountR), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: LeaveHeadCountR = RequestHandler.Defaults.getQuery<LeaveHeadCountR>(req, LeaveHeadCountR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const leaveCountService = new LeaveCountController();
        const data = await leaveCountService.getLeaveHeadOfCurrentYear(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getLeaveCount/:headLeaveCntId', validateDtoMiddleware(LeaveHeadCountR), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: LeaveHeadCountR = RequestHandler.Defaults.getParams<LeaveHeadCountR>(req, LeaveHeadCountR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const leaveCountService = new LeaveCountController();
        const data = await leaveCountService.getLeaveCount(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/updateLeaveCount', validateDtoMiddleware(LeaveHeadCountU), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: LeaveHeadCountU = RequestHandler.Defaults.getBody<LeaveHeadCountU>(req, LeaveHeadCountU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const leaveCountService = new LeaveCountController();
        const data = await leaveCountService.updateLeaveCount(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/deleteLeaveCount', validateDtoMiddleware(LeaveHeadCountD), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: LeaveHeadCountD = RequestHandler.Defaults.getQuery<LeaveHeadCountD>(req, LeaveHeadCountD);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const leaveCountService = new LeaveCountController();
        const data = await leaveCountService.deleteLeaveCount(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


export { router as LeaveCountRoute };