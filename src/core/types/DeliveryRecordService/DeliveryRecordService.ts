import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  IsNumber
} from "class-validator";
import { Type } from "class-transformer";
import { DeliveryStatusEnum } from "../Constent/common";

/** Create Delivery (from a Dispatch) - header + items auto-created from dispatch */
export class CreateDeliveryRecordDto {
  @IsInt()
  @Type(() => Number)
  dispatchId: number;

  //  @IsNumber()
  // deliveredQty: number;
  
}

/** Update Delivery Header - Delivery Status, Delivery Date, Remarks (editable per spec) */
export class UpdateDeliveryRecordHeaderDto {
  @IsOptional()
  @IsEnum(DeliveryStatusEnum)
  deliveryStatus?: DeliveryStatusEnum;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;
}

/** Update Delivery Item - Delivered Qty, Delivery Date (editable); remaining & status are computed */
export class UpdateDeliveryRecordItemDto {
  @IsInt()
  @Type(() => Number)
  deliveryItemId: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  deliveredQty: number;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;
}

export class GetDeliveryRecordByIdDto {
  @IsInt()
  @Type(() => Number)
  deliveryId: number;
}

export class DeleteDeliveryRecordDto {
  @IsInt()
  @Type(() => Number)
  deliveryId: number;
}

export class ListDeliveryRecordDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  dispatchId?: number;

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

export class ListDeliveryRecordItemDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  deliveryId?: number;

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

export class GetDeliveryRecordItemByIdDto {
  @IsInt()
  @Type(() => Number)
  deliveryItemId: number;
}

export class DeleteDeliveryRecordItemDto {
  @IsInt()
  @Type(() => Number)
  deliveryItemId: number;
}
