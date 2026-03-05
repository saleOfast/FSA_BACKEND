import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import {IUser} from "../../../../core/types/AuthService/AuthService";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { GrnHeaderCreateDto, GrnHeaderListDto, GrnHeaderUpdateDto } from "../../../../core/types/grnHeaderService/grnHeaderService";
import { GrnHeaderService } from "../../Controllers/GrnHeaderController/GrnHeaderController";

const router = express.Router();

router.post(
  '/create',
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  validateDtoMiddleware(GrnHeaderCreateDto),
  async (req: Request, res: Response) => {
    try{

        const input: GrnHeaderCreateDto = RequestHandler.Defaults.getBody<GrnHeaderCreateDto>(req, GrnHeaderCreateDto);
         const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new GrnHeaderService();
        const data = await service.createGrnHeader(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
      throw error;
    }
  }
);

router.put(
    '/update',
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    validateDtoMiddleware(GrnHeaderUpdateDto),
    async (req: Request, res: Response) => {
        try{
            const input: GrnHeaderUpdateDto = RequestHandler.Defaults.getBody<GrnHeaderUpdateDto>(req, GrnHeaderUpdateDto);
            const payload: IUser = RequestHandler.Custom.getUser(req);
            const service = new GrnHeaderService();
            const data = await service.updateGrnHeader(input, payload);
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
          throw error;
        }
      }
);

router.delete('/delete/:grnId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try{
        const input = { grnId: req.params.grnId };
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new GrnHeaderService();
        const data = await service.deleteGrnHeader(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
      throw error;
    }
  }
);

router.get('/getById/:grnId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try{
        const input = { grnId: req.params.grnId };
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new GrnHeaderService();
        const data = await service.getGrnHeaderById(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        throw error;
    }
});

router.get('/list', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try{
                const input:GrnHeaderListDto = RequestHandler.Defaults.getQuery<GrnHeaderListDto>(req, GrnHeaderListDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new GrnHeaderService();
        const data = await service.listGrnHeader(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        throw error;
    }
});

export {router as grnHeaderRouter}