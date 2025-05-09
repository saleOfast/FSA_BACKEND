import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreatePaymentMode, DeletePaymentMode, GetPaymentMode, UpdatePaymentMode } from "../../../../core/types/PaymentModeService/PaymentModeService";
import { PaymentModeService } from "../../../../api/v1/Controllers/config/PaymentModeController/PaymentMode.controller";
const router = express.Router();

router.post('/add', validateDtoMiddleware(CreatePaymentMode), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreatePaymentMode = RequestHandler.Defaults.getBody<CreatePaymentMode>(req, CreatePaymentMode);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new PaymentModeService();
        const data = await service.add(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new PaymentModeService();
        const data = await service.list(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/update', validateDtoMiddleware(UpdatePaymentMode), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdatePaymentMode = RequestHandler.Defaults.getBody<UpdatePaymentMode>(req, UpdatePaymentMode);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new PaymentModeService();
        const data = await service.update(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById/:paymentModeId', validateDtoMiddleware(GetPaymentMode), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetPaymentMode = RequestHandler.Defaults.getParams<GetPaymentMode>(req, GetPaymentMode);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new PaymentModeService();
        const data = await service.getPaymentModeById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:paymentModeId', validateDtoMiddleware(DeletePaymentMode), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeletePaymentMode = RequestHandler.Defaults.getParams<DeletePaymentMode>(req, DeletePaymentMode);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new PaymentModeService();
        const data = await service.delete(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as PaymentModeRouter }