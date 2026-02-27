import { IsInt, IsPositive, IsOptional, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export interface ISalesOrderItem {
  id?: number;
  soId: number;
  productId: number;
  shippingAddressId: number;
  uom: string;
  saleQty: number;
  basePrice: number;
  discountPercent?: number;
  schemeAmount?: number;
  totalBaseValue: number;
  discountValue: number;
  taxPercent: number;
  netAmount: number;
  taxAmount: number;
  grossAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  warehouseId: string;
}

export class CreateSalesOrderItemDto {
  @IsInt()
  @IsNotEmpty()
  salesOrderId: number; // Required field - link to SalesOrderHeader

  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  skuId: number;

  @IsInt()
  @IsNotEmpty()
  shippingAddressId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  saleQty: number;

  @IsOptional()
  @IsInt()
  discountId?: number;

  @IsOptional()
  @IsInt()
  schemeId?: number;

  @IsInt()
  @IsNotEmpty()
  taxId: number;

  @IsString()
  @IsNotEmpty()
  warehouseId: string;
}

export class UpdateSalesOrderItemDto {
  @IsInt()
  @IsNotEmpty()
  id: number; // Required for update

  @IsOptional()
  @IsInt()
  productId?: number;

  @IsOptional()
  @IsInt()
  skuId?: number;

  @IsOptional()
  @IsInt()
  shippingAddressId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  saleQty?: number;

  @IsOptional()
  @IsInt()
  discountId?: number;

  @IsOptional()
  @IsInt()
  schemeId?: number;

  @IsOptional()
  @IsInt()
  taxId?: number;
}

export class GetSalesOrderItemById {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsNotEmpty()
  id: number;
}

export class DeleteSalesOrderItemById {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsNotEmpty()
  id: number;
}

export class GetSalesOrderItemsByOrderId {
@Type(() => Number)
@IsInt()
id: number;
}

export class SalesOrderItemListFilter {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  @IsInt()
  salesOrderId?: number;

  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  @IsInt()
  productId?: number;
}