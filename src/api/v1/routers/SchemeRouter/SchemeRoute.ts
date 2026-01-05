import express, { Request, Response } from "express";
import catchAsync from '../../../../core/utils/catch-async';
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { CreateSchemeDto, GetScheme, UpdateSchemeDto,GetAllSchemeDto,GetSchemeDto,DeleteSchemeDto} from "../../../../core/types/SchemeService/SchemeService";
import { SchemeService } from "../../Controllers/SchemeController/Scheme.controller";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreateSchemeDto), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), catchAsync(async (req: Request, res: Response) => {
    try {
        const input: CreateSchemeDto = RequestHandler.Defaults.getBody<CreateSchemeDto>(req, CreateSchemeDto);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const SchemeController = new SchemeService();
        const data = await SchemeController.createScheme(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}));

// router.get('/getActiveScheme', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), catchAsync(async (req: Request, res: Response) => {
//     try {
//         const SchemeController = new SchemeService();
//         const data = await SchemeController.getScheme();
//         ResponseHandler.sendResponse(res, data);
//     } catch (error) {
//         ResponseHandler.sendErrorResponse(res, error);
//     }
// }));

router.get(
  '/list',
  validateDtoMiddleware(GetAllSchemeDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  catchAsync(async (req: Request, res: Response) => {
    try {
      const input: GetAllSchemeDto = RequestHandler.Defaults.getBody<GetAllSchemeDto>(req, GetAllSchemeDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const schemeService = new SchemeService();
      const data = await schemeService.getAllSchemes(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  })
);

router.get(
  '/get',
  validateDtoMiddleware(GetSchemeDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  catchAsync(async (req: Request, res: Response) => {
    try {
      const input: GetSchemeDto = RequestHandler.Defaults.getBody<GetSchemeDto>(req, GetSchemeDto);
      const schemeService = new SchemeService();
      const data = await schemeService.getScheme(input);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  })
);


router.put(
  "/update/:id",
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  validateDtoMiddleware(UpdateSchemeDto),
  async (req: Request, res: Response) => {
    try {
      const payload: IUser = RequestHandler.Custom.getUser(req);

      // ✅ id from URL
      const schemeId = Number(req.params.id);
      if (isNaN(schemeId)) {
        return ResponseHandler.sendErrorResponse(res, {
          message: "Invalid scheme ID",
          status: 400,
        });
      }

      // ✅ body contains ONLY update fields
      const input = RequestHandler.Defaults.getBody<UpdateSchemeDto>(
        req,
        UpdateSchemeDto
      );

      const service = new SchemeService();
      const data = await service.update(payload, schemeId, input);

      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);




router.delete(
  '/delete',
  validateDtoMiddleware(DeleteSchemeDto),
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
  catchAsync(async (req: Request, res: Response) => {
    try {
      // Get validated body from request
      const input: DeleteSchemeDto = RequestHandler.Defaults.getBody<DeleteSchemeDto>(req, DeleteSchemeDto);
       const payload: IUser = RequestHandler.Custom.getUser(req);

      const schemeService = new SchemeService();
      const data = await schemeService.deleteScheme(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  })
);


export { router as SchemeRoute };