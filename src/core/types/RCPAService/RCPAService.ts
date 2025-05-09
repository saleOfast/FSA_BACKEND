import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { StockLevelComparison } from "../../../core/types/Constent/common";

export interface IRCPA {
    rcpaId: number;
    productId: number;
    storeId?: number;
    addedBy: number;
    quantitySold?: number;
    stockLevel?: number;
    stockLevelCompetitor?: number;
    competitorBrandId?: number;
    priceComparison: StockLevelComparison;
    PromotionalOffers?: string;
    deliveryIssues?: boolean;
    ServicesProvided?: string;
    rating: number;
    remarks?: string;
    date?: Date;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class RCPAC {
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsOptional()
    @IsNumber()
    storeId: number;

    @IsNotEmpty()
    @IsNumber()
    addedBy: number;

    @IsOptional()
    @IsNumber()
    quantitySold?: number;

    @IsOptional()
    @IsNumber()
    stockLevel?: number;

    @IsOptional()
    @IsNumber()
    stockLevelCompetitor?: number;

    @IsOptional()
    @IsNumber()
    competitorBrandId?: number;

    @IsNotEmpty()
    @IsString()
    priceComparison: StockLevelComparison;

    @IsOptional()
    @IsString()
    PromotionalOffers?: string;

    @IsOptional()
    @IsBoolean()
    deliveryIssues?: boolean;

    @IsOptional()
    @IsString()
    ServicesProvided?: string;

    @IsNotEmpty()
    @IsNumber()
    rating: number;

    @IsOptional()
    @IsString()
    remarks?: string;

    @IsOptional()
    date?: Date;

    @IsOptional()
    @IsBoolean()
    status?: boolean = true;
}

export class RCPAR {
    @IsNotEmpty()
    @IsNumber()
    rcpaId: number;

    @IsOptional()
    @IsNumber()
    storeId?: number;
}

export class RCPAU {
    @IsNotEmpty()
    @IsNumber()
    rcpaId: number;

    @IsOptional()
    @IsNumber()
    productId?: number;

    @IsOptional()
    @IsNumber()
    storeId?: number;

    @IsOptional()
    @IsNumber()
    addedBy?: number;

    @IsOptional()
    @IsNumber()
    quantitySold?: number;

    @IsOptional()
    @IsNumber()
    stockLevel?: number;

    @IsOptional()
    @IsNumber()
    stockLevelCompetitor?: number;

    @IsOptional()
    @IsNumber()
    competitorBrandId?: number;

    @IsOptional()
    @IsString()
    priceComparison?: StockLevelComparison;

    @IsOptional()
    @IsString()
    PromotionalOffers?: string;

    @IsOptional()
    @IsBoolean()
    deliveryIssues?: boolean;

    @IsOptional()
    @IsString()
    ServicesProvided?: string;

    @IsOptional()
    @IsNumber()
    rating?: number;

    @IsOptional()
    @IsString()
    remarks?: string;

    @IsOptional()
    date?: Date;

    @IsOptional()
    @IsBoolean()
    status?: boolean;
}

export class RCPAD {
    @IsNotEmpty()
    @IsNumber()
    rcpaId: number;
}
