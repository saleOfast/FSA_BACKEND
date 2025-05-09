import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface IGifts {
    giftId: number;
    productId: number;
    storeId: number;
    date: Date;
    addedBy: number;
    quantity: number;
    remarks: string;
    gift: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class GiftsC {
    @IsOptional()
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

    @IsNotEmpty()
    @IsString()
    gift: string;

    @IsOptional()
    @IsBoolean()
    status: boolean = true;

    @IsOptional()
    @IsNumber()
    storeId: number;
}

export class GiftsR {
    @IsNotEmpty()
    @IsNumber()
    giftId: number;

    @IsNotEmpty()
    @IsNumber()
    storeId: number;
}

export class GiftsU {
    @IsNotEmpty()
    @IsNumber()
    giftId: number;

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
    @IsString()
    gift?: string;

    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @IsOptional()
    @IsNumber()
    storeId: number;
}

export class GiftsD {
    @IsNotEmpty()
    @IsNumber()
    giftId: number;
}
