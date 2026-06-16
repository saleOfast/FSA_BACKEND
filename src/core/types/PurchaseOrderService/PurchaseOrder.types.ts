import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsDateString,
  IsUUID

} from "class-validator";
import { Type } from "class-transformer";
import {Customer} from "../../DB/Entities/customer.entity";
import {Warehouse} from "../../DB/Entities/warehouse.entity";

export interface IPurchaseOrder {
  // Identifiers
  purchaseOrderId: number;

  // Purchase Order Details
  poNumber: string;
  poDate: Date;

  // Customer
  customerId: number;
  customerName?: string;

  // Warehouse
  warehouseId: string;
  warehouseName?: string;

  // Delivery
  expectedDeliveryDate?: Date;

  // Payment
  paymentTerms?: string;

  // Status
  status: string;

  // Remarks
  remarks?: string;

  // Amount Details
  subTotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;

  // Soft Delete
  isDeleted: boolean;

  // Audit
  createdAt: Date;
  updatedAt: Date;

  // Relations
  customer?: Customer;
  warehouse?: Warehouse;

  // Line Items (if implemented)
  // lineItems?: IPurchaseOrderItem[];
}


export class CreatePurchaseOrderDto {
  @IsOptional()
  @IsNumber()
  purchaseOrderId?: number;

  @IsNotEmpty()
  @IsString()
  poNumber:string;

  @IsNotEmpty()
  @IsDateString()
  poDate: Date;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  customerId: number;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  warehouseId: string;

  @IsOptional()
  @IsString()
  warehouseName?: string;

  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: Date;

  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  subTotal?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalDiscount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalTax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  grandTotal?: number;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
export class UpdatePurchaseOrderDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  purchaseOrderId: number;

  @IsOptional()
  @IsDateString()
  poDate?: Date;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  warehouseName?: string;

  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: Date;

  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  subTotal?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalDiscount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalTax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  grandTotal?: number;
}


export class GetPurchaseOrderByIdDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  purchaseOrderId: number;
}

export class DeletePurchaseOrderDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  purchaseOrderId: number;
}


export class ListPurchaseOrderDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  purchaseOrderId?: number;

  @IsOptional()
  @IsString()
  poNumber?: string;

  @IsOptional()
  @IsDateString()
  poDate?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: Date;

  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class SearchPurchaseOrderDto {
  @IsOptional()
  @IsString()
  poNumber?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  warehouseName?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  poDate?: Date;
}