import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes, UserRole } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {AdminService} from "../../Controllers/AdminDashboardController/AdminDas.controller"
import {GetOrderById} from "../../../../core/types/OrderService/OrderService"
const router = express.Router();

router.get('/total', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response)=>{

     try {
        const input:GetOrderById = RequestHandler.Defaults.getBody<GetOrderById>(req);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const adminServices = new AdminService()
        const data = await adminServices.totalOrders(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
}
)

router.get(
  '/total-revenue', 
  AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), 
  async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);

        // Create an instance of AdminService
        const adminServices = new AdminService();

        // Call the totalRevenue method
        const data = await adminServices.totalRevenue(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        // Handle errors
        ResponseHandler.sendErrorResponse(res, error);
    }
  }
);


router.get(
    '/total-active-distributors',
    AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN),
    async (req: Request, res: Response) => {
        try {
            // Get user from request (for auth or logging if needed)
            const payload = RequestHandler.Custom.getUser(req);

            const adminServices = new AdminService();
            const data = await adminServices.totalActiveDistributors(payload);

            // Send response
            ResponseHandler.sendResponse(res, data);
        } catch (error) {
            ResponseHandler.sendErrorResponse(res, error);
        }
    }
)
export {router as AdminRouter}
