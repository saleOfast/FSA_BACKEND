import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  GetInvoiceByIdDto,
  ListInvoiceDto,
  DeleteInvoiceDto,
  CreateInvoiceItemStandaloneDto,
  UpdateInvoiceItemDto,
  GetInvoiceItemByIdDto,
  ListInvoiceItemDto,
  DeleteInvoiceItemDto,
} from "../../../../core/types/InvoiceService/InvoiceService";
import { InvoiceService } from "../../Controllers/InvoiceController/Invoice.Controller";

const router = express.Router();

// ----- Invoice Header CRUD -----

router.post(
  "/create",
  validateDtoMiddleware(CreateInvoiceDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getBody<CreateInvoiceDto>(req, CreateInvoiceDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new InvoiceService();
      const data = await service.createInvoice(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/get/:invoiceId",
  validateDtoMiddleware(GetInvoiceByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<GetInvoiceByIdDto>(req, GetInvoiceByIdDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new InvoiceService();
      const data = await service.getInvoice(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

// router.put(
//   "/update/:invoiceId",
//   validateDtoMiddleware(UpdateInvoiceDto),
//   AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
//   async (req: Request, res: Response) => {
//     try {
//       // Convert invoiceId to number
//       const invoiceId = parseInt(req.params.invoiceId, 10);

//       // if (isNaN(invoiceId)) {
//       //   return ResponseHandler.sendResponse(res, {
//       //     status: STATUSCODES.BAD_REQUEST,
//       //     message: "Invalid invoiceId",
//       //     data: null,
//       //   });
//       // }

//       const input = RequestHandler.Defaults.getBody<UpdateInvoiceDto>(req, UpdateInvoiceDto);
//       const payload: IUser = RequestHandler.Custom.getUser(req);
//       const service = new InvoiceService();
//       const data = await service.updateInvoice(invoiceId, input, payload); // now number
//       ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//       ResponseHandler.sendErrorResponse(res, error);
//     }
//   }
// );

router.delete(
  "/delete/:invoiceId",
  validateDtoMiddleware(DeleteInvoiceDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<GetInvoiceByIdDto>(req, GetInvoiceByIdDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new InvoiceService();
      const data = await service.deleteInvoice(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/list",
  validateDtoMiddleware(ListInvoiceDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getQuery<ListInvoiceDto>(req, ListInvoiceDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new InvoiceService();
      const data = await service.listInvoices(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);


// ----- Invoice Item CRUD -----

router.post(
  "/items/create",
  validateDtoMiddleware(CreateInvoiceItemStandaloneDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getBody<CreateInvoiceItemStandaloneDto>(req, CreateInvoiceItemStandaloneDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new InvoiceService();
      const data = await service.createInvoiceItem(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.put(
  "/items/update",
  validateDtoMiddleware(UpdateInvoiceItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getBody<UpdateInvoiceItemDto>(req, UpdateInvoiceItemDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new InvoiceService();
      const data = await service.updateInvoiceItem(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/items/get/:invoiceItemId",
  validateDtoMiddleware(GetInvoiceItemByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<GetInvoiceItemByIdDto>(req, GetInvoiceItemByIdDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new InvoiceService();
      const data = await service.getInvoiceItem(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/items/list",
  validateDtoMiddleware(ListInvoiceItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getQuery<ListInvoiceItemDto>(req, ListInvoiceItemDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new InvoiceService();
      const data = await service.listInvoiceItems(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.delete(
  "/items/delete/:invoiceItemId",
  validateDtoMiddleware(DeleteInvoiceItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getParams<DeleteInvoiceItemDto>(req, DeleteInvoiceItemDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new InvoiceService();
      const data = await service.deleteInvoiceItem(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

export { router as InvoiceRoute }; 
