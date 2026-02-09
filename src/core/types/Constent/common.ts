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

export enum InventoryVisibilityScope {
    SELF = 'Self',
    CHILD = 'Child',
    FULL = 'Full',
    NONE = 'None',
}

// POSM Type
export enum PosmTypeEnum {
  POSTER = "Poster",
  SHELF_STRIP = "Shelf Strip",
  WOBBLER = "Wobbler",
  COOLER = "Cooler",
  DISPLAY_UNIT = "Display Unit",
  DIGITAL_SCREEN = "Digital Screen",
}

// POSM Category
export enum PosmCategoryEnum {
  PERMANENT = "Permanent",
  SEMI_PERMANENT = "Semi-Permanent",
  TEMPORARY = "Temporary",
}

// Material Type
export enum POSMMaterialTypeEnum {
  CARDBOARD = "Cardboard",
  PLASTIC = "Plastic",
  METAL = "Metal",
  DIGITAL = "Digital",
}

// Channel Target
export enum POSMChannelTargetEnum {
  GT = "GT",
  MT = "MT",
  ECOM = "E-COM",
}

// Allocation Target
export enum POSMAllocationTargetEnum {
  DISTRIBUTOR = "Distributor",
  RETAILER = "Retailer",
  KEY_ACCOUNT = "Key Account",
}

// POSM Status
export enum PosmStatusEnum {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  RETURNED = "Returned",
  LOST = "Lost",
}


export enum SchemeType {
  QTY_BASED = "QTY_BASED",
  VALUE_BASED = "VALUE_BASED",
  FREE_SKU = "FREE_SKU",
  SLAB = "SLAB",
  COMBO = "COMBO",
}

export enum SchemeNature {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
  TRADE = "TRADE",
  CONSUMER = "CONSUMER",
}

export enum SchemeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  EXPIRED = "EXPIRED",
}

export enum BenefitType {
  FREE_SKU = "FREE_SKU",
  EXTRA_QTY = "EXTRA_QTY",
  VALUE_OFF = "VALUE_OFF",
}

export enum ClaimPeriod {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  CAMPAIGN = "CAMPAIGN",
}




export enum BeatType {
  SALES = "SALES",
  DELIVERY = "DELIVERY",
  COLLECTION = "COLLECTION",
}

export enum VisitFrequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  FORTNIGHTLY = "FORTNIGHTLY",
  MONTHLY = "MONTHLY",
}

export enum BeatStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum BeatPriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum VisitDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export enum PriceBookType {
  TRADE = "TRADE",
  MRP = "MRP",
  PROMO = "PROMO",
  KEY_ACCOUNT = "KEY_ACCOUNT",
}
export enum Channel {
  GT = "GT",
  MT = "MT",
  ECOM = "ECOM",
  B2B = "B2B",
}
export enum CurrencyType {
  INR = "INR",
  USD = "USD",
  EUR = "EUR",
}
export enum PriceBookStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
}
export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
export enum PriorityType {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}


export enum ItemType {
  SKU = "SKU",
  BUNDLE = "BUNDLE",
  SERVICE = "SERVICE",
}

export enum UOM {
  PC = "PC",
  CASE = "CASE",
  KG = "KG",
  LTR = "LTR",
}

export enum TaxInclusive {
  INCLUSIVE = "INCLUSIVE",
  EXCLUSIVE = "EXCLUSIVE",
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum  PreferredDays{
    MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export enum TaxClassification {
  HSN = "HSN",
  SAC = "SAC",
}

export enum TaxComponent {
  CGST = "CGST",
  SGST = "SGST",
  IGST = "IGST",
  UTGST = "UTGST",
  CESS = "CESS",
  REVERSE_CHARGE = "REVERSE_CHARGE",
  NON_GST = "NON_GST",
}

export enum SupplyType {
  INTRA = "INTRA",
  INTER = "INTER",
}

export enum YesNo {
  YES = "YES",
  NO = "NO",
}

export enum OrderTypeEnum {
  REGULAR = "Regular",
  VAN_SALES = "Van Sales",
  SECONDARY = "Secondary",
  PRE_SELL = "Pre-sell",
}

export enum OrderStatusEnum {
  DRAFT = "Draft",
  CONFIRMED = "Confirmed",
  ALLOCATED = "Allocated",
  INVOICED = "Invoiced",
  CANCELLED = "Cancelled",
}
export enum PaymentModeEnum {
  CASH = "CASH",
  UPI = "UPI",
  CHEQUE = "CHEQUE",
  NEFT = "NEFT",
  RTGS = "RTGS",
}


export enum WarehouseStatusEnum {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  CLOSED = "CLOSED",
}

export enum OwnershipTypeEnum {
  COMPANY = "COMPANY",
  DISTRIBUTOR = "DISTRIBUTOR",

}

export enum BusinessRoleEnum {
  PLANT = "PLANT",
  PRIMARY = "PRIMARY",
  // REGIONAL_DC = "REGIONAL_DC",
  // DEPOT = "DEPOT",
  // DIRECT_STORE = "DIRECT_STORE",
  // TRANSIT_HUB = "TRANSIT_HUB",
  // RETURN_CENTER = "RETURN_CENTER",
}

export enum franchise{
  YES = "YES",
  NO = "NO",
}

export enum SEZ{
  YES = "YES",
  NO = "NO",
}

export enum customerZone{
  NORTH = "NORTH",
  SOUTH = "SOUTH",
  EAST = "EAST",
  WEST = "WEST",

}


export enum BatchStatusEnum {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  EXPIRED = "EXPIRED",
  QUARANTINE = "QUARANTINE",
}

export enum QualityStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum StorageConditionEnum {
  AMBIENT = "AMBIENT",
  COLD_CHAIN = "COLD_CHAIN",
  FROZEN = "FROZEN",
}

