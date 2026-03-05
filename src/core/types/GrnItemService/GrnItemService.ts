import { Type, Transform } from "class-transformer";
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class ProcessGrnItemDto {
  @IsNotEmpty()
  @IsString()
  grnId: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  skuId: number;

  @IsNotEmpty()
  @IsString()
  warehouseId: string;

  @IsNotEmpty()
  @IsString()
  batchNo: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  receivedQty: number;

  @IsNotEmpty()
  @IsString()
  unit: string; // pcs / kg / ltr

  @IsOptional()
  @IsDateString()
  mfgDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsDateString()
  receivedDate?: string;
}

// UI-driven create:
// Inventory & Batch are created/selected first (with full fields),
// then GRN Item is created using IDs and stock is updated.
export class CreateGrnItemByIdsDto {
  @IsNotEmpty()
  @IsString()
  grnId: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  skuId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  inventoryId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  batchId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  receivedQty: number;
}

export class GetGrnItemByIdDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  grnItemId: number;
}

export class GrnItemListDto {
  @IsOptional()
  @IsString()
  grnId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  skuId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  inventoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  batchId?: number;
}

export class DeleteGrnItemDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  grnItemId: number;
}

export class UpdateGrnItemDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  grnItemId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  receivedQty: number;
}

