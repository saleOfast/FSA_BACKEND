import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { DashboardFilter, IUser, TargetFilter, TargetSummaryFilter } from "../../../../core/types/AuthService/AuthService";
import { CreateTarget, DeleteTarget, GetAllTarget, GetTarget, List, UpdateTarget, UpsertTarget } from "../../../../core/types/TargetService/TargetService";
import { TargetService } from "../../../../api/v1/Controllers/TargetController/Target.controller";
import { TargetService as NewTargetService } from "../../../../api/v1/Controllers/NewTargetController copy/New.Target.controller";
import catchAsync from "../../../../core/utils/catch-async";
const router = express.Router();

// router.post('/add', validateDtoMiddleware(CreateTarget), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: any = RequestHandler.Defaults.getBody<CreateTarget>(req, CreateTarget);
//         const payload: IUser = RequestHandler.Custom.getUser(req);
//         const targetService = new TargetService();
//         const data = await targetService.add(input, payload);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });

// router.post('/yearly-chart', validateDtoMiddleware(UpdateTarget), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: UpdateTarget = RequestHandler.Defaults.getBody<UpdateTarget>(req, UpdateTarget);
//         const payload: IUser = RequestHandler.Custom.getUser(req);
//         const targetService = new TargetService();
//         const data = await targetService.getYearlyTargetById(payload, input);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });



//*****************************New Target APIs*************************************

router.get('/getById/:targetId', validateDtoMiddleware(GetTarget), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetTarget = RequestHandler.Defaults.getParams<GetTarget>(req, GetTarget);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const targetService = new NewTargetService();
        const data = await targetService.getTargetById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getAllByEmpId', validateDtoMiddleware(GetAllTarget), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetAllTarget = RequestHandler.Defaults.getQuery<GetAllTarget>(req, GetAllTarget);
        // const payload: IUser = RequestHandler.Custom.getUser(req);
        const targetService = new NewTargetService();
        const data = await targetService.getTargetByEmpId(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:targetId', validateDtoMiddleware(DeleteTarget), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteTarget = RequestHandler.Defaults.getParams<DeleteTarget>(req, DeleteTarget);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const TargetService = new NewTargetService();
        const data = await TargetService.delete(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/yearly-chart', validateDtoMiddleware(TargetFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), catchAsync(async (req: Request, res: Response) => {
    try {
        const input: any = RequestHandler.Defaults.getQuery<DashboardFilter>(req, DashboardFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const profileController = new NewTargetService();
        const data = await profileController.getYearlyTargetById(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

router.post('/update', validateDtoMiddleware(UpsertTarget), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpsertTarget = RequestHandler.Defaults.getBody<UpsertTarget>(req, UpsertTarget);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const targetService = new NewTargetService();
        const data = await targetService.upsertTarget(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


router.get('/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const input: List = RequestHandler.Defaults.getQuery<List>(req, List);
        const targetService = new NewTargetService();
        const data = await targetService.list(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as TargetRouter }