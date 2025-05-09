import { IsArray, IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { DiscountType, DurationEnum, PracticeTypeEnum, StoreBilling, StoreTypeFilter } from "../Constent/common";
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
    lat?: string,
    long?: string,
    addressLine1: string;
    addressLine2?: string | null;
    townCity: string;
    state: string;
    district: string | null;
    email?: string;
    pinCode: string;
    ownerName: string;
    mobileNumber: string;
    alterMobile: string;
    openingTime: string;
    closingTime: string;
    openingTimeAmPm: string;
    closingTimeAmPm: string;
    paymentMode: string;
    isPremiumStore: boolean;
    flatDiscount?: IStoreFlatDiscount;
    visibilityDiscount?: IStoreVisibilityDiscount;
    orderValueDiscount?: IOrderValueDiscount[];
    isActiveOrderValueDiscount?: boolean;
    isActive: boolean;
    isDeleted: boolean;
    // beat: string;
    createdAt: Date;
    updatedAt: Date;
    assignTo?: number;
    assignToRetailor?: number;
    retailorId?: number;
    qualification?: string;
    doctorCode?: string;
    speciality?: string;
    language_known?: string;
    DOB?: string;
    dateOfWedding?: string;
    clinicName?: string;
    RegistrationNumber?: string;
    availability?: number;
    patientVolume?: number;
    territory?: string;
    orgName?: string;
    practiceType?: PracticeTypeEnum;

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
    orderAmount: number,

}

// export interface IOrderCollectionResponse {
//     storeId: number,
//     orderCount: number,
//     totalAmount: string,
//     totalCollectedAmount: string
// }
export interface IOrderStoreCollection {
    store: { storeId: number }

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
    @IsOptional()
    @IsString()
    amountRange: string

    @IsOptional()
    @IsEnum(DiscountType)
    discountType: DiscountType

    @IsOptional()
    @IsNumber()
    value: number
}

export class CreateStore {
    @IsOptional()
    @IsNumber()
    assignTo: number;

    @IsOptional()
    @IsNumber()
    assignToRetailor: number;

    @IsNotEmpty()
    @IsString()
    storeName: string;

    @IsNotEmpty()
    @IsString()
    uid: string;

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

    @IsOptional()
    @IsString()
    townCity: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    district: string;

    @IsOptional()
    @IsString()
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

    @IsOptional()
    @IsString()
    alterMobile: string;

    @IsNotEmpty()
    @IsString()
    openingTime: string;

    @IsNotEmpty()
    @IsString()
    closingTime: string;

    @IsNotEmpty()
    @IsString()
    openingTimeAmPm: string;

    @IsNotEmpty()
    @IsString()
    closingTimeAmPm: string;

    @IsOptional()
    @IsString()
    paymentMode: string;

    @IsNotEmpty()
    @IsBoolean()
    isPremiumStore: boolean;

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;

    @IsOptional()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => StoreFlatDiscount)
    flatDiscount: StoreFlatDiscount

    @IsOptional()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => StoreVisibilityDiscount)
    visibilityDiscount: StoreVisibilityDiscount

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderValueDiscount)
    orderValueDiscount: OrderValueDiscount[]

    @IsOptional()
    @IsBoolean()
    isActiveOrderValueDiscount: boolean;

    @IsOptional()
    @IsString()
    qualification: string;

    @IsOptional()
    @IsString()
    doctorCode: string;

    @IsOptional()
    @IsString()
    speciality: string;

    @IsOptional()
    @IsString()
    language_known: string;

    @IsOptional()
    DOB: string;

    @IsOptional()
    dateOfWedding: string;

    @IsOptional()
    @IsString()
    clinicName: string;

    @IsOptional()
    @IsString()
    RegistrationNumber: string;

    @IsOptional()
    @IsNumber()
    availability: number;

    @IsOptional()
    @IsNumber()
    patientVolume: number;

    @IsOptional()
    practiceType: PracticeTypeEnum;

    @IsOptional()
    territory: string;

    @IsOptional()
    orgName: string;
}

export class UpdateStore {
    @IsOptional()
    @IsNumber()
    assignTo: number;

    @IsOptional()
    @IsNumber()
    assignToRetailor: number;

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

    @IsOptional()
    @IsString()
    addressLine2: string;

    @IsOptional()
    @IsString()
    townCity: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    district: string;

    @IsOptional()
    @IsString()
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

    @IsOptional()
    @IsString()
    alterMobile: string;

    @IsNotEmpty()
    @IsString()
    openingTime: string;

    @IsNotEmpty()
    @IsString()
    closingTime: string;

    @IsNotEmpty()
    @IsString()
    openingTimeAmPm: string;

    @IsNotEmpty()
    @IsString()
    closingTimeAmPm: string;

    @IsOptional()
    @IsString()
    paymentMode: string;

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

    @IsOptional()
    @IsString()
    qualification: string;

    @IsOptional()
    @IsString()
    doctorCode: string;

    @IsOptional()
    @IsString()
    speciality: string;

    @IsOptional()
    @IsString()
    language_known: string;

    @IsOptional()
    DOB: string;

    @IsOptional()
    dateOfWedding: string;

    @IsOptional()
    @IsString()
    clinicName: string;

    @IsOptional()
    @IsString()
    RegistrationNumber: string;

    @IsOptional()
    @IsNumber()
    availability: number;

    @IsOptional()
    @IsNumber()
    patientVolume: number;

    @IsOptional()
    practiceType: PracticeTypeEnum;

    @IsOptional()
    territory: string;

    @IsOptional()
    orgName: string;
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

export class DeleteStoreById {
    @IsNotEmpty()
    @IsString()
    storeId: string

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
    @IsString()
    storeSearch?: string

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

export class GetStoreByType {
    @IsNotEmpty()
    @IsString()
    storeType: string
}