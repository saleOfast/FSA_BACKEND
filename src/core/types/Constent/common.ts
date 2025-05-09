export enum STATUSCODES {
    BAD_REQUEST = 400,
    VALIDATION_FAILED = 400,
    OUTGOING_API_ERROR = 777,
    ERROR_UNKNOWN_SHOW_TO_USER = 400,
    ERROR_UNKNOWN = 500,
    ERROR_CANNOT_FULLFILL_REQUEST = 417,
    NOT_FOUND = 404,
    DATABASE_ERROR = 402,
    DATABASE_DUPLICATE_ERROR_CODE = 1062,
    INVALID_UPLOADING = 1103,
    TOKEN_INVALID = 511,
    ACCESS_DENIED = 403,
    INVALID_ROUTE_URL = 608,
    INVALID_BASE_URL = 609,
    CONFLICT = 409,
    SUCCESS = 200
}

export enum JwtTokenTypes {
    AUTH_TOKEN = 'AUTH_TOKEN'
}

export var ExpressExtendedRequestParams = {
    IP: "PC_ip_address",
    START_TIME: "PC_start_timeStamp",
    PAYLOAD: "PC_payload",
    USER: "PC_user",
};

export enum UserRole {
    ADMIN = "ADMIN",
    DIRECTOR = "DIRECTOR",
    RSM = "RSM",
    ASM = "ASM",
    SO = "SO",
    SSM = "SSM",
    MANAGER = "MANAGER",
    DISTRIBUTOR = "DISTRIBUTOR",
    RETAILER = "RETAILER",
    SUPER_ADMIN = "SUPER_ADMIN",
    CHANNEL = "CHANNEL"
}

export enum CallType {
    PHYSICAL = "PHYSICAL",
    TELEVISIT = "TELEVISIT",
    RETAILER_ORDER = "RETAILER_ORDER"
}

export enum CallTypeOrders {
    PHYSICAL = "PHYSICAL",
    TELEVISIT = "TELEVISIT",
    RETAILER_ORDER = "RETAILER_ORDER"
}

export enum VisitStatus {
    PENDING = 'PENDING',
    COMPLETE = 'COMPLETE'
}

export enum SpecialDiscountStatus {
    REJECTED = 'REJECTED',
    APPROVED = 'APPROVED',
    PENDING = 'PENDING'
}

export enum StoreTypeFilter {
    NEW = 'new',
    ALL = 'all'
}

export enum DiscountType {
    PERCENTAGE = "PERCENTAGE",
    VALUE = "VALUE"
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS'
}

export enum OrderStatus {
    ORDERSAVED = 'ORDER_SAVED',
    ORDERPLACED = 'ORDER_PLACED',
    OUTFORDELIVERY = 'OUT_FOR_DELIVERY',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}
export enum DurationEnum {
    ALL = 'ALL',
    TODAY = 'TODAY',
    WEEK = 'WEEK'
}

export enum CollectionStatus {
    PAID = 'PAID',
    PENDING = 'PENDING'
}

export enum StoreBilling {
    BILLED = 'BILLED',
    UNBILLED = 'UNBILLED',
    ALL = 'ALL'
}

export enum TimelineEnum {
    TODAY = 'TODAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    YEAR = 'YEAR',
    QUARTER = 'QUARTER'
}

export enum ExpenseReportClaimType {
    TA = 'TA',
    DA = 'DA',
}

export enum HolidayType {
    GAZETTED = 'GAZETTED',
    RESTRICTED = 'RESTRICTED',
}

export enum ExpenseReportStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum PracticeTypeEnum {
    PVT = 'PRIVATE',
    HOSPITAL = 'HOSPITAL',
    GOVT = 'GOVERNMENT',
}

export enum ActivityTypeEnum {
    FTFM = 'FACE_TO_FACE_MEETING',
    CALL = 'PHONE_CALL',
}

export enum WorkplaceTypeEnum {
    PRIMARY = 'PRIMARY',
    OTHERS = 'OTHERS',
}

export enum SessionTypeEnum {
    SURVERY = 'SURVERY',
    RTM = 'ROUND_TABLE_MEETING',
    WEBINAR = 'WEBINAR',
}

export enum StockLevelComparison {
    LOWER = 'LOWER',
    SAME = 'SAME',
    HIGHER = 'HIGHER',
}