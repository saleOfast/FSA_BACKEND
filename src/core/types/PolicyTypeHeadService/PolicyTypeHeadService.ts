import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CallType, DurationEnum, ExpenseReportClaimType, VisitStatus } from "../Constent/common";
import { IStore } from "../StoreService/StoreService";


export interface IPolicyTypeHead {
    policy_type_id: number;
    policy_type_name: string;
    policy_id: number;
    from_date: Date;
    to_date: Date;
    claim_type: ExpenseReportClaimType;
    cost_per_km: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class PolicyTypeHeadC {
    @IsNotEmpty()
    @IsString()
    policy_type_name: string;

    @IsNotEmpty()
    @IsString()
    policy_id: number;

    @IsOptional()
    @IsString()
    from_date: Date;

    @IsOptional()
    @IsString()
    to_date: Date;

    @IsOptional()
    claim_type: ExpenseReportClaimType;

    @IsOptional()
    @IsString()
    cost_per_km: number;

    // @IsNotEmpty()
    // @IsString()
    // createdAt: Date;

    // @IsNotEmpty()
    // @IsString()
    // updatedAt: Date;

    // @IsNotEmpty()
    // @IsString()
    // deletedAt?: Date;
}

export class PolicyTypeHeadR {
    @IsOptional()
    @IsString()
    policy_id: string;

    @IsOptional()
    @IsString()
    policy_type_id: string;

    @IsOptional()
    from_date: any;

    @IsOptional()
    policy_type_name: any;
}


export class PolicyTypeHeadU {
    @IsOptional()
    policy_id: number;

    @IsNotEmpty()
    policy_type_id: number;

    @IsOptional()
    policy_type_name: string;

    @IsOptional()
    from_date: Date;

    @IsOptional()
    to_date: Date;

    @IsOptional()
    claim_type: ExpenseReportClaimType;

    @IsOptional()
    cost_per_km: number;
}

export class PolicyTypeHeadD {
    @IsNotEmpty()
    policy_type_id: number;

    @IsNotEmpty()
    @IsString()
    policy_id: number;

    @IsNotEmpty()
    @IsBoolean()
    is_travel: boolean;

    policy_code: string;
}