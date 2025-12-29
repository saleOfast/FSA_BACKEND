import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsDateString
} from "class-validator";
import { Type } from "class-transformer";

import {
  PosmCategoryEnum,
  PosmTypeEnum,
  POSMAllocationTargetEnum,
  POSMChannelTargetEnum,
  POSMMaterialTypeEnum
        } from "../../../core/types/Constent/common"


export interface IPosm {
  posmId: number;
  posmName: string;
  posmType: PosmTypeEnum;
  posmCategory: PosmCategoryEnum;
  materialType: POSMMaterialTypeEnum;
  dimensionsSpecs?: string;
  campaignId: string;
  channelTarget: POSMChannelTargetEnum;
  regionTarget: string;
  allocationTarget: POSMAllocationTargetEnum;
  quantityAllocated: number;
  allocationDate: string;
  sku: string;
  customerId: number;
  unitCost?: number;
  claimedTarget?: number;
}


export class CreatePosmDto {

  @IsNotEmpty()
  @IsString()
  posmName: string;

  @IsNotEmpty()
  @IsEnum(PosmTypeEnum)
  posmType: PosmTypeEnum;

  @IsNotEmpty()
  @IsEnum(PosmCategoryEnum)
  posmCategory: PosmCategoryEnum;

  @IsNotEmpty()
  @IsEnum(POSMMaterialTypeEnum)
  materialType: POSMMaterialTypeEnum;

  @IsOptional()
  @IsString()
  dimensionsSpecs?: string;

  @IsNotEmpty()
  @IsString()
  campaignId: string;

  @IsNotEmpty()
  @IsEnum(POSMChannelTargetEnum)
  channelTarget: POSMChannelTargetEnum;

  @IsNotEmpty()
  @IsString()
  regionTarget: string;

  @IsNotEmpty()
  @IsEnum(POSMAllocationTargetEnum)
  allocationTarget: POSMAllocationTargetEnum;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  quantityAllocated: number;

  @IsNotEmpty()
  @IsDateString()
  allocationDate: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  customerId: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  unitCost?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  claimedTarget?: number;
}

export class UpdatePosmDto {

  @IsOptional()
  @IsString()
  posmName?: string;

  @IsOptional()
  @IsEnum(PosmTypeEnum)
  posmType?: PosmTypeEnum;

  @IsOptional()
  @IsEnum(PosmCategoryEnum)
  posmCategory?: PosmCategoryEnum;

  @IsOptional()
  @IsEnum(POSMMaterialTypeEnum)
  materialType?: POSMMaterialTypeEnum;

  @IsOptional()
  @IsString()
  dimensionsSpecs?: string;

  @IsOptional()
  @IsString()
  campaignId?: string;

  @IsOptional()
  @IsEnum(POSMChannelTargetEnum)
  channelTarget?: POSMChannelTargetEnum;

  @IsOptional()
  @IsString()
  regionTarget?: string;

  @IsOptional()
  @IsEnum(POSMAllocationTargetEnum)
  allocationTarget?: POSMAllocationTargetEnum;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantityAllocated?: number;

  @IsOptional()
  @IsDateString()
  allocationDate?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  unitCost?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  claimedTarget?: number;
}

export class DeletePosmDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  posmId: number;
}

export class GetPosmByIdDto {

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  posmId: number;
}
export class GetPosmListDto {

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  posmId?: number;

  @IsOptional()
  @IsString()
  posmName?: string;

  @IsOptional()
  @IsEnum(PosmTypeEnum)
  posmType?: PosmTypeEnum;

  @IsOptional()
  @IsEnum(PosmCategoryEnum)
  posmCategory?: PosmCategoryEnum;

  @IsOptional()
  @IsEnum(POSMMaterialTypeEnum)
  materialType?: POSMMaterialTypeEnum;

  @IsOptional()
  @IsString()
  campaignId?: string;

  @IsOptional()
  @IsEnum(POSMChannelTargetEnum)
  channelTarget?: POSMChannelTargetEnum;

  @IsOptional()
  @IsString()
  regionTarget?: string;

  @IsOptional()
  @IsEnum(POSMAllocationTargetEnum)
  allocationTarget?: POSMAllocationTargetEnum;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantityAllocated?: number;

  @IsOptional()
  @IsDateString()
  allocationDate?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  customerId?: number;
}
