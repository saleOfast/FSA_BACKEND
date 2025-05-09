import { IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { DiscountType, DurationEnum, StoreBilling, StoreTypeFilter } from "../Constent/common";
import { Type } from "class-transformer";

export interface IStoreFlatDiscount {
    discountType: DiscountType,
    value: number,
    isActive: boolean
}

export interface IStoreVisibilityDiscount {
    discountType: DiscountType,
    value: number,
    isActive: boolean
}

export interface IOrderValueDiscount {
    amountRange: string,
    discountType: DiscountType,
    value: number
}

export interface IStore {
    storeId: number;
    storeName: string;
    empId: number,
    storeType: number;
    // lat?: string,
    // long?: string,
    addressLine1: string;
    addressLine2?: string;
    townCity: string;
    state: string;
    email: string;
    pinCode: string;
    ownerName: string;
    mobileNumber: string;
    openingTime: string;
    closingTime: string;
    isPremiumStore: boolean;
    flatDiscount?: IStoreFlatDiscount;
    visibilityDiscount?: IStoreVisibilityDiscount;
    orderValueDiscount?: IOrderValueDiscount[];
    isActiveOrderValueDiscount?: boolean;
    isActive: boolean;
    // beat: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IStoreCategory {
    storeCategoryId: number;
    categoryName: string;
    empId: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderCollectionResponse {
    totalAmount: number,
    totalCollectedAmount: number,
    netAmount: number,
    orderId: number,
    store: {
        storeId: number,
        storeName: string,
        storeCat: {
            categoryName: string
        }
    }
    collectedAmount: number,
    orderAmount: number
}

// export interface IOrderCollectionResponse {
//     storeId: number,
//     orderCount: number,
//     totalAmount: string,
//     totalCollectedAmount: string
// }
export interface IOrderStoreCollection {
   store:{ storeId: number}
    
}
export interface ICollectionResponse {
    storeId: number,
    storeName: string,
    storeType: string,
    pendingAmount: number,
    status: string,
    totalOrderAmount: number,
    totalCollectedAmount: number,
    netAmount: number,
    orderId: number
}

export class StoreFlatDiscount {
    @IsNotEmpty()
    @IsEnum(DiscountType)
    discountType: DiscountType

    @IsNotEmpty()
    @IsNumber()
    value: number

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean
}

export class StoreVisibilityDiscount {
    @IsNotEmpty()
    @IsEnum(DiscountType)
    discountType: DiscountType

    @IsNotEmpty()
    @IsNumber()
    value: number

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean
}

export class OrderValueDiscount {
    @IsNotEmpty()
    @IsString()
    amountRange: string

    @IsNotEmpty()
    @IsEnum(DiscountType)
    discountType: DiscountType

    @IsNotEmpty()
    @IsNumber()
    value: number
}

export class CreateStore {
    @IsNotEmpty()
    @IsString()
    storeName: string;

    @IsNotEmpty()
    @IsNumber()
    storeType: number;

    @IsNotEmpty()
    @IsString()
    lat: string;

    @IsNotEmpty()
    @IsString()
    long: string;

    @IsNotEmpty()
    @IsString()
    addressLine1: string;

    @IsOptional()
    @IsString()
    addressLine2: string;

    @IsNotEmpty()
    @IsString()
    townCity: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    pinCode: string;

    @IsNotEmpty()
    @IsString()
    ownerName: string;

    @IsNotEmpty()
    @IsString()
    mobileNumber: string;

    @IsNotEmpty()
    @IsString()
    openingTime: string;

    @IsNotEmpty()
    @IsString()
    closingTime: string;

    @IsNotEmpty()
    @IsBoolean()
    isPremiumStore: boolean;

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;

    // @IsNotEmpty()
    // @IsString()
    // beat: string;
}

export class UpdateStore {
    @IsNotEmpty()
    @IsNumber()
    storeId: number

    @IsNotEmpty()
    @IsString()
    storeName: string;

    @IsNotEmpty()
    @IsNumber()
    storeType: number;

    @IsNotEmpty()
    @IsString()
    lat: string;

    @IsNotEmpty()
    @IsString()
    long: string;

    @IsNotEmpty()
    @IsString()
    addressLine1: string;

    @IsNotEmpty()
    @IsString()
    addressLine2: string;

    @IsNotEmpty()
    @IsString()
    townCity: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    pinCode: string;

    @IsNotEmpty()
    @IsString()
    ownerName: string;

    @IsNotEmpty()
    @IsString()
    mobileNumber: string;

    @IsNotEmpty()
    @IsString()
    openingTime: string;

    @IsNotEmpty()
    @IsString()
    closingTime: string;

    @IsNotEmpty()
    @IsBoolean()
    isPremiumStore: boolean;

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;

    // @IsNotEmpty()
    // @IsString()
    // beat: string;

    @IsOptional()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => StoreFlatDiscount)
    flatDiscount?: IStoreFlatDiscount;

    @IsOptional()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => StoreVisibilityDiscount)
    visibilityDiscount?: IStoreVisibilityDiscount;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderValueDiscount)
    orderValueDiscount?: OrderValueDiscount[];

    @IsOptional()
    @IsBoolean()
    isActiveOrderValueDiscount?: boolean;
}

export class CreateCategory {
    @IsNotEmpty()
    @IsString()
    categoryName: string
}

export class GetCategoryById {
    @IsNotEmpty()
    @IsString()
    categoryId: string
}

export class DeleteCategoryById {
    @IsNotEmpty()
    @IsString()
    categoryId: string
}

export class UpdateCategory {
    @IsNotEmpty()
    @IsString()
    categoryName: string

    @IsNotEmpty()
    @IsNumber()
    categoryId: number
}
export class StoreListFilter {
    @IsOptional()
    @IsEnum(StoreTypeFilter)
    storeType?: StoreTypeFilter;

    @IsOptional()
    @IsEnum(StoreBilling)
    isUnbilled: StoreBilling

    @IsOptional()
    @IsString()
    storeCat?: string

    @IsOptional()
    @IsEnum(DurationEnum)
    duration?: DurationEnum

    @IsOptional()
    @IsString()
    beatId?: string

    @IsNotEmpty()
    @IsString()
    pageNumber: string

    @IsNotEmpty()
    @IsString()
    pageSize: string
}

export class GetStoreById {
    @IsNotEmpty()
    @IsString()
    storeId: string
}