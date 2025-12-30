import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsDateString
} from "class-validator";
import { DiscountType, DiscountCategory, DiscountStatus, ApprovalStatus, PktType, DiscountValueType } from "../../DB/Entities/discount.entity";

export interface IDiscount {
  discountId: number;
  discountName: string;
  discountType: DiscountType;
  discountCategory: DiscountCategory;
  customerTypeId?: number;
  customerId?: number;
  skuId?: number;
  countryId?: number;
  stateId?: number;
  districtId?: number;
  beatId?: number;
  validFrom?: Date;
  validTill?: Date;
  status: DiscountStatus;
  approvalStatus: ApprovalStatus;
  pktType?: PktType;
  minQty?: number;
  maxQty?: number;
  minimumOrderValue?: number;
  discountValueType: DiscountValueType;
  discountValue?: number;
  discountPercentage?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateDiscount {
  @IsNotEmpty()
  @IsString()
  discountName!: string;

  @IsNotEmpty()
  @IsEnum(DiscountType)
  discountType!: DiscountType;

  @IsNotEmpty()
  @IsEnum(DiscountCategory)
  discountCategory!: DiscountCategory;

  @IsOptional()
  @IsNumber()
  customerTypeId?: number;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  skuId?: number;

  @IsOptional()
  @IsNumber()
  countryId?: number;

  @IsOptional()
  @IsNumber()
  stateId?: number;

  @IsOptional()
  @IsNumber()
  districtId?: number;

  @IsOptional()
  @IsNumber()
  beatId?: number;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validTill?: string;

  @IsOptional()
  @IsEnum(DiscountStatus)
  status?: DiscountStatus;

  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;

  @IsOptional()
  @IsEnum(PktType)
  pktType?: PktType;

  @IsOptional()
  @IsNumber()
  minQty?: number;

  @IsOptional()
  @IsNumber()
  maxQty?: number;

  @IsOptional()
  @IsNumber()
  minimumOrderValue?: number;

  @IsNotEmpty()
  @IsEnum(DiscountValueType)
  discountValueType!: DiscountValueType;

  @IsOptional()
  @IsNumber()
  discountValue?: number;

  @IsOptional()
  @IsNumber()
  discountPercentage?: number;
}

export class UpdateDiscount {
  @IsNotEmpty()
  @IsNumber()
  discountId!: number;

  @IsNotEmpty()
  @IsString()
  discountName!: string;

  @IsNotEmpty()
  @IsEnum(DiscountType)
  discountType!: DiscountType;

  @IsNotEmpty()
  @IsEnum(DiscountCategory)
  discountCategory!: DiscountCategory;

  @IsOptional()
  @IsNumber()
  customerTypeId?: number;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  skuId?: number;

  @IsOptional()
  @IsNumber()
  countryId?: number;

  @IsOptional()
  @IsNumber()
  stateId?: number;

  @IsOptional()
  @IsNumber()
  districtId?: number;

  @IsOptional()
  @IsNumber()
  beatId?: number;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validTill?: string;

  @IsOptional()
  @IsEnum(DiscountStatus)
  status?: DiscountStatus;

  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;

  @IsOptional()
  @IsEnum(PktType)
  pktType?: PktType;

  @IsOptional()
  @IsNumber()
  minQty?: number;

  @IsOptional()
  @IsNumber()
  maxQty?: number;

  @IsOptional()
  @IsNumber()
  minimumOrderValue?: number;

  @IsNotEmpty()
  @IsEnum(DiscountValueType)
  discountValueType!: DiscountValueType;

  @IsOptional()
  @IsNumber()
  discountValue?: number;

  @IsOptional()
  @IsNumber()
  discountPercentage?: number;
}

export class GetDiscountById {
  @IsNotEmpty()
  @IsString()
  discountId!: string;
}

export class DeleteDiscountById {
  @IsNotEmpty()
  @IsString()
  discountId!: string;
}

export class DiscountListFilter {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @IsOptional()
  @IsEnum(DiscountCategory)
  discountCategory?: DiscountCategory;

  @IsOptional()
  @IsEnum(DiscountStatus)
  status?: DiscountStatus;

  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;

  @IsOptional()
  @IsNumber()
  customerTypeId?: number;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsNumber()
  skuId?: number;

  @IsOptional()
  @IsNumber()
  countryId?: number;

  @IsOptional()
  @IsNumber()
  stateId?: number;

  @IsOptional()
  @IsNumber()
  districtId?: number;

  @IsOptional()
  @IsNumber()
  beatId?: number;

  @IsNotEmpty()
  @IsString()
  pageNumber!: string;

  @IsNotEmpty()
  @IsString()
  pageSize!: string;
}

