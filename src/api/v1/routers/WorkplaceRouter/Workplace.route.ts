import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes, UserRole } from "../../../../core/types/Constent/common";
import { IWorkplace, WorkplaceC, WorkplaceR, WorkplaceU, WorkplaceD } from "../../../../core/types/WorkplaceService/WorkplaceService";
import { Workplace } from "../../Controllers/WorkplaceController/WorkplaceController";
import { IUser } from "../../../../core/types/AuthService/AuthService";

const router = express.Router();

router.post('/addWorkplace', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: WorkplaceC = RequestHandler.Defaults.getBody<WorkplaceC>(req, WorkplaceC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const WorkplaceServices = new Workplace()
        const data = await WorkplaceServices.createWorkplace(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getWorkplace', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: WorkplaceR = RequestHandler.Defaults.getQuery<WorkplaceR>(req, WorkplaceR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const WorkplaceServices = new Workplace()
        const data = await WorkplaceServices.getWorkplace(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getWorkplaceById/:workplaceId', validateDtoMiddleware(WorkplaceR), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: WorkplaceR = RequestHandler.Defaults.getParams<WorkplaceR>(req, WorkplaceR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new Workplace();
        const data = await service.getWorkplaceById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/updateWorkplace', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: WorkplaceU = RequestHandler.Defaults.getBody<WorkplaceU>(req, WorkplaceU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const WorkplaceServices = new Workplace();
        const data = await WorkplaceServices.editWorkplace(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/deleteWorkplace/:workplaceId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: WorkplaceD = RequestHandler.Defaults.getParams<WorkplaceD>(req, WorkplaceD);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const WorkplaceServices = new Workplace();
        const data = await WorkplaceServices.deleteWorkplace(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


export { router as WorkplaceRouter };