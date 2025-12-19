import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateState,
  UpdateState,
  DeleteStateById,
  GetStateById,
  StateListFilter
} from "../../../../core/types/StateService/StateService";
import { StateService } from "../../Controllers/StateController/State.controller";

const router = express.Router();

router.post('/create', validateDtoMiddleware(CreateState), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: CreateState = RequestHandler.Defaults.getBody<CreateState>(req, CreateState);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const stateService = new StateService();
    const data = await stateService.createState(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.post('/update', validateDtoMiddleware(UpdateState), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: UpdateState = RequestHandler.Defaults.getBody<UpdateState>(req, UpdateState);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const stateService = new StateService();
    const data = await stateService.updateState(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.delete('/delete/:stateId', validateDtoMiddleware(DeleteStateById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: DeleteStateById = RequestHandler.Defaults.getParams<DeleteStateById>(req, DeleteStateById);
    const stateService = new StateService();
    const data = await stateService.deleteState(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/getById/:stateId', validateDtoMiddleware(GetStateById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: GetStateById = RequestHandler.Defaults.getParams<GetStateById>(req, GetStateById);
    const stateService = new StateService();
    const data = await stateService.getStateById(input);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

router.get('/list', validateDtoMiddleware(StateListFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
  try {
    const input: StateListFilter = RequestHandler.Defaults.getQuery<StateListFilter>(req, StateListFilter);
    const payload: IUser = RequestHandler.Custom.getUser(req);
    const stateService = new StateService();
    const data = await stateService.stateList(input, payload);
    ResponseHandler.sendResponse(res, data);
  } catch (error) {
    ResponseHandler.sendErrorResponse(res, error);
  }
});

export { router as StateRoute };

