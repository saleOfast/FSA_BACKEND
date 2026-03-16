import { IsBoolean, IsNotEmpty, IsNumber, IsString,IsOptional,IsEnum,IsDateString , ValidateIf } from "class-validator"
import { Type } from "class-transformer";

import { SchemeType, SchemeNature, SchemeStatus, BenefitType, ClaimPeriod } from "../Constent/common";
import { Customer } from "../../DB/Entities/customer.entity";
import { Products } from "../../DB/Entities/products.entity";
import { Sku } from "../../DB/Entities/sku.entity";
import { Warehouse } from "../../DB/Entities/warehouse.entity";
import { CustomerType } from "core/DB/Entities/customerType.entity";
import { Posm } from "../../DB/Entities/posm.entity";

export interface IScheme {
    id: number;
   schemeName: string;
    schemeType: SchemeType;
    schemeNature: SchemeNature;
    startDate: Date;
    endDate: Date;
    status: SchemeStatus;
    priority?: number;
    autoApply: boolean;

    customer?: Customer;
    customerType?: CustomerType;
    // products?: Products[];
    sku?: Sku;
    warehouse?: Warehouse;
    posm?: Posm;
    beatId?: number;

    minQty?: number;
    minValue?: number;
    slabFrom?: number;
    slabTo?: number;

    benefitType: BenefitType;
    benefitQty?: number;
    BenefitLimit?: number;
    isClaimable: boolean;
    claimPeriod?: ClaimPeriod;

    createdBy: number;
    isEnable: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class CreateSchemeDto {
  /* ================= BASIC ================= */

  @IsNotEmpty()
  @IsString()
  schemeName: string;

  @IsNotEmpty()
  @IsEnum(SchemeType)
  schemeType: SchemeType;

  @IsNotEmpty()
  @IsEnum(SchemeNature)
  schemeNature: SchemeNature;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsEnum(SchemeStatus)
  status?: SchemeStatus;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsBoolean()
  autoApply?: boolean;

  /* ================= LOOKUPS (IDs) ================= */

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  customerTypeId?: number;

  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsNumber()
  skuId?: number;

  @IsOptional()
  @IsNumber()
  warehouseId?: number;

  @IsOptional()
  @IsNumber()
  posmId?: number;

  @IsOptional()
  @IsNumber()
  beatId?: number;

  /* ================= CONDITIONS ================= */

  @IsOptional()
  @IsNumber()
  minQty?: number;

  @IsOptional()
  @IsNumber()
  minValue?: number;

  @IsOptional()
  @IsNumber()
  slabFrom?: number;

  @IsOptional()
  @IsNumber()
  slabTo?: number;

  /* ================= BENEFIT ================= */

  @IsNotEmpty()
  @IsEnum(BenefitType)
  benefitType: BenefitType;

  @IsOptional()
  @IsNumber()
  benefitQty?: number;

  @IsOptional()
  @IsNumber()
  BenefitLimit?: number;

  @IsOptional()
  @IsBoolean()
  isClaimable?: boolean;

  @IsOptional()
  @IsEnum(ClaimPeriod)
  claimPeriod?: ClaimPeriod;


//   @IsNotEmpty()
//   @IsNumber()
//   createdBy: number;
}
export class GetScheme {
    @IsNotEmpty()
    @IsString()
    id: string;
}


export class UpdateSchemeDto {


//   @IsNotEmpty()
//   @IsNumber()
//   id: number;

  @IsOptional()
  @IsString()
  schemeName?: string;

  @IsOptional()
  @IsEnum(SchemeType)
  schemeType?: SchemeType;

  @IsOptional()
  @IsEnum(SchemeNature)
  schemeNature?: SchemeNature;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsEnum(SchemeStatus)
  status?: SchemeStatus;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsBoolean()
  autoApply?: boolean;


  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  customerTypeId?: number;

  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsNumber()
  skuId?: number;

  @IsOptional()
  @IsNumber()
  warehouseId?: number;

  @IsOptional()
  @IsNumber()
  posmId?: number;

  @IsOptional()
  @IsNumber()
  beatId?: number;


  @IsOptional()
  @IsNumber()
  minQty?: number;

  @IsOptional()
  @IsNumber()
  minValue?: number;

  @IsOptional()
  @IsNumber()
  slabFrom?: number;

  @IsOptional()
  @IsNumber()
  slabTo?: number;

  @IsOptional()
  @IsEnum(BenefitType)
  benefitType?: BenefitType;

  @IsOptional()
  @IsNumber()
  benefitQty?: number;

  @IsOptional()
  @IsNumber()
  BenefitLimit?: number;

  @IsOptional()
  @IsBoolean()
  isClaimable?: boolean;

  @IsOptional()
  @IsEnum(ClaimPeriod)
  claimPeriod?: ClaimPeriod;

  @IsOptional()
  @IsBoolean()
  isEnable?: boolean;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}



export class DeleteSchemeDto {
    @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf((o) => !o.schemeName) // id is required if schemeName is not provided
  id?: number;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.id) // schemeName is required if id is not provided
  schemeName?: string;
}


export class GetAllSchemeDto {
  @IsOptional()
  @IsEnum(SchemeType)
  schemeType?: SchemeType;

  @IsOptional()
  @IsEnum(SchemeNature)
  schemeNature?: SchemeNature;

  @IsOptional()
  @IsEnum(SchemeStatus)
  status?: SchemeStatus;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsNumber()
  skuId?: number;

  @IsOptional()
  @IsNumber()
  warehouseId?: number;

  @IsOptional()
  @IsNumber()
  posmId?: number;

  @IsOptional()
  @IsNumber()
  beatId?: number;

  @IsOptional()
  @IsBoolean()
  isEnable?: boolean;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsDateString()
  startDateFrom?: Date;

  @IsOptional()
  @IsDateString()
  startDateTo?: Date;

  @IsOptional()
  @IsDateString()
  endDateFrom?: Date;

  @IsOptional()
  @IsDateString()
  endDateTo?: Date;
}

export class GetSchemeDto {
  @IsOptional()
  @IsNumber()
@Type(() => Number)
  @ValidateIf((o) => !o.schemeName) // id is required if schemeName is not provided
  id?: number;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.id) // schemeName is required if id is not provided
  schemeName?: string;
}