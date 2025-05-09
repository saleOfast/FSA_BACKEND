import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes, UserRole } from "../../../../core/types/Constent/common";
import { HolidayC, HolidayR, HolidayU, HolidayD, IHoliday } from "../../../../core/types/HolidayService/HolidayService";
import { Holiday } from "../../Controllers/HolidayController/HolidayController";
import { IUser } from "../../../../core/types/AuthService/AuthService";

const router = express.Router();

router.post('/addHoliday', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: HolidayC = RequestHandler.Defaults.getBody<HolidayC>(req, HolidayC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const HolidayService = new Holiday()
        const data = await HolidayService.createHoliday(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getholiday', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: HolidayR = RequestHandler.Defaults.getQuery<HolidayR>(req, HolidayR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const HolidayService = new Holiday()
        const data = await HolidayService.getHolidays(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/updateHoliday', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: HolidayU = RequestHandler.Defaults.getBody<HolidayU>(req, HolidayU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const HolidayService = new Holiday();
        const data = await HolidayService.editHoliday(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/deleteHoliday/:holidayId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: HolidayD = RequestHandler.Defaults.getParams<HolidayD>(req, HolidayD);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const HolidayService = new Holiday();
        const data = await HolidayService.deleteHoliday(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


export { router as HolidayRouter };