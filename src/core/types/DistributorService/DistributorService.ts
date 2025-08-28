import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface IDistributorDto {
    distributorName: string;
    type: string;
    address: string;
    isActive: boolean;
}

export interface IDistributorResponse extends IDistributorDto {
    distributorId: number;
    createdAt: Date;
    updatedAt: Date;
}

export class CreateDistributorDto {
    @IsNotEmpty()
    @IsString()
    distributorName: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;
}

export class UpdateDistributorDto {
    @IsNotEmpty()
    @IsNumber()
    distributorId: number;

    @IsOptional()
    @IsString()
    distributorName?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class GetDistributorByIdDto {
    @IsNotEmpty()
    @IsString()
    distributorId: string;
}

export class ListDistributorsFilterDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    pageNumber?: string;

    @IsOptional()
    @IsString()
    pageSize?: string;
}