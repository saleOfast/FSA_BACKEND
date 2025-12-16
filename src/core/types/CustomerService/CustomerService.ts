import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEmail,
  IsArray,
  IsDateString,
  IsBoolean,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { IUserReference } from "../Profile/Profile.types";

export interface ICustomer {
  customerId: number;
  parentId?: number;
  customerName: string;
  customerType: string;
  channelType: string;
  phone: string;
  email?: string;
  accountOwnerId?: number;
  beatRouteId?: number;
  category?: string;
  // Billing Address
  billingCountry?: string;
  billingState?: string;
  billingDistrict?: string;
  billingStreet?: string;
  billingCity?: string;
  billingPinCode?: string;
  // Shipping Address
  shippingCountry: string;
  shippingState: string;
  shippingDistrict: string;
  shippingStreet: string;
  shippingCity: string;
  shippingPinCode: string;
  // Delivery Details
  deliveryTimeSlot: string;
  preferredDays?: string[];
  // KYC Details
  gstCertificate?: string;
  gstNo?: string;
  businessLicense?: string;
  panDetail?: string;
  tanDetail?: string;
  agreementSigned?: string;
  cinNo?: string;
  // Bank Details
  bankName?: string;
  bankAccountNo?: string;
  ifscCode?: string;
  micrCode?: string;
  modeOfPayment?: string;
  currency?: string;
  // Financial & Transactional Data
  paymentTerms: string;
  creditLimit?: number;
  openingBalance?: number;
  lastPaymentDate?: Date;
  averageMonthlySales?: number;
  outstandingAmount?: number;
  discountEligibility?: string;
  // Audit Fields
  createdBy: IUserReference;
  createdDate: Date;
  lastModifiedBy?: IUserReference;
  lastModifiedDate?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

export class CreateCustomer {
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsNotEmpty()
  @IsString()
  customerName!: string;

  @IsNotEmpty()
  @IsString()
  customerType!: string; // Retailer / Distributor / Wholesaler / Chain Store

  @IsNotEmpty()
  @IsString()
  channelType!: string; // GT, MT, Ecom, Horeca, retailer

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumber()
  accountOwnerId?: number;

  @IsOptional()
  @IsNumber()
  beatRouteId?: number;

  @IsOptional()
  @IsString()
  category?: string; // A, A++, B, B++

  // Billing Address
  @IsOptional()
  @IsString()
  billingCountry?: string;

  @IsOptional()
  @IsString()
  billingState?: string;

  @IsOptional()
  @IsString()
  billingDistrict?: string;

  @IsOptional()
  @IsString()
  billingStreet?: string;

  @IsOptional()
  @IsString()
  billingCity?: string;

  @IsOptional()
  @IsString()
  billingPinCode?: string;

  // Shipping Address
  @IsNotEmpty()
  @IsString()
  shippingCountry!: string;

  @IsNotEmpty()
  @IsString()
  shippingState!: string;

  @IsNotEmpty()
  @IsString()
  shippingDistrict!: string;

  @IsNotEmpty()
  @IsString()
  shippingStreet!: string;

  @IsNotEmpty()
  @IsString()
  shippingCity!: string;

  @IsNotEmpty()
  @IsString()
  shippingPinCode!: string;

  // Delivery Details
  @IsNotEmpty()
  @IsString()
  deliveryTimeSlot!: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  preferredDays!: string[]; // Sun, Mon, Tues, etc.

  // KYC Details
  @IsOptional()
  @IsString()
  gstCertificate?: string; // Yes/No

  @IsOptional()
  @IsString()
  gstNo?: string;

  @IsOptional()
  @IsString()
  businessLicense?: string;

  @IsOptional()
  @IsString()
  panDetail?: string;

  @IsOptional()
  @IsString()
  tanDetail?: string;

  @IsOptional()
  @IsString()
  agreementSigned?: string; // Yes/No

  @IsOptional()
  @IsString()
  cinNo?: string;

  // Bank Details
  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  bankAccountNo?: string;

  @IsOptional()
  @IsString()
  ifscCode?: string;

  @IsOptional()
  @IsString()
  micrCode?: string;

  @IsOptional()
  @IsString()
  modeOfPayment?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  // Financial & Transactional Data
  @IsNotEmpty()
  @IsString()
  paymentTerms!: string;

  @IsOptional()
  @IsNumber()
  creditLimit?: number;

  @IsOptional()
  @IsNumber()
  openingBalance?: number;

  @IsOptional()
  @IsDateString()
  lastPaymentDate?: string;

  @IsOptional()
  @IsNumber()
  averageMonthlySales?: number;

  @IsOptional()
  @IsNumber()
  outstandingAmount?: number;

  @IsOptional()
  @IsString()
  discountEligibility?: string;
}

export class UpdateCustomer {
  @IsNotEmpty()
  @IsNumber()
  customerId!: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsNotEmpty()
  @IsString()
  customerName!: string;

  @IsNotEmpty()
  @IsString()
  customerType!: string;

  @IsNotEmpty()
  @IsString()
  channelType!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumber()
  accountOwnerId?: number;

  @IsOptional()
  @IsNumber()
  beatRouteId?: number;

  @IsOptional()
  @IsString()
  category?: string;

  // Billing Address
  @IsOptional()
  @IsString()
  billingCountry?: string;

  @IsOptional()
  @IsString()
  billingState?: string;

  @IsOptional()
  @IsString()
  billingDistrict?: string;

  @IsOptional()
  @IsString()
  billingStreet?: string;

  @IsOptional()
  @IsString()
  billingCity?: string;

  @IsOptional()
  @IsString()
  billingPinCode?: string;

  // Shipping Address
  @IsNotEmpty()
  @IsString()
  shippingCountry!: string;

  @IsNotEmpty()
  @IsString()
  shippingState!: string;

  @IsNotEmpty()
  @IsString()
  shippingDistrict!: string;

  @IsNotEmpty()
  @IsString()
  shippingStreet!: string;

  @IsNotEmpty()
  @IsString()
  shippingCity!: string;

  @IsNotEmpty()
  @IsString()
  shippingPinCode!: string;

  // Delivery Details
  @IsNotEmpty()
  @IsString()
  deliveryTimeSlot!: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  preferredDays!: string[];

  // KYC Details
  @IsOptional()
  @IsString()
  gstCertificate?: string;

  @IsOptional()
  @IsString()
  gstNo?: string;

  @IsOptional()
  @IsString()
  businessLicense?: string;

  @IsOptional()
  @IsString()
  panDetail?: string;

  @IsOptional()
  @IsString()
  tanDetail?: string;

  @IsOptional()
  @IsString()
  agreementSigned?: string;

  @IsOptional()
  @IsString()
  cinNo?: string;

  // Bank Details
  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  bankAccountNo?: string;

  @IsOptional()
  @IsString()
  ifscCode?: string;

  @IsOptional()
  @IsString()
  micrCode?: string;

  @IsOptional()
  @IsString()
  modeOfPayment?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  // Financial & Transactional Data
  @IsNotEmpty()
  @IsString()
  paymentTerms!: string;

  @IsOptional()
  @IsNumber()
  creditLimit?: number;

  @IsOptional()
  @IsNumber()
  openingBalance?: number;

  @IsOptional()
  @IsDateString()
  lastPaymentDate?: string;

  @IsOptional()
  @IsNumber()
  averageMonthlySales?: number;

  @IsOptional()
  @IsNumber()
  outstandingAmount?: number;

  @IsOptional()
  @IsString()
  discountEligibility?: string;
}

export class GetCustomerById {
  @IsNotEmpty()
  @IsString()
  customerId!: string;
}

export class DeleteCustomerById {
  @IsNotEmpty()
  @IsString()
  customerId!: string;
}

export class CustomerListFilter {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  customerType?: string;

  @IsOptional()
  @IsString()
  channelType?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNotEmpty()
  @IsString()
  pageNumber!: string;

  @IsNotEmpty()
  @IsString()
  pageSize!: string;
}

