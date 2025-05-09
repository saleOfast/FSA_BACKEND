import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MarkAttendance {
    @IsOptional()
    @IsDateString()
    inTime?: Date;

    @IsOptional()
    @IsDateString()
    outTime?: Date;
}

export interface IAttendance {
    attendanceId: number;
    empId: number;
    checkIn: Date;
    checkOut: Date | null;
    duration: string;
    createdAt: Date;
    updatedAt: Date;
}

export class GetAttendanceList {
    @IsNotEmpty()
    @IsString()
    empId: string
}

export class ReportFilter {
    @IsOptional()
    @IsArray()
    timePeriod: string
}

export class monthlyFilter {
    @IsOptional()
    @IsString()
    timePeriod: string
}