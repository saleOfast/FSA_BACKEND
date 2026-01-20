import { IsEnum, IsNotEmpty, IsOptional, IsDate, IsNumber, IsDateString ,IsBoolean, IsInt,IsIn,Min,Max,
  IsString} from "class-validator";
import {SalesOrderHeader} from '../../DB/Entities/SalesOrderHeader.entity'
import {OrderTypeEnum,OrderStatusEnum,PaymentModeEnum} from '../../types/Constent/common'
import { Type } from 'class-transformer'


import { Customer } from "../../DB/Entities/customer.entity";
import { User } from "../../DB/Entities/User.entity";

export interface ISalesOrderHeader {
  soId?: number;

  // Order basic info
  orderType: OrderTypeEnum;
  customer: Customer;
  orderDate: Date;

  paymentTerms?: string;
  paymentMode?: PaymentModeEnum;
  poNumber?: string;
  poDate?: Date;

  status?: OrderStatusEnum;
  remarks?: string;

  // Users
  salesUser: User;
  createdBy: User;
  approvedBy?: User;

  // Amounts (derived, default 0)
  subtotal?:number;
  otherCharges?: number;
  totalDiscount?: number;
  schemeAmount?: number;
  taxAmount?: number;
  grandTotal?: number;

  // Audit
  createdDate?: Date;
  updatedAt?: Date;
}


export class CreateSalesOrderDto {
  // ===== REQUIRED FIELDS =====
  @IsEnum(OrderTypeEnum)
  @IsNotEmpty()
  orderType: OrderTypeEnum;

  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @IsDateString()
  @IsNotEmpty()
  orderDate: Date;

  @IsNumber()
  @IsNotEmpty()
  salesUserId: number;

  // @IsNumber()
  // @IsNotEmpty()
  // createdBy: number;

  // ===== OPTIONAL FIELDS =====
  @IsOptional()
  @IsEnum(PaymentModeEnum)
  paymentMode?: PaymentModeEnum;

  @IsOptional()
  paymentTerms?: string;

  @IsOptional()
  poNumber?: string;

  @IsOptional()
   @IsDateString()
  poDate?: Date;

  @IsOptional()
  remarks?: string;
}

export class UpdateSalesOrderDto {
  @IsOptional()
  @IsEnum(OrderTypeEnum)
  orderType?: OrderTypeEnum;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  customerId?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  orderDate?: Date;

  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @IsOptional()
  @IsEnum(PaymentModeEnum)
  paymentMode?: PaymentModeEnum;

  @IsOptional()
  @IsString()
  poNumber?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  poDate?: Date;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  salesUserId?: number;

  // ================= AMOUNT FIELDS =================
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  otherCharges?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalDiscount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  schemeAmount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  taxAmount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  grandTotal?: number;
}

export class DeleteSalesOrderDto {
  @Type(() => Number)
  @IsInt()
  soId: number;

}

export class GetSalesOrderByIdDto {
  @Type(() => Number)
  @IsInt()
  soId: number;
}


export class ListSalesOrderDto {
  /* ================= FILTERS ================= */
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  customerId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  salesUserId?: number;

  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fromDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  toDate?: Date;

  /* ================= PAGINATION ================= */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  /* ================= SORTING ================= */
  @IsOptional()
  @IsIn(['createdDate', 'orderDate'])
  sortBy?: 'createdDate' | 'orderDate' = 'createdDate';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}