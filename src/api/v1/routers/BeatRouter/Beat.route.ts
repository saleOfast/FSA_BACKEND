import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateBeatDto, DeleteBeatDto, GetBeatDto, UpdateBeatDto, GetAllBeatDto } from "../../../../core/types/BeatService/Beat";
import { BeatService } from "../../Controllers/BeatController/Beat.controller";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreateBeatDto),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateBeatDto = RequestHandler.Defaults.getBody<CreateBeatDto>(req, CreateBeatDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const beatService = new BeatService();
        const data = await beatService.createBeat(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

// router.get('/beatList', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: GetBeatOnVisit = RequestHandler.Defaults.getQuery<GetBeatOnVisit>(req, GetBeatOnVisit);
//         const payload: IUser = RequestHandler.Custom.getUser(req);
//         const beatService = new BeatService();
//         const data = await beatService.beatList(payload, input);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });

router.put('/update', validateDtoMiddleware(UpdateBeatDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateBeatDto = RequestHandler.Defaults.getBody<UpdateBeatDto>(req, UpdateBeatDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new BeatService();
        const data = await brandService.updateBeat(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

// router.get('/getById/:beatId', validateDtoMiddleware(GetBeat), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: GetBeat = RequestHandler.Defaults.getParams<GetBeat>(req, GetBeat);
//         const payload: IUser = RequestHandler.Custom.getUser(req);
//         const brandService = new BeatService();
//         const data = await brandService.getBeatById(payload, input);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });

router.delete('/delete/:beatId', validateDtoMiddleware(DeleteBeatDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteBeatDto = RequestHandler.Defaults.getParams<DeleteBeatDto>(req, DeleteBeatDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new BeatService();
        const data = await brandService.delete(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById/:beatId', validateDtoMiddleware(GetBeatDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetBeatDto = RequestHandler.Defaults.getParams<GetBeatDto>(req, GetBeatDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new BeatService();
        const data = await brandService.getById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getAll', validateDtoMiddleware(GetAllBeatDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetAllBeatDto = RequestHandler.Defaults.getQuery<GetAllBeatDto>(req, GetAllBeatDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new BeatService();
        const data = await brandService.getAllBeats(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export
 { router as BeatRoute };