import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { DiscountType } from "../Constent/common";
import { Type } from "class-transformer";

export interface ISkuDiscount {
    discountType: DiscountType,
    value: number,
    isActive: boolean
}
export interface IProducts {
    // Product ID - Auto (Primary key)
    productId: number;
    
    // Product Type - Pick List (FG / POSM)
    productType?: 'FG' | 'POSM';
    
    // Product Name - Text
    productName: string;
    
    // Product Code - Auto
    productCode?: string;
    
    // Category - Pick List (references categories table)
    categoryId: number;
    
    // Sub Category - Pick List (optional, references subcategories table)
    subCategoryId?: number;
    
    // Description - TEXT
    description?: string;
    
    // Status - Pick List (Active/Inactive)
    status: 'Active' | 'Inactive';
    
    // Launch Date - DATE
    launchDate?: Date;
    
    // Discontinue Date - DATE
    discontinueDate?: Date;
    
    // Vol. - Pick List (Default unit of measure e.g., 'Piece', 'Pack')
    vol?: string;
    
    // Tax Category - Lookup (references Tax Table)
    // taxCategoryId?: number;
    
    // HSN Code - Lookup (references Tax Table)
    // hsnCode?: string;
    
    // Image - VARCHAR(255)
    image?: string;
    
    // Created Date - TIMESTAMP
    createdDate: Date;
    
    // Updated Date - TIMESTAMP
    updatedDate: Date;
    
    // Market Segment - Pick List (Urban, Rural, General Trade, Modern Trade)
    marketSegment?: string;
    
    // Product Life Cycle Stage - Pick List (new, growth, mature, decline)
    productLifeCycleStage?: string;
    
    // Storage Condition - Pick List (e.g., 'Cool Dry')
    storageCondition?: string;
    
    // Scheme - Lookup (references Scheme & Discount Table)
    // schemeId?: number;
    
    // Discount - Lookup (references Scheme & Discount Table)
    // discountId?: number;
    
    // Soft delete flag
    isDeleted: boolean;
    
    // Legacy fields for backward compatibility
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductCategory {
    productCategoryId: number,
    empId: number,
    parentId?: number,
    name: string,
    isActive: boolean,
    isDeleted: boolean,
    createdAt: Date,
    updatedAt: Date
}

export class SkuDiscount {
    @IsNotEmpty()
    @IsEnum(DiscountType)
    discountType: DiscountType

    @IsNotEmpty()
    @IsNumber()
    value: number

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean
}

export class CreateProductRequest {
    // Product Type - Pick List (FG / POSM)
    @IsOptional()
    @IsEnum(['FG', 'POSM'])
    productType?: 'FG' | 'POSM';

    // Product Name - Text
    @IsNotEmpty()
    @IsString()
    productName: string;

    // Product Code - Auto
    @IsOptional()
    @IsString()
    productCode?: string;

    // Category - Pick List (references categories table)
    @IsNotEmpty()
    @IsNumber()
    categoryId: number;

    // Sub Category - Pick List (optional, references subcategories table)
    @IsOptional()
    @IsNumber()
    subCategoryId?: number;

    // Description - TEXT
    @IsOptional()
    @IsString()
    description?: string;

    // Status - Pick List (Active/Inactive)
    @IsOptional()
    @IsEnum(['Active', 'Inactive'])
    status?: 'Active' | 'Inactive';

    // Launch Date - DATE
    @IsOptional()
    @IsDateString()
    launchDate?: string;

    // Discontinue Date - DATE
    @IsOptional()
    @IsDateString()
    discontinueDate?: string;

    // Vol. - Pick List (Default unit of measure e.g., 'Piece', 'Pack')
    @IsOptional()
    @IsString()
    vol?: string;

    // Tax Category - Lookup (references Tax Table)
    // @IsOptional()
    // @IsNumber()
    // taxCategoryId?: number;

    // HSN Code - Lookup (references Tax Table)
    // @IsOptional()
    // @IsString()
    // hsnCode?: string;

