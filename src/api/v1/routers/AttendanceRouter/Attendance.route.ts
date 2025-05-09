import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes, UserRole } from "../../../../core/types/Constent/common";
import { GetAttendanceList, MarkAttendance, ReportFilter } from "../../../../core/types/AttendanceService/AttendanceService";
import { Attendance } from "../../Controllers/AttendanceController/Attendance.controller";
import { IUser } from "../../../../core/types/AuthService/AuthService";

const router = express.Router();

router.post('/mark', validateDtoMiddleware(MarkAttendance),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: MarkAttendance = RequestHandler.Defaults.getBody<MarkAttendance>(req, MarkAttendance);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const attendanceService = new Attendance()
        const data = await attendanceService.markAttendance(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list/:empId',  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetAttendanceList = RequestHandler.Defaults.getParams<GetAttendanceList>(req, GetAttendanceList);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const attendanceService = new Attendance()
        const data = await attendanceService.attendanceList(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/report',  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: ReportFilter = RequestHandler.Defaults.getQuery<ReportFilter>(req, ReportFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const attendanceService = new Attendance()
        const data = await attendanceService.attendanceReport(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/inAndOutTime',  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN, [UserRole.SSM]), async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const attendanceService = new Attendance()
        const data = await attendanceService.todayInAndOutTIme(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as AttendanceRoute };