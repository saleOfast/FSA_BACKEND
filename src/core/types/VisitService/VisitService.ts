import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CallType, DurationEnum, VisitStatus } from "../Constent/common";
import { IStore } from "../StoreService/StoreService";
import { User } from "../../../core/DB/Entities/User.entity";
import { Stores } from "../../../core/DB/Entities/stores.entity";

export interface IActivity {
    action: string;
    time: Date;
    lat: string;
    long: string;
}
export interface IVisit {
    visitId: number;
    storeId?: number;
    store: number[];
    stores?: Stores
    user?: User;
    beat: number;
    empId: number;
    visitDate: Date;
    checkIn?: string
    checkInLat?: string
    checkInLong?: string
    checkOut?: string
    checkOutLat?: string
    checkOutLong?: string
    duration?: string
    isCallType?: CallType,
    noOrderReason?: string,
    status: VisitStatus;
    image?: string
    createdAt: Date
    updatedAt: Date;
    activity : IActivity[];
}

export interface BeatDetails {
    beatId: number,
    beatName: string
}

export interface IStoreObj {
    storeName: string,
    storeType: string,
    storeId: number,
    status: VisitStatus
}

export interface IVisitList {
    visitId: number,
    empId: number,
    visitDate: Date,
    visitStatus: VisitStatus,
    beatDetails: BeatDetails,
    storeDetails: IStore,
    image?: string,
    checkIn?: string,
    callType?: CallType
    checkOut?:  string,
    status: string,
    noOrderReason: any

}

export class CreateVisit {
    @IsNotEmpty()
    @IsArray()
    store: number[];

    // @IsNotEmpty()
    // @IsNumber()
    // storeId: number;

    @IsNotEmpty()
    @IsString()
    visitDate: Date;

    @IsNotEmpty()
    @IsNumber()
    beat: number

    @IsNotEmpty()
    @IsNumber()
    emp_id: number
}

export class GetVisitById {
    @IsNotEmpty()
    @IsString()
    visitId: string;
}

export class UpdateImage {
    @IsNotEmpty()
    @IsNumber()
    visitId: number;

    @IsNotEmpty()
    @IsString()
    image: string;
}

export class VisitListFilter {
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

    @IsOptional()
    @IsEnum(VisitStatus )
    status: VisitStatus
}


export class PastNoOrderList {
    @IsNotEmpty()
    @IsString()
    empId?: string

    @IsNotEmpty()
    @IsString()
    storeId: string

}

export class PictureList {
    @IsNotEmpty()
    @IsString()
    storeId: string

}

export class CheckInRequest {
    @IsNotEmpty()
    @IsNumber()
    visitId: number;

    @IsNotEmpty()
    @IsString()
    checkIn: string;

    @IsNotEmpty()
    @IsString()
    checkInLat: string;

    @IsNotEmpty()
    @IsString()
    checkInLong: string;

    @IsNotEmpty()
    @IsString()
    action: string;
}

export class CheckOutRequest {
    @IsNotEmpty()
    @IsNumber()
    visitId: number;

    @IsNotEmpty()
    @IsString()
    checkOut: string;

    @IsNotEmpty()
    @IsString()
    checkOutLat: string;

    @IsNotEmpty()
    @IsString()
    checkOutLong: string;

    @IsOptional()
    @IsString()
    image: string
}

export class dayTrackingFilter {
    @IsOptional()
    @IsString()
    timePeriod: string
}

export class UpdateVisitByNoOrder {
    @IsNotEmpty()
    @IsNumber()
    visitId: number;

    @IsNotEmpty()
    @IsString()
    noOrderReason: string;
}


export class UpdateActivityById {
    @IsNotEmpty()
    @IsNumber()
    visitId: number;

    @IsNotEmpty()
    @IsString()
    action: string;

    @IsNotEmpty()
    @IsString()
    lat: string;

    @IsNotEmpty()
    @IsString()
    long: string;

    @IsNotEmpty()
    @IsString()
    time: string;
}