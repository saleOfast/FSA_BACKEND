import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { STATUSCODES } from "../../../../core/types/Constent/common";
import { DiscountService } from "../../Controllers/DiscountListController/DiscountList.controller";
import { CreateDiscountListDto,ListDiscountListsDto,GetDiscountListByIdDto,DeleteDiscountListDto,GetDiscountListByStatusDto ,CreateDiscountItemDto,UpdateDiscountItemDto,DeleteDiscountItemDto,ListDiscountItemsDto,GetDiscountItemByIdDto,UpdateDiscountListDto } from "../../../../core/types/DiscountListService/DiscountListService";


const router = express.Router();

router.post('/create',validateDtoMiddleware(CreateDiscountListDto),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) =>{

    try{
          const input: CreateDiscountListDto= RequestHandler.Defaults.getBody< CreateDiscountListDto>(req,  CreateDiscountListDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const discountService = new DiscountService();
        const data = await discountService.createDiscountList(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
    }

)

router.get('/list',validateDtoMiddleware(ListDiscountListsDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) =>{
    try{
  const input: ListDiscountListsDto = RequestHandler.Defaults.getQuery<ListDiscountListsDto>(req, ListDiscountListsDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);

      // Call service
      const discountService = new DiscountService();
      const data = await discountService.getDiscountList(input, payload);

      // Send response
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
}
)

router.get('/getdiscount',validateDtoMiddleware(GetDiscountListByIdDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) =>{
     try {

           const payload: IUser = RequestHandler.Custom.getUser(req);
      const input:GetDiscountListByIdDto = RequestHandler.Defaults.getQuery<GetDiscountListByIdDto>(
        req,
        GetDiscountListByIdDto,
      );

      const discountService = new DiscountService();
      const data = await discountService. getDiscountById(input,payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.delete(
  "/delete/:id",
  validateDtoMiddleware(DeleteDiscountListDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const payload: IUser = RequestHandler.Custom.getUser(req);

      // Extract the ID from the route params and create the input DTO
      const input: DeleteDiscountListDto = { discountListId: req.params.id };

      const discountService = new DiscountService();
      const data = await discountService.deleteDiscountList(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      console.log(error);
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get(
  "/getStatus",
  validateDtoMiddleware(GetDiscountListByStatusDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const input: GetDiscountListByStatusDto =
        RequestHandler.Defaults.getQuery<GetDiscountListByStatusDto>(
          req,
     GetDiscountListByStatusDto
        );

      const discountService = new DiscountService();
      const data = await discountService.getDiscountListsByStatus(input);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

//update list
// updateDiscountList
router.put(
  "/update",
  validateDtoMiddleware(UpdateDiscountListDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      // Extract request body
      const input: UpdateDiscountListDto & { discountListId?: string } =
        RequestHandler.Defaults.getBody<UpdateDiscountListDto>(req, UpdateDiscountListDto);

      // Extract authenticated user
      const payload: IUser = RequestHandler.Custom.getUser(req);

      // Check that discountListId is provided
      if (!input.discountListId) {
        return ResponseHandler.sendErrorResponse(res, {
          status: STATUSCODES.BAD_REQUEST,
          message: "discountListId is required in the request body",
        });
      }

      // Initialize service
      const discountService = new DiscountService();

      // Call updateDiscountList with correct arguments
      const data = await discountService.updateDiscountList(input.discountListId, input, payload);

      // Send response
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);








//create iteam
router.get('/createItem',validateDtoMiddleware(CreateDiscountItemDto),  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) =>{

   try{
          const input:CreateDiscountItemDto= RequestHandler.Defaults.getBody< CreateDiscountItemDto>(req,CreateDiscountItemDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const discountService = new DiscountService();
        const data = await discountService.createDiscountItem(input, payload);
        ResponseHandler.sendResponse(res, data);
   }catch(error){
        ResponseHandler.sendErrorResponse(res, error);
    }
    }
)

router.put(
  "/update/:discountItemId",
  validateDtoMiddleware(UpdateDiscountItemDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
  try {
    const discountItemId = Number(req.params.discountItemId);
    if (Number.isNaN(discountItemId)) {
      return ResponseHandler.sendResponse(res, {
        status: STATUSCODES.BAD_REQUEST,
        message: "Invalid discountItemId. It must be a number.",
      });
    }
    const input: UpdateDiscountItemDto =
      RequestHandler.Defaults.getBody<UpdateDiscountItemDto>(req, UpdateDiscountItemDto);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const discountService = new DiscountService();
    const result = await discountService.updateDiscountItem(discountItemId, input, payload);
    return res.status(result.status).json(result);
  } catch (error) {
    return ResponseHandler.sendErrorResponse(res, error);
  }
});



router.delete(
  "/item/:discountItemId",
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  async (req: Request, res: Response) => {
    try {
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const discountItemId = Number(req.params.discountItemId);
      if (Number.isNaN(discountItemId)) {
        return ResponseHandler.sendResponse(res, {
          status: STATUSCODES.BAD_REQUEST,
          message: "Invalid discountItemId. It must be a number.",
        });
      }

      const input: DeleteDiscountItemDto = { discountItemId };
      const discountService = new DiscountService();
      const data = await discountService.deleteDiscountItem(input, payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      console.log(error);
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);


router.get('/listItem',validateDtoMiddleware(ListDiscountItemsDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) =>{
    try{
  const input: ListDiscountItemsDto = RequestHandler.Defaults.getQuery<ListDiscountItemsDto>(req, ListDiscountItemsDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);

      // Call service
      const discountService = new DiscountService();
      const data = await discountService. listDiscountItem(input, payload);

      // Send response
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
}
)

router.get('/getdiscountItem',validateDtoMiddleware(GetDiscountItemByIdDto ), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) =>{
     try {

           const payload: IUser = RequestHandler.Custom.getUser(req);
      const input:GetDiscountItemByIdDto  = RequestHandler.Defaults.getQuery<GetDiscountItemByIdDto>(
        req,
       GetDiscountItemByIdDto ,
      );

      const discountService = new DiscountService();
      const data = await discountService. getDiscountItemById(input,payload);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);


export {router as DiscountRoute }