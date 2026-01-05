import { Type, Transform } from "class-transformer";
import { 
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  ValidateNested
} from "class-validator";


export class InventoryItemDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  inventoryId?: number; // optional for create

  @IsNotEmpty()
  @IsString()
  inventoryName: string; // added inventoryName

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  skuId:number; // optional SKU

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  productId?: number; // optional, can come from SKU

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  warehouseId?: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  stockQuantity: number;

  // @IsOptional()
  // @Type(() => Number)
  // @IsNumber()
  // reservedQuantity?: number;

  @IsOptional()
  @IsString()
  batchNumber?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
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

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  schemeId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discountId?: number;
}

export class CreateInventoryDto {
  @IsArray()
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
  @Type(() => Number)
  @IsNumber()
  warehouseId: number;

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
