import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateColour, DeleteColour, GetColour, UpdateColour } from "../../../../core/types/ReasonService/ReasonService";
import { ColourService } from "../../../../api/v1/Controllers/ColourController/Colour.controller";
const router = express.Router();

router.post('/add', validateDtoMiddleware(CreateColour), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateColour = RequestHandler.Defaults.getBody<CreateColour>(req, CreateColour);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new ColourService();
        const data = await service.add(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new ColourService();
        const data = await service.list(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post('/update', validateDtoMiddleware(UpdateColour), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateColour = RequestHandler.Defaults.getBody<UpdateColour>(req, UpdateColour);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new ColourService();
        const data = await service.update(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getById/:colourId', validateDtoMiddleware(GetColour), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetColour = RequestHandler.Defaults.getParams<GetColour>(req, GetColour);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new ColourService();
        const data = await service.getColourById(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:colourId', validateDtoMiddleware(DeleteColour), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteColour = RequestHandler.Defaults.getParams<DeleteColour>(req, DeleteColour);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new ColourService();
        const data = await service.delete(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.post(
    '/import',
    validateDtoMiddleware(CreateColour), // Validate an array of CreateColour DTOs
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
      try {
        // Get the array of colors from the request body
        const inputs: CreateColour[] = RequestHandler.Defaults.getBody<CreateColour[]>(req);
  
        // Get the user payload
        const payload: IUser = RequestHandler.Custom.getUser(req);
  
        // Create an instance of ColourService and pass the array of colors
        const service = new ColourService();
        const data = await service.addMultiple(inputs, payload); // Ensure you have addMultiple in ColourService
  
        // Send the response back
        ResponseHandler.sendResponse(res, data);
      } catch (error) {
        // Handle any errors
        ResponseHandler.sendErrorResponse(res, error);
      }
    }
  );
  
export { router as ColourRouter }