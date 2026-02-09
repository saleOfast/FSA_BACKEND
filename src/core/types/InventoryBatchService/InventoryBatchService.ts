import { Type, Transform } from "class-transformer";
import { 
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  ValidateNested,
  IsEnum,
   IsInt,
    Min,
    IsBoolean
} from "class-validator";

import {BatchStatusEnum, QualityStatusEnum, StorageConditionEnum } from "../../types/Constent/common";

export class CreateInventoryBatchDto {

  // 🔹 Inventory reference
  @IsNotEmpty()
  @IsInt()
  inventoryId: number;

  // 🔹 Batch details
  @IsNotEmpty()
  @IsString()
  batchNo: string;

  @IsOptional()
  @IsDateString()
  mfgDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsDateString()
  receivedDate?: string;

  // 🔹 Stock
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  currentStock: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  reservedStock?: number;

  // 🔹 Unit & status
  @IsNotEmpty()
  @IsString()
  unit: string; // pcs / kg / ltr

  @IsOptional()
  @IsEnum(BatchStatusEnum)
  status?: BatchStatusEnum;

  @IsOptional()
  @IsEnum(QualityStatusEnum)
  qualityStatus?: QualityStatusEnum;

  @IsOptional()
  @IsEnum(StorageConditionEnum)
  storageCondition?: StorageConditionEnum;

  // 🔹 Traceability
  @IsOptional()
  @IsInt()
  supplierId?: number;

  @IsOptional()
  @IsInt()
  grnId?: number;

  @IsOptional()
  @IsString()
  inspectionRef?: string;
}

export class UpdateInventoryBatchDto {

   @IsNotEmpty()
  @IsInt()
  batchId: number;

  // 🔹 Batch details
  @IsOptional()
  @IsString()
  batchNo?: string;

  @IsOptional()
  @IsDateString()
  mfgDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsDateString()
  receivedDate?: string;

  // 🔹 Stock
  @IsOptional()
  @IsInt()
  @Min(0)
  currentStock?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  reservedStock?: number;

  // 🔹 Unit & status
  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsEnum(BatchStatusEnum)
  status?: BatchStatusEnum;

  @IsOptional()
  @IsEnum(QualityStatusEnum)
  qualityStatus?: QualityStatusEnum;

  @IsOptional()
  @IsEnum(StorageConditionEnum)
  storageCondition?: StorageConditionEnum;

  // 🔹 Traceability
  @IsOptional()
  @IsInt()
  supplierId?: number;

  @IsOptional()
  @IsInt()
  grnId?: number;

  @IsOptional()
  @IsString()
  inspectionRef?: string;
}
export class DeleteInventoryBatchByIdDto {

  @IsNotEmpty()
  @IsInt()
  batchId: number;
}
export class GetInventoryBatchListDto {

  // 🔹 Pagination
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  // 🔹 Core filters
  @IsOptional()
  @IsInt()
  inventoryId?: number;

  @IsOptional()
  @IsString()
  batchNo?: string;

  // 🔹 Status filters
  @IsOptional()
  @IsEnum(BatchStatusEnum)
  status?: BatchStatusEnum;

  @IsOptional()
  @IsEnum(QualityStatusEnum)
  qualityStatus?: QualityStatusEnum;

  @IsOptional()
  @IsEnum(StorageConditionEnum)
  storageCondition?: StorageConditionEnum;

  // 🔹 Date filters
  @IsOptional()
  @IsDateString()
  expiryFrom?: string;

  @IsOptional()
  @IsDateString()
  expiryTo?: string;

  @IsOptional()
  @IsDateString()
  receivedFrom?: string;

  @IsOptional()
  @IsDateString()
  receivedTo?: string;

  // 🔹 Stock filters
  @IsOptional()
  @IsBoolean()
  onlyAvailable?: boolean; // availableQty > 0

  @IsOptional()
  @IsBoolean()
  includeExpired?: boolean;

  // 🔹 Traceability
  @IsOptional()
  @IsInt()
  supplierId?: number;

  @IsOptional()
  @IsInt()
  grnId?: number;

  // 🔹 Sorting
  @IsOptional()
  @IsString()
  sortBy?: "expiryDate" | "receivedDate" | "createdAt";

  @IsOptional()
  @IsString()
  sortOrder?: "ASC" | "DESC";
}

export class GetInventoryBatchByIdDto {

  @IsNotEmpty()
  @IsInt()
  batchId: number;
}