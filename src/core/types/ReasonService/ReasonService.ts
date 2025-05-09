import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export interface IReason {
    reasonId: number;
    empId: number;
    description: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date
}


export class CreateReason {
    @IsNotEmpty()
    @IsString()
    description: string;
}

export class UpdateReason {
    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    reasonId: number
}

export class DeleteReason {
    @IsNotEmpty()
    @IsString()
    reasonId: string
}

export class GetReason {
    @IsNotEmpty()
    @IsString()
    reasonId: string
}

// colour

export interface IColour {
    colourId: number;
    empId: number;
    name: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date
}


export class CreateColour {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class UpdateColour {
    @IsOptional()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsNumber()
    colourId: number
}

export class DeleteColour {
    @IsNotEmpty()
    @IsString()
    colourId: string
}

export class GetColour {
    @IsNotEmpty()
    @IsString()
    colourId: string
}

// size

export interface ISize {
    sizeId: number;
    empId: number;
    name: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date
}


export class CreateSize {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class UpdateSize {
    @IsOptional()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsNumber()
    sizeId: number
}

export class DeleteSize {
    @IsNotEmpty()
    @IsString()
    sizeId: string
}

export class GetSize {
    @IsNotEmpty()
    @IsString()
    sizeId: string
}


// Feature

export interface IFeature {
    featureId: number;
    empId: number;
    name: string;
    key: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date
}


export class CreateFeature {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}

export class UpdateFeature {
    @IsNotEmpty()
    @IsString()
    key: string

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean
}

export class DeleteFeature {
    @IsNotEmpty()
    @IsString()
    featureId: string
}

export class GetFeature {
    @IsNotEmpty()
    @IsString()
    featureId: string
}

// Role

export interface IRole {
    roleId: number;
    empId: number;
    name: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date
}


export class CreateRole {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class UpdateRole {
    @IsOptional()
    @IsString()
    name?: string;

    @IsNotEmpty()
    @IsNumber()
    roleId: number

    @IsOptional()
    @IsBoolean()
    isActive: boolean
}

export class IsActiveRole {
    @IsOptional()
    @IsBoolean()
    isActive: boolean
}

export class DeleteRole {
    @IsNotEmpty()
    @IsString()
    roleId: string
}

export class GetRole {
    @IsNotEmpty()
    @IsString()
    roleId: string
}

