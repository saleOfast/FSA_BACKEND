"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeatRoute = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const Beat_1 = require("../../../../core/types/BeatService/Beat");
const Beat_controller_1 = require("../../Controllers/BeatController/Beat.controller");
const router = express_1.default.Router();
exports.BeatRoute = router;
router.post('/create', (0, validationMiddleware_1.validateDtoMiddleware)(Beat_1.CreateBeatDto), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, Beat_1.CreateBeatDto);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const beatService = new Beat_controller_1.BeatService();
        const data = yield beatService.createBeat(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
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
router.put('/update', (0, validationMiddleware_1.validateDtoMiddleware)(Beat_1.UpdateBeatDto), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, Beat_1.UpdateBeatDto);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const brandService = new Beat_controller_1.BeatService();
        const data = yield brandService.updateBeat(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
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
router.delete('/delete/:beatId', (0, validationMiddleware_1.validateDtoMiddleware)(Beat_1.DeleteBeatDto), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, Beat_1.DeleteBeatDto);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const brandService = new Beat_controller_1.BeatService();
        const data = yield brandService.delete(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getById/:beatId', (0, validationMiddleware_1.validateDtoMiddleware)(Beat_1.GetBeatDto), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, Beat_1.GetBeatDto);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const brandService = new Beat_controller_1.BeatService();
        const data = yield brandService.getById(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getAll', (0, validationMiddleware_1.validateDtoMiddleware)(Beat_1.GetAllBeatDto), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, Beat_1.GetAllBeatDto);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const brandService = new Beat_controller_1.BeatService();
        const data = yield brandService.getAllBeats(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
