import express, { Request, Response } from "express";
import catchAsync from '../../../../../core/utils/catch-async';
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../../core/helper/validationMiddleware";
import { DashboardFilter, DeleteUserProfile, IUser, UpdateApprovalStore, UpdateUserProfile } from "../../../../../core/types/AuthService/AuthService";
import { RequestHandler } from "../../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../../core/types/Constent/common";
import { profileService } from "../../../Controllers/AuthController/ProfileController/Profile.Controller";

const router = express.Router();

router.get('/get', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), catchAsync(async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const profileController = new profileService();
        const data = await profileController.getProfile(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

router.put('/updateProfile', validateDtoMiddleware(UpdateUserProfile), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), catchAsync(async (req: Request, res: Response) => {
    try {
        const input: UpdateUserProfile = RequestHandler.Defaults.getBody<UpdateUserProfile>(req, UpdateUserProfile);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const profileController = new profileService();
        const data = await profileController.updateImage(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

router.get('/dashboard', validateDtoMiddleware(DashboardFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), catchAsync(async (req: Request, res: Response) => {
    try {
        const input: DashboardFilter = RequestHandler.Defaults.getQuery<DashboardFilter>(req, DashboardFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const profileController = new profileService();
        const data = await profileController.dashboard(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

router.get('/retailor/dashboard', validateDtoMiddleware(DashboardFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), catchAsync(async (req: Request, res: Response) => {
    try {
        const input: DashboardFilter = RequestHandler.Defaults.getQuery<DashboardFilter>(req, DashboardFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const profileController = new profileService();
        const data = await profileController.retailorDashboard(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

router.get('/admin/dashboard', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), catchAsync(async (req: Request, res: Response) => {
    try {
        const input: DashboardFilter = RequestHandler.Defaults.getQuery<DashboardFilter>(req, DashboardFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const profileController = new profileService();
        const data = await profileController.adminDashboard(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

router.get('/admin/dashboard/revenue-chart', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), catchAsync(async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const profileController = new profileService();
        const data = await profileController.revenueChart(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

router.post('/admin/update/approvalStore', validateDtoMiddleware(UpdateApprovalStore), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateApprovalStore = RequestHandler.Defaults.getBody<UpdateApprovalStore>(req, UpdateApprovalStore);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const profileController = new profileService();
        const data = await profileController.updateApprovalStore(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/deleteProfilePic/:empId', validateDtoMiddleware(DeleteUserProfile), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), catchAsync(async (req: Request, res: Response) => {
    try {
        const input: DeleteUserProfile = RequestHandler.Defaults.getParams<DeleteUserProfile>(req, DeleteUserProfile);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const profileController = new profileService();
        const data = await profileController.deleteProfile(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

router.get('/home/today-achievement',  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        // const input: dayTrackingFilter = RequestHandler.Defaults.getQuery<dayTrackingFilter>(req, dayTrackingFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new profileService();
        const data = await service.homeTodayAchievement(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/home/today-order-value',  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        // const input: dayTrackingFilter = RequestHandler.Defaults.getQuery<dayTrackingFilter>(req, dayTrackingFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new profileService();
        const data = await service.homeTodayOrderValue(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/home/month-achievement',  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        // const input: dayTrackingFilter = RequestHandler.Defaults.getQuery<dayTrackingFilter>(req, dayTrackingFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new profileService();
        const data = await service.homeCurrentMonthAchievement(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as ProfileRoute };