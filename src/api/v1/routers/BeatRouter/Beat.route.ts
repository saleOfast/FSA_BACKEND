import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateBeat, DeleteBeat, GetBeat, GetBeatOnVisit, UpdateBeat } from "../../../../core/types/BeatService/Beat";
import { BeatService } from "../../Controllers/BeatController/Beat.controller";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreateBeat),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateBeat = RequestHandler.Defaults.getBody<CreateBeat>(req, CreateBeat);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const beatService = new BeatService();
        const data = await beatService.createBeat(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/beatList', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetBeatOnVisit = RequestHandler.Defaults.getQuery<GetBeatOnVisit>(req, GetBeatOnVisit);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const beatService = new BeatService();
        const data = await beatService.beatList(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/update', validateDtoMiddleware(UpdateBeat), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateBeat = RequestHandler.Defaults.getBody<UpdateBeat>(req, UpdateBeat);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new BeatService();
        const data = await brandService.update(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById/:beatId', validateDtoMiddleware(GetBeat), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetBeat = RequestHandler.Defaults.getParams<GetBeat>(req, GetBeat);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new BeatService();
        const data = await brandService.getBeatById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:beatId', validateDtoMiddleware(DeleteBeat), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteBeat = RequestHandler.Defaults.getParams<DeleteBeat>(req, DeleteBeat);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new BeatService();
        const data = await brandService.delete(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as BeatRoute };