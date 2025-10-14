import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEmail,
  Length,
  IsEnum,
  IsDateString,
  ValidateNested,
  isDate
} from "class-validator";
import { Type } from "class-transformer";
import {IUser}from "../AuthService/AuthService"
// import {User} from "../../DB/Entities/"

/** ─────────────────────────────
 * ENUMS
 * ───────────────────────────── */
export enum DiscountType {
  PERCENTAGE = "Percentage",
  FIXED_AMOUNT = "Fixed Amount",
  TIERED = "Tiered",
  VOLUME_BASED = "Volume-Based",
}

export enum DiscountStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  EXPIRED = "Expired",
}

/** ─────────────────────────────
 * Interfaces
 * ───────────────────────────── */
export interface IDiscountItem {
  discountItemId: number;
  discountListId: string;
  productId: number;
  discountValue: number;
  discountConditionRules?: string;
  priorityLevel?: number;
  remarks?: string;
  createdDate: Date;
  lastUpdatedDate: Date;
  createdBy: string;
  lastModifiedBy: string;
}

export interface IDiscountList {
  discountListId: string;
  discountListName: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  discountType: DiscountType;
  applicableProducts?: string[];
  applicableCategories?: string[];
  customerSegment?: string;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  status: DiscountStatus;
  createdDate: Date;
  lastUpdatedDate: Date;
  createdBy: string|null ;
  lastModifiedBy: string|null;
  items?: IDiscountItem[];
}

/** ─────────────────────────────
 * DiscountItem DTO
 * ───────────────────────────── */
export class DiscountItemDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  discountValue: number;

  @IsOptional()
  @IsString()
  discountConditionRules?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priorityLevel?: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class CreateDiscountItemDto extends DiscountItemDto {
  @IsNotEmpty()
  @IsString()
  discountListId: string; // must belong to existing DiscountList
}

export class UpdateDiscountListDto {
  // Required to identify which discount list to update
  @IsString()
  discountListId: string;

  // Optional fields to update
  @IsOptional()
  @IsString()
  discountListName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => String)
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @Type(() => String)
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @IsOptional()
  applicableProducts?: string[];

  @IsOptional()
  applicableCategories?: string[];

  @IsOptional()
  @IsString()
  customerSegment?: string;

  @IsOptional()
  @IsNumber()
  minOrderValue?: number;

  @IsOptional()
  @IsNumber()
  maxDiscountAmount?: number;

  @IsOptional()
  @IsNumber()
  usageLimit?: number;

  @IsOptional()
  @IsEnum(DiscountStatus)
  status?: DiscountStatus;
}
  
export class UpdateDiscountItemDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discountItemId?: number;

  @IsOptional()
  @IsString()
  discountListId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  productId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discountValue?: number;

  @IsOptional()
  @IsString()
  discountConditionRules?: string;

  @IsOptional()
  @IsNumber()
  priorityLevel?: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class DeleteDiscountItemDto {
  @IsNotEmpty()
  @IsNumber()
  discountItemId: number;
}
/** ─────────────────────────────
 * DiscountList DTO
 * ───────────────────────────── */
export class CreateDiscountListDto {
  
  @IsOptional()
  @IsString()
  discountListId?: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  discountListName: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsOptional()
  @IsString({ each: true })
  applicableProducts?: string[];

  @IsOptional()
  @IsString({ each: true })
  applicableCategories?: string[];

  @IsOptional()
  @IsString()
  customerSegment?: string;

  @IsOptional()
  @IsNumber()
  minOrderValue?: number;

  @IsOptional()
  @IsNumber()
  maxDiscountAmount?: number;

  @IsOptional()
  @IsNumber()
  usageLimit?: number;

  @IsOptional()
  @IsEnum(DiscountStatus)
  status?: DiscountStatus;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DiscountItemDto)
  items?: DiscountItemDto[];
}

/** ─────────────────────────────
 * Get/List/Delete DTOs
 * ───────────────────────────── */
export class GetDiscountListByIdDto {
  @IsNotEmpty()
  @IsString()
  discountListId: string;
}

export class ListDiscountListsDto {
  @IsOptional()
  @IsString()
  discountListId?: string;

  @IsOptional()
  @IsString()
  discountListName?: string;

  @IsOptional()
  @IsEnum(DiscountStatus)
  status?: DiscountStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsString()
  lastModifiedBy?: string;
    @IsNotEmpty()
  @IsEnum(DiscountType)
  discountType: DiscountType;
}

export class DeleteDiscountListDto {
  @IsNotEmpty()
  @IsString()
  discountListId: string;
}

export class GetDiscountListByStatusDto{
    @IsNotEmpty()
  @IsEnum(DiscountStatus)
  status: DiscountStatus;
}
export class GetDiscountItemByIdDto {
  @IsNotEmpty()
  @IsNumber()
  discountItemId: number;
}

export class ListDiscountItemsDto {
  @IsOptional()
  @IsNumber()
  discountItemId?: number;

  @IsOptional()
  @IsString()
  discountListId?: string;

  @IsOptional()
  @IsNumber()
  productId?: number;

}



