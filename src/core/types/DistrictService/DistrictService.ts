import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber
} from "class-validator";

export interface IDistrict {
  districtId: number;
  districtName: string;
  stateId: number;
  countryId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateDistrict {
  @IsNotEmpty()
  @IsString()
  districtName!: string;

  @IsNotEmpty()
  @IsNumber()
  stateId!: number;

  @IsNotEmpty()
  @IsNumber()
  countryId!: number;
}

export class UpdateDistrict {
  @IsNotEmpty()
  @IsNumber()
  districtId!: number;

  @IsNotEmpty()
  @IsString()
  districtName!: string;

  @IsNotEmpty()
  @IsNumber()
  stateId!: number;

  @IsNotEmpty()
  @IsNumber()
  countryId!: number;
}

export class GetDistrictById {
  @IsNotEmpty()
  @IsString()
  districtId!: string;
}

export class DeleteDistrictById {
  @IsNotEmpty()
  @IsString()
  districtId!: string;
}

export class DistrictListFilter {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  stateId?: number;

  @IsOptional()
  @IsNumber()
  countryId?: number;

  @IsNotEmpty()
  @IsString()
  pageNumber!: string;

  @IsNotEmpty()
  @IsString()
  pageSize!: string;
}

