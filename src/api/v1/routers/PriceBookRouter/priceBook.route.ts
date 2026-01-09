import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreatePriceBookDto, DeletePriceBookDto, GetPriceBookByIdDto, GetPriceBookDto, UpdatePriceBookDto } from "../../../../core/types/PriceBookService/PriceBookService";
import { PriceBookService } from "../../Controllers/PriceBookController/PriceBook.controller";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreatePriceBookDto),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreatePriceBookDto = RequestHandler.Defaults.getBody<CreatePriceBookDto>(req, CreatePriceBookDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const priceBookService = new PriceBookService();
        const data = await priceBookService.createPriceBook(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put(
  "/update",
  validateDtoMiddleware(UpdatePriceBookDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: UpdatePriceBookDto =
        RequestHandler.Defaults.getBody<UpdatePriceBookDto>(req, UpdatePriceBookDto);

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const priceBookService = new PriceBookService();

      // ✅ correct argument order
      const data = await priceBookService.updatePriceBook(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.delete(
  '/delete/:priceBookId',
  validateDtoMiddleware(DeletePriceBookDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: DeletePriceBookDto =
        RequestHandler.Defaults.getParams<DeletePriceBookDto>(
          req,
          DeletePriceBookDto
        );

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const priceBookService = new PriceBookService();

      const data = await priceBookService.deletePriceBook(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  '/list',
  validateDtoMiddleware(GetPriceBookDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: GetPriceBookDto =
        RequestHandler.Defaults.getQuery<GetPriceBookDto>(
          req,
          GetPriceBookDto
        );

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const priceBookService = new PriceBookService();

      const data = await priceBookService.listPriceBooks(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  '/getById/:priceBookId',
  validateDtoMiddleware(GetPriceBookByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: GetPriceBookByIdDto =
        RequestHandler.Defaults.getParams<GetPriceBookByIdDto>(
          req,
          GetPriceBookByIdDto
        );

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const priceBookService = new PriceBookService();

      const data = await priceBookService.getPriceBookById(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

export
 { router as PriceBookRoute };