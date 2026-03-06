import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  GetInvoiceByIdDto,
} from "../../../../core/types/InvoiceService/InvoiceService";
import { InvoiceService } from "../../Controllers/InvoiceController/Invoice.Controller";

const router = express.Router();

// Create Invoice
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

// Get Invoice
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

// Update Invoice
router.put(
  "/update/:invoiceId",
  validateDtoMiddleware(UpdateInvoiceDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const invoiceId = req.params.invoiceId;
      const input = RequestHandler.Defaults.getBody<UpdateInvoiceDto>(req, UpdateInvoiceDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const service = new InvoiceService();
      const data = await service.updateInvoice(invoiceId, input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

export default router;
