import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes, UserRole } from "../../../../core/types/Constent/common";
import { ExpenseC, ExpenseR, ExpenseU, ExpenseD, IExpenseManagement } from "../../../../core/types/ExpenseManagement/ExpenseManagement";
import { ExpenseManagement } from "../../Controllers/ExpenseManagementController/ExpenseManagementController";
import { IUser } from "../../../../core/types/AuthService/AuthService";

const router = express.Router();

router.post('/add', validateDtoMiddleware(ExpenseC), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: ExpenseC = RequestHandler.Defaults.getBody<ExpenseC>(req, ExpenseC);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const expenseManagement = new ExpenseManagement();
        const data = await expenseManagement.createExpenseManagement(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/get', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: ExpenseR = RequestHandler.Defaults.getQuery<ExpenseR>(req, ExpenseR);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const expenseManagement = new ExpenseManagement();
        const data = await expenseManagement.getExpenseManagement(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/update', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: ExpenseU = RequestHandler.Defaults.getBody<ExpenseU>(req, ExpenseU);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const expenseManagement = new ExpenseManagement();
        const data = await expenseManagement.editExpenseManagement(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.delete('/delete', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: ExpenseD = RequestHandler.Defaults.getQuery<ExpenseD>(req, ExpenseD);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const expenseManagement = new ExpenseManagement();
        const data = await expenseManagement.deleteExpenseManagement(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

export { router as ExpenseManagementRouter };