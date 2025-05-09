import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface IDar {
    darId: number;
    activityType?: string;
    darDetails?: string;
    assignedTo?: number;
    activityRelated?: string;
    relatedTo?: string;
    date?: Date;
    subject?: string;
    nextActionOn?: string;
    status?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class DarC {
    @IsNotEmpty()
    @IsString()
    activityType: string;

    @IsOptional()
    @IsString()
    darDetails?: string;

    @IsOptional()
    @IsNumber()
    assignedTo?: number;

    @IsOptional()
    @IsString()
    activityRelated?: string;

    @IsOptional()
    @IsString()
    relatedTo?: string;

    @IsOptional()
    date?: Date;

    @IsOptional()
    @IsString()
    subject?: string;

    @IsOptional()
    @IsString()
    nextActionOn?: string;

    @IsOptional()
    @IsString()
    status?: string;
}

export class DarR {
    @IsNotEmpty()
    @IsNumber()
    darId: number;
}

export class DarU {
    @IsNotEmpty()
    @IsNumber()
    darId: number;

    @IsOptional()
    @IsString()
    activityType?: string;

    @IsOptional()
    @IsString()
    darDetails?: string;
}

export class DarD {
    @IsNotEmpty()
    @IsNumber()
    darId: number;
}
