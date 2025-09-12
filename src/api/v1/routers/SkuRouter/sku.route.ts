import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { CreateSkuRequest , UpdateSkuRequest,SearchSkuRequest,GetSkuListRequest,DeleteSkuById, GetStatusRequest} from "../../../../core/types/skuService/skuService";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { skuController} from "../../Controllers/skuController/sku.controller";

const router = express.Router();

router.post('/add', validateDtoMiddleware(CreateSkuRequest), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateSkuRequest = RequestHandler.Defaults.getBody<CreateSkuRequest>(req, CreateSkuRequest);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const sku = new  skuController();
        const data = await sku.createSku(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/update', validateDtoMiddleware(UpdateSkuRequest), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
    const input: UpdateSkuRequest = RequestHandler.Defaults.getBody<UpdateSkuRequest>(req, UpdateSkuRequest);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const sku = new  skuController();
    const data = await sku.updateSku(input.skuId, input, payload);
    ResponseHandler.sendResponse(res, data);
    } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete/:skuId', validateDtoMiddleware(DeleteSkuById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: DeleteSkuById = RequestHandler.Defaults.getParams<DeleteSkuById>(req, DeleteSkuById);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const sku = new  skuController();
        const data = await sku.deleteSku(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list', validateDtoMiddleware(GetSkuListRequest), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input:GetSkuListRequest  = RequestHandler.Defaults.getQuery<GetSkuListRequest>(req, GetSkuListRequest);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const sku = new  skuController();
        const data = await sku.getSkuList(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});         

router.get(
  '/search',
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  validateDtoMiddleware(SearchSkuRequest),
  async (req: Request, res: Response) => {
    try {
      // Map query params to DTO
      const input: SearchSkuRequest = RequestHandler.Defaults.getQuery<SearchSkuRequest>(
        req,
        SearchSkuRequest
      );

      // Get the user payload (if needed for auditing or permissions)
      const payload: IUser = RequestHandler.Custom.getUser(req);

      // Instantiate your controller
      const sku = new skuController();

      // Call the search service
      const data = await sku.searchSkus(input);

      // Send response
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);
router.get(
  '/status',
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      // Extract query params
      const input: GetStatusRequest = {
        skuId: req.query.skuId ? Number(req.query.skuId) : undefined,
        skuNumber: req.query.skuNumber as string | undefined
      };

      const payload: IUser = RequestHandler.Custom.getUser(req);
      const sku = new skuController();
      const data = await sku.getStatus(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);


export { router as SkuRouter }