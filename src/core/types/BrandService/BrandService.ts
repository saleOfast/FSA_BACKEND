import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface IBrand {
    brandId: number;
    empId: number;
    name: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date
}


export class CreateBrand {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    isCompetitor: number;
}

export class UpdateBrand {
    @IsOptional()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsNumber()
    brandId: number

    @IsOptional()
    isCompetitor: number;
}

export class DeleteBrand {
    @IsNotEmpty()
    @IsString()
    brandId: string

    @IsOptional()
    isCompetitor: number;
}

export class GetBrand {
    @IsNotEmpty()
    @IsString()
    brandId: string

    @IsOptional()
    isCompetitor: number;
}

export class GetBrandList {
    @IsOptional()
    isCompetitor: number;
}