"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const response = __importStar(require("../../../../core/utils/response"));
const auth_controller_1 = require("../../Controllers/AuthController/auth.controller");
const catch_async_1 = __importDefault(require("../../../../core/utils/catch-async"));
const verifyToken_1 = require("../../../../core/helper/verifyToken");
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const AuthService_1 = require("../../../../core/types/AuthService/AuthService");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const router = express_1.default.Router();
exports.UserRoute = router;
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '../../../../views'));
router.post('/login', (0, validationMiddleware_1.validateDtoMiddleware)(AuthService_1.Login), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, AuthService_1.Login);
        const data = yield auth_controller_1.userController.login(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        console.log(error, 'error==============login');
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.post('/signUp', (0, validationMiddleware_1.validateDtoMiddleware)(AuthService_1.SignUp), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, AuthService_1.SignUp);
        const data = yield auth_controller_1.userController.createUser(input);
        response.success(res, data);
    }
    catch (error) {
        response.serverError(res, error);
    }
}));
// router.get('/verifyEmail', verifyEmailToken, catchAsync(async (req: Express.Request, res: any) => {
//     const userId = (req as any).user._id;
//     const data = await userController.verifyEmail(userId);
//     const url = process.env.HOST + `/authentication/login`;
//     res.redirect(url);
// }))
// router.get('/token', verifyRefreshToken, catchAsync(async (req: any, res: Response) => {
//     try {
//         const input = req.user;
//         const refreshToken = req.refreshTokenParam;
//         const data = await userController.token(input, refreshToken);
//         response.success(res, data);
//     } catch (error) {
//         response.serverError(res);
//     }
// }));
router.post('/forgotPassword', (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const input: ForgetPassword = RequestHandler.Defaults.getBody<ForgetPassword>(req, ForgetPassword);
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, AuthService_1.ForgetPassword);
        const data = yield auth_controller_1.userController.forgotPassword(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
router.get('/reset-password/:id/:role', (0, validationMiddleware_1.validateDtoMiddleware)(AuthService_1.ResetPassword), (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, AuthService_1.ResetPassword);
        const data = yield auth_controller_1.userController.forgotRedirect(input);
        if (data.status === 200) {
            res.setHeader('X-Token-Verified', 'true');
            res.redirect(302, `http://mrapp.saleofast.com/auth/confirm-password?empId=${input.id}`);
        }
        else {
            res.redirect("authError");
            // ResponseHandler.sendResponse(res, data);
        }
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
router.get('/reset-password/:id/:token', verifyToken_1.verifyEmailToken, (0, validationMiddleware_1.validateDtoMiddleware)(AuthService_1.ResetPassword), (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, AuthService_1.ResetPassword);
        const data = yield auth_controller_1.userController.forgotRedirect(input);
        if (data.status === 200) {
            res.setHeader('X-Token-Verified', 'true');
            res.redirect(302, `http://mrapp.saleofast.com/auth/confirm-password?empId=${input.id}`);
        }
        else {
            res.redirect("authError");
            // ResponseHandler.sendResponse(res, data);
        }
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
router.post('/reset-password', (0, validationMiddleware_1.validateDtoMiddleware)(AuthService_1.ResetConfirmPassword), (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, AuthService_1.ResetConfirmPassword);
        const data = yield auth_controller_1.userController.resetPasswordConfirm(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
})));
