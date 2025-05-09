import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface IBeat {
    beatId: number;
    beatName: string;
    store: number[];
    empId: number;
    area: string;
    country: string;
    state: string;
    district: string;
    city: string;
    IsEnable: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class CreateBeat {
    @IsOptional()
    @IsString()
    area: string;

    @IsNotEmpty()
    @IsNumber()
    salesRep: number;

    @IsNotEmpty()
    @IsString()
    beatName: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    district: string;

    @IsOptional()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsArray()
    store: number[];
}

export class UpdateBeat {
    @IsOptional()
    @IsString()
    area: string;

    @IsNotEmpty()
    @IsNumber()
    salesRep: number;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    district: string;

    @IsOptional()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    beatName: string;

    @IsNotEmpty()
    @IsArray()
    store: number[]

    @IsNotEmpty()
    @IsNumber()
    beatId: number
}

export class DeleteBeat {
    @IsNotEmpty()
    @IsString()
    beatId: string
}

export class GetBeat {
    @IsNotEmpty()
    @IsString()
    beatId: string
}

export class GetBeatOnVisit {
    @IsOptional()
    @IsBoolean()
    isVisit: boolean
}
