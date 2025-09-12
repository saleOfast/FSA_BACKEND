import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { DiscountType } from "../Constent/common";
import { Type } from "class-transformer";

/**
 * Interfaces
 */
export interface ISkuDiscount {
  discountType: DiscountType;
  value: number;
  isActive: boolean;
}

export interface IProducts {
  productId: number;
  empId: number;
  sku: string; // ✅ Unique Item ID / SKU
  productName: string;
  categoryId: number;
  brandId: number;
  subcategory?: string;
  batchNumber?: string;
  manufacturingDate?: string | null;
  expiryDate?: string | null;
  shelf_life?: number;
  unitOfMeasure?: string;
  total_quantity?: number;
  total_sold?: number; // ✅ Sold till date
  quantity_in_stock?: number; // ✅ Current available stock
  reorderLevel?: number; // ✅ Minimum stock threshold
  maxStockLevel?: number;
  currency?: string;
  purchase_price?: number;
  selling_price?: number;
  mrp: number;
  rlp: number;
  caseQty: number;
  storage_location?: string;
  storage_condition?: string; // ✅ Special conditions
  stock_in_date?: string | null;
  stock_out_date?: string | null;
  status?: string; // ✅ In stock / Sold out / Expired
  damaged_quantity?: number; // ✅ Damaged/unsellable
  image?: string | null;
  colour?: string;
  skuDiscount?: ISkuDiscount;
  product_state?: string;
  isFocused: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductCategory {
  productCategoryId: number;
  empId: number;
  parentId?: number;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Classes
 */
export class SkuDiscount {
  @IsNotEmpty()
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}

/**
 * Create Product DTO
 */
export class CreateProductRequest {
  @IsNotEmpty()
  @IsString()
  sku: string; // ✅ Item ID / SKU

  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  brandId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsString()
  subcategory?: string;

  @IsOptional()
  @IsString()
  batchNumber?: string;

  @IsOptional()
  @IsString()
  manufacturingDate?: string | null;

  @IsOptional()
  @IsString()
  expiryDate?: string | null;

  @IsOptional()
  @IsNumber()
  shelf_life?: number;

  @IsOptional()
  @IsString()
  unitOfMeasure?: string;

  @IsOptional()
  @IsNumber()
  total_quantity?: number;

  @IsOptional()
  @IsNumber()
  total_sold?: number;

  @IsOptional()
  @IsNumber()
  quantity_in_stock?: number;

  @IsOptional()
  @IsNumber()
  reorderLevel?: number;

  @IsOptional()
  @IsNumber()
  maxStockLevel?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  purchase_price?: number;

  @IsOptional()
  @IsNumber()
  selling_price?: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  mrp: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  rlp: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  caseQty: number;

  @IsOptional()
  @IsString()
  storage_location?: string;

  @IsOptional()
  @IsString()
  storage_condition?: string;

  @IsOptional()
  @IsString()
  stock_in_date?: string | null;

  @IsOptional()
  @IsString()
  stock_out_date?: string | null;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  damaged_quantity?: number;

  @IsOptional()
  @IsObject()
  @Type(() => SkuDiscount)
  skuDiscount?: SkuDiscount;

  @IsOptional()
  @IsString()
  image: string;

    
  @IsOptional()
  @IsString()
  colour: string;

  @IsOptional()
  @IsString()
  product_state?: string;

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  isFocused: boolean;

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  isActive: boolean;
}

/**
 * Update Product DTO
 */
export class UpdateProductRequest extends CreateProductRequest {
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}

/**
 * Other Product DTOs
 */
export class GetProductById {
  @IsNotEmpty()
  @IsString()
  productId: string;
}

export class GetProductListRequest {
  @IsOptional()
  @IsString()
  isFocused?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  isActive?: string;
}

export class DeleteProductById {
  @IsNotEmpty()
  @IsString()
  productId: string;
}

/**
 * Product Category DTOs
 */
export class CreateProductCategory {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  parentId?: number;

   @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

   @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isDeleted?: boolean; 
}

export class GetCategoryById {
  @IsNotEmpty()
  @IsString()
  catId: string;
}

export class UpdateCategoryById {
  @IsNotEmpty()
  @IsNumber()
  catId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}

export class DeleteCategoryById {
  @IsNotEmpty()
  @IsString()
  catId: string;
}
