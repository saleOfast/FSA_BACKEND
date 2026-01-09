import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreatePriceBookItemDTO , UpdatePriceBookItemDTO , GetAllPriceBookItemDTO , GetPriceBookItemByIdDTO, DeletePriceBookItemDTO } from "../../../../core/types/PriceBookItemService/PriceBookItmService";
import { PriceBookItemService } from "../../Controllers/PriceBookItmController/PriceBookItm.Controller";
import { PriceBookService } from "api/v1/Controllers/PriceBookController/PriceBook.controller";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreatePriceBookItemDTO),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreatePriceBookItemDTO = RequestHandler.Defaults.getBody<CreatePriceBookItemDTO>(req, CreatePriceBookItemDTO);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const priceBookItemService = new PriceBookItemService();
        const data = await priceBookItemService.createPriceBookItem(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete(
  '/delete/:priceBookItemId',
  validateDtoMiddleware(DeletePriceBookItemDTO),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: DeletePriceBookItemDTO =
        RequestHandler.Defaults.getParams<DeletePriceBookItemDTO>(
          req,
          DeletePriceBookItemDTO
        );

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const priceBookItemService = new PriceBookItemService();

      const data = await priceBookItemService.deletePriceBookItem(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  '/getById/:priceBookItemId',
  validateDtoMiddleware(GetPriceBookItemByIdDTO),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: GetPriceBookItemByIdDTO =
        RequestHandler.Defaults.getParams<GetPriceBookItemByIdDTO>(
          req,
          GetPriceBookItemByIdDTO
        );

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const priceBookItemService = new PriceBookItemService();

      const data = await priceBookItemService.getPriceBookItemById(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);


router.get(
  '/list',
  validateDtoMiddleware(GetAllPriceBookItemDTO),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: GetAllPriceBookItemDTO =
        RequestHandler.Defaults.getQuery<GetAllPriceBookItemDTO>(
          req,
          GetAllPriceBookItemDTO
        );

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const priceBookItemService = new PriceBookItemService();

      const data = await priceBookItemService.getAllPriceBookItems(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.put(
  "/update",
  validateDtoMiddleware(UpdatePriceBookItemDTO),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: UpdatePriceBookItemDTO =
        RequestHandler.Defaults.getBody<UpdatePriceBookItemDTO>(req, UpdatePriceBookItemDTO);

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const priceBookItemService = new PriceBookItemService();
      // ✅ correct argument order
      const data = await priceBookItemService.updatePriceBookItem(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);


export
 { router as PriceBookItmRoute };
 