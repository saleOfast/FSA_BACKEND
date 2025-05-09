import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IDar, DarC, DarR, DarU, DarD } from "../../../../core/types/DarService/DarService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { EDetainingController } from "../../../../api/v1/Controllers/EDetailingController/EDetailing.Controller";
// import { DarController } from "api/v1/Controllers/DarController/Dar.Controller";

const router = express.Router();

router.post('/add', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DarC = RequestHandler.Defaults.getBody<DarC>(req, DarC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const services = new EDetainingController()
        const data = await services.createEDetailing(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/get', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DarC = RequestHandler.Defaults.getQuery<DarC>(req, DarC);
        const services = new EDetainingController()
        const data = await services.getEDetailing(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById/:e_detailing_id', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: any = RequestHandler.Defaults.getParams(req);
        const services = new EDetainingController()
        const data = await services.getEDetailingById(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/update', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DarU = RequestHandler.Defaults.getBody<DarU>(req, DarU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const services = new EDetainingController();
        const data = await services.editEDetailing(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:e_detailing_id', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DarD = RequestHandler.Defaults.getParams<DarD>(req, DarD);
        const services = new EDetainingController();
        const data = await services.deleteEDetailing(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


export { router as EDetailingRouter };