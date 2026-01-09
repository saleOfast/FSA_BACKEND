import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString,IsDateString,IsEnum } from "class-validator";
import { BeatStatus, BeatType, VisitFrequency ,BeatPriority, VisitDay} from "../../types/Constent/common";
import { Type } from "class-transformer";

export interface IBeat {
  beatId: number;                // Auto
  beatCode: string;              // Auto-generated (BT-S-001)
  beatName: string;

  customerId: number;            // Distributor
  warehouseId?: number;
  userId?: number;               // Assigned user / sales rep

  channel?: string;               // Derived from customer
  beatType: BeatType;

  countryId: number;
  stateId: number;
  districtId: number;

  area?: string;
  zone?: string;

  defaultVisitDays?: VisitDay[]; // Mon, Tue...
  visitFrequency: VisitFrequency;

  status: BeatStatus;
  priority: BeatPriority;

  startLat?: number;
  startLng?: number;
  endLat?: number;
  endLng?: number;

  plannedStartTime?: Date;
  plannedEndTime?: Date;

  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
    isDeleted: boolean;

    
}


export class CreateBeatDto {
  @IsNotEmpty()
  @IsString()
  beatName: string;

  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsOptional()
  @IsNumber()
  warehouseId?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsNotEmpty()
  @IsEnum(BeatType)
  beatType: BeatType;

  @IsNotEmpty()
  @IsEnum(VisitFrequency)
  visitFrequency: VisitFrequency;

  @IsOptional()
  @IsArray()
  @IsEnum(VisitDay, { each: true })
  defaultVisitDays?: VisitDay[];

  @IsNotEmpty()
  @IsEnum(BeatPriority)
  priority: BeatPriority;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsNotEmpty()
  @IsNumber()
  countryId: number;

  @IsNotEmpty()
  @IsNumber()
  stateId: number;

  @IsNotEmpty()
  @IsNumber()
  districtId: number;

  @IsOptional()
  @IsNumber()
  startLat?: number;

  @IsOptional()
  @IsNumber()
  startLng?: number;

  @IsOptional()
  @IsNumber()
  endLat?: number;

  @IsOptional()
  @IsNumber()
  endLng?: number;

  @IsOptional()
  @IsDateString()
  plannedStartTime?: Date;

  @IsOptional()
  @IsDateString()
  plannedEndTime?: Date;
}
export class UpdateBeatDto {
  @IsNotEmpty()
  @IsNumber()
  beatId: number;

  @IsOptional()
  @IsString()
  beatName?: string;

  @IsOptional()
  @IsEnum(BeatType)
  beatType?: BeatType;

  @IsOptional()
  @IsEnum(VisitFrequency)
  visitFrequency?: VisitFrequency;

  @IsOptional()
  @IsArray()
  @IsEnum(VisitDay, { each: true })
  defaultVisitDays?: VisitDay[];

  @IsOptional()
  @IsEnum(BeatPriority)
  priority?: BeatPriority;

  @IsOptional()
  @IsEnum(BeatStatus)
  status?: BeatStatus;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsNumber()
  startLat?: number;

  @IsOptional()
  @IsNumber()
  startLng?: number;

  @IsOptional()
  @IsNumber()
  endLat?: number;

  @IsOptional()
  @IsNumber()
  endLng?: number;

  @IsOptional()
  @IsDateString()
  plannedStartTime?: Date;

  @IsOptional()
  @IsDateString()
  plannedEndTime?: Date;
}


export class GetBeatDto {
  @IsNotEmpty()
    @IsNumber()
  @Type(() => Number) // important to convert from string param to number
  beatId: number; 
}




export class DeleteBeatDto {
   @IsNumber()
  @Type(() => Number) // important to convert from string param to number
  beatId: number; 
}


export class GetAllBeatDto {
  
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;

  /* ================= Filters ================= */

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  warehouseId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId?: number;

 @IsOptional()
@IsString()
channel?: string;

  @IsOptional()
  @IsEnum(BeatType)
  beatType?: BeatType;

  @IsOptional()
  @IsEnum(BeatStatus)
  status?: BeatStatus;

  @IsOptional()
  @IsEnum(BeatPriority)
  priority?: BeatPriority;

  /* ================= Location Filters ================= */

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  countryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  stateId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  districtId?: number;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  zone?: string;

  /* ================= Search ================= */

  @IsOptional()
  @IsString()
  search?: string; // beatName / beatCode
}


// export class GetBeatOnVisit {
//     @IsOptional()
//     @IsBoolean()
//     isVisit: boolean
// }
