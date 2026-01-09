import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Length,
} from "class-validator";
import { Type } from "class-transformer";
import { PreferredDays } from "../../types/Constent/common";
export interface IItemShippingAddress {
  // ================= IDs =================
  addressId?: number;
  customerId: number;

  shippingCountryId: number;
  shippingStateId: number;
  shippingDistrictId: number;

  // ================= Address Details =================
  shippingStreet: string;
  shippingCity: string;
  shippingPinCode: string;

  // ================= Delivery Details =================
  deliveryTimeSlot?: string; // HH:mm:ss
  preferredDays?: PreferredDays;

  // ================= Receiver Details =================
  receiverName: string;
  receiverContactNo: string;

  // ================= System Fields =================
  isDeleted?: boolean;
}export class CreateShippingAddressDto {

  // ================= Customer =================
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  customerId: number;

  // ================= Location =================
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  shippingCountryId: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  shippingStateId: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  shippingDistrictId: number;

  // ================= Address =================
  @IsString()
  @IsNotEmpty()
  shippingStreet: string;

  @IsString()
  @IsNotEmpty()
  shippingCity: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 10)
  shippingPinCode: string;

  // ================= Delivery =================
  @IsOptional()
  @IsString()
  // format: HH:mm or HH:mm:ss
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: "deliveryTimeSlot must be in HH:mm or HH:mm:ss format",
  })
  deliveryTimeSlot?: string;

  @IsOptional()
  @IsEnum(PreferredDays)
  preferredDays?: PreferredDays;

  // ================= Receiver =================
  @IsString()
  @IsNotEmpty()
  receiverName: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 15)
  receiverContactNo: string;
}

/* ================= UPDATE ================= */
export class UpdateShippingAddressDto {

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  addressId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  shippingCountryId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  shippingStateId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  shippingDistrictId?: number;

  @IsOptional()
  @IsString()
  shippingStreet?: string;

  @IsOptional()
  @IsString()
  shippingCity?: string;

  @IsOptional()
  @IsString()
  @Length(4, 10)
  shippingPinCode?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: "deliveryTimeSlot must be in HH:mm or HH:mm:ss format",
  })
  deliveryTimeSlot?: string;

  @IsOptional()
  @IsEnum(PreferredDays)
  preferredDays?: PreferredDays;

  @IsOptional()
  @IsString()
  receiverName?: string;

  @IsOptional()
  @IsString()
  @Length(8, 15)
  receiverContactNo?: string;

  // Soft delete support
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}

/* ================= GET BY ID ================= */
export class GetShippingAddressByIdDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  addressId: number;
}

/* ================= GET ALL (FILTERS) ================= */
export class GetAllShippingAddressDto {

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  shippingCountryId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  shippingStateId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  shippingDistrictId?: number;

  @IsOptional()
  @IsEnum(PreferredDays)
  preferredDays?: PreferredDays;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}

/* ================= DELETE ================= */
export class DeleteShippingAddressDto {
  @IsNumber()
  @Type(() => Number)
  addressId: number;
}