import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsDateString,
  IsUUID

} from "class-validator";
import { Type } from "class-transformer";
import {PriceBookType , PriceBookStatus, ApprovalStatus, Channel, CurrencyType, PriorityType} from "../../../core/types/Constent/common"

export interface IPriceBook {
  // Identifiers
  priceBookId: number;                 // Unique identifier
  tenantId?: string;                   // UUID (optional for single-tenant cases)

  // Basic details
  priceBookCode: string;               // e.g. GT_NORTH_2025
  priceBookName: string;
  priceBookType: PriceBookType;

  // Channel & customer
  Channel: Channel;
  customerTypeId?: number;             // Distributor / Retailer / 

  customerName?: string;
    customerId?: number;
  // Geography
  countryId?: number;
  stateId?: number;
  districtId?: number;
  beatRouteId?: number;

  // Currency & priority
  currency: CurrencyType;
  priority: PriorityType;                    // Higher value = higher priority

  // Validity
  effectiveFrom: Date;
  effectiveTo?: Date;

  // Versioning & lifecycle
  version: number;
  status: PriceBookStatus;
  approvalStatus: ApprovalStatus;

  // Audit
  createdBy: number;                   // user_id
  createdAt: Date;



  channel?: string;
}

export class CreatePriceBookDto {
  // ================== Identifiers ==================
  @IsOptional()
  @IsUUID()
  tenantId?: string;

    @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerId?: number;

  // ================== Basic Details ==================
  @IsString()
  @IsNotEmpty()
  priceBookCode: string;

  @IsString()
  @IsNotEmpty()
  priceBookName: string;

  @IsEnum(PriceBookType)
  priceBookType: PriceBookType;

  // ================== Channel & Customer ==================
  @IsEnum(Channel)
  Channel: Channel;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerTypeId?: number;

  @IsOptional()
  @IsString()
  customerName: string; 

  // ================== Geography ==================
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  countryId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  stateId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  districtId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  beatRouteId?: number;

  // ================== Currency & Priority ==================
  @IsEnum(CurrencyType)
  currency: CurrencyType;

  @IsEnum(PriorityType)
  priority: PriorityType;

  // ================== Validity ==================
  @IsDateString()
  effectiveFrom: Date;

  @IsOptional()
  @IsDateString()
  effectiveTo?: Date;

  // ================== Lifecycle (system controlled) ==================
  @IsOptional()
  @IsEnum(PriceBookStatus)
  status?: PriceBookStatus;

  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;


  @IsOptional()
  @IsNumber()
  version?: number;
}

export class UpdatePriceBookDto {

      @IsNumber()
  @Type(() => Number)
  priceBookId: number; 
  // ================== Identifiers ==================
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  // ================== Basic Details ==================
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  priceBookCode?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  priceBookName?: string;

  @IsOptional()
  @IsEnum(PriceBookType)
  priceBookType?: PriceBookType;

  // ================== Channel & Customer ==================
  @IsOptional()
  @IsEnum(Channel)
  Channel?: Channel;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerTypeId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerId?: number;

  // ================== Geography ==================
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  countryId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  stateId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  districtId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  beatRouteId?: number;

  // ================== Currency & Priority ==================
  @IsOptional()
  @IsEnum(CurrencyType)
  currency?: CurrencyType;

  @IsOptional()
  @IsEnum(PriorityType)
  priority?: PriorityType;

  // ================== Validity ==================
  @IsOptional()
  @IsDateString()
  effectiveFrom?: Date;

  @IsOptional()
  @IsDateString()
  effectiveTo?: Date;

  // ================== Lifecycle ==================
  @IsOptional()
  @IsEnum(PriceBookStatus)
  status?: PriceBookStatus;

  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;

  //   @IsOptional()
  // @IsNumber()
  // approvedBy?: number;

  // @IsOptional()
  // @IsDateString()
  // approvedAt?: Date;

  @IsOptional()
  @IsNumber()
  version?: number;
}

export class GetPriceBookDto {
  // ================== Identifiers ==================
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceBookId?: number;

  @IsOptional()
  @IsUUID()
  tenantId?: string;

  // ================== Basic Details ==================
  @IsOptional()
  @IsString()
  priceBookCode?: string;

  @IsOptional()
  @IsString()
  priceBookName?: string;

  @IsOptional()
  @IsEnum(PriceBookType)
  priceBookType?: PriceBookType;

  // ================== Channel & Customer ==================
  @IsOptional()
  @IsEnum(Channel)
  Channel?: Channel;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerTypeId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerId?: number;

  // ================== Geography ==================
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  countryId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  stateId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  districtId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  beatRouteId?: number;

  // ================== Currency & Priority ==================
  @IsOptional()
  @IsEnum(CurrencyType)
  currency?: CurrencyType;

  @IsOptional()
  @IsEnum(PriorityType)
  priority?: PriorityType;

  // ================== Validity Filters ==================
  @IsOptional()
  @IsDateString()
  effectiveFrom?: Date;

  @IsOptional()
  @IsDateString()
  effectiveTo?: Date;

  // ================== Lifecycle ==================
  @IsOptional()
  @IsEnum(PriceBookStatus)
  status?: PriceBookStatus;

  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;

  // ================== Pagination ==================
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;
}

export class GetPriceBookByIdDto {
  @IsNumber()
  @Type(() => Number)
  priceBookId: number;
}

export class DeletePriceBookDto {
  @IsNumber()
  @Type(() => Number)
  priceBookId: number;
}

