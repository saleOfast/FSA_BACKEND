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
import { DeliveryStatusEnum } from "../Constent/common";

export class CreateDeliveryItemDto {

  @IsString()
  deliveryId:string;

  @IsInt()
  @Type(() => Number)
  orderItemId: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  dispatchedQty?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  batchId?: number;
}

export class CreateDeliveryDto {
  @IsInt()
  @Type(() => Number)
  salesOrderId: number;

  @IsUUID()
  warehouseId: string;

  @IsOptional()
  @IsEnum(DeliveryStatusEnum)
  deliveryStatus?: DeliveryStatusEnum;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

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
  @IsDateString()
  dispatchDate?: string;
}

export class UpdateDeliveryHeaderDto {
  @IsOptional()
  @IsEnum(DeliveryStatusEnum)
  deliveryStatus?: DeliveryStatusEnum;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

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
  @IsDateString()
  dispatchDate?: string;
}

export class UpdateDeliveryItemDto {
  @IsInt()
  @Type(() => Number)
  deliveryItemId: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  dispatchedQty: number;
}

export class GetDeliveryByIdDto {
  @IsUUID()
  deliveryId: string;
}

export class DeleteDeliveryDto {
  @IsUUID()
  deliveryId: string;
}

export class ListDeliveryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  salesOrderId?: number;

  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @IsOptional()
  @IsEnum(DeliveryStatusEnum)
  deliveryStatus?: DeliveryStatusEnum;

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

export class CancelDeliveryDto {
  @IsUUID()
  deliveryId: string;
}



export class ListDeliveryItemDto {

  // Filter by Delivery
  @IsOptional()
  @IsUUID()
  deliveryId?: string;

  // Filter by Order Item
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orderItemId?: number;

  // Filter by SKU
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  skuId?: number;

  // Filter by Product
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  productId?: number;

  // Include deleted records (optional)
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export class GetDeliveryItemByIdDto {
  @IsInt()
  @Type(() => Number)
  deliveryItemId: number;
}

export class DeleteDeliveryItemDto {

  @Type(() => Number)   // important for param transformation
  @IsInt()
  @IsNotEmpty()
  deliveryItemId: number;
}