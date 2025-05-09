import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CallType, DurationEnum, VisitStatus } from "../Constent/common";
import { IStore } from "../StoreService/StoreService";

export interface IPolicyHead {
    policy_id: number;
    policy_name: string
    is_travel?: boolean
    policy_code: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
}

export class PolicyHeadC {
    @IsNotEmpty()
    @IsString()
    policy_name: string;

    @IsNotEmpty()
    @IsBoolean()
    is_travel: boolean;

    policy_code: string;
}

export class PolicyHeadR {
    @IsNotEmpty()
    @IsString()
    policy_id: number;
}

export class PolicyHeadU {
    @IsNotEmpty()
    @IsString()
    policy_id: number;

    @IsNotEmpty()
    @IsBoolean()
    is_travel: boolean;

    policy_name: string;
}

export class PolicyHeadD {
    @IsNotEmpty()
    @IsString()
    policy_id: number;

    @IsNotEmpty()
    @IsBoolean()
    is_travel: boolean;

    policy_code: string;
}
