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
exports.UsersListRoute = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const Users_controller_1 = require("../../Controllers/UsersController/Users.controller");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const AuthService_1 = require("../../../../core/types/AuthService/AuthService");
const common_1 = require("../../../../core/types/Constent/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const auth_controller_1 = require("../../Controllers/AuthController/auth.controller");
const router = express_1.default.Router();
exports.UsersListRoute = router;
router.get('/list', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const usersListService = new Users_controller_1.UsersListService();
        const data = yield usersListService.getUsersList(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/managersList', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersListService = new Users_controller_1.UsersListService();
        const data = yield usersListService.getManagersList();
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/userDetails/:empId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, AuthService_1.GetUsers);
        const usersListService = new Users_controller_1.UsersListService();
        const data = yield usersListService.getUserDetails(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/update', (0, validationMiddleware_1.validateDtoMiddleware)(AuthService_1.UpdateUser), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, AuthService_1.UpdateUser);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const brandService = new Users_controller_1.UsersListService();
        const data = yield brandService.updateUser(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
// router.get('/getById/:brandId', validateDtoMiddleware(GetBrand), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
//     try {
//         const input: GetBrand = RequestHandler.Defaults.getParams<GetBrand>(req, GetBrand);
//         const payload: IUser = RequestHandler.Custom.getUser(req);
//         const brandService = new BrandService();
//         const data = await brandService.getBrandById(payload, input);
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// });
router.delete('/delete/:empId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, AuthService_1.DeleteUser);
        // const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new Users_controller_1.UsersListService();
        const data = yield brandService.deleteUser(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/learningRoleList', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersListService = new Users_controller_1.UsersListService();
        const data = yield usersListService.getLearningRoleList();
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getStoresByEmpId/:empId', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, AuthService_1.GetUsers);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const usersListService = new Users_controller_1.UsersListService();
        const data = yield usersListService.getStoresByEmpId(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getStoresByBeatId/:beatId', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, AuthService_1.GetUsers);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const usersListService = new Users_controller_1.UsersListService();
        const data = yield usersListService.getStoresByBeatId(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/importUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the body which should be an array of SignUp data
        const inputs = RequestHander_1.RequestHandler.Defaults.getBody(req);
        // Validate that the input is an array
        if (!Array.isArray(inputs)) {
            return res.status(400).json({ message: 'Expected an array of sign-up data.' });
        }
        // Validate each input object
        for (const input of inputs) {
            const errors = (0, class_validator_1.validateSync)((0, class_transformer_1.plainToInstance)(AuthService_1.SignUp, input));
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }
        }
        // Process the array of sign-ups
        const results = yield auth_controller_1.userController.createUsers(inputs);
        validationMiddleware_1.ResponseHandler.sendResponse(res, results);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
