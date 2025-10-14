import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {  createPosmDto,updatePosmDto,deletePosmDto,getPosmByIdDto,GetPosmListDto} from "../../../../core/types/PosmService/PosmService";
import { StoreService } from "../../Controllers/StoreController/Store.controller";
import { validateSync } from "class-validator";
import {PosmService} from "../../Controllers/PosmController/Posm.controller"
import { STATUSCODES } from "../../../../core/types/Constent/common";

const router = express.Router();

router.post('/create', validateDtoMiddleware(createPosmDto),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: createPosmDto = RequestHandler.Defaults.getBody<createPosmDto>(req, createPosmDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const posmService = new PosmService();
        const data = await posmService.createposm(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put(
  '/update/:posmId',
  validateDtoMiddleware(updatePosmDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const posmId = Number(req.params.posmId); // Get POSM ID from URL
      const input: updatePosmDto = RequestHandler.Defaults.getBody<updatePosmDto>(req, updatePosmDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      
      const posmService = new PosmService();
      const data = await posmService.updatePosm(posmId, input, payload);
      
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.delete(
  '/delete/:posmId',
  validateDtoMiddleware(deletePosmDto),  // ✅ validate if you pass in body
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: deletePosmDto = RequestHandler.Defaults.getBody<deletePosmDto>(req, deletePosmDto); // ✅ wrap param in DTO
      const payload: IUser = RequestHandler.Custom.getUser(req);

      const posmService = new PosmService();
      const data = await posmService.deletePosm(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);


router.get(
  "/get",
  validateDtoMiddleware(getPosmByIdDto), // validate query parameters
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      // ✅ Parse query params into DTO
  const input: getPosmByIdDto = RequestHandler.Defaults.getQuery<getPosmByIdDto>(req, getPosmByIdDto);


      // ✅ Get authenticated user
      const payload: IUser = RequestHandler.Custom.getUser(req);

      // ✅ Call service method
      const posmService = new PosmService();
      const data = await posmService.getPosm(input, payload);

      // ✅ Send consistent response
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/list",
  validateDtoMiddleware(GetPosmListDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: GetPosmListDto = RequestHandler.Defaults.getQuery<GetPosmListDto>(req, GetPosmListDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const posmService = new PosmService();
      const data = await posmService.listPosms(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);


export { router as PosmRoute };
