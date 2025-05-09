"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockLevelComparison = exports.SessionTypeEnum = exports.WorkplaceTypeEnum = exports.ActivityTypeEnum = exports.PracticeTypeEnum = exports.ExpenseReportStatus = exports.HolidayType = exports.ExpenseReportClaimType = exports.TimelineEnum = exports.StoreBilling = exports.CollectionStatus = exports.DurationEnum = exports.OrderStatus = exports.PaymentStatus = exports.DiscountType = exports.StoreTypeFilter = exports.SpecialDiscountStatus = exports.VisitStatus = exports.CallTypeOrders = exports.CallType = exports.UserRole = exports.ExpressExtendedRequestParams = exports.JwtTokenTypes = exports.STATUSCODES = void 0;
var STATUSCODES;
(function (STATUSCODES) {
    STATUSCODES[STATUSCODES["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    STATUSCODES[STATUSCODES["VALIDATION_FAILED"] = 400] = "VALIDATION_FAILED";
    STATUSCODES[STATUSCODES["OUTGOING_API_ERROR"] = 777] = "OUTGOING_API_ERROR";
    STATUSCODES[STATUSCODES["ERROR_UNKNOWN_SHOW_TO_USER"] = 400] = "ERROR_UNKNOWN_SHOW_TO_USER";
    STATUSCODES[STATUSCODES["ERROR_UNKNOWN"] = 500] = "ERROR_UNKNOWN";
    STATUSCODES[STATUSCODES["ERROR_CANNOT_FULLFILL_REQUEST"] = 417] = "ERROR_CANNOT_FULLFILL_REQUEST";
    STATUSCODES[STATUSCODES["NOT_FOUND"] = 404] = "NOT_FOUND";
    STATUSCODES[STATUSCODES["DATABASE_ERROR"] = 402] = "DATABASE_ERROR";
    STATUSCODES[STATUSCODES["DATABASE_DUPLICATE_ERROR_CODE"] = 1062] = "DATABASE_DUPLICATE_ERROR_CODE";
    STATUSCODES[STATUSCODES["INVALID_UPLOADING"] = 1103] = "INVALID_UPLOADING";
    STATUSCODES[STATUSCODES["TOKEN_INVALID"] = 511] = "TOKEN_INVALID";
    STATUSCODES[STATUSCODES["ACCESS_DENIED"] = 403] = "ACCESS_DENIED";
    STATUSCODES[STATUSCODES["INVALID_ROUTE_URL"] = 608] = "INVALID_ROUTE_URL";
    STATUSCODES[STATUSCODES["INVALID_BASE_URL"] = 609] = "INVALID_BASE_URL";
    STATUSCODES[STATUSCODES["CONFLICT"] = 409] = "CONFLICT";
    STATUSCODES[STATUSCODES["SUCCESS"] = 200] = "SUCCESS";
})(STATUSCODES = exports.STATUSCODES || (exports.STATUSCODES = {}));
var JwtTokenTypes;
(function (JwtTokenTypes) {
    JwtTokenTypes["AUTH_TOKEN"] = "AUTH_TOKEN";
})(JwtTokenTypes = exports.JwtTokenTypes || (exports.JwtTokenTypes = {}));
exports.ExpressExtendedRequestParams = {
    IP: "PC_ip_address",
    START_TIME: "PC_start_timeStamp",
    PAYLOAD: "PC_payload",
    USER: "PC_user",
};
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["DIRECTOR"] = "DIRECTOR";
    UserRole["RSM"] = "RSM";
    UserRole["ASM"] = "ASM";
    UserRole["SO"] = "SO";
    UserRole["SSM"] = "SSM";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["DISTRIBUTOR"] = "DISTRIBUTOR";
    UserRole["RETAILER"] = "RETAILER";
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["CHANNEL"] = "CHANNEL";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var CallType;
(function (CallType) {
    CallType["PHYSICAL"] = "PHYSICAL";
    CallType["TELEVISIT"] = "TELEVISIT";
    CallType["RETAILER_ORDER"] = "RETAILER_ORDER";
})(CallType = exports.CallType || (exports.CallType = {}));
var CallTypeOrders;
(function (CallTypeOrders) {
    CallTypeOrders["PHYSICAL"] = "PHYSICAL";
    CallTypeOrders["TELEVISIT"] = "TELEVISIT";
    CallTypeOrders["RETAILER_ORDER"] = "RETAILER_ORDER";
})(CallTypeOrders = exports.CallTypeOrders || (exports.CallTypeOrders = {}));
var VisitStatus;
(function (VisitStatus) {
    VisitStatus["PENDING"] = "PENDING";
    VisitStatus["COMPLETE"] = "COMPLETE";
})(VisitStatus = exports.VisitStatus || (exports.VisitStatus = {}));
var SpecialDiscountStatus;
(function (SpecialDiscountStatus) {
    SpecialDiscountStatus["REJECTED"] = "REJECTED";
    SpecialDiscountStatus["APPROVED"] = "APPROVED";
    SpecialDiscountStatus["PENDING"] = "PENDING";
})(SpecialDiscountStatus = exports.SpecialDiscountStatus || (exports.SpecialDiscountStatus = {}));
var StoreTypeFilter;
(function (StoreTypeFilter) {
    StoreTypeFilter["NEW"] = "new";
    StoreTypeFilter["ALL"] = "all";
})(StoreTypeFilter = exports.StoreTypeFilter || (exports.StoreTypeFilter = {}));
var DiscountType;
(function (DiscountType) {
    DiscountType["PERCENTAGE"] = "PERCENTAGE";
    DiscountType["VALUE"] = "VALUE";
})(DiscountType = exports.DiscountType || (exports.DiscountType = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["SUCCESS"] = "SUCCESS";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["ORDERSAVED"] = "ORDER_SAVED";
    OrderStatus["ORDERPLACED"] = "ORDER_PLACED";
    OrderStatus["OUTFORDELIVERY"] = "OUT_FOR_DELIVERY";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
var DurationEnum;
(function (DurationEnum) {
    DurationEnum["ALL"] = "ALL";
    DurationEnum["TODAY"] = "TODAY";
    DurationEnum["WEEK"] = "WEEK";
})(DurationEnum = exports.DurationEnum || (exports.DurationEnum = {}));
var CollectionStatus;
(function (CollectionStatus) {
    CollectionStatus["PAID"] = "PAID";
    CollectionStatus["PENDING"] = "PENDING";
})(CollectionStatus = exports.CollectionStatus || (exports.CollectionStatus = {}));
var StoreBilling;
(function (StoreBilling) {
    StoreBilling["BILLED"] = "BILLED";
    StoreBilling["UNBILLED"] = "UNBILLED";
    StoreBilling["ALL"] = "ALL";
})(StoreBilling = exports.StoreBilling || (exports.StoreBilling = {}));
var TimelineEnum;
(function (TimelineEnum) {
    TimelineEnum["TODAY"] = "TODAY";
    TimelineEnum["WEEK"] = "WEEK";
    TimelineEnum["MONTH"] = "MONTH";
    TimelineEnum["YEAR"] = "YEAR";
    TimelineEnum["QUARTER"] = "QUARTER";
})(TimelineEnum = exports.TimelineEnum || (exports.TimelineEnum = {}));
var ExpenseReportClaimType;
(function (ExpenseReportClaimType) {
    ExpenseReportClaimType["TA"] = "TA";
    ExpenseReportClaimType["DA"] = "DA";
})(ExpenseReportClaimType = exports.ExpenseReportClaimType || (exports.ExpenseReportClaimType = {}));
var HolidayType;
(function (HolidayType) {
    HolidayType["GAZETTED"] = "GAZETTED";
    HolidayType["RESTRICTED"] = "RESTRICTED";
})(HolidayType = exports.HolidayType || (exports.HolidayType = {}));
var ExpenseReportStatus;
(function (ExpenseReportStatus) {
    ExpenseReportStatus["PENDING"] = "PENDING";
    ExpenseReportStatus["APPROVED"] = "APPROVED";
    ExpenseReportStatus["REJECTED"] = "REJECTED";
})(ExpenseReportStatus = exports.ExpenseReportStatus || (exports.ExpenseReportStatus = {}));
var PracticeTypeEnum;
(function (PracticeTypeEnum) {
    PracticeTypeEnum["PVT"] = "PRIVATE";
    PracticeTypeEnum["HOSPITAL"] = "HOSPITAL";
    PracticeTypeEnum["GOVT"] = "GOVERNMENT";
})(PracticeTypeEnum = exports.PracticeTypeEnum || (exports.PracticeTypeEnum = {}));
var ActivityTypeEnum;
(function (ActivityTypeEnum) {
    ActivityTypeEnum["FTFM"] = "FACE_TO_FACE_MEETING";
    ActivityTypeEnum["CALL"] = "PHONE_CALL";
})(ActivityTypeEnum = exports.ActivityTypeEnum || (exports.ActivityTypeEnum = {}));
var WorkplaceTypeEnum;
(function (WorkplaceTypeEnum) {
    WorkplaceTypeEnum["PRIMARY"] = "PRIMARY";
    WorkplaceTypeEnum["OTHERS"] = "OTHERS";
})(WorkplaceTypeEnum = exports.WorkplaceTypeEnum || (exports.WorkplaceTypeEnum = {}));
var SessionTypeEnum;
(function (SessionTypeEnum) {
    SessionTypeEnum["SURVERY"] = "SURVERY";
    SessionTypeEnum["RTM"] = "ROUND_TABLE_MEETING";
    SessionTypeEnum["WEBINAR"] = "WEBINAR";
})(SessionTypeEnum = exports.SessionTypeEnum || (exports.SessionTypeEnum = {}));
var StockLevelComparison;
(function (StockLevelComparison) {
    StockLevelComparison["LOWER"] = "LOWER";
    StockLevelComparison["SAME"] = "SAME";
    StockLevelComparison["HIGHER"] = "HIGHER";
})(StockLevelComparison = exports.StockLevelComparison || (exports.StockLevelComparison = {}));
