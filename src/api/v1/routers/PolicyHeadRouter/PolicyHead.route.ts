import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes, UserRole } from "../../../../core/types/Constent/common";
import { IPolicyHead, PolicyHeadC, PolicyHeadR, PolicyHeadU, PolicyHeadD } from "../../../../core/types/PolicyHeadService/PolicyHeadService";
import { PolicyHead } from "../../Controllers/PolicyHeadController/PolicyHeadController";
import { IUser } from "../../../../core/types/AuthService/AuthService";

const router = express.Router();

router.post('/addPolicyHead', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: PolicyHeadC = RequestHandler.Defaults.getBody<PolicyHeadC>(req, PolicyHeadC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const policyHeadServices = new PolicyHead()
        const data = await policyHeadServices.createPolicyHead(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getPolicyHead', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: PolicyHeadR = RequestHandler.Defaults.getQuery<PolicyHeadR>(req, PolicyHeadR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const policyHeadServices = new PolicyHead()
        const data = await policyHeadServices.getPolicyHead(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getPolicyHeadById/:policy_id', validateDtoMiddleware(PolicyHeadR), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: PolicyHeadR = RequestHandler.Defaults.getParams<PolicyHeadR>(req, PolicyHeadR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new PolicyHead();
        const data = await service.getPolicyHeadById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/updatePolicyHead', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: PolicyHeadU = RequestHandler.Defaults.getBody<PolicyHeadU>(req, PolicyHeadU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const policyHeadServices = new PolicyHead();
        const data = await policyHeadServices.editPolicyHead(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/deletePolicyHead/:policyId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
                // const input: DeleteBeat = RequestHandler.Defaults.getParams<DeleteBeat>(req, DeleteBeat);
        const input: PolicyHeadD = RequestHandler.Defaults.getParams<PolicyHeadD>(req, PolicyHeadD);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const policyHeadServices = new PolicyHead();
        const data = await policyHeadServices.deletePolicyHead(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});


export { router as PolicyHeadRouter };