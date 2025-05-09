import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes, UserRole } from "../../../../core/types/Constent/common";
import { PolicyTypeHeadC, PolicyTypeHeadD, PolicyTypeHeadR, PolicyTypeHeadU } from "../../../../core/types/PolicyTypeHeadService/PolicyTypeHeadService";
import { PolicyHeadType } from "../../Controllers/PolicyHeadTypeController/PolicyHeadTypeController";
import { IUser } from "../../../../core/types/AuthService/AuthService";

const router = express.Router();

router.post('/addPolicyType', validateDtoMiddleware(PolicyTypeHeadC),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: PolicyTypeHeadC = RequestHandler.Defaults.getBody<PolicyTypeHeadC>(req, PolicyTypeHeadC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const attendanceService = new PolicyHeadType()
        const data = await attendanceService.addPolicyType(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getPolicyType/:policy_id', validateDtoMiddleware(PolicyTypeHeadR),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: PolicyTypeHeadR = RequestHandler.Defaults.getBody<PolicyTypeHeadR>(req, PolicyTypeHeadR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const attendanceService = new PolicyHeadType()
        const data = await attendanceService.getPolicyHeadTypeIDWise(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getPolicyTypeById/:policy_type_id', validateDtoMiddleware(PolicyTypeHeadR),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: PolicyTypeHeadR = RequestHandler.Defaults.getBody<PolicyTypeHeadR>(req, PolicyTypeHeadR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new PolicyHeadType()
        const data = await service.getPolicyTypeById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/updatePolicyType', validateDtoMiddleware(PolicyTypeHeadU),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: PolicyTypeHeadU = RequestHandler.Defaults.getBody<PolicyTypeHeadU>(req, PolicyTypeHeadU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const attendanceService = new PolicyHeadType()
        const data = await attendanceService.editPolicyHeadType(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/deletePolicyType/:policy_type_id', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: PolicyTypeHeadD = RequestHandler.Defaults.getParams<PolicyTypeHeadD>(req, PolicyTypeHeadD);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const attendanceService = new PolicyHeadType()
        const data = await attendanceService.deletePolicyHeadType(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as PolicyHeadTypeRouter };