import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { InvoiceDocumentTypeEnum, InvoiceStatusEnum } from "../Constent/common";

export class CreateInvoiceDto {
  @IsEnum(InvoiceDocumentTypeEnum)
  @IsNotEmpty()
  documentType: InvoiceDocumentTypeEnum;

  @IsString()
  @IsNotEmpty()
  invoiceDate: string; // ISO Date String

  @IsUUID()
  @IsNotEmpty()
  deliveryId: string;

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
  @IsUUID()
  @IsNotEmpty()
  invoiceId: string;
}
