import { IsNotEmpty, IsOptional, IsNumber, IsString, IsDate, IsBoolean } from 'class-validator';

export class LeaveHeadCountC {
    @IsNotEmpty()
    @IsNumber()
    headLeaveId: number;

    @IsNotEmpty()
    @IsString()
    financialStart: Date;

    @IsNotEmpty()
    @IsString()
    financialEnd: Date;

    @IsOptional()
    @IsNumber()
    totalHeadLeave: number;

    @IsOptional()
    @IsBoolean()
    status: boolean;
}

export class LeaveHeadCountR {
    @IsOptional()
    @IsString()
    headLeaveCntId: string;

    @IsOptional()
    @IsString()
    headLeaveId: string;

    @IsOptional()
    year: any;

    @IsOptional()
    @IsString()
    mode: string;

    @IsOptional()
    leave_head_count: any;
}

export class LeaveHeadCountU {
    @IsNotEmpty()
    @IsNumber()
    headLeaveCntId: number;

    @IsOptional()
    @IsNumber()
    headLeaveId: number;

    @IsOptional()
    // @IsDate()
    financialStart: Date;

    @IsOptional()
    // @IsDate()
    financialEnd: Date;

    @IsOptional()
    @IsNumber()
    totalHeadLeave: number;

    @IsOptional()
    @IsBoolean()
    status: boolean;
}

export class LeaveHeadCountD {
    @IsNotEmpty()
    @IsNumber()
    headLeaveCntId: number;
}

export interface ILeaveHeadCount {
    headLeaveCntId: number;
    headLeaveId: number;
    financialStart: Date;
    financialEnd: Date;
    totalHeadLeave: number;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}
