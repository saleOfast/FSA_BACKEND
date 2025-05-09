import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface IDar {
    darId: number;
    activity_type?: string;
    // darDetails?: string;
    // assignedTo?: number;
    manager_id?: number;
    emp_id?: number;
    activity_related?: string;
    related_to?: string;
    date?: Date;
    subject?: string;
    next_action_on?: string;
    status?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export class DarC {
    @IsNotEmpty()
    @IsString()
    activity_type: string;

    @IsOptional()
    @IsString()
    activity_related?: string;

    @IsOptional()
    @IsString()
    related_to?: string;

    @IsOptional()
    date?: Date;

    @IsOptional()
    @IsString()
    subject?: string;

    @IsOptional()
    @IsString()
    next_action_on?: string;

    @IsOptional()
    @IsString()
    status?: string;
}

export class DarR {
    @IsNotEmpty()
    @IsNumber()
    dar_id: number;
}

export class DarU {
    @IsNotEmpty()
    @IsNumber()
    dar_id: number;

    @IsOptional()
    @IsString()
    activity_type?: string;

    // @IsOptional()
    // @IsString()
    // darDetails?: string;
}

export class DarD {
    @IsNotEmpty()
    @IsNumber()
    dar_id: number;
}
