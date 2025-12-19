import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber
} from "class-validator";

export interface ICountry {
  countryId: number;
  countryName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class CreateCountry {
  @IsNotEmpty()
  @IsString()
  countryName!: string;
}

export class UpdateCountry {
  @IsNotEmpty()
  @IsNumber()
  countryId!: number;

  @IsNotEmpty()
  @IsString()
  countryName!: string;
}

export class GetCountryById {
  @IsNotEmpty()
  @IsString()
  countryId!: string;
}

export class DeleteCountryById {
  @IsNotEmpty()
  @IsString()
  countryId!: string;
}

export class CountryListFilter {
  @IsOptional()
  @IsString()
  search?: string;

  @IsNotEmpty()
  @IsString()
  pageNumber!: string;

  @IsNotEmpty()
  @IsString()
  pageSize!: string;
}

