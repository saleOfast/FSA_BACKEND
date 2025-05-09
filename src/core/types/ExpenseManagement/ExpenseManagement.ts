import { IsArray, IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CallType, DurationEnum, ExpenseReportClaimType, ExpenseReportStatus, VisitStatus } from "../Constent/common";
import { float } from "aws-sdk/clients/cloudfront";

export interface IExpenseManagement {
    expence_id: number;
    claim_type: ExpenseReportClaimType;
    from_date: Date;
    to_date: Date;
    policy_id: number;
    policy_type_id: number;
    manager_id: number;
    emp_id: number;
    from_location: string;
    to_location: string;
    kms: number;
    total_expence: number;
    detail: string;
    remark: string;
    report_status: ExpenseReportStatus;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}

export class ExpenseC {
    @IsNotEmpty()
    @IsNumber()
    policy_id: number;

    @IsOptional()
    @IsNumber()
    policy_type_id: number;

    @IsNotEmpty()
    @IsNumber()
    total_expence: float;

    @IsOptional()
    @IsDateString()
    from_date: Date;

    @IsOptional()
    @IsDateString()
    to_date: Date;

    @IsOptional()
    @IsString()
    from_location: string;

    @IsOptional()
    @IsString()
    to_location: string;

    @IsOptional()
    @IsNumber()
    kms: number;

    @IsOptional()
    @IsString()
    detail: string;

    @IsOptional()
    @IsString()
    remark: string;

}

export class ExpenseR {
    @IsOptional()
    @IsNumber()
    expence_id: number;

    @IsOptional()
    @IsNumber()
    policy_id: number;
}

export class ExpenseU {
    @IsNotEmpty()
    @IsNumber()
    expence_id: number;
    
    @IsOptional()
    @IsString()
    remark: string;

    @IsNotEmpty()
    @IsString()
    report_status: ExpenseReportStatus;
}

export class ExpenseD {
    @IsNotEmpty()
    @IsNumber()
    policy_id: number;
}