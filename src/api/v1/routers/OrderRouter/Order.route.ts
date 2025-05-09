import express, { Request, Response } from "express";
import { AccessTokenService, ResponseHandler, validateDtoMiddleware } from "../../../../core/helper/validationMiddleware";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { JwtTokenTypes } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { OrderService } from "../../Controllers/OrderController/Order.controller";
import { CollectionListByStore, CollectionListFilter, CreateOrder, GetOrderById, OrderList, OrderListByStore, OrderListByVisit, OrderListFilter, UpdateOrderBySpecialDiscountById, UpdateOrderCollection, UpdateOrderTrackStatusById, UploadFile } from "../../../../core/types/OrderService/OrderService";
import { S3Service } from "../../../../core/helper/s3";
import { monthlyFilter, ReportFilter } from "../../../../core/types/AttendanceService/AttendanceService";
import { dayTrackingFilter } from "../../../../core/types/VisitService/VisitService";
const router = express.Router();

router.post('/create', validateDtoMiddleware(CreateOrder), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CreateOrder = RequestHandler.Defaults.getBody<CreateOrder>(req, CreateOrder);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const orderService = new OrderService();
        const data = await orderService.createOrder(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/getOrderById/:orderId', validateDtoMiddleware(GetOrderById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: GetOrderById = RequestHandler.Defaults.getParams<GetOrderById>(req, GetOrderById);
        const orderService = new OrderService();
        const data = await orderService.getOrderById(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/list/:storeId', validateDtoMiddleware(OrderListByStore), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: OrderListByStore = RequestHandler.Defaults.getParams<OrderListByStore>(req, OrderListByStore);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const orderService = new OrderService();
        const data = await orderService.listByStoreId(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/isList/:visitId/:storeId', validateDtoMiddleware(OrderListByVisit), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: OrderListByVisit = RequestHandler.Defaults.getParams<OrderListByVisit>(req, OrderListByVisit);
        const orderService = new OrderService();
        const data = await orderService.orderListByVisitId(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/allOrders', validateDtoMiddleware(OrderListFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: OrderListFilter = RequestHandler.Defaults.getQuery<OrderListFilter>(req, OrderListFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const orderService = new OrderService();
        const data = await orderService.getAllOrders(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/collections', validateDtoMiddleware(CollectionListFilter), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: CollectionListFilter = RequestHandler.Defaults.getQuery<CollectionListFilter>(req, CollectionListFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const orderService = new OrderService();
        const data = await orderService.collections(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/collectionList/:orderId', validateDtoMiddleware(OrderList), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: OrderList = RequestHandler.Defaults.getParams<OrderList>(req, OrderList);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const orderService = new OrderService();
        const data = await orderService.collectionList(input, payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/collectionByStore/:storeId', validateDtoMiddleware(CollectionListByStore), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const storeId: string = req.params.storeId;

        // Extract query parameters
        const queryParams: CollectionListByStore = req.query as unknown as CollectionListByStore;

        // Alternatively, you can access individual query parameters like req.query.paramName

        const payload: IUser = RequestHandler.Custom.getUser(req);
        const orderService = new OrderService();
        const data = await orderService.collectionListByStoreId({ ...queryParams, storeId }, payload);
        ResponseHandler.sendResponse(res, data);
        // const input: CollectionListByStore = RequestHandler.Defaults.getParams.getQuery<CollectionListByStore>(req, CollectionListByStore);
        // const payload: IUser = RequestHandler.Custom.getUser(req);
        // const orderService = new OrderService();
        // const data = await orderService.collectionListByStoreId(input, payload);
        // ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

// update collection
router.put('/collection', validateDtoMiddleware(UpdateOrderCollection), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateOrderCollection = RequestHandler.Defaults.getBody<UpdateOrderCollection>(req, UpdateOrderCollection);
        const orderService = new OrderService();
        const data = await orderService.updateOrderCOllection(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/signedUrl', validateDtoMiddleware(UploadFile), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UploadFile = RequestHandler.Defaults.getQuery<UploadFile>(req, UploadFile);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const s3Service = new S3Service()
        const data = await s3Service.getSignedUrlForStore(input.fileName, payload.emp_id);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/update/orderStatus', validateDtoMiddleware(UpdateOrderTrackStatusById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateOrderTrackStatusById = RequestHandler.Defaults.getBody<UpdateOrderTrackStatusById>(req, UpdateOrderTrackStatusById);
        const orderService = new OrderService();
        const data = await orderService.updateOrderTrackStatus(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/update/special-discount', validateDtoMiddleware(UpdateOrderBySpecialDiscountById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateOrderBySpecialDiscountById = RequestHandler.Defaults.getBody<UpdateOrderBySpecialDiscountById>(req, UpdateOrderBySpecialDiscountById);
        const orderService = new OrderService();
        const data = await orderService.updateOrderBySpecialDiscount(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.put('/get/special-discount', validateDtoMiddleware(UpdateOrderBySpecialDiscountById), AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: UpdateOrderBySpecialDiscountById = RequestHandler.Defaults.getBody<UpdateOrderBySpecialDiscountById>(req, UpdateOrderBySpecialDiscountById);
        const orderService = new OrderService();
        const data = await orderService.updateOrderBySpecialDiscount(input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/allPendingApproval', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        // const input: OrderListFilter = RequestHandler.Defaults.getQuery<OrderListFilter>(req, OrderListFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const orderService = new OrderService();
        const data = await orderService.getAllPendingApproval(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/report/pending-collection', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        // const input: dayTrackingFilter = RequestHandler.Defaults.getQuery<dayTrackingFilter>(req, dayTrackingFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const pendingCollectionService = new OrderService()
        const data = await pendingCollectionService.getPendingCollectionReport(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/report/getPendingCollectionByStoreId', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const pendingCollectionService = new OrderService()
        const data = await pendingCollectionService.getPendingCollectionByStoreId(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/report/pending-approval', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        // const input: dayTrackingFilter = RequestHandler.Defaults.getQuery<dayTrackingFilter>(req, dayTrackingFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const pendingApprovalService = new OrderService()
        const data = await pendingApprovalService.getPendingApprovalReport(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/report/store-revenue', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: ReportFilter = RequestHandler.Defaults.getQuery<ReportFilter>(req, ReportFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const pendingApprovalService = new OrderService()
        const data = await pendingApprovalService.getStoreRevenueReport(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/report/sku-revenue', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: ReportFilter = RequestHandler.Defaults.getQuery<ReportFilter>(req, ReportFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const pendingApprovalService = new OrderService()
        const data = await pendingApprovalService.getSkuRevenueReport(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});
router.get('/report/monthly-progress', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: monthlyFilter = RequestHandler.Defaults.getQuery<monthlyFilter>(req, monthlyFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const pendingApprovalService = new OrderService()
        const data = await pendingApprovalService.getMonthlyProgressReport(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/report/monthly-order', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: monthlyFilter = RequestHandler.Defaults.getQuery<monthlyFilter>(req, monthlyFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const pendingApprovalService = new OrderService()
        const data = await pendingApprovalService.getMonthlyOrderReportforRetailor(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/report/unbilled-store', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        // const input: dayTrackingFilter = RequestHandler.Defaults.getQuery<dayTrackingFilter>(req, dayTrackingFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const service = new OrderService()
        const data = await service.getUnbilledStoreReport(payload);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/report/employee-performance', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: ReportFilter = RequestHandler.Defaults.getQuery<ReportFilter>(req, ReportFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const pendingApprovalService = new OrderService()
        const data = await pendingApprovalService.getEmployeePreformanceReport(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});

router.get('/report/monthly-no-order', AccessTokenService.validateTokenMiddleware!(JwtTokenTypes.AUTH_TOKEN), async (req: Request, res: Response) => {
    try {
        const input: dayTrackingFilter = RequestHandler.Defaults.getQuery<dayTrackingFilter>(req, dayTrackingFilter);
        const payload: IUser = RequestHandler.Custom.getUser(req);
        const pendingApprovalService = new OrderService()
        const data = await pendingApprovalService.getMonthlyNoOrderReport(payload, input);
        ResponseHandler.sendResponse(res, data);
    } catch (error) {
        ResponseHandler.sendErrorResponse(res, error);
    }
});
export { router as OrderRouter }