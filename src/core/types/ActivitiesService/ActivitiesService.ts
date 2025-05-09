import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ActivityTypeEnum } from "../../../core/types/Constent/common";
import { JointWork } from "core/DB/Entities/activities.jointWork.entity";

export interface IActivities {
    activityId: number;
    activityType?: ActivityTypeEnum;
    date: string;
    addedBy: number;
    productId: number;
    storeId: number;
    remarks: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class ActivitiesC {
    @IsNotEmpty()
    @IsEnum(ActivityTypeEnum)
    activityType: ActivityTypeEnum;

    @IsNotEmpty()
    date: string;

    @IsNotEmpty()
    duration: string;

    @IsNotEmpty()
    @IsNumber()
    addedBy: number;

    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    @IsString()
    remarks: string;

    @IsOptional()
    @IsBoolean()
    status: boolean = true;

    @IsOptional()
    @IsNumber()
    storeId: number;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    jointWorks: number[];
}

export class ActivitiesR {
    @IsNotEmpty()
    @IsNumber()
    activityId: number;

    @IsNotEmpty()
    @IsNumber()
    storeId: number;
}

export class ActivitiesU {
    @IsNotEmpty()
    @IsNumber()
    activityId: number;

    @IsOptional()
    @IsEnum(ActivityTypeEnum)
    activityType?: ActivityTypeEnum;

    @IsOptional()
    date?: string;

    @IsOptional()
    duration?: string;

    @IsOptional()
    @IsNumber()
    addedBy?: number;

    @IsOptional()
    @IsNumber()
    productId?: number;

    @IsOptional()
    @IsString()
    remarks?: string;

    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @IsOptional()
    @IsNumber()
    storeId: number;
}

export class ActivitiesD {
    @IsNotEmpty()
    @IsNumber()
    activityId: number;
}
