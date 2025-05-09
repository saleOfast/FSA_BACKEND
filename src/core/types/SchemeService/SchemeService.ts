import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator"

export interface IScheme {
    id: number,
    empId: number;
    name: string,
    month: number,
    year: number,
    file: string,
    isEnable: boolean;
    isDeleted: boolean;
    createdAt: Date,
    updatedAt: Date
}

export class CreateScheme {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsNumber()
    month: number

    @IsNotEmpty()
    @IsNumber()
    year: number

    @IsNotEmpty()
    @IsString()
    file: string
}

export class GetScheme {
    @IsNotEmpty()
    @IsString()
    id: string;
}

export class UpdateScheme {
        @IsNotEmpty()
        @IsBoolean()
        isEnable: boolean;
    
        @IsNotEmpty()
        @IsNumber()
        id: number
    }