"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../../../../core/helper/validationMiddleware");
const RequestHander_1 = require("../../../../core/helper/RequestHander");
const common_1 = require("../../../../core/types/Constent/common");
const Order_controller_1 = require("../../Controllers/OrderController/Order.controller");
const OrderService_1 = require("../../../../core/types/OrderService/OrderService");
const s3_1 = require("../../../../core/helper/s3");
const AttendanceService_1 = require("../../../../core/types/AttendanceService/AttendanceService");
const VisitService_1 = require("../../../../core/types/VisitService/VisitService");
const router = express_1.default.Router();
exports.OrderRouter = router;
router.post('/create', (0, validationMiddleware_1.validateDtoMiddleware)(OrderService_1.CreateOrder), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, OrderService_1.CreateOrder);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const orderService = new Order_controller_1.OrderService();
        const data = yield orderService.createOrder(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/getOrderById/:orderId', (0, validationMiddleware_1.validateDtoMiddleware)(OrderService_1.GetOrderById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, OrderService_1.GetOrderById);
        const orderService = new Order_controller_1.OrderService();
        const data = yield orderService.getOrderById(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/list/:storeId', (0, validationMiddleware_1.validateDtoMiddleware)(OrderService_1.OrderListByStore), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, OrderService_1.OrderListByStore);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const orderService = new Order_controller_1.OrderService();
        const data = yield orderService.listByStoreId(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/isList/:visitId/:storeId', (0, validationMiddleware_1.validateDtoMiddleware)(OrderService_1.OrderListByVisit), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, OrderService_1.OrderListByVisit);
        const orderService = new Order_controller_1.OrderService();
        const data = yield orderService.orderListByVisitId(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/allOrders', (0, validationMiddleware_1.validateDtoMiddleware)(OrderService_1.OrderListFilter), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, OrderService_1.OrderListFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const orderService = new Order_controller_1.OrderService();
        const data = yield orderService.getAllOrders(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/collections', (0, validationMiddleware_1.validateDtoMiddleware)(OrderService_1.CollectionListFilter), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, OrderService_1.CollectionListFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const orderService = new Order_controller_1.OrderService();
        const data = yield orderService.collections(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/collectionList/:orderId', (0, validationMiddleware_1.validateDtoMiddleware)(OrderService_1.OrderList), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getParams(req, OrderService_1.OrderList);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const orderService = new Order_controller_1.OrderService();
        const data = yield orderService.collectionList(input, payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/collectionByStore/:storeId', (0, validationMiddleware_1.validateDtoMiddleware)(OrderService_1.CollectionListByStore), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeId = req.params.storeId;
        // Extract query parameters
        const queryParams = req.query;
        // Alternatively, you can access individual query parameters like req.query.paramName
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const orderService = new Order_controller_1.OrderService();
        const data = yield orderService.collectionListByStoreId(Object.assign(Object.assign({}, queryParams), { storeId }), payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
        // const input: CollectionListByStore = RequestHandler.Defaults.getParams.getQuery<CollectionListByStore>(req, CollectionListByStore);
        // const payload: IUser = RequestHandler.Custom.getUser(req);
        // const orderService = new OrderService();
        // const data = await orderService.collectionListByStoreId(input, payload);
        // ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
// update collection
router.put('/collection', (0, validationMiddleware_1.validateDtoMiddleware)(OrderService_1.UpdateOrderCollection), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, OrderService_1.UpdateOrderCollection);
        const orderService = new Order_controller_1.OrderService();
        const data = yield orderService.updateOrderCOllection(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/signedUrl', (0, validationMiddleware_1.validateDtoMiddleware)(OrderService_1.UploadFile), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, OrderService_1.UploadFile);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const s3Service = new s3_1.S3Service();
        const data = yield s3Service.getSignedUrlForStore(input.fileName, payload.emp_id);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.put('/update/orderStatus', (0, validationMiddleware_1.validateDtoMiddleware)(OrderService_1.UpdateOrderTrackStatusById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, OrderService_1.UpdateOrderTrackStatusById);
        const orderService = new Order_controller_1.OrderService();
        const data = yield orderService.updateOrderTrackStatus(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.put('/update/special-discount', (0, validationMiddleware_1.validateDtoMiddleware)(OrderService_1.UpdateOrderBySpecialDiscountById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, OrderService_1.UpdateOrderBySpecialDiscountById);
        const orderService = new Order_controller_1.OrderService();
        const data = yield orderService.updateOrderBySpecialDiscount(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.put('/get/special-discount', (0, validationMiddleware_1.validateDtoMiddleware)(OrderService_1.UpdateOrderBySpecialDiscountById), validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getBody(req, OrderService_1.UpdateOrderBySpecialDiscountById);
        const orderService = new Order_controller_1.OrderService();
        const data = yield orderService.updateOrderBySpecialDiscount(input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/allPendingApproval', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const input: OrderListFilter = RequestHandler.Defaults.getQuery<OrderListFilter>(req, OrderListFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const orderService = new Order_controller_1.OrderService();
        const data = yield orderService.getAllPendingApproval(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/report/pending-collection', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const input: dayTrackingFilter = RequestHandler.Defaults.getQuery<dayTrackingFilter>(req, dayTrackingFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const pendingCollectionService = new Order_controller_1.OrderService();
        const data = yield pendingCollectionService.getPendingCollectionReport(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/report/getPendingCollectionByStoreId', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const pendingCollectionService = new Order_controller_1.OrderService();
        const data = yield pendingCollectionService.getPendingCollectionByStoreId(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/report/pending-approval', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const input: dayTrackingFilter = RequestHandler.Defaults.getQuery<dayTrackingFilter>(req, dayTrackingFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const pendingApprovalService = new Order_controller_1.OrderService();
        const data = yield pendingApprovalService.getPendingApprovalReport(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/report/store-revenue', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, AttendanceService_1.ReportFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const pendingApprovalService = new Order_controller_1.OrderService();
        const data = yield pendingApprovalService.getStoreRevenueReport(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/report/sku-revenue', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, AttendanceService_1.ReportFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const pendingApprovalService = new Order_controller_1.OrderService();
        const data = yield pendingApprovalService.getSkuRevenueReport(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/report/monthly-progress', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, AttendanceService_1.monthlyFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const pendingApprovalService = new Order_controller_1.OrderService();
        const data = yield pendingApprovalService.getMonthlyProgressReport(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/report/monthly-order', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, AttendanceService_1.monthlyFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const pendingApprovalService = new Order_controller_1.OrderService();
        const data = yield pendingApprovalService.getMonthlyOrderReportforRetailor(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/report/unbilled-store', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const input: dayTrackingFilter = RequestHandler.Defaults.getQuery<dayTrackingFilter>(req, dayTrackingFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const service = new Order_controller_1.OrderService();
        const data = yield service.getUnbilledStoreReport(payload);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/report/employee-performance', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, AttendanceService_1.ReportFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const pendingApprovalService = new Order_controller_1.OrderService();
        const data = yield pendingApprovalService.getEmployeePreformanceReport(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
router.get('/report/monthly-no-order', validationMiddleware_1.AccessTokenService.validateTokenMiddleware(common_1.JwtTokenTypes.AUTH_TOKEN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = RequestHander_1.RequestHandler.Defaults.getQuery(req, VisitService_1.dayTrackingFilter);
        const payload = RequestHander_1.RequestHandler.Custom.getUser(req);
        const pendingApprovalService = new Order_controller_1.OrderService();
        const data = yield pendingApprovalService.getMonthlyNoOrderReport(payload, input);
        validationMiddleware_1.ResponseHandler.sendResponse(res, data);
    }
    catch (error) {
        validationMiddleware_1.ResponseHandler.sendErrorResponse(res, error);
    }
}));
