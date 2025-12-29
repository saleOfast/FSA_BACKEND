import { Type } from "class-transformer";
import { 
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  ValidateNested
} from "class-validator";

// =======================
// 1️⃣ INVENTORY ITEM DTO (for create/update single item)
// =======================
export class InventoryItemDto {
  @IsOptional()
  @IsNumber()
  inventoryId?: number; // optional for create

  @IsOptional()
  @IsNumber()
  skuId?: number; // optional SKU

  @IsOptional()
  @IsNumber()
  productId?: number; // optional, can come from SKU

  @IsOptional()
  @IsNumber()
  warehouseId?: number;

  @IsNotEmpty()
  @IsNumber()
  stockQuantity: number;

  @IsOptional()
  @IsNumber()
  reservedQuantity?: number;

  @IsOptional()
  @IsString()
  batchNumber?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsNumber()
  reorderLevel?: number;

  @IsOptional()
  @IsDateString()
  stockInDate?: string;

  @IsOptional()
  @IsDateString()
  stockOutDate?: string;

  @IsOptional()
  @IsNumber()
  taxId?: number;

  @IsOptional()
  @IsNumber()
  schemeId?: number;

  @IsOptional()
  @IsNumber()
  discountId?: number;
}

// =======================
// 2️⃣ CREATE INVENTORY DTO (bulk items)
// =======================
export class CreateInventoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InventoryItemDto)
  inventory: InventoryItemDto[];
}

// =======================
// 3️⃣ UPDATE INVENTORY DTO
// =======================
export class UpdateInventoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InventoryItemDto)
  inventory: InventoryItemDto[];
}

// =======================
// 4️⃣ DELETE INVENTORY DTO
// =======================
export class DeleteInventoryDto {
  @IsArray()
  @IsNumber({}, { each: true })
  inventoryIds: number[];
}

// =======================
// 5️⃣ GET INVENTORY LIST DTO
// =======================
export class GetInventoryList {
  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;
}
