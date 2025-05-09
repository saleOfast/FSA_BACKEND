import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateRole, DeleteRole, GetRole, IsActiveRole, UpdateRole } from "../../../../core/types/ReasonService/ReasonService";
import { RoleService } from "../../../../api/v1/Controllers/RoleController/Role.controller";
const router = express.Router();

router.post('/add', validateDtoMiddleware(CreateRole), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateRole = RequestHandler.Defaults.getBody<CreateRole>(req, CreateRole);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new RoleService();
        const data = await service.add(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const input: IsActiveRole = RequestHandler.Defaults.getQuery<IsActiveRole>(req, IsActiveRole);
        const service = new RoleService();
        const data = await service.list(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/update', validateDtoMiddleware(UpdateRole), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateRole = RequestHandler.Defaults.getBody<UpdateRole>(req, UpdateRole);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new RoleService();
        const data = await service.update(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById/:roleId', validateDtoMiddleware(GetRole), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetRole = RequestHandler.Defaults.getParams<GetRole>(req, GetRole);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new RoleService();
        const data = await service.getRoleById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:roleId', validateDtoMiddleware(DeleteRole), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteRole = RequestHandler.Defaults.getParams<DeleteRole>(req, DeleteRole);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new RoleService();
        const data = await service.delete(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as RoleRouter }