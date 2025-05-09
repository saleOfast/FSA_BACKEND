import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateBrand, DeleteBrand, GetBrand, UpdateBrand } from "../../../../core/types/BrandService/BrandService";
import { BrandService } from "../../Controllers/BrandController/Brand.controller";
import { CreateReason, DeleteReason, GetReason, UpdateReason } from "../../../../core/types/ReasonService/ReasonService";
import { ReasonService } from "../../Controllers/ReasonController/Reason.controller";
const router = express.Router();

router.post('/add', validateDtoMiddleware(CreateReason), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateReason = RequestHandler.Defaults.getBody<CreateReason>(req, CreateReason);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new ReasonService();
        const data = await service.add(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new ReasonService();
        const data = await service.list(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/update', validateDtoMiddleware(UpdateReason), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateReason = RequestHandler.Defaults.getBody<UpdateReason>(req, UpdateReason);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new ReasonService();
        const data = await service.update(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById/:reasonId', validateDtoMiddleware(GetReason), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetReason = RequestHandler.Defaults.getParams<GetReason>(req, GetReason);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new ReasonService();
        const data = await service.getReasonById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:reasonId', validateDtoMiddleware(DeleteReason), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteReason = RequestHandler.Defaults.getParams<DeleteReason>(req, DeleteReason);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new ReasonService();
        const data = await service.delete(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post(
    '/import',
    validateDtoMiddleware(CreateReason), // Validate an array of CreateReason DTOs
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
      try {
        // Get the array of reasons from the request body
        const inputs: CreateReason[] = RequestHandler.Defaults.getBody<CreateReason[]>(req);
  
        // Get the user payload
        const payload: IUser = RequestHandler.Custom.getUser(req);
  
        // Create an instance of ReasonService and pass the array of reasons
        const service = new ReasonService();
        const data = await service.addMultiple(inputs, payload); // Make sure you implement addMultiple in ReasonService
  
        // Send the response back
        ResponseHandler.sendResponse(res, data);
      } catch (error) {
        // Handle any errors
        ResponseHandler.sendErrorResponse(res, error);
      }
    }
  );
  
export { router as ReasonRouter }