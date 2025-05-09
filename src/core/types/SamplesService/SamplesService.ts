import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface ISamples {
    samplesId: number;
    productId: number;
    storeId: number;
    date: Date;
    addedBy: number;
    quantity: number;
    remarks: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class SamplesC {
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    date: Date;

    @IsNotEmpty()
    @IsNumber()
    addedBy: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsString()
    remarks: string;

    @IsOptional()
    @IsBoolean()
    status: boolean = true;

    @IsOptional()
    @IsNumber()
    storeId: number;
}

export class SamplesR {
    @IsNotEmpty()
    @IsNumber()
    samplesId: number;

    @IsNotEmpty()
    @IsNumber()
    storeId: number;
}

export class SamplesU {
    @IsNotEmpty()
    @IsNumber()
    samplesId: number;

    @IsOptional()
    @IsNumber()
    productId?: number;

    @IsOptional()
    date?: Date;

    @IsOptional()
    @IsNumber()
    addedBy?: number;

    @IsOptional()
    @IsNumber()
    quantity?: number;

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

export class SamplesD {
    @IsNotEmpty()
    @IsNumber()
    samplesId: number;
}
