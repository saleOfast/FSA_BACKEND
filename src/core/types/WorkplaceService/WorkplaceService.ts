import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { WorkplaceTypeEnum } from "../Constent/common";

export interface IWorkplace {
    workplaceId: number;
    workplaceType?: WorkplaceTypeEnum;
    addedBy: number;
    productId: number;
    storeId: number;
    orgName: string;
    townCity: string;
    territory: string;
    patientVolume: number;
    availability: number;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class WorkplaceC {

    @IsNotEmpty()
    @IsEnum(WorkplaceTypeEnum)
    workplaceType: WorkplaceTypeEnum;

    @IsNotEmpty()
    @IsNumber()
    addedBy: number;

    @IsNotEmpty()
    @IsNumber()
    storeId: number;

    @IsOptional()
    @IsString()
    orgName: string;

    @IsOptional()
    @IsString()
    townCity: string;

    @IsOptional()
    @IsString()
    territory: string;

    @IsOptional()
    @IsString()
    patientVolume: number;

    @IsOptional()
    @IsString()
    availability: number;

    @IsOptional()
    @IsBoolean()
    status: boolean = true;
}

export class WorkplaceR {
    @IsNotEmpty()
    @IsNumber()
    workplaceId: number;

    @IsNotEmpty()
    @IsNumber()
    storeId: number;
}

export class WorkplaceU {
    @IsNotEmpty()
    @IsNumber()
    workplaceId: number;

    @IsOptional()
    @IsNumber()
    addedBy: number;

    @IsOptional()
    @IsNumber()
    storeId: number;

    @IsOptional()
    @IsString()
    orgName: string;

    @IsOptional()
    @IsString()
    townCity: string;

    @IsOptional()
    @IsString()
    territory: string;

    @IsOptional()
    @IsString()
    patientVolume: number;

    @IsOptional()
    @IsString()
    availability: number;

    @IsOptional()
    @IsBoolean()
    status: boolean = true;
}

export class WorkplaceD {
    @IsNotEmpty()
    @IsNumber()
    workplaceId: number;
}
