import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { LeaveHeadController } from "../../Controllers/LeaveController/LeaveController";
import { HeadLeaveC, HeadLeaveD, HeadLeaveR, HeadLeaveU } from "../../../../core/types/LeaveService/LeaveService";

const router = express.Router();

router.post('/addLeave', validateDtoMiddleware(HeadLeaveC), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: HeadLeaveC = RequestHandler.Defaults.getBody<HeadLeaveC>(req, HeadLeaveC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const leaveHeadService = new LeaveHeadController()
        const data = await leaveHeadService.createLeadHead(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

// router.get('/getLeave', validateDtoMiddleware(HeadLeaveR), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: HeadLeaveR = RequestHandler.Defaults.getQuery<HeadLeaveR>(req, HeadLeaveR);
//         const payload: IUser = RequestHandler.Custom.getUser(req);
//         const leaveHeadService = new LeaveHeadController()
//         const data = await leaveHeadService.getLeadHead(input, payload);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });

router.get('/getLeave', validateDtoMiddleware(HeadLeaveR), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: HeadLeaveR = RequestHandler.Defaults.getQuery<HeadLeaveR>(req, HeadLeaveR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const leaveHeadService = new LeaveHeadController()
        const data = await leaveHeadService.getLeadHead(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});
router.get('/getLeaveById/:head_leave_id', validateDtoMiddleware(HeadLeaveR), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: HeadLeaveR = RequestHandler.Defaults.getParams<HeadLeaveR>(req, HeadLeaveR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new LeaveHeadController();
        const data = await service.getLeaveHeadById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/updateLeave', validateDtoMiddleware(HeadLeaveU), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: HeadLeaveU = RequestHandler.Defaults.getBody<HeadLeaveU>(req, HeadLeaveU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const leaveHeadService = new LeaveHeadController()
        const data = await leaveHeadService.updateLeadHead(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/deleteLeave/:head_leave_id', validateDtoMiddleware(HeadLeaveD), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: HeadLeaveD = RequestHandler.Defaults.getParams<HeadLeaveD>(req, HeadLeaveD);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const leaveHeadService = new LeaveHeadController()
        const data = await leaveHeadService.deleteLeadHead(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


export { router as LeaveRoute };