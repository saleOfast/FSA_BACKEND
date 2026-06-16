import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreatePurchaseOrderDto, DeletePurchaseOrderDto, GetPurchaseOrderByIdDto, ListPurchaseOrderDto, SearchPurchaseOrderDto, UpdatePurchaseOrderDto } from "../../../../core/types/PurchaseOrderService/PurchaseOrder.types";
import { PurchaseOrderService} from "../../Controllers/PurchaseOrderController/PurchaseOrder.Controller";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreatePurchaseOrderDto),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreatePurchaseOrderDto = RequestHandler.Defaults.getBody<CreatePurchaseOrderDto>(req, CreatePurchaseOrderDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const purchaseOrderService = new PurchaseOrderService();
        const data = await purchaseOrderService.createPurchaseOrder(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get(
    "/list",
    validateDtoMiddleware(ListPurchaseOrderDto),
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
        try {
            const input: ListPurchaseOrderDto = RequestHandler.Defaults.getBody<ListPurchaseOrderDto>(req, ListPurchaseOrderDto);
            const payload: IUser = RequestHandler.Custom.getUser(req);
            const purchaseOrderService = new PurchaseOrderService();
            const data = await purchaseOrderService.listPurchaseOrders(input, payload);
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
);

router.delete(
    "/delete/:purchaseOrderId",
    validateDtoMiddleware(DeletePurchaseOrderDto),
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
        try {
            const input: DeletePurchaseOrderDto = RequestHandler.Defaults.getBody<DeletePurchaseOrderDto>(req, DeletePurchaseOrderDto);
            const payload: IUser = RequestHandler.Custom.getUser(req);
            const purchaseOrderService = new PurchaseOrderService();
            const data = await purchaseOrderService.deletePurchaseOrder(input, payload);
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
);

router.get(
    "/get/:purchaseOrderId",
    validateDtoMiddleware(GetPurchaseOrderByIdDto),
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
        try {
            const input: GetPurchaseOrderByIdDto = RequestHandler.Defaults.getBody<GetPurchaseOrderByIdDto>(req, GetPurchaseOrderByIdDto);
            const payload: IUser = RequestHandler.Custom.getUser(req);
            const purchaseOrderService = new PurchaseOrderService();
            const data = await purchaseOrderService.getPurchaseOrderById(input, payload);
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
);

router.get(
    "/search",
    validateDtoMiddleware(SearchPurchaseOrderDto),
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
        try {
            const input: SearchPurchaseOrderDto = RequestHandler.Defaults.getBody<SearchPurchaseOrderDto>(req, SearchPurchaseOrderDto);
            const payload: IUser = RequestHandler.Custom.getUser(req);
            const purchaseOrderService = new PurchaseOrderService();
            const data = await purchaseOrderService.searchPurchaseOrder(input, payload);
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
);

router.put(
    "/update/:purchaseOrderId",
    validateDtoMiddleware(UpdatePurchaseOrderDto),
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
        try {
            const input: UpdatePurchaseOrderDto = RequestHandler.Defaults.getBody<UpdatePurchaseOrderDto>(req, UpdatePurchaseOrderDto);
            const payload: IUser = RequestHandler.Custom.getUser(req);
            const purchaseOrderService = new PurchaseOrderService();
            const data = await purchaseOrderService.updatePurchaseOrder(input, payload);
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
);
    
export { router as PurchaseOrderRoute };