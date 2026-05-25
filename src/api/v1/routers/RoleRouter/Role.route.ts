import express, { Request, Response } from "express";
import {
  AccessTokenService,
  ResponseHandler,
  validateDtoMiddleware,
} from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateRoleDto,
  UpdateRoleDto,
  RoleListQuery,
  RoleIdParam,
} from "../../../../core/types/RoleService/RoleService";
import { RoleService } from "../../Controllers/RoleController/Role.controller";

const router = express.Router();
const auth = AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN);

router.post(
  "/create",
  auth,
  validateDtoMiddleware(CreateRoleDto),
  async (req: Request, res: Response) => {
    try {
      const input = RequestHandler.Defaults.getBody<CreateRoleDto>(req, CreateRoleDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const data = await new RoleService().create(input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.get("/list", auth, async (req: Request, res: Response) => {
  try {
    const input = RequestHandler.Defaults.getQuery<RoleListQuery>(req, RoleListQuery);
    const data = await new RoleService().list(input.search);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get("/hierarchy", auth, async (req: Request, res: Response) => {
  try {
    const data = await new RoleService().hierarchy();
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get("/parent-options", auth, async (req: Request, res: Response) => {
  try {
    const exclude = req.query.excludeRoleId
      ? parseInt(String(req.query.excludeRoleId), 10)
      : undefined;
    const data = await new RoleService().parentOptions(
      exclude != null && !Number.isNaN(exclude) ? exclude : undefined
    );
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get(
  "/:roleId",
  auth,
  validateDtoMiddleware(RoleIdParam),
  async (req: Request, res: Response) => {
    try {
      const roleId = parseInt(req.params.roleId, 10);
      if (Number.isNaN(roleId)) {
        return ResponseHandler.sendErrorResponse(res, {
          status: 400,
          message: "Invalid role ID",
        });
      }
      const data = await new RoleService().getById(roleId);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.put(
  "/update/:roleId",
  auth,
  validateDtoMiddleware(UpdateRoleDto),
  async (req: Request, res: Response) => {
    try {
      const roleId = parseInt(req.params.roleId, 10);
      if (Number.isNaN(roleId)) {
        return ResponseHandler.sendErrorResponse(res, {
          status: 400,
          message: "Invalid role ID",
        });
      }
      const input = RequestHandler.Defaults.getBody<UpdateRoleDto>(req, UpdateRoleDto);
      const payload: IUser = RequestHandler.Custom.getUser(req);
      const data = await new RoleService().update(roleId, input, payload);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

router.delete(
  "/:roleId",
  auth,
  async (req: Request, res: Response) => {
    try {
      const roleId = parseInt(req.params.roleId, 10);
      if (Number.isNaN(roleId)) {
        return ResponseHandler.sendErrorResponse(res, {
          status: 400,
          message: "Invalid role ID",
        });
      }
      const data = await new RoleService().delete(roleId);
      ResponseHandler.sendResponse(res, data);
    } catch (error) {
      ResponseHandler.sendErrorResponse(res, error);
    }
  }
);

export { router as RoleRouter };