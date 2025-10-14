import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";


  export interface IPosm {
  posmId: number; // auto-generated serial number
  posmCode: string;
  posmName: string;
  posmType: string;
  quantityAllocated: number;
  quantityDistributed: number;
  quantityReturned?: number;
  
  distributorId?: number; // FK reference to Distributor
  outletId: string;
  campaignId: string;

  startDate: string; // stored as 'YYYY-MM-DD'
  endDate?: string;

  status: "Active" | "Inactive" | "Returned" | "Lost";

  assignedTo?: string;
  remarks?: string;

  createdDate: Date;
  lastUpdatedDate: Date;
}


export class createPosmDto{
      @IsNotEmpty()
     @IsString()
     posmCode:string;

     @IsNotEmpty()
     @IsString()
     posmName:string;


      @IsNotEmpty()
      @IsString()
      posmType: string;

      @IsNotEmpty()
  @IsNumber()
  quantityAllocated: number;

    @IsNotEmpty()
  @IsNumber()
  quantityDistributed: number;

    @IsOptional()
  @IsNumber()
  quantityReturned?: number;

   
  @IsOptional()
  @IsNumber()
  distributorId?: number;

  
  @IsNotEmpty()
  @IsString()
  outletId: string;

    @IsNotEmpty()
  @IsString()
  campaignId: string;

   @IsNotEmpty()
  @IsString()
  startDate: string; // 'YYYY-MM-DD'


    @IsOptional()
  @IsString()
  endDate?: string;

    @IsNotEmpty()
  @IsEnum(["Active", "Inactive", "Returned", "Lost"])
  status: "Active" | "Inactive" | "Returned" | "Lost";

    @IsOptional()
  @IsString()
  assignedTo?: string;

}
  export class updatePosmDto {
  @IsOptional()
  @IsString()
  posmCode?: string;

  @IsOptional()
  @IsString()
  posmName?: string;

  @IsOptional()
  @IsString()
  posmType?: string;

  @IsOptional()
  @IsNumber()
  quantityAllocated?: number;

  @IsOptional()
  @IsNumber()
  quantityDistributed?: number;

  @IsOptional()
  @IsNumber()
  quantityReturned?: number;

  @IsOptional()
  @IsNumber()
  distributorId?: number;

  @IsOptional()
  @IsString()
  outletId?: string;

  @IsOptional()
  @IsString()
  campaignId?: string;

  @IsOptional()
  @IsString()
  startDate?: string; // 'YYYY-MM-DD'

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsEnum(["Active", "Inactive", "Returned", "Lost"])
  status?: "Active" | "Inactive" | "Returned" | "Lost";

  @IsOptional()
  @IsString()
  assignedTo?: string;

}

export class deletePosmDto{
  @IsNotEmpty()
  @IsNumber()
  posmId:number

}

export class getPosmByIdDto{
@IsOptional()
@IsNumber()
posmId:number;

@IsOptional()
@IsString()
posmCode:string;


@IsOptional()
@IsString()
posmName:string;

}

export class GetPosmListDto {
  @IsOptional()
  @IsNumber({}, { message: "posmId must be a number" })
  posmId?: number;

  @IsOptional()
  @IsString({ message: "posmCode must be a string" })
  posmCode?: string;

  @IsOptional()
  @IsString({ message: "posmName must be a string" })
  posmName?: string;

  @IsOptional()
  @IsString({ message: "posmType must be a string" })
  posmType?: string;

  @IsOptional()
  @IsNumber({}, { message: "quantityAllocated must be a number" })
  quantityAllocated?: number;

  @IsOptional()
  @IsNumber({}, { message: "quantityDistributed must be a number" })
  quantityDistributed?: number;

  @IsOptional()
  @IsNumber({}, { message: "quantityReturned must be a number" })
  quantityReturned?: number;

  @IsOptional()
  @IsNumber({}, { message: "distributorId must be a number" })
  distributorId?: number;

  @IsOptional()
  @IsString({ message: "outletId must be a string" })
  outletId?: string;

  @IsOptional()
  @IsString({ message: "campaignId must be a string" })
  campaignId?: string;

  @IsOptional()
  @IsString({ message: "startDate must be a string in 'YYYY-MM-DD' format" })
  startDate?: string;

  @IsOptional()
  @IsString({ message: "endDate must be a string in 'YYYY-MM-DD' format" })
  endDate?: string;

  @IsOptional()
  @IsEnum(["Active", "Inactive", "Returned", "Lost"], { message: "Invalid status" })
  status?: "Active" | "Inactive" | "Returned" | "Lost";

  @IsOptional()
  @IsString({ message: "assignedTo must be a string" })
  assignedTo?: string;
}

