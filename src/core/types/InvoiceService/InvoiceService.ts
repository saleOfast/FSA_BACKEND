import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { Type } from "class-transformer";
import { InvoiceDocumentTypeEnum, InvoiceStatusEnum } from "../Constent/common";

export class CreateInvoiceDto {
  @IsEnum(InvoiceDocumentTypeEnum)
  @IsNotEmpty()
  documentType: InvoiceDocumentTypeEnum;

  @IsString()
  @IsNotEmpty()
  invoiceDate: string; // ISO Date String

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  deliveryId: number;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsArray()
  @IsOptional()
  items?: CreateInvoiceItemDto[];
}

export class CreateInvoiceItemDto {
  @IsNumber()
  @IsNotEmpty()
  skuId: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsOptional()
  discountId?: number;

  @IsNumber()
  @IsOptional()
  schemeId?: number;
}

export class UpdateInvoiceDto {
  @IsEnum(InvoiceStatusEnum)
  @IsOptional()
  status?: InvoiceStatusEnum;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  @IsOptional()
  irnNo?: string;

  @IsString()
  @IsOptional()
  qrCode?: string;
}

export class GetInvoiceByIdDto {

  @Type(() => Number)
  @IsNotEmpty()
  invoiceId: number;
}

export class ListInvoiceDto {
  @IsOptional()
  @IsEnum(InvoiceStatusEnum)
  status?: InvoiceStatusEnum;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;
}

export class DeleteInvoiceDto {
  @Type(() => Number)
  @IsNotEmpty()
  invoiceId: number;
}

// -------- Invoice Item DTOs --------

export class CreateInvoiceItemStandaloneDto {
  @IsUUID()
  @IsNotEmpty()
  invoiceId: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  skuId: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  quantity: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  discountId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  schemeId?: number;
}

export class UpdateInvoiceItemDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  invoiceItemId: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  unitPrice?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  discountId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  schemeId?: number;
}

export class GetInvoiceItemByIdDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  invoiceItemId: number;
}

export class DeleteInvoiceItemDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  invoiceItemId: number;
}

export class ListInvoiceItemDto {
  @IsOptional()
  @IsUUID()
  invoiceId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;
}