    // Image - VARCHAR(255)
    @IsOptional()
    @IsString()
    image?: string;

    // Market Segment - Pick List (Urban, Rural, General Trade, Modern Trade)
    @IsOptional()
    @IsString()
    marketSegment?: string;

    // Product Life Cycle Stage - Pick List (new, growth, mature, decline)
    @IsOptional()
    @IsString()
    productLifeCycleStage?: string;

    // Storage Condition - Pick List (e.g., 'Cool Dry')
    @IsOptional()
    @IsString()
    storageCondition?: string;

    // Scheme - Lookup (references Scheme & Discount Table)
    // @IsOptional()
    // @IsNumber()
    // schemeId?: number;

    // Discount - Lookup (references Scheme & Discount Table)
    // @IsOptional()
    // @IsNumber()
    // discountId?: number;
}

export class UpdateProductRequest {
    @IsNotEmpty()
    @IsNumber()
    productId: number

    // Product Type - Pick List (FG / POSM)
    @IsOptional()
    @IsEnum(['FG', 'POSM'])
    productType?: 'FG' | 'POSM';

    // Product Name - Text
    @IsOptional()
    @IsString()
    productName?: string;

    // Product Code - Auto
    @IsOptional()
    @IsString()
    productCode?: string;

    // Category - Pick List (references categories table)
    @IsOptional()
    @IsNumber()
    categoryId?: number;

    // Sub Category - Pick List (optional, references subcategories table)
    @IsOptional()
    @IsNumber()
    subCategoryId?: number;

    // Description - TEXT
    @IsOptional()
    @IsString()
    description?: string;

    // Status - Pick List (Active/Inactive)
    @IsOptional()
    @IsEnum(['Active', 'Inactive'])
    status?: 'Active' | 'Inactive';

    // Launch Date - DATE
    @IsOptional()
    @IsDateString()
    launchDate?: string;

    // Discontinue Date - DATE
    @IsOptional()
    @IsDateString()
    discontinueDate?: string;

    // Vol. - Pick List (Default unit of measure e.g., 'Piece', 'Pack')
    @IsOptional()
    @IsString()
    vol?: string;

    // Tax Category - Lookup (references Tax Table)
    // @IsOptional()
    // @IsNumber()
    // taxCategoryId?: number;

    // HSN Code - Lookup (references Tax Table)
    // @IsOptional()
    // @IsString()
    // hsnCode?: string;

    // Image - VARCHAR(255)
    @IsOptional()
    @IsString()
    image?: string;

    // Market Segment - Pick List (Urban, Rural, General Trade, Modern Trade)
    @IsOptional()
    @IsString()
    marketSegment?: string;

    // Product Life Cycle Stage - Pick List (new, growth, mature, decline)
    @IsOptional()
    @IsString()
    productLifeCycleStage?: string;

    // Storage Condition - Pick List (e.g., 'Cool Dry')
    @IsOptional()
    @IsString()
    storageCondition?: string;

    // Scheme - Lookup (references Scheme & Discount Table)
    // @IsOptional()
    // @IsNumber()
    // schemeId?: number;

    // Discount - Lookup (references Scheme & Discount Table)
    // @IsOptional()
    // @IsNumber()
    // discountId?: number;
}

export class GetProductById {
    @IsNotEmpty()
    @IsString()
    productId: string;
}

export class GetProductListRequest {
    // @IsOptional()
    // @IsString()
    // isFocused: string;

    @IsOptional()
    @IsString()
    brand?: string

    @IsOptional()
    @IsString()
    category?: string

    @IsOptional()
    @IsString()
    search?: string

    @IsOptional()
    @IsString()
    isActive?: string
}

export class DeleteProductById {
    @IsNotEmpty()
    @IsString()
    productId: string;
}



/**
 * Product Category Validation
 */
export class CreateProductCategory {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsNumber()
    parentId: number
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
    name: string

    @IsOptional()
    @IsNumber()
    parentId: number
}

export class DeleteCategoryById {
    @IsNotEmpty()
    @IsString()
    catId: string;
}