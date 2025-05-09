import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes, UserRole } from "../../../../core/types/Constent/common";
import { IGifts, GiftsC, GiftsR, GiftsU, GiftsD } from "../../../../core/types/GiftsService/GiftsService";
import { Gifts } from "../../Controllers/GiftDistributionController/GiftDistributionController";
import { IUser } from "../../../../core/types/AuthService/AuthService";

const router = express.Router();

router.post('/addGifts', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GiftsC = RequestHandler.Defaults.getBody<GiftsC>(req, GiftsC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const GiftsServices = new Gifts()
        const data = await GiftsServices.createGifts(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getGifts', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GiftsR = RequestHandler.Defaults.getQuery<GiftsR>(req, GiftsR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const GiftsServices = new Gifts()
        const data = await GiftsServices.getGifts(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


router.get('/getGiftsById/:giftId', validateDtoMiddleware(GiftsR), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GiftsR = RequestHandler.Defaults.getParams<GiftsR>(req, GiftsR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new Gifts();
        const data = await service.getGiftsById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


router.get('/getGiftsByDate', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GiftsR = RequestHandler.Defaults.getQuery<GiftsR>(req, GiftsR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new Gifts();
        const data = await service.getGiftsByDate(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/updateGifts', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GiftsU = RequestHandler.Defaults.getBody<GiftsU>(req, GiftsU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const GiftsServices = new Gifts();
        const data = await GiftsServices.editGifts(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/deleteGifts/:giftId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GiftsD = RequestHandler.Defaults.getParams<GiftsD>(req, GiftsD);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const GiftsServices = new Gifts();
        const data = await GiftsServices.deleteGifts(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


export { router as GiftsRouter };