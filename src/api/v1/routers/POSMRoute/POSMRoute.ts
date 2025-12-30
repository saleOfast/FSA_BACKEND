import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {  CreatePosmDto,UpdatePosmDto,DeletePosmDto,GetPosmByIdDto,GetPosmListDto} from "../../../../core/types/PosmService/PosmService";
// import { StoreService } from "../../Controllers/StoreController/Store.controller";
import { validateSync } from "class-validator";
import {PosmService} from "..//../Controllers/POSMController/POSMController"
import { STATUSCODES } from "../../../../core/types/Constent/common";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreatePosmDto),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreatePosmDto = RequestHandler.Defaults.getBody<CreatePosmDto>(req, CreatePosmDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const posmService = new PosmService();
        const data = await posmService.createPosm(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put(
  '/update/:posmId',
  validateDtoMiddleware(UpdatePosmDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const posmId = Number(req.params.posmId); // Get POSM ID from URL
      const input: UpdatePosmDto = RequestHandler.Defaults.getBody<UpdatePosmDto>(req, UpdatePosmDto);
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
  validateDtoMiddleware(DeletePosmDto),  // ✅ validate if you pass in body
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: DeletePosmDto = RequestHandler.Defaults.getBody<DeletePosmDto>(req, DeletePosmDto); // ✅ wrap param in DTO
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
  validateDtoMiddleware(GetPosmByIdDto), // validate query parameters
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      // ✅ Parse query params into DTO
  const input: GetPosmByIdDto = RequestHandler.Defaults.getQuery<GetPosmByIdDto>(req, GetPosmByIdDto);


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