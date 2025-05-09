import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { UsersListService } from "../../Controllers/UsersController/Users.controller";
import {  RequestHandler } from "../../../../core/helper/RequestHander";
import { DeleteUser, GetUsers, IUser, SignUp, UpdateUser } from "../../../../core/types/AuthService/AuthService";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { validateSync } from "class-validator";
import { plainToInstance } from "class-transformer";
import { userController } from "../../Controllers/AuthController/auth.controller";
const router = express.Router();


router.get('/list',  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const usersListService = new UsersListService();
        const data = await usersListService.getUsersList(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/managersList', async (req: Request, res: Response) => {
    try {
        const usersListService = new UsersListService();
        const data = await usersListService.getManagersList();
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/userDetails/:empId', async (req: Request, res: Response) => {
    try {
        const input: GetUsers = RequestHandler.Defaults.getParams<GetUsers>(req, GetUsers);
        const usersListService = new UsersListService();
        const data = await usersListService.getUserDetails(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/update', validateDtoMiddleware(UpdateUser), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateUser = RequestHandler.Defaults.getBody<UpdateUser>(req, UpdateUser);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new UsersListService();
        const data = await brandService.updateUser(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

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

router.delete('/delete/:empId',   async (req: Request, res: Response) => {
    try {
        const input: DeleteUser = RequestHandler.Defaults.getParams<DeleteUser>(req, DeleteUser);
        // const payload: IUser = RequestHandler.Custom.getUser(req);
        const brandService = new UsersListService();
        const data = await brandService.deleteUser(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/learningRoleList', async (req: Request, res: Response) => {
    try {
        const usersListService = new UsersListService();
        const data = await usersListService.getLearningRoleList();
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getStoresByEmpId/:empId',AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetUsers = RequestHandler.Defaults.getParams<GetUsers>(req, GetUsers);
        const payload: IUser = RequestHandler.Custom.getUser(req);
       
        const usersListService = new UsersListService();
        const data = await usersListService.getStoresByEmpId(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getStoresByBeatId/:beatId',AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetUsers = RequestHandler.Defaults.getParams<GetUsers>(req, GetUsers);
        const payload: IUser = RequestHandler.Custom.getUser(req);
       
        const usersListService = new UsersListService();
        const data = await usersListService.getStoresByBeatId(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/importUser',
    async (req: Request, res: Response) => {
        try {
            // Extract the body which should be an array of SignUp data
            const inputs: SignUp[] = RequestHandler.Defaults.getBody<SignUp[]>(req);

            // Validate that the input is an array
            if (!Array.isArray(inputs)) {
                return res.status(400).json({ message: 'Expected an array of sign-up data.' });
            }

            // Validate each input object
            for (const input of inputs ) {
                const errors = validateSync(plainToInstance(SignUp, input));
                if (errors.length > 0) {
                    return res.status(400).json({ errors });
                }
            }

            // Process the array of sign-ups
            const results: any = await userController.createUsers(inputs);

            ResponseHandler.sendResponse(res, results);
        } catch (error) {
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
);

export { router as UsersListRoute };