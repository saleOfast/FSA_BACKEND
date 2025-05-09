import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class HeadLeaveC {
    @IsNotEmpty()
    @IsString()
    head_leave_name: string;

    @IsOptional()
    @IsString()
    head_leave_short_name: string;
}

export class HeadLeaveR {
    @IsOptional()
    @IsString()
    head_leave_id: string;
}

export class HeadLeaveD {
    @IsNotEmpty()
    @IsString()
    head_leave_id: string;
}

export class HeadLeaveU {
    @IsNotEmpty()
    @IsNumber()
    head_leave_id: number;

    @IsOptional()
    @IsString()
    head_leave_name: string;

    @IsOptional()
    @IsString()
    head_leave_short_name: string;

    @IsOptional()
    @IsBoolean()
    status: boolean;
}

export interface IHeadLeave {
    head_leave_id: number;
    head_leave_code: string;
    head_leave_short_name: string;
    head_leave_name: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
    leave_head_count: any
}
