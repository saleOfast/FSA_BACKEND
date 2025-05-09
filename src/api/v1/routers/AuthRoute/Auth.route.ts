import express, { Request, Response } from "express";
import * as response from '../../../../core/utils/response';
import { userController } from '../../Controllers/AuthController/auth.controller';
import catchAsync from '../../../../core/utils/catch-async';
import { verifyEmailToken } from '../../../../core/helper/verifyToken';
import { ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { ForgetPassword, Login, ResetConfirmPassword, ResetPassword, SignUp } from "../../../../core/types/AuthService/AuthService";
import { RequestHandler } from "../../../../core/helper/RequestHander";

const router = express.Router();
const app = express();
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '../../../../views'));

router.post('/login', validateDtoMiddleware(Login), async (req: Request, res: Response) => {
    try {
        const input: Login = RequestHandler.Defaults.getBody<Login>(req, Login);
        const data = await userController.login(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        console.log(error, 'error==============login')
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/signUp', validateDtoMiddleware(SignUp), async (req: Request, res: Response) => {
    try {
        const input: SignUp = RequestHandler.Defaults.getBody<SignUp>(req, SignUp);
        const data = await userController.createUser(input);
        response.success(res, data);
    } catch (error: any) {
        response.serverError(res, error)
    }
});

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

router.post('/forgotPassword', catchAsync(async (req: Request, res: Response) => {
    try {
        // const input: ForgetPassword = RequestHandler.Defaults.getBody<ForgetPassword>(req, ForgetPassword);
        const input: any = RequestHandler.Defaults.getBody<any>(req, ForgetPassword);
       
        const data = await userController.forgotPassword(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/reset-password/:id/:role' , validateDtoMiddleware(ResetPassword), catchAsync(async (req: Request, res: Response) => {
    try {
        const input: ResetPassword = RequestHandler.Defaults.getParams<ResetPassword>(req, ResetPassword);
        const data = await userController.forgotRedirect(input);
        if(data.status === 200){
            res.setHeader('X-Token-Verified', 'true');
            res.redirect(302, `http://mrapp.saleofast.com/auth/confirm-password?empId=${input.id}`);
        }else{
            res.redirect("authError")
        // ResponseHandler.sendResponse(res, data);

        }
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

router.get('/reset-password/:id/:token' , verifyEmailToken, validateDtoMiddleware(ResetPassword), catchAsync(async (req: Request, res: Response) => {
    try {
        const input: ResetPassword = RequestHandler.Defaults.getParams<ResetPassword>(req, ResetPassword);
        const data = await userController.forgotRedirect(input);
        if(data.status === 200){
            res.setHeader('X-Token-Verified', 'true');
            res.redirect(302, `http://mrapp.saleofast.com/auth/confirm-password?empId=${input.id}`);
        }else{
            res.redirect("authError")
        // ResponseHandler.sendResponse(res, data);

        }
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

router.post('/reset-password' , validateDtoMiddleware(ResetConfirmPassword), catchAsync(async (req: Request, res: Response) => {
    try {
        const input: ResetConfirmPassword = RequestHandler.Defaults.getBody<ResetConfirmPassword>(req, ResetConfirmPassword);
        const data = await userController.resetPasswordConfirm(input);
            ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

export { router as UserRoute };