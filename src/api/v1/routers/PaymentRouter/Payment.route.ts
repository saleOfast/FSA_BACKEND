import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { GetPayment, OnlinePayment, OrderPayment } from "../../../../core/types/PaymentService/PaymentService";
import { PaymentService } from "../../../../api/v1/Controllers/PaymentController/Payment.controller";
const router = express.Router();

router.post('/addByCash', validateDtoMiddleware(OrderPayment), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: OrderPayment = RequestHandler.Defaults.getBody<OrderPayment>(req, OrderPayment);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const paymentService = new PaymentService();
        const data = await paymentService.addByCash(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/addByOnline',  async (req: Request, res: Response) => {
    try {
        const input: OnlinePayment = RequestHandler.Defaults.getBody<OnlinePayment>(req, OnlinePayment);
        // const payload: IUser = RequestHandler.Custom.getUser(req);
        const paymentService = new PaymentService();
        const data = await paymentService.addByOnline(input);
        console.log({data});
        
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/paymentCapture', validateDtoMiddleware(OrderPayment), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),  async (req: Request, res: Response) => {
    try {
        const input: OnlinePayment = RequestHandler.Defaults.getBody<OnlinePayment>(req, OnlinePayment);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const paymentService = new PaymentService();
        const data = await paymentService.paymentCapture(input, payload);
        console.log({data});
        
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/recordByOrderId/:orderId', validateDtoMiddleware(GetPayment), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetPayment = RequestHandler.Defaults.getParams<GetPayment>(req, GetPayment);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const paymentService = new PaymentService();
        const data = await paymentService.getPaymentHistoryByOrderID(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as PaymentRouter }