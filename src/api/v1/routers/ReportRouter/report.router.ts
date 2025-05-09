import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { UsersListService } from "../../Controllers/UsersController/Users.controller";
import {  RequestHandler } from "../../../../core/helper/RequestHander";
import { DeleteUser, GetUsers, IUser, UpdateUser } from "../../../../core/types/AuthService/AuthService";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
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

export { router as ReportRoute };