import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes, UserRole } from "../../../../core/types/Constent/common";
import { IDar, DarC, DarR, DarU, DarD } from "../../../../core/types/DarService/DarService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { DarController } from "../../../../api/v1/Controllers/DarController/Dar.Controller";
// import { DarController } from "api/v1/Controllers/DarController/Dar.Controller";

const router = express.Router();

router.post('/addDar', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DarC = RequestHandler.Defaults.getBody<DarC>(req, DarC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const DarServices = new DarController()
        const data = await DarServices.createDar(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/listDar', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DarC = RequestHandler.Defaults.getQuery<DarC>(req, DarC);
        const DarServices = new DarController()
        const data = await DarServices.listDar(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getDarById/:dar_id', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DarR = RequestHandler.Defaults.getParams<DarR>(req, DarR);
        const DarServices = new DarController()
        const data = await DarServices.getDarById(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/updateDar', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DarU = RequestHandler.Defaults.getBody<DarU>(req, DarU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const DarServices = new DarController();
        const data = await DarServices.updateDar(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/deleteDar', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DarD = RequestHandler.Defaults.getQuery<DarD>(req, DarD);
        const DarServices = new DarController();
        const data = await DarServices.deleteDar(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


export { router as DarRouter };