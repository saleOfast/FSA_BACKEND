import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { SessionTypeEnum } from "core/types/Constent/common";

export interface ISessions {
    sessionId: number;
    productId: number;
    storeId: number;
    date: Date;
    addedBy: number;
    duration: number;
    title: string;
    about: string;
    remarks: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class SessionsC {
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    date: Date;

    @IsNotEmpty()
    @IsNumber()
    addedBy: number;

    @IsOptional()
    duration: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    about: string;

    @IsNotEmpty()
    @IsString()
    remarks: string;

    @IsOptional()
    @IsBoolean()
    status: boolean = true;

    @IsNotEmpty()
    @IsNumber()
    storeId: number;
}

export class SessionsR {
    @IsNotEmpty()
    @IsNumber()
    sessionId: number;

    @IsNotEmpty()
    @IsNumber()
    storeId: number;
}

export class SessionsU {
    @IsNotEmpty()
    @IsNumber()
    sessionId: number;

    @IsOptional()
    @IsNumber()
    productId?: number;

    @IsOptional()
    date?: Date;

    @IsOptional()
    @IsNumber()
    addedBy?: number;

    @IsOptional()
    duration: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    about?: string;

    @IsOptional()
    @IsString()
    remarks?: string;

    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @IsOptional()
    @IsNumber()
    storeId: number;
}

export class SessionsD {
    @IsNotEmpty()
    @IsNumber()
    sessionId: number;
}
