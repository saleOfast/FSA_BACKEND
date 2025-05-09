import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { HeadLeaveU } from "../../../../core/types/LeaveService/LeaveService";
import { LeaveApplicationController } from "../../Controllers/LeaveController/userLeaveApplicationController";
import { CreateUserLeaveApplication, DeleteUserLeaveAppl, GetUserLeaveApplication, UpdateLeaveApp } from "../../../../core/types/LeaveService/userLeaveApplicationService";

const router = express.Router();

router.post('/add', validateDtoMiddleware(CreateUserLeaveApplication), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateUserLeaveApplication = RequestHandler.Defaults.getBody<CreateUserLeaveApplication>(req, CreateUserLeaveApplication);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new LeaveApplicationController()
        const data = await service.createUserLeaveApplication(input, payload);
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

router.get('/get',  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: any = RequestHandler.Defaults.getQuery<any>(req, GetUserLeaveApplication);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new LeaveApplicationController()
        const data = await service.getLeaveApplication(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


router.put('/update', validateDtoMiddleware(UpdateLeaveApp), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateLeaveApp = RequestHandler.Defaults.getBody<UpdateLeaveApp>(req, UpdateLeaveApp);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new LeaveApplicationController()
        const data = await service.updateLeaveApplication(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:head_leave_id', validateDtoMiddleware(DeleteUserLeaveAppl), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteUserLeaveAppl = RequestHandler.Defaults.getParams<DeleteUserLeaveAppl>(req, DeleteUserLeaveAppl);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new LeaveApplicationController()
        const data = await service.deleteLeaveApplication(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


export { router as LeaveApplicationRoute };