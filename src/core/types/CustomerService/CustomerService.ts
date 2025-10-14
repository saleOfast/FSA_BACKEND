import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEmail,
  Length,
  IsEnum,
  IsDateString,
  ValidateNested,
  isDate
} from "class-validator";
import { Type } from "class-transformer";

/** ─────────────────────────────
 * Address reusable type
 * ───────────────────────────── */
export interface IAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

/** ─────────────────────────────
 * Main Customer interface
 * ───────────────────────────── */
export interface ICustomer {
  id:string;                        // Unique UUID
  customerName: string;
  customerCode: string;
  contactPersonName: string;
  contactNumber: string;
  email: string;

  shippingAddress?: IAddress;         
  billingAddress?: IAddress;

  regionOrTerritory?: string;         
  distributorType?: "Dealer" | "Distributor" | "Retailer" | "Super Stockes";
  taxIdOrGSTIN?: string;
  creditLimit?: number;               
  paymentMethod?: "Cash" | "Credit" | "Online" | "Other";
  status?: "Active" | "Inactive";
  registrationDate?: Date;
  salesManagerId?: string;            
  distributorCategory?: "Primary" | "Secondary";
  performanceTarget?: number;         
  remarks?: string;

  createdDate: Date;
  createdBy: string;
  modifiedDate: Date;
  modifiedBy: string;
}

/** ─────────────────────────────
 * ENUMS for pick-list fields
 * ───────────────────────────── */
export enum DistributorType {
  Dealer = "Dealer",
  Distributor = "Distributor",
  Retailer = "Retailer",
  SuperStockes = "Super Stockes",
}

export enum PaymentMethod {
  Cash = "Cash",
  Credit = "Credit",
  Online = "Online",
  Other = "Other",
}

export enum Status {
  Active = "Active",
  Inactive = "Inactive",
}

export enum DistributorCategory {
  Primary = "Primary",
  Secondary = "Secondary",
}

/** ─────────────────────────────
 * DTOs
 * ───────────────────────────── */
export class AddressDto {
  @IsOptional()
  @IsString()
  @Length(0, 200)
  street?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  state?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  postalCode?: string;
}

export class CreateCustomerDto {
  @IsOptional()
  beatId:number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  customerName: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  customerCode: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  contactPersonName: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 13)
  contactNumber: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress?: AddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress?: AddressDto;

  @IsOptional()
  @IsString()
  regionOrTerritory?: string;

  @IsOptional()
  @IsEnum(DistributorType)
  distributorType?: DistributorType;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  taxIdOrGSTIN?: string;

  @IsOptional()
  @IsNumber()
  creditLimit?: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsDateString()
  registrationDate?: string;

  @IsOptional()
  @IsString()
  salesManagerId?: string;

  @IsOptional()
  @IsEnum(DistributorCategory)
  distributorCategory?: DistributorCategory;

  @IsOptional()
  @IsNumber()
  performanceTarget?: number;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  remarks?: string;
}

export class UpdateCustomerDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  customerName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  customerCode?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  contactPersonName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 13)
  contactNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress?: AddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress?: AddressDto;

  @IsOptional()
  @IsString()
  regionOrTerritory?: string;

  @IsOptional()
  @IsEnum(DistributorType)
  distributorType?: DistributorType;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  taxIdOrGSTIN?: string;

  @IsOptional()
  @IsNumber()
  creditLimit?: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsDateString()
  registrationDate?: string;

  @IsOptional()
  @IsString()
  salesManagerId?: string;

  @IsOptional()
  @IsEnum(DistributorCategory)
  distributorCategory?: DistributorCategory;

  @IsOptional()
  @IsNumber()
  performanceTarget?: number;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  remarks?: string;
}

export class GetCustomerByIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class ListCustomersDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerCode?: string;

  @IsOptional()
  @IsString()
  contactPersonName?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsEmail()
  emailAddress?: string;

  @IsOptional()
  shippingAddress?: AddressDto;

  @IsOptional()
  billingAddress?: AddressDto;

  @IsOptional()
  @IsString()
  regionOrTerritory?: string; // Reference from Beat plan

  @IsOptional()
  @IsEnum(DistributorType)
  distributorType?: DistributorType;

  @IsOptional()
  @IsString()
  taxIdOrGSTIN?: string;

  @IsOptional()
  @IsNumber()
  creditLimit?: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

 @IsOptional()
  @IsDateString()
  registrationDate?: string;

  @IsOptional()
  @IsString()
  salesManager?: string; // Reference from User table

  @IsOptional()
  @IsEnum(DistributorCategory)
  distributorCategory?: DistributorCategory;

  @IsOptional()
  @IsNumber()
  salesVolume?: number;

  @IsOptional()
  @IsNumber()
  targetAchievement?: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  // @IsOptional()
  // @Type(() => Date)
  // @IsDate()
  // createdDate?: Date;

  @IsOptional()
  @IsString()
  createdBy?: string;

  // @IsOptional()
  // @Type(() => Date)
  // @IsDate()
  // modifiedDate?: Date;

  @IsOptional()
  @IsString()
  modifiedBy?: string;

  // Pagination & search
  // @IsOptional()
  // @Type(() => Number)
  // @IsNumber()
  // pageNumber?: number;

  // @IsOptional()
  // @Type(() => Number)
  // @IsNumber()
  // pageSize?: number;

  // @IsOptional()
  // @IsString()
  // search?: string; // Generic text search
}

export class deleteCustomerDto{
      @IsNotEmpty()
  @IsString()
  id: string;
}

export class GetStoresByStatusDto {
  @IsOptional()
  @IsString()
  status?: "Active" | "Inactive";
}        
