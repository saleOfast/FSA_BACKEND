import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface ICompetitorBrand {
    CompetitorBrandId: number;
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
}

export class UpdateBrand {
    @IsOptional()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsNumber()
    CompetitorBrandId: number
}

export class DeleteBrand {
    @IsNotEmpty()
    @IsString()
    CompetitorBrandId: string
}

export class GetBrand {
    @IsNotEmpty()
    @IsString()
    CompetitorBrandId: string
}