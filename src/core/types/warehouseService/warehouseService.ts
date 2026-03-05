import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested,Length,IsBoolean,IsDateString,IsIn, IsUUID } from "class-validator";
import { Transform, Type } from "class-transformer";
import {WarehouseStatusEnum ,OwnershipTypeEnum,BusinessRoleEnum,franchise,SEZ,customerZone} from '../../../core/types/Constent/common' 

export class CreateWarehouseDto {
  @IsString()
  @Length(1, 30)
  warehouseCode: string;

  @IsString()
  @Length(1, 100)
  warehouseName: string;

  @IsOptional()
  @IsEnum(WarehouseStatusEnum)
  status?: WarehouseStatusEnum;

  @IsOptional()
  @IsBoolean()
  activeFlag?: boolean;

  @IsDateString()
  effectiveFrom: Date;

  @IsOptional()
  @IsDateString()
  effectiveTo?: Date;

  @IsEnum(OwnershipTypeEnum)
  ownershipType: OwnershipTypeEnum;

  @IsEnum(BusinessRoleEnum)
  businessRole: BusinessRoleEnum;

  @IsOptional()
  @IsNumber()
  legalEntityId:number;


  @IsOptional()
  @IsNumber()
  parentPartnerId: number;

  @IsEnum(franchise)
  franchise: franchise;

  // Shipping Address (Relations via IDs)
  
  @IsNotEmpty()
  shippingCountryId:number;

  @IsNotEmpty()
  shippingStateId:number ;

  @IsNotEmpty()
  shippingDistrictId:number;

  @IsString()
  shippingStreet: string;

  @IsString()
  @Length(1, 100)
  shippingCity: string;

  @IsString()
  @Length(1, 20)
  shippingPinCode: string;

  // Tax / Compliance
  @IsOptional()
  @IsString()
  @Length(1, 20)
  gstNo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  vatRegistrationNo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  taxRegistrationType?: string;

  @IsEnum(SEZ)
  sez: SEZ;

  @IsEnum(customerZone)
  customZone: customerZone;

  // Operational Flags
  @IsOptional()
  @IsBoolean()
  allowsSales?: boolean;

  @IsOptional()
  @IsBoolean()
  allowsPurchase?: boolean;

  @IsOptional()
  @IsBoolean()
  allowsReturns?: boolean;

  @IsOptional()
  @IsBoolean()
  supportsBatch?: boolean;

  @IsOptional()
  @IsBoolean()
  supportsExpiry?: boolean;

  @IsOptional()
  @IsBoolean()
  supportsSerial?: boolean;

  @IsOptional()
  @IsBoolean()
  temperatureControlled?: boolean;

  @IsOptional()
  @IsBoolean()
  crossDockingFlag?: boolean;

  @IsOptional()
  @IsBoolean()
  consignmentFlag?: boolean;
}

export class GetWarehouseById{
  @IsString()
  warehouseId:string;
}

export class GetWarehouseList {
  /* =======================
     BASIC IDENTIFIERS
  ======================= */

  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @IsOptional()
  @IsString()
  warehouseCode?: string;

  @IsOptional()
  @IsString()
  warehouseName?: string;

  /* =======================
     STATUS & FLAGS
  ======================= */

  @IsOptional()
  @IsEnum(WarehouseStatusEnum)
  status?: WarehouseStatusEnum;

  @IsOptional()
  @IsBoolean()
  activeFlag?: boolean;

  @IsOptional()
  @IsEnum(OwnershipTypeEnum)
  ownershipType?: OwnershipTypeEnum;

  @IsOptional()
  @IsEnum(BusinessRoleEnum)
  businessRole?: BusinessRoleEnum;

  @IsOptional()
  @IsEnum(franchise)
  franchise?: franchise;

  @IsOptional()
  @IsEnum(SEZ)
  sez?: SEZ;

  @IsOptional()
  @IsEnum(customerZone)
  customZone?: customerZone;

  /* =======================
     LOCATION FILTERS (IDs)
  ======================= */

  @IsOptional()
  @IsNumber()
  shippingCountryId?: number;

  @IsOptional()
  @IsNumber()
  shippingStateId?: number;

  @IsOptional()
  @IsNumber()
  shippingDistrictId?: number;



  @IsOptional()
  @IsString()
  search?: string;



  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean = false;





  @IsOptional()
  @IsIn(["createdAt", "warehouseName", "warehouseCode"])
  sortBy?: "createdAt" | "warehouseName" | "warehouseCode" = "createdAt";

  @IsOptional()
  @IsIn(["ASC", "DESC"])
  sortOrder?: "ASC" | "DESC" = "DESC";
}

export class DeleteWarehouseById{
  @IsString()
  warehouseId:string;
}

export class UpdateWarehouse{
@IsString()
  warehouseId: string;
  
  @IsOptional()
  @IsString()
  @Length(1, 30)
  warehouseCode?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  warehouseName?: string;

  @IsOptional()
  @IsEnum(WarehouseStatusEnum)
  status?: WarehouseStatusEnum;

  @IsOptional()
  @IsBoolean()
  activeFlag?: boolean;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: Date;

  @IsOptional()
  @IsDateString()
  effectiveTo?: Date;

  @IsOptional()
  @IsEnum(OwnershipTypeEnum)
  ownershipType?: OwnershipTypeEnum;

  @IsOptional()
  @IsEnum(BusinessRoleEnum)
  businessRole?: BusinessRoleEnum;

  @IsOptional()
  @IsNumber()
  legalEntityId?: number;

  @IsOptional()
  @IsNumber()
  parentPartnerId?: number;

  @IsOptional()
  @IsEnum(franchise)
  franchise?: franchise;

  @IsOptional()
  @IsNumber()
  shippingCountryId?: number;

  @IsOptional()
  @IsNumber()
  shippingStateId?: number;

  @IsOptional()
  @IsNumber()
  shippingDistrictId?: number;

  @IsOptional()
  @IsString()
  shippingStreet?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  shippingCity?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  shippingPinCode?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  gstNo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  vatRegistrationNo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  taxRegistrationType?: string;

  @IsOptional()
  @IsEnum(SEZ)
  sez?: SEZ;

  @IsOptional()
  @IsEnum(customerZone)
  customZone?: customerZone;


  @IsOptional()
  @IsBoolean()
  allowsSales?: boolean;

  @IsOptional()
  @IsBoolean()
  allowsPurchase?: boolean;

  @IsOptional()
  @IsBoolean()
  allowsReturns?: boolean;

  @IsOptional()
  @IsBoolean()
  supportsBatch?: boolean;

  @IsOptional()
  @IsBoolean()
  supportsExpiry?: boolean;

  @IsOptional()
  @IsBoolean()
  supportsSerial?: boolean;

  @IsOptional()
  @IsBoolean()
  temperatureControlled?: boolean;

  @IsOptional()
  @IsBoolean()
  crossDockingFlag?: boolean;

  @IsOptional()
  @IsBoolean()
  consignmentFlag?: boolean;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}

