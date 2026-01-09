import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { SkuStatus } from "../../../core/DB/Entities/sku.entity";

export interface ISku {
    skuId: number;
    skuName?: string;
    productId?: number;
    packSize?: string;
    vom?: string;
    mrp?: number;
    basePrice?: number;
    taxId?: number;
    barcode?: string;
    caseSize?: string;
    shelfLifeDays?: string;
    netWeight?: string;
    grossWeight?: string;
    dimension?: string;
    status: SkuStatus;
    launchDate?: Date;
    discontinueDate?: Date;
    image?: string;
    schemeId?: number;
    discountId?: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    remarks?: string;
}

export class CreateSkuRequest {
    @IsNotEmpty()
    @IsString()
    skuName: string;

    @IsNotEmpty()
    @IsNumber()
    productId?: number;

    @IsOptional()
    @IsString()
    packSize?: string;

    @IsOptional()
    @IsString()
    vom?: string;

    @IsOptional()
    @IsNumber()
    mrp?: number;

    @IsOptional()
    @IsNumber()
    basePrice?: number;

    @IsOptional()
    @IsNumber()
    taxId?: number;

    @IsOptional()
    @IsString()
    barcode?: string;

    @IsOptional()
    @IsString()
    caseSize?: string;

    @IsOptional()
    @IsString()
    shelfLifeDays?: string;

    @IsOptional()
    @IsString()
    netWeight?: string;

    @IsOptional()
    @IsString()
    grossWeight?: string;

    @IsOptional()
    @IsString()
    dimension?: string;

    @IsOptional()
    @IsEnum(SkuStatus)
    status?: SkuStatus;

    @IsOptional()
    @IsDateString()
    launchDate?: string;

    @IsOptional()
    @IsDateString()
    discontinueDate?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsNumber()
    schemeId?: number;

    @IsOptional()
    @IsNumber()
    discountId?: number;

    @IsOptional()
    @IsString()
    remarks?: string;
}

export class UpdateSkuRequest {
    @IsNotEmpty()
    @IsNumber()
    skuId: number;

    @IsOptional()
    @IsString()
    skuName?: string;

    @IsOptional()
    @IsNumber()
    productId?: number;

    @IsOptional()
    @IsString()
    packSize?: string;

    @IsOptional()
    @IsString()
    vom?: string;

    @IsOptional()
    @IsNumber()
    mrp?: number;

    @IsOptional()
    @IsNumber()
    basePrice?: number;

    @IsOptional()
    @IsNumber()
    taxId?: number;

    @IsOptional()
    @IsString()
    barcode?: string;

    @IsOptional()
    @IsString()
    caseSize?: string;

    @IsOptional()
    @IsString()
    shelfLifeDays?: string;

    @IsOptional()
    @IsString()
    netWeight?: string;

    @IsOptional()
    @IsString()
    grossWeight?: string;

    @IsOptional()
    @IsString()
    dimension?: string;

    @IsOptional()
    @IsEnum(SkuStatus)
    status?: SkuStatus;

    @IsOptional()
    @IsDateString()
    launchDate?: string;

    @IsOptional()
    @IsDateString()
    discontinueDate?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsNumber()
    schemeId?: number;

    @IsOptional()
    @IsNumber()
    discountId?: number;

    @IsOptional()
    @IsString()
    remarks?: string;
}

export class GetSkuById {
    @IsNotEmpty()
    @IsString()
    skuId: string;
}

export class GetSkuListRequest {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    productId?: string;

    @IsOptional()
    @IsString()
    page?: string;

    @IsOptional()
    @IsString()
    limit?: string;
}

export class DeleteSkuById {
    @IsNotEmpty()
    @IsString()
    skuId: string;
}

