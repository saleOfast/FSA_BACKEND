import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateSize, DeleteSize, GetSize, UpdateSize } from "../../../../core/types/ReasonService/ReasonService";
import { SizeService } from "../../../../api/v1/Controllers/SizeController/Size.controller";
const router = express.Router();

router.post('/add', validateDtoMiddleware(CreateSize), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateSize = RequestHandler.Defaults.getBody<CreateSize>(req, CreateSize);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new SizeService();
        const data = await service.add(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new SizeService();
        const data = await service.list(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/update', validateDtoMiddleware(UpdateSize), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateSize = RequestHandler.Defaults.getBody<UpdateSize>(req, UpdateSize);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new SizeService();
        const data = await service.update(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById/:sizeId', validateDtoMiddleware(GetSize), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetSize = RequestHandler.Defaults.getParams<GetSize>(req, GetSize);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new SizeService();
        const data = await service.getSizeById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:sizeId', validateDtoMiddleware(DeleteSize), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteSize = RequestHandler.Defaults.getParams<DeleteSize>(req, DeleteSize);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new SizeService();
        const data = await service.delete(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post(
    '/import',
    validateDtoMiddleware(CreateSize), // Validate an array of CreateSize DTOs
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
        try {
            // Get the array of sizes from the request body
            const inputs: CreateSize[] = RequestHandler.Defaults.getBody<CreateSize[]>(req);

            // Get the user payload
            const payload: IUser = RequestHandler.Custom.getUser(req);

            // Create an instance of the SizeService and pass the array of sizes
            const sizeService = new SizeService();
            const data = await sizeService.addMultiple(inputs, payload); // Ensure `addMultiple` method exists

            // Send the response back
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            // Handle any errors
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
);

export { router as SizeRouter }