import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { DispatchedStatusEnum } from "../Constent/common";

/* =========================================================
   CREATE DISPATCH HEADER
========================================================= */

export class CreateDispatchDto {

  @IsInt()
  @Type(() => Number)
  salesOrderId: number;

  @IsOptional()
  @IsEnum(DispatchedStatusEnum)
  dispatchStatus?: DispatchedStatusEnum;

  @IsOptional()
  @IsDateString()
  dispatchDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vehicleNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  transporterName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  driverName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  driverMobile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  ewayBillNo?: string;
}

/* =========================================================
   CREATE DISPATCH ITEM
========================================================= */

export class CreateDispatchItemDto {

  @IsUUID()
  dispatchId: string;

  @IsInt()
  @Type(() => Number)
  salesOrderItemId: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  dispatchedQty: number;

  @IsInt()
  @Type(() => Number)
  productId: number;

  @IsInt()
  @Type(() => Number)
  batchId: number;
}

/* =========================================================
   UPDATE DISPATCH HEADER
========================================================= */

export class UpdateDispatchHeaderDto {

  @IsOptional()
  @IsEnum(DispatchedStatusEnum)
  dispatchStatus?: DispatchedStatusEnum;

  @IsOptional() // ✅ ADD THIS
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDispatchItemDto)
  items?: UpdateDispatchItemDto[]; // ✅ Make optional

  @IsOptional()
  @IsDateString()
  dispatchDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vehicleNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  transporterName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  driverName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  driverMobile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  ewayBillNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;
}

/* =========================================================
   UPDATE DISPATCH ITEM
========================================================= */

export class UpdateDispatchItemDto {

  @IsUUID()
  dispatchItemId: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  dispatchedQty: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  batchId?: number;   
}

/* =========================================================
   GET BY ID
========================================================= */

export class GetDispatchByIdDto {

  @IsUUID()
  dispatchId: string;
}

/* =========================================================
   DELETE
========================================================= */

export class DeleteDispatchDto {

  @IsUUID()
  dispatchId: string;
}

/* =========================================================
   LIST DISPATCH HEADER
========================================================= */

export class ListDispatchDto {

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  salesOrderId?: number;

  @IsOptional()
  @IsEnum(DispatchedStatusEnum)
  dispatchStatus?: DispatchedStatusEnum;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;
}

/* =========================================================
   LIST DISPATCH ITEMS
========================================================= */

export class ListDispatchItemDto {

  @IsOptional()
  @IsUUID()
  dispatchId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  salesOrderItemId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  productId?: number;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}

/* =========================================================
   GET DISPATCH ITEM BY ID
========================================================= */

export class GetDispatchItemByIdDto {

  @IsUUID()
  dispatchItemId: string;
}

/* =========================================================
   DELETE DISPATCH ITEM
========================================================= */

export class DeleteDispatchItemDto {

  @IsUUID()
  @IsNotEmpty()
  dispatchItemId: string;
}