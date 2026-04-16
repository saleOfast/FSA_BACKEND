import { Type, Transform } from "class-transformer";
import { 
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  ValidateNested,
  Min,Max,
  ValidateIf,
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty
} from "class-validator";


export class InventoryItemDto {

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  inventoryId?: number;

  // ============================
  // Inventory Name
  // ============================
  @IsNotEmpty({ message: "inventoryName is required" })
  @IsString()
  @Transform(({ value }) => value?.trim())
  inventoryName: string;

  // ============================
  // SKU
  // ============================
  @IsNotEmpty({ message: "skuId is required" })
  @Type(() => Number)
  @IsNumber()
  skuId: number;

  // ============================
  // Warehouse (MAKE REQUIRED)
  // ============================
  @IsNotEmpty({ message: "warehouseId is required" })
  @IsString()
  warehouseId: string;

  // ============================
  // Stock
  // ============================
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: "stockQuantity must be greater than 0" })
  stockQuantity: number;

  // ============================
  // Batch + Expiry (linked validation)
  // ============================
  // @ValidateIf(o => o.expiryDate !== undefined)
   @IsOptional()
  @IsString()
  batchNumber?: string;

  @ValidateIf(o => o.batchNumber !== undefined)
  @IsDateString({}, { message: "expiryDate must be a valid date" })
  expiryDate?: string;

  // ============================
  // Optional Fields
  // ============================
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  reorderLevel?: number;

  @IsOptional()
  @IsDateString()
  stockInDate?: string;

  @IsOptional()
  @IsDateString()
  stockOutDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  taxId?: number;
}

export class CreateInventoryDto {

  @IsArray({ message: "inventory must be an array" })
  
  @ArrayNotEmpty({ message: "inventory cannot be empty" })
  
  @ArrayMinSize(1, { message: "At least one inventory item is required" })
  
  @ArrayMaxSize(100, { message: "Maximum 100 items allowed at once" }) // optional limit
  
  @ValidateNested({ each: true })
  
  @Type(() => InventoryItemDto)
  
  inventory: InventoryItemDto[];
}


export class UpdateInventoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InventoryItemDto)
  inventory: InventoryItemDto[];
}


export class DeleteInventoryDto {
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  inventoryIds: number[];
}

// =======================
// 5️⃣ GET INVENTORY LIST DTO
// =======================
export class GetInventoryList {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsString()
  warehouseId?: string;

 @IsOptional()
  @Type(() => Number)
  @IsNumber()
  inventoryId?: number;

  @IsOptional()
  @IsString()
  inventoryName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skuId?: number;
  
}

export class GetInventoryById {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  inventoryId: number;
}
