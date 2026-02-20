import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
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
