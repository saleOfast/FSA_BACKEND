import { UserRole } from "../../../core/types/Constent/common";
import { IsArray, IsDateString, IsNotEmpty, isNumber, IsNumber, IsOptional, IsString } from "class-validator";
export interface IUserTarget {
    storeTarget: number,
    amountTarget: number,
    collectionTarget: boolean,
    month: Date
}
export interface ITarget {
    forEach(callback: (target: ITarget) => void): void;
    targetId: number;
    managerId: number;
    empId: number;
    target: IUserTarget[];
    storeTarget: number;
    amountTarget: number;
    collectionTarget: number;
    month: any;
    year: Date;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}


export class CreateTarget {
    @IsNotEmpty()
    @IsNumber()
    emp_id: number;

    @IsOptional()
    @IsNumber()
    storeTarget: number;

    @IsOptional()
    @IsNumber()
    amountTarget: number;

    @IsOptional()
    @IsNumber()
    collectionTarget: number;

    @IsOptional()
    @IsNumber()
    month: number;

    @IsOptional()
    @IsNumber()
    year: number;

}

export class UpsertTarget {
    @IsNotEmpty()
    @IsNumber()
    emp_id: number;

    @IsOptional()
    @IsNumber()
    month: number;

    @IsOptional()
    @IsNumber()
    year: number;

    @IsOptional()
    @IsNumber()
    storeTarget: number;

    @IsOptional()
    @IsNumber()
    amountTarget: number;

    @IsOptional()
    @IsNumber()
    collectionTarget: number;

    @IsNotEmpty()
    @IsNumber()
    targetId: number;

    @IsOptional()
    @IsArray()
    target: IUserTarget[];
}

export class DeleteTarget {
    @IsNotEmpty()
    @IsString()
    targetId: string
}

export class GetTarget {
    @IsNotEmpty()
    @IsString()
    targetId: string
}

export class GetAllTarget {
    @IsOptional()
    @IsString()
    emp_id: number

    @IsOptional()
    @IsString()
    year: string
}

export class List {
    @IsOptional()
    @IsString()
    month: string

    @IsOptional()
    @IsString()
    quarter: string

    @IsOptional()
    @IsString()
    year: string

    @IsOptional()
    @IsString()
    roles: UserRole
}

export class UpdateTarget {
    @IsNotEmpty()
    @IsNumber()
    SSMId: number;

    @IsOptional()
    @IsDateString()
    month: Date;

    @IsOptional()
    @IsDateString()
    year: Date;

    @IsOptional()
    @IsNumber()
    storeTarget: number;

    @IsOptional()
    @IsNumber()
    amountTarget: number;

    @IsOptional()
    @IsNumber()
    collectionTarget: number;

    @IsNotEmpty()
    @IsNumber()
    targetId: number;

    @IsOptional()
    @IsArray()
    target: IUserTarget[];
}