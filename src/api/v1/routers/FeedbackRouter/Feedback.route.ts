import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes, UserRole } from "../../../../core/types/Constent/common";
import { IFeedback, FeedbackC, FeedbackR, FeedbackU, FeedbackD } from "../../../../core/types/FeedbackService/FeedbackService";
import { Feedback } from "../../Controllers/FeedbackController/FeedbackController";
import { IUser } from "../../../../core/types/AuthService/AuthService";

const router = express.Router();

router.post('/addFeedback', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: FeedbackC = RequestHandler.Defaults.getBody<FeedbackC>(req, FeedbackC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const FeedbackServices = new Feedback()
        const data = await FeedbackServices.createFeedback(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getFeedback', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: FeedbackR = RequestHandler.Defaults.getQuery<FeedbackR>(req, FeedbackR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const FeedbackServices = new Feedback()
        const data = await FeedbackServices.getFeedback(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getFeedbackById/:feedbackId', validateDtoMiddleware(FeedbackR), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: FeedbackR = RequestHandler.Defaults.getParams<FeedbackR>(req, FeedbackR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new Feedback();
        const data = await service.getFeedbackById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/updateFeedback', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: FeedbackU = RequestHandler.Defaults.getBody<FeedbackU>(req, FeedbackU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const FeedbackServices = new Feedback();
        const data = await FeedbackServices.editFeedback(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/deleteFeedback/:feedbackId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: FeedbackD = RequestHandler.Defaults.getParams<FeedbackD>(req, FeedbackD);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const FeedbackServices = new Feedback();
        const data = await FeedbackServices.deleteFeedback(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


export { router as FeedbackRouter };