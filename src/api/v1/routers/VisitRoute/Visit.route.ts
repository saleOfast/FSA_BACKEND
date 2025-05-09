import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CheckInRequest, CheckOutRequest, CreateVisit, dayTrackingFilter, GetVisitById, PastNoOrderList, PictureList, UpdateActivityById, UpdateImage, UpdateVisitByNoOrder, VisitListFilter } from "../../../../core/types/VisitService/VisitService";
import { VisitService } from "../../Controllers/VisitController/Visit.controller";

const router = express.Router();


router.post('/create', validateDtoMiddleware(CreateVisit), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateVisit = RequestHandler.Defaults.getBody<CreateVisit>(req, CreateVisit);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const visitService = new VisitService()
        const data = await visitService.createVisit(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/visitList', validateDtoMiddleware(VisitListFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: VisitListFilter = RequestHandler.Defaults.getQuery<VisitListFilter>(req, VisitListFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const visitService = new VisitService()
        const data = await visitService.visitList(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getVisit/:visitId', validateDtoMiddleware(GetVisitById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetVisitById = RequestHandler.Defaults.getParams<GetVisitById>(req, GetVisitById);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const visitService = new VisitService()
        const data = await visitService.getVisitById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/updateImage', validateDtoMiddleware(UpdateImage), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateImage = RequestHandler.Defaults.getBody<UpdateImage>(req, UpdateImage);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const visitService = new VisitService()
        const data = await visitService.updateImage(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/checkIn', validateDtoMiddleware(CheckInRequest), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CheckInRequest = RequestHandler.Defaults.getBody<CheckInRequest>(req, CheckInRequest);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const visitService = new VisitService()
        const data = await visitService.checkIn(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/checkOut', validateDtoMiddleware(CheckOutRequest), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CheckOutRequest = RequestHandler.Defaults.getBody<CheckOutRequest>(req, CheckOutRequest);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const visitService = new VisitService()
        const data = await visitService.checkOut(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/day-track-report', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: dayTrackingFilter = RequestHandler.Defaults.getQuery<dayTrackingFilter>(req, dayTrackingFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const dayTrackingService = new VisitService()
        const data = await dayTrackingService.dayTrackingReport(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/update/no-order-reason', validateDtoMiddleware(UpdateVisitByNoOrder), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateVisitByNoOrder = RequestHandler.Defaults.getBody<UpdateVisitByNoOrder>(req, UpdateVisitByNoOrder);
        const service = new VisitService();
        const data = await service.updateOrderBySpecialDiscount(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/past-no-order', validateDtoMiddleware(PastNoOrderList), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: PastNoOrderList = RequestHandler.Defaults.getQuery<PastNoOrderList>(req, PastNoOrderList);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const visitService = new VisitService()
        const data = await visitService.getPastNoOrder(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/picture', validateDtoMiddleware(PictureList), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: PictureList = RequestHandler.Defaults.getQuery<PictureList>(req, PictureList);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const visitService = new VisitService()
        const data = await visitService.getPictureByStoreId(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/visitReport', validateDtoMiddleware(VisitListFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const visitService = new VisitService()
        const data = await visitService.visitReport();
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


// router.put('/track/activity', validateDtoMiddleware(UpdateActivityById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: UpdateActivityById = RequestHandler.Defaults.getBody<UpdateActivityById>(req, UpdateActivityById);
//         const service = new VisitService();
//         const data = await service.updateActivity(input);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });

router.post(
    '/import',
    validateDtoMiddleware([CreateVisit]), // Validate an array of CreateVisit DTOs
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
        try {
            // Get the array of visits from the request body
            const inputs: CreateVisit[] = RequestHandler.Defaults.getBody<CreateVisit[]>(req);

            // Get the user payload
            const payload: IUser = RequestHandler.Custom.getUser(req);

            // Create an instance of VisitService and handle the array of visits
            const visitService = new VisitService();
            const data = await visitService.createMultipleVisits(inputs, payload);

            // Send the response back
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            // Handle any errors
            ResponseHandler.sendErrorResponse(res, error);
        }
    }

);

export { router as VisitRoute };