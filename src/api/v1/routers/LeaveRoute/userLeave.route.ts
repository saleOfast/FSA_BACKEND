import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserLeaveController } from "../../Controllers/LeaveController/userLeaveController";
import { GetUserLeave } from "../../../../core/types/LeaveService/userLeaveService";

const router = express.Router();

router.get('/get',  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: any = RequestHandler.Defaults.getQuery<any>(req, GetUserLeave);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new UserLeaveController()
        const data = await service.getUserPendingLeavesCount(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

// router.post('/addLeaveCount', validateDtoMiddleware(LeaveHeadCountC), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: LeaveHeadCountC = RequestHandler.Defaults.getBody<LeaveHeadCountC>(req, LeaveHeadCountC);
//         const payload: IUser = RequestHandler.Custom.getUser(req);
//         const leaveCountService = new LeaveCountController();
//         const data = await leaveCountService.createLeaveCount(input, payload);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });


export { router as userLeave };