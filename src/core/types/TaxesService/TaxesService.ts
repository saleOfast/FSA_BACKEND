import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface ITaxes {
    taxId: number;
    taxName: string;
    taxAmount: number;
    description: string;
    addedBy: number;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class TaxesC {
    @IsNotEmpty()
    @IsString()
    taxName: string;

    @IsNotEmpty()
    @IsNumber()
    taxAmount: number;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    addedBy: number;

    @IsOptional()
    @IsBoolean()
    status: boolean = true;
}

export class TaxesR {
    @IsNotEmpty()
    @IsNumber()
    taxId: number;
}

export class TaxesU {
    @IsNotEmpty()
    @IsNumber()
    taxId: number;

    @IsOptional()
    @IsString()
    taxName?: string;

    @IsOptional()
    @IsNumber()
    taxAmount?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    addedBy?: number;

    @IsOptional()
    @IsBoolean()
    status?: boolean;
}

export class TaxesD {
    @IsNotEmpty()
    @IsNumber()
    taxId: number;
}
