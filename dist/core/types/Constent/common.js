"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxInclusive = exports.UOM = exports.ItemType = exports.PriorityType = exports.ApprovalStatus = exports.PriceBookStatus = exports.CurrencyType = exports.Channel = exports.PriceBookType = exports.VisitDay = exports.BeatPriority = exports.BeatStatus = exports.VisitFrequency = exports.BeatType = exports.ClaimPeriod = exports.BenefitType = exports.SchemeStatus = exports.SchemeNature = exports.SchemeType = exports.PosmStatusEnum = exports.POSMAllocationTargetEnum = exports.POSMChannelTargetEnum = exports.POSMMaterialTypeEnum = exports.PosmCategoryEnum = exports.PosmTypeEnum = exports.InventoryVisibilityScope = exports.StockLevelComparison = exports.SessionTypeEnum = exports.WorkplaceTypeEnum = exports.ActivityTypeEnum = exports.PracticeTypeEnum = exports.ExpenseReportStatus = exports.HolidayType = exports.ExpenseReportClaimType = exports.TimelineEnum = exports.StoreBilling = exports.CollectionStatus = exports.DurationEnum = exports.OrderStatus = exports.PaymentStatus = exports.DiscountType = exports.StoreTypeFilter = exports.SpecialDiscountStatus = exports.VisitStatus = exports.CallTypeOrders = exports.CallType = exports.UserRole = exports.ExpressExtendedRequestParams = exports.JwtTokenTypes = exports.STATUSCODES = void 0;
exports.DeliveryStatusEnum = exports.GrnStatusEnum = exports.StorageConditionEnum = exports.QualityStatusEnum = exports.BatchStatusEnum = exports.customerZone = exports.SEZ = exports.franchise = exports.BusinessRoleEnum = exports.OwnershipTypeEnum = exports.WarehouseStatusEnum = exports.PaymentModeEnum = exports.OrderStatusEnum = exports.OrderTypeEnum = exports.YesNo = exports.SupplyType = exports.TaxComponent = exports.TaxClassification = exports.PreferredDays = exports.Status = void 0;
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
var InventoryVisibilityScope;
(function (InventoryVisibilityScope) {
    InventoryVisibilityScope["SELF"] = "Self";
    InventoryVisibilityScope["CHILD"] = "Child";
    InventoryVisibilityScope["FULL"] = "Full";
    InventoryVisibilityScope["NONE"] = "None";
})(InventoryVisibilityScope = exports.InventoryVisibilityScope || (exports.InventoryVisibilityScope = {}));
// POSM Type
var PosmTypeEnum;
(function (PosmTypeEnum) {
    PosmTypeEnum["POSTER"] = "Poster";
    PosmTypeEnum["SHELF_STRIP"] = "Shelf Strip";
    PosmTypeEnum["WOBBLER"] = "Wobbler";
    PosmTypeEnum["COOLER"] = "Cooler";
    PosmTypeEnum["DISPLAY_UNIT"] = "Display Unit";
    PosmTypeEnum["DIGITAL_SCREEN"] = "Digital Screen";
})(PosmTypeEnum = exports.PosmTypeEnum || (exports.PosmTypeEnum = {}));
// POSM Category
var PosmCategoryEnum;
(function (PosmCategoryEnum) {
    PosmCategoryEnum["PERMANENT"] = "Permanent";
    PosmCategoryEnum["SEMI_PERMANENT"] = "Semi-Permanent";
    PosmCategoryEnum["TEMPORARY"] = "Temporary";
})(PosmCategoryEnum = exports.PosmCategoryEnum || (exports.PosmCategoryEnum = {}));
// Material Type
var POSMMaterialTypeEnum;
(function (POSMMaterialTypeEnum) {
    POSMMaterialTypeEnum["CARDBOARD"] = "Cardboard";
    POSMMaterialTypeEnum["PLASTIC"] = "Plastic";
    POSMMaterialTypeEnum["METAL"] = "Metal";
    POSMMaterialTypeEnum["DIGITAL"] = "Digital";
})(POSMMaterialTypeEnum = exports.POSMMaterialTypeEnum || (exports.POSMMaterialTypeEnum = {}));
// Channel Target
var POSMChannelTargetEnum;
(function (POSMChannelTargetEnum) {
    POSMChannelTargetEnum["GT"] = "GT";
    POSMChannelTargetEnum["MT"] = "MT";
    POSMChannelTargetEnum["ECOM"] = "E-COM";
})(POSMChannelTargetEnum = exports.POSMChannelTargetEnum || (exports.POSMChannelTargetEnum = {}));
// Allocation Target
var POSMAllocationTargetEnum;
(function (POSMAllocationTargetEnum) {
    POSMAllocationTargetEnum["DISTRIBUTOR"] = "Distributor";
    POSMAllocationTargetEnum["RETAILER"] = "Retailer";
    POSMAllocationTargetEnum["KEY_ACCOUNT"] = "Key Account";
})(POSMAllocationTargetEnum = exports.POSMAllocationTargetEnum || (exports.POSMAllocationTargetEnum = {}));
// POSM Status
var PosmStatusEnum;
(function (PosmStatusEnum) {
    PosmStatusEnum["ACTIVE"] = "Active";
    PosmStatusEnum["INACTIVE"] = "Inactive";
    PosmStatusEnum["RETURNED"] = "Returned";
    PosmStatusEnum["LOST"] = "Lost";
})(PosmStatusEnum = exports.PosmStatusEnum || (exports.PosmStatusEnum = {}));
var SchemeType;
(function (SchemeType) {
    SchemeType["QTY_BASED"] = "QTY_BASED";
    SchemeType["VALUE_BASED"] = "VALUE_BASED";
    SchemeType["FREE_SKU"] = "FREE_SKU";
    SchemeType["SLAB"] = "SLAB";
    SchemeType["COMBO"] = "COMBO";
})(SchemeType = exports.SchemeType || (exports.SchemeType = {}));
var SchemeNature;
(function (SchemeNature) {
    SchemeNature["PRIMARY"] = "PRIMARY";
    SchemeNature["SECONDARY"] = "SECONDARY";
    SchemeNature["TRADE"] = "TRADE";
    SchemeNature["CONSUMER"] = "CONSUMER";
})(SchemeNature = exports.SchemeNature || (exports.SchemeNature = {}));
var SchemeStatus;
(function (SchemeStatus) {
    SchemeStatus["ACTIVE"] = "ACTIVE";
    SchemeStatus["INACTIVE"] = "INACTIVE";
    SchemeStatus["EXPIRED"] = "EXPIRED";
})(SchemeStatus = exports.SchemeStatus || (exports.SchemeStatus = {}));
var BenefitType;
(function (BenefitType) {
    BenefitType["FREE_SKU"] = "FREE_SKU";
    BenefitType["EXTRA_QTY"] = "EXTRA_QTY";
    BenefitType["VALUE_OFF"] = "VALUE_OFF";
})(BenefitType = exports.BenefitType || (exports.BenefitType = {}));
var ClaimPeriod;
(function (ClaimPeriod) {
    ClaimPeriod["MONTHLY"] = "MONTHLY";
    ClaimPeriod["QUARTERLY"] = "QUARTERLY";
    ClaimPeriod["CAMPAIGN"] = "CAMPAIGN";
})(ClaimPeriod = exports.ClaimPeriod || (exports.ClaimPeriod = {}));
var BeatType;
(function (BeatType) {
    BeatType["SALES"] = "SALES";
    BeatType["DELIVERY"] = "DELIVERY";
    BeatType["COLLECTION"] = "COLLECTION";
})(BeatType = exports.BeatType || (exports.BeatType = {}));
var VisitFrequency;
(function (VisitFrequency) {
    VisitFrequency["DAILY"] = "DAILY";
    VisitFrequency["WEEKLY"] = "WEEKLY";
    VisitFrequency["FORTNIGHTLY"] = "FORTNIGHTLY";
    VisitFrequency["MONTHLY"] = "MONTHLY";
})(VisitFrequency = exports.VisitFrequency || (exports.VisitFrequency = {}));
var BeatStatus;
(function (BeatStatus) {
    BeatStatus["ACTIVE"] = "ACTIVE";
    BeatStatus["INACTIVE"] = "INACTIVE";
})(BeatStatus = exports.BeatStatus || (exports.BeatStatus = {}));
var BeatPriority;
(function (BeatPriority) {
    BeatPriority["HIGH"] = "HIGH";
    BeatPriority["MEDIUM"] = "MEDIUM";
    BeatPriority["LOW"] = "LOW";
})(BeatPriority = exports.BeatPriority || (exports.BeatPriority = {}));
var VisitDay;
(function (VisitDay) {
    VisitDay["MONDAY"] = "MONDAY";
    VisitDay["TUESDAY"] = "TUESDAY";
    VisitDay["WEDNESDAY"] = "WEDNESDAY";
    VisitDay["THURSDAY"] = "THURSDAY";
    VisitDay["FRIDAY"] = "FRIDAY";
    VisitDay["SATURDAY"] = "SATURDAY";
    VisitDay["SUNDAY"] = "SUNDAY";
})(VisitDay = exports.VisitDay || (exports.VisitDay = {}));
var PriceBookType;
(function (PriceBookType) {
    PriceBookType["TRADE"] = "TRADE";
    PriceBookType["MRP"] = "MRP";
    PriceBookType["PROMO"] = "PROMO";
    PriceBookType["KEY_ACCOUNT"] = "KEY_ACCOUNT";
})(PriceBookType = exports.PriceBookType || (exports.PriceBookType = {}));
var Channel;
(function (Channel) {
    Channel["GT"] = "GT";
    Channel["MT"] = "MT";
    Channel["ECOM"] = "ECOM";
    Channel["B2B"] = "B2B";
})(Channel = exports.Channel || (exports.Channel = {}));
var CurrencyType;
(function (CurrencyType) {
    CurrencyType["INR"] = "INR";
    CurrencyType["USD"] = "USD";
    CurrencyType["EUR"] = "EUR";
})(CurrencyType = exports.CurrencyType || (exports.CurrencyType = {}));
var PriceBookStatus;
(function (PriceBookStatus) {
    PriceBookStatus["DRAFT"] = "DRAFT";
    PriceBookStatus["ACTIVE"] = "ACTIVE";
    PriceBookStatus["EXPIRED"] = "EXPIRED";
})(PriceBookStatus = exports.PriceBookStatus || (exports.PriceBookStatus = {}));
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "PENDING";
    ApprovalStatus["APPROVED"] = "APPROVED";
    ApprovalStatus["REJECTED"] = "REJECTED";
})(ApprovalStatus = exports.ApprovalStatus || (exports.ApprovalStatus = {}));
var PriorityType;
(function (PriorityType) {
    PriorityType["LOW"] = "LOW";
    PriorityType["MEDIUM"] = "MEDIUM";
    PriorityType["HIGH"] = "HIGH";
    PriorityType["CRITICAL"] = "CRITICAL";
})(PriorityType = exports.PriorityType || (exports.PriorityType = {}));
var ItemType;
(function (ItemType) {
    ItemType["SKU"] = "SKU";
    ItemType["BUNDLE"] = "BUNDLE";
    ItemType["SERVICE"] = "SERVICE";
})(ItemType = exports.ItemType || (exports.ItemType = {}));
var UOM;
(function (UOM) {
    UOM["PC"] = "PC";
    UOM["CASE"] = "CASE";
    UOM["KG"] = "KG";
    UOM["LTR"] = "LTR";
})(UOM = exports.UOM || (exports.UOM = {}));
var TaxInclusive;
(function (TaxInclusive) {
    TaxInclusive["INCLUSIVE"] = "INCLUSIVE";
    TaxInclusive["EXCLUSIVE"] = "EXCLUSIVE";
})(TaxInclusive = exports.TaxInclusive || (exports.TaxInclusive = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["INACTIVE"] = "INACTIVE";
})(Status = exports.Status || (exports.Status = {}));
var PreferredDays;
(function (PreferredDays) {
    PreferredDays["MONDAY"] = "MONDAY";
    PreferredDays["TUESDAY"] = "TUESDAY";
    PreferredDays["WEDNESDAY"] = "WEDNESDAY";
    PreferredDays["THURSDAY"] = "THURSDAY";
    PreferredDays["FRIDAY"] = "FRIDAY";
    PreferredDays["SATURDAY"] = "SATURDAY";
    PreferredDays["SUNDAY"] = "SUNDAY";
})(PreferredDays = exports.PreferredDays || (exports.PreferredDays = {}));
var TaxClassification;
(function (TaxClassification) {
    TaxClassification["HSN"] = "HSN";
    TaxClassification["SAC"] = "SAC";
})(TaxClassification = exports.TaxClassification || (exports.TaxClassification = {}));
var TaxComponent;
(function (TaxComponent) {
    TaxComponent["CGST"] = "CGST";
    TaxComponent["SGST"] = "SGST";
    TaxComponent["IGST"] = "IGST";
    TaxComponent["UTGST"] = "UTGST";
    TaxComponent["CESS"] = "CESS";
    TaxComponent["REVERSE_CHARGE"] = "REVERSE_CHARGE";
    TaxComponent["NON_GST"] = "NON_GST";
})(TaxComponent = exports.TaxComponent || (exports.TaxComponent = {}));
var SupplyType;
(function (SupplyType) {
    SupplyType["INTRA"] = "INTRA";
    SupplyType["INTER"] = "INTER";
})(SupplyType = exports.SupplyType || (exports.SupplyType = {}));
var YesNo;
(function (YesNo) {
    YesNo["YES"] = "YES";
    YesNo["NO"] = "NO";
})(YesNo = exports.YesNo || (exports.YesNo = {}));
var OrderTypeEnum;
(function (OrderTypeEnum) {
    OrderTypeEnum["REGULAR"] = "Regular";
    OrderTypeEnum["VAN_SALES"] = "Van Sales";
    OrderTypeEnum["SECONDARY"] = "Secondary";
    OrderTypeEnum["PRE_SELL"] = "Pre-sell";
})(OrderTypeEnum = exports.OrderTypeEnum || (exports.OrderTypeEnum = {}));
var OrderStatusEnum;
(function (OrderStatusEnum) {
    OrderStatusEnum["DRAFT"] = "Draft";
    OrderStatusEnum["CONFIRMED"] = "Confirmed";
    OrderStatusEnum["ALLOCATED"] = "Allocated";
    OrderStatusEnum["INVOICED"] = "Invoiced";
    OrderStatusEnum["CANCELLED"] = "Cancelled";
})(OrderStatusEnum = exports.OrderStatusEnum || (exports.OrderStatusEnum = {}));
var PaymentModeEnum;
(function (PaymentModeEnum) {
    PaymentModeEnum["CASH"] = "CASH";
    PaymentModeEnum["UPI"] = "UPI";
    PaymentModeEnum["CHEQUE"] = "CHEQUE";
    PaymentModeEnum["NEFT"] = "NEFT";
    PaymentModeEnum["RTGS"] = "RTGS";
})(PaymentModeEnum = exports.PaymentModeEnum || (exports.PaymentModeEnum = {}));
var WarehouseStatusEnum;
(function (WarehouseStatusEnum) {
    WarehouseStatusEnum["DRAFT"] = "DRAFT";
    WarehouseStatusEnum["ACTIVE"] = "ACTIVE";
    WarehouseStatusEnum["SUSPENDED"] = "SUSPENDED";
    WarehouseStatusEnum["CLOSED"] = "CLOSED";
})(WarehouseStatusEnum = exports.WarehouseStatusEnum || (exports.WarehouseStatusEnum = {}));
var OwnershipTypeEnum;
(function (OwnershipTypeEnum) {
    OwnershipTypeEnum["COMPANY"] = "COMPANY";
    OwnershipTypeEnum["DISTRIBUTOR"] = "DISTRIBUTOR";
})(OwnershipTypeEnum = exports.OwnershipTypeEnum || (exports.OwnershipTypeEnum = {}));
var BusinessRoleEnum;
(function (BusinessRoleEnum) {
    BusinessRoleEnum["PLANT"] = "PLANT";
    BusinessRoleEnum["PRIMARY"] = "PRIMARY";
    // REGIONAL_DC = "REGIONAL_DC",
    // DEPOT = "DEPOT",
    // DIRECT_STORE = "DIRECT_STORE",
    // TRANSIT_HUB = "TRANSIT_HUB",
    // RETURN_CENTER = "RETURN_CENTER",
})(BusinessRoleEnum = exports.BusinessRoleEnum || (exports.BusinessRoleEnum = {}));
var franchise;
(function (franchise) {
    franchise["YES"] = "YES";
    franchise["NO"] = "NO";
})(franchise = exports.franchise || (exports.franchise = {}));
var SEZ;
(function (SEZ) {
    SEZ["YES"] = "YES";
    SEZ["NO"] = "NO";
})(SEZ = exports.SEZ || (exports.SEZ = {}));
var customerZone;
(function (customerZone) {
    customerZone["NORTH"] = "NORTH";
    customerZone["SOUTH"] = "SOUTH";
    customerZone["EAST"] = "EAST";
    customerZone["WEST"] = "WEST";
})(customerZone = exports.customerZone || (exports.customerZone = {}));
var BatchStatusEnum;
(function (BatchStatusEnum) {
    BatchStatusEnum["ACTIVE"] = "ACTIVE";
    BatchStatusEnum["BLOCKED"] = "BLOCKED";
    BatchStatusEnum["EXPIRED"] = "EXPIRED";
    BatchStatusEnum["QUARANTINE"] = "QUARANTINE";
})(BatchStatusEnum = exports.BatchStatusEnum || (exports.BatchStatusEnum = {}));
var QualityStatusEnum;
(function (QualityStatusEnum) {
    QualityStatusEnum["PENDING"] = "PENDING";
    QualityStatusEnum["APPROVED"] = "APPROVED";
    QualityStatusEnum["REJECTED"] = "REJECTED";
})(QualityStatusEnum = exports.QualityStatusEnum || (exports.QualityStatusEnum = {}));
var StorageConditionEnum;
(function (StorageConditionEnum) {
    StorageConditionEnum["AMBIENT"] = "AMBIENT";
    StorageConditionEnum["COLD_CHAIN"] = "COLD_CHAIN";
    StorageConditionEnum["FROZEN"] = "FROZEN";
})(StorageConditionEnum = exports.StorageConditionEnum || (exports.StorageConditionEnum = {}));
var GrnStatusEnum;
(function (GrnStatusEnum) {
    GrnStatusEnum["PENDING"] = "PENDING";
    GrnStatusEnum["VERIFIED"] = "VERIFIED";
    GrnStatusEnum["COMPLETED"] = "COMPLETED";
})(GrnStatusEnum = exports.GrnStatusEnum || (exports.GrnStatusEnum = {}));
var DeliveryStatusEnum;
(function (DeliveryStatusEnum) {
    DeliveryStatusEnum["DRAFT"] = "DRAFT";
    DeliveryStatusEnum["PICK_LIST"] = "PICK_LIST";
    DeliveryStatusEnum["PICKED"] = "PICKED";
    DeliveryStatusEnum["DISPATCHED"] = "DISPATCHED";
    DeliveryStatusEnum["IN_TRANSIT"] = "IN_TRANSIT";
    DeliveryStatusEnum["DELIVERED"] = "DELIVERED";
    DeliveryStatusEnum["CANCELLED"] = "CANCELLED";
})(DeliveryStatusEnum = exports.DeliveryStatusEnum || (exports.DeliveryStatusEnum = {}));
