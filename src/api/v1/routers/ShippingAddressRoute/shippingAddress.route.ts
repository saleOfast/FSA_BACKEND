import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {ShippingAddressService} from "../../Controllers/ShippingAddressController/ShippingAddress.Controller"
import { DeleteShippingAddressDto,GetAllShippingAddressDto, GetShippingAddressByIdDto,UpdateShippingAddressDto, CreateShippingAddressDto} from "../../../../core/types/ShippingAddressService/shippingAddressService"
import { AddLearningSession } from "core/types/LearningModule/LearningSessionService";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreateShippingAddressDto),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateShippingAddressDto = RequestHandler.Defaults.getBody<CreateShippingAddressDto>(req, CreateShippingAddressDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const AddressService = new ShippingAddressService();
        const data = await AddressService.createShippingAddress(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete(
  '/delete/:id',
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      // Map param to DTO manually
      const input: DeleteShippingAddressDto = {
        addressId: parseInt(req.params.id, 10)
      };

      const payload: IUser = RequestHandler.Custom.getUser(req);
      const AddressService = new ShippingAddressService();

      const data = await AddressService.DeleteShippingAddress(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  '/getById/:id',
  (req, res, next) => {
    req.body = { addressId: parseInt(req.params.id, 10) }; // map param to body
    next();
  },
  validateDtoMiddleware(GetShippingAddressByIdDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const AddressService = new ShippingAddressService();
    const data = await AddressService.getShippingAddressById(req.body, payload);
    ResponseHandler.sendResponse(res, data);
  }
);

router.put(
  "/update",
  validateDtoMiddleware(UpdateShippingAddressDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: UpdateShippingAddressDto =
        RequestHandler.Defaults.getBody<UpdateShippingAddressDto>(req, UpdateShippingAddressDto);

      const payload: IUser = RequestHandler.Custom.getUser(req);
 const AddressService = new ShippingAddressService();
      // ✅ correct argument order
      const data = await AddressService.updateShippingAddress(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  '/list',
  validateDtoMiddleware(GetAllShippingAddressDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input:GetAllShippingAddressDto =
        RequestHandler.Defaults.getQuery<GetAllShippingAddressDto>(
          req,
          GetAllShippingAddressDto
        );

      const payload: IUser = RequestHandler.Custom.getUser(req);

      const AddressService = new ShippingAddressService();

      const data = await AddressService .getAllShippingAddresse(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

    
export {router as ShippingAddressRouter}