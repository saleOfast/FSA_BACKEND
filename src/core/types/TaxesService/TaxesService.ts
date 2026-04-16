import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString,IsEnum,IsUUID,IsDateString,Min,Max } from "class-validator";

import {
  TaxClassification,
  TaxComponent,
  SupplyType,
  YesNo,
} from "../../types/Constent/common";
// import { Country } from "../../DB/Entities/country.entity";
// import { State } from "../../DB/Entities/state.entity";


export interface ITaxes {
  taxId:number;

  taxClassification: TaxClassification;
  hsnCode?: string;
  sacCode?: string;

  taxComponent: TaxComponent;
  taxPercentage: number;
  supplyType: SupplyType;

  country:number;
  state:number;

  isSez: YesNo;
  isExport: YesNo;
  isRcm: YesNo;
  isTaxable: YesNo;

  effectiveFrom: Date;
  effectiveTo?: Date;

  priority: number;
  isActive: YesNo;

  createdAt: Date;
  updatedAt: Date;
}

export class TaxesC {
  @IsNotEmpty()
  @IsEnum(TaxClassification)
  taxClassification: TaxClassification;

  @IsOptional()
  @IsString()
  hsnCode?: string;

  @IsOptional()
  @IsString()
  sacCode?: string;

  @IsNotEmpty()
  @IsEnum(TaxComponent)
  taxComponent: TaxComponent;
@IsNotEmpty()
@IsNumber()
@Min(0, { message: "Tax percentage cannot be negative" })
@Max(100, { message: "Tax percentage cannot exceed 100" })
taxPercentage: number;

  @IsNotEmpty()
  @IsEnum(SupplyType)
  supplyType: SupplyType;

  @IsNotEmpty()
  countryId:number;

  
  @IsNotEmpty()
  stateId:number;

  @IsOptional()
  @IsEnum(YesNo)
  isSez?: YesNo = YesNo.NO;

  @IsOptional()
  @IsEnum(YesNo)
  isExport?: YesNo = YesNo.NO;

  @IsOptional()
  @IsEnum(YesNo)
  isRcm?: YesNo = YesNo.NO;

  @IsOptional()
  @IsEnum(YesNo)
  isTaxable?: YesNo = YesNo.YES;

  @IsNotEmpty()
  @IsDateString()
  effectiveFrom: Date;

  @IsOptional()
  @IsDateString()
  effectiveTo?: Date;

  @IsOptional()
  @IsNumber()
  priority?: number = 1;

  @IsOptional()
  @IsEnum(YesNo)
  isActive?: YesNo = YesNo.YES;
}

export class TaxesR {
  @IsOptional()
  taxId:number;
}

export class TaxesU {
  @IsNotEmpty()
  taxId: number;

  @IsOptional()
  @IsEnum(TaxClassification)
  taxClassification?: TaxClassification;

  @IsOptional()
  @IsString()
  hsnCode?: string;

  @IsOptional()
  @IsString()
  sacCode?: string;

  @IsOptional()
  @IsEnum(TaxComponent)
  taxComponent?: TaxComponent;

  @IsOptional()
  @IsNumber()
  taxPercentage?: number;

  @IsOptional()
  @IsEnum(SupplyType)
  supplyType?: SupplyType;

  @IsNotEmpty()
  countryId:number;

   @IsNotEmpty()
  stateId:number;

  @IsOptional()
  @IsEnum(YesNo)
  isSez?: YesNo;

  @IsOptional()
  @IsEnum(YesNo)
  isExport?: YesNo;

  @IsOptional()
  @IsEnum(YesNo)
  isRcm?: YesNo;

  @IsOptional()
  @IsEnum(YesNo)
  isTaxable?: YesNo;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: Date;

  @IsOptional()
  @IsDateString()
  effectiveTo?: Date;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsEnum(YesNo)
  isActive?: YesNo;
}


export class TaxesD {
  @IsOptional()
  taxId: number;
}

export class getTaskById{
   
  @IsOptional()
  taxId:number;

}