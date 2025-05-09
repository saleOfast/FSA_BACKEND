import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { DiscountType } from "../Constent/common";
import { Type } from "class-transformer";

export interface ISkuDiscount {
    discountType: DiscountType,
    value: number,
    isActive: boolean
}
export interface IProducts {
    productId: number;
    empId: number;
    productName: string;
    mrp: number;
    rlp: number;
    caseQty: number;
    categoryId: number;
    brandId: number;
    image: string | null;
    colour: string | null;
    skuDiscount: ISkuDiscount;
    isFocused: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    // brand?: string | null;
    // category?: string | null;
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
    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsNotEmpty()
    @IsNumber()
    mrp: number;

    @IsNotEmpty()
    @IsNumber()
    rlp: number;

    @IsNotEmpty()
    @IsNumber()
    caseQty: number;

    @IsNotEmpty()
    @IsNumber()
    categoryId: number;

    @IsNotEmpty()
    @IsNumber()
    brandId: number;

    @IsOptional()
    @IsString()
    image: string;

    
    @IsOptional()
    @IsString()
    colour: string;

    @IsOptional()
    @IsObject()
    skuDiscount: SkuDiscount

    @IsNotEmpty()
    @IsBoolean()
    isFocused: boolean;

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;
}

export class UpdateProductRequest {
    @IsNotEmpty()
    @IsNumber()
    productId: number

    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsNotEmpty()
    @IsNumber()
    mrp: number;

    @IsNotEmpty()
    @IsNumber()
    rlp: number;

    // @IsNotEmpty()
    // @IsNumber()
    // rlpValue: number;

    @IsNotEmpty()
    @IsNumber()
    caseQty: number;

    // @IsNotEmpty()
    // @IsNumber()
    // packetQty: number;

    @IsNotEmpty()
    @IsNumber()
    categoryId: number;

    @IsNotEmpty()
    @IsNumber()
    brandId: number;

    @IsOptional()
    @IsObject()
    // @ValidateNested({ each: true })
    @Type(() => SkuDiscount)
    skuDiscount: SkuDiscount

    @IsOptional()
    @IsBoolean()
    isFocused: boolean;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}

export class GetProductById {
    @IsNotEmpty()
    @IsString()
    productId: string;
}

export class GetProductListRequest {
    @IsOptional()
    @IsString()
    isFocused: string;

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