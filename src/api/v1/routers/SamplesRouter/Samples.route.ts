import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes, UserRole } from "../../../../core/types/Constent/common";
import { ISamples, SamplesC, SamplesR, SamplesU, SamplesD } from "../../../../core/types/SamplesService/SamplesService";
import { Samples } from "../../Controllers/SamplesController/SamplesController";
import { IUser } from "../../../../core/types/AuthService/AuthService";

const router = express.Router();

router.post('/addSamples', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: SamplesC = RequestHandler.Defaults.getBody<SamplesC>(req, SamplesC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const SamplesServices = new Samples()
        const data = await SamplesServices.createSamples(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getSamples', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: SamplesR = RequestHandler.Defaults.getQuery<SamplesR>(req, SamplesR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const SamplesServices = new Samples()
        const data = await SamplesServices.getSamples(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getSamplesByDate', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: SamplesR = RequestHandler.Defaults.getQuery<SamplesR>(req, SamplesR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const SamplesServices = new Samples()
        const data = await SamplesServices.getSamplesByDate(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getSamplesById/:samplesId', validateDtoMiddleware(SamplesR), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: SamplesR = RequestHandler.Defaults.getParams<SamplesR>(req, SamplesR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new Samples();
        const data = await service.getSamplesById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/updateSamples', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: SamplesU = RequestHandler.Defaults.getBody<SamplesU>(req, SamplesU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const SamplesServices = new Samples();
        const data = await SamplesServices.editSamples(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/deleteSamples/:samplesId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: SamplesD = RequestHandler.Defaults.getParams<SamplesD>(req, SamplesD);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const SamplesServices = new Samples();
        const data = await SamplesServices.deleteSamples(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


export { router as SamplesRouter };