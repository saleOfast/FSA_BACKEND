import { Type } from "class-transformer";
import { IsArray, IsBoolean, isEnum, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { IStore } from "../StoreService/StoreService";
import { CallTypeOrders, CollectionStatus, DurationEnum, OrderStatus, PaymentStatus, SpecialDiscountStatus } from "../Constent/common";
import { ISkuDiscount } from "../ProductService/ProductService";

export interface IOrderItems {
    id: number,
    productId: number;
    orderId: number;
    productName: string;
    mrp: number;
    rlp: number;
    rlpValue: number;
    caseQty: number;
    categoryId: number;
    brandId: number;
    packetQty: number;
    createdAt: Date;
    updatedAt: Date;
    pieceDiscount: number
}


export interface ICollectedAmount {
    collectedAmountId: number,
    orderId: number,
    collectedAmount: number,
    pendingAmount: number,
    totalCollectedAmount: number,
    totalPendingAmount: number,
    createdAt: Date,
    updatedAt: Date
}

export class Products {
    @IsNotEmpty()
    @IsNumber()
    categoryId: number;

    @IsNotEmpty()
    @IsNumber()
    brandId: number;

    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsNotEmpty()
    @IsNumber()
    mrp: number;

    @IsNotEmpty()
    @IsNumber()
    rlp: number

    @IsNotEmpty()
    @IsNumber()
    noOfCase: number

    @IsNotEmpty()
    @IsNumber()
    noOfPiece: number

    @IsObject()
    @IsOptional()
    skuDiscount?: ISkuDiscount

    @IsBoolean()
    @IsNotEmpty()
    isFocused: boolean
}

export class CreateOrder {
    @IsOptional()
    @IsNumber()
    orderId?: number

    @IsNotEmpty()
    @IsNumber()
    storeId: number;

    @IsOptional()
    @IsEnum(CallTypeOrders)
    isCallType: CallTypeOrders;

    @IsOptional()
    @IsNumber()
    visitId: number;

    @IsNotEmpty()
    @IsString()
    orderDate: string;

    @IsNotEmpty()
    @IsNumber()
    orderAmount: number;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Products)
    products: Products[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    // @Type(() => any[])
    size: any[];

    @IsNotEmpty()
    @IsNumber()
    netAmount: number;

    @IsNotEmpty()
    @IsOptional()
    totalDiscountAmount?: number;

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    orderStatus: OrderStatus;

    @IsNotEmpty()
    @IsBoolean()
    isVisibility: boolean

    @IsOptional()
    @IsNumber()
    pieceDiscount: number
}

export class GetOrderById {
    @IsNotEmpty()
    @IsString()
    orderId: string;
}

export class OrderList {
    @IsNotEmpty()
    @IsString()
    orderId: string;
}

export class CollectionListByStore {
    @IsOptional()
    @IsEnum(CollectionStatus)
    status?: CollectionStatus

    @IsNotEmpty()
    @IsString()
    storeId: string;
}

export class OrderListByStore {
    @IsNotEmpty()
    @IsString()
    storeId: string;
}

export class OrderListByVisit {
    @IsNotEmpty()
    @IsString()
    visitId: string;

    @IsNotEmpty()
    @IsString()
    storeId: string;
}

export class OrderListFilter {
    @IsOptional()
    @IsEnum(DurationEnum)
    duration?: DurationEnum

    @IsNotEmpty()
    @IsString()
    pageNumber: string

    @IsNotEmpty()
    @IsString()
    pageSize: string

    @IsOptional()
    // @IsEnum(OrderStatus)
    orderStatus?: any

    @IsOptional()
    isCallType?: any
}
export class CollectionListFilter {
    @IsOptional()
    @IsEnum(CollectionStatus)
    status?: CollectionStatus

    @IsNotEmpty()
    @IsString()
    pageNumber: string

    @IsNotEmpty()
    @IsString()
    pageSize: string
}
export class UploadFile {
    @IsNotEmpty()
    @IsString()
    fileName: string;
}

export class UpdateOrderCollection {
    @IsNotEmpty()
    @IsNumber()
    collectedAmount: number;

    @IsNotEmpty()
    @IsNumber()
    orderId: number;
}

export interface GetDiscount {
    netAmount: number;
    discountValue: number;
}
export interface StatusHistoryEntry {
    status: OrderStatus;
    timestamp: string;
}
export interface IOrders {
    pieceDiscount: number;
    orderId: number;
    empId: number;
    visitId?: number;
    isCallType?: CallTypeOrders;
    storeId: number;
    store?: IStore;
    orderDate: string;
    orderAmount: number;
    collectedAmount: number;
    paymentStatus: PaymentStatus;
    netAmount: number;
    totalDiscountAmount: number;
    skuDiscountValue: number;
    flatDiscountValue: number;
    visibilityDiscountValue: number;
    orderValueDiscountValue: number;
    specialDiscountValue: number;
    specialDiscountId: number;
    specialDiscountAmount: number;
    specialDiscountStatus?: SpecialDiscountStatus;
    specialDiscountComment?: string;
    orderStatus: OrderStatus;
    products: Products[];
    createdAt: Date;
    updatedAt: Date;
    statusHistory: StatusHistoryEntry[];
}

export class UpdateOrderTrackStatusById {
    @IsNotEmpty()
    @IsNumber()
    orderId: number;

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    orderStatus: OrderStatus;
}

export class UpdateOrderBySpecialDiscountById {
    @IsNotEmpty()
    @IsNumber()
    orderId: number;

    @IsNotEmpty()
    @IsNumber()
    specialDiscountValue: number;

    @IsNotEmpty()
    specialDiscountStatus: SpecialDiscountStatus;
}


export class AddScreenshot {
    @IsNotEmpty()
    @IsNumber()
    orderId: number;

    @IsNotEmpty()
    @IsString()
    screenshot: string;
}
