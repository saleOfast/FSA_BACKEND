// dto/Sku.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";


// interfaces/ISku.ts
export interface ISku {
  skuId: number;              // Auto-generated primary key
  skuNumber: string;          // SKU Number
  productName: string;        // Product name
  salesChannel: string;       // Retail / Distributor
  channelSku: string;         // Channel-specific SKU
  barcode: string;            // Barcode / UPC
  description?: string;       // Short description
  attributeColor?: string;    // Color variant
  attributeSize?: string;     // Size variant
  stockLevel: number;         // Inventory stock count
  warehouseLocation?: string; // Warehouse where SKU is stored
  productDescription?: string;// Detailed description
  isActive: boolean;          // For status (active/inactive)
  createdAt: Date;
  updatedAt: Date;
}


/**
 * Create SKU DTO
 */
export class CreateSkuRequest {
  @IsNotEmpty()
  @IsString()
  skuNumber: string;

  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsNotEmpty()
  @IsString()
  salesChannel: string;

  @IsNotEmpty()
  @IsString()
  channelSku: string;

  @IsNotEmpty()
  @IsString()
  barcode: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  attributeColor?: string;

  @IsOptional()
  @IsString()
  attributeSize?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  stockLevel: number;

  @IsOptional()
  @IsString()
  warehouseLocation?: string;

  @IsOptional()
  @IsString()
  productDescription?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean = true;

}

/**
 * Update SKU DTO
 */
export class UpdateSkuRequest extends CreateSkuRequest {
  @IsNotEmpty()
  @IsNumber()
  skuId: number;
}

/**
 * Get SKU by ID DTO
 */
 export class SearchSkuRequest {
   @IsOptional()
  @Type(() => Number)   // 👈 this will transform "6" → 6
  @IsNumber()
  skuId?: number;

  @IsOptional()
  @IsString()
  productName?: string;

 @IsOptional()
  @IsString()
  warehouseLocation?: string;
}


/**
 * Get SKU List DTO (with filters)
 */
export class GetSkuListRequest {
  @IsOptional()
  @IsString()
  salesChannel?: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  isActive?: string;
}

/**
 * Delete SKU by ID DTO
 */
export class DeleteSkuById {
  @IsNotEmpty()
  @IsString()
  skuId: string;
}

/**
 * get status
 */
export class GetStatusRequest {
    @IsOptional()
  @Type(() => Number)   // 👈 this will transform "6" → 6
  @IsNumber()
  skuId?: number;
  
  @IsOptional()
  @IsString()
  skuNumber?: string;

  @IsOptional()
  @IsString()
  status?: "Active" | "Inactive";
}