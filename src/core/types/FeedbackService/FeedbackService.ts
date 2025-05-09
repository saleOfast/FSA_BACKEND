import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface IFeedback {
    feedbackId: number;
    productId: number;
    storeId: number;
    date: Date;
    addedBy: number;
    rating: number;
    remarks: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class FeedbackC {
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
    rating: number;

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

export class FeedbackR {
    @IsNotEmpty()
    @IsNumber()
    feedbackId: number;

    @IsNotEmpty()
    @IsNumber()
    storeId: number;
}

export class FeedbackU {
    @IsNotEmpty()
    @IsNumber()
    feedbackId: number;

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
    rating?: number;

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

export class FeedbackD {
    @IsNotEmpty()
    @IsNumber()
    feedbackId: number;
}
