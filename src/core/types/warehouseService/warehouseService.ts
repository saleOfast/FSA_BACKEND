import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { WarehouseStatus, WarehouseType, IUserInfo } from "../../DB/Entities/warehouse.entity";

// Validation class for user info
export class UserInfoDto {
	@IsNotEmpty() @IsNumber()
	id: number;

	@IsNotEmpty() @IsString()
	name: string;
}

export class CreateWarehouse {
	@IsNotEmpty() @IsString()
	warehouseName: string;

	// picklist
	@IsOptional() @IsEnum(WarehouseType)
	type?: WarehouseType;

	// location
	@IsNotEmpty() @IsString()
	address: string;

	@IsNotEmpty() @IsString()
	city: string;

	@IsNotEmpty() @IsString()
	state: string;

	@IsNotEmpty() @IsString()
	zip: string;

	// user refs
	@IsOptional() @IsNumber()
	managerId?: number;

	@IsOptional() @IsEmail()
	email?: string;

	@IsOptional() @IsString()
	managerPhone?: string;

	@IsOptional() @IsString()
	contactPerson?: string;

	@IsOptional() @IsString()
	contactName?: string;

	@IsOptional() @IsNumber()
	capacity?: number;

	@IsOptional() @IsEnum(WarehouseStatus)
	status?: WarehouseStatus;

	@IsOptional() @IsString()
	operationalHours?: string;

	@IsOptional() @IsNumber()
	createdBy?: number;

	@IsOptional() @IsString()
	createdByName?: string;

	@IsOptional() @IsNumber()
	lastModifiedBy?: number;

	@IsOptional() @IsString()
	lastModifiedByName?: string;
}

export class GetWarehouseById {
	@Transform(({ value }) => parseInt(value))
	@IsNotEmpty() @IsNumber()
	warehouseId: number;
}

export class DeleteWarehouseById {
	@Transform(({ value }) => parseInt(value))
	@IsNotEmpty() @IsNumber()
	warehouseId: number;
}

export class UpdateWarehouse {
	@IsNotEmpty() @IsNumber()
	warehouseId: number;

	@IsOptional() @IsString()
	warehouseName?: string;

	@IsOptional() @IsEnum(WarehouseType)
	type?: WarehouseType;

	@IsOptional() @IsString()
	address?: string;

	@IsOptional() @IsString()
	city?: string;

	@IsOptional() @IsString()
	state?: string;

	@IsOptional() @IsString()
	zip?: string;

	@IsOptional() @IsNumber()
	managerId?: number;

	@IsOptional() @IsEmail()
	email?: string;

	@IsOptional() @IsString()
	managerPhone?: string;

	@IsOptional() @IsString()
	contactPerson?: string;

	@IsOptional() @IsString()
	contactName?: string;

	@IsOptional() @IsNumber()
	capacity?: number;

	@IsOptional() @IsEnum(WarehouseStatus)
	status?: WarehouseStatus;

	@IsOptional() @IsString()
	operationalHours?: string;

	@IsOptional() @IsNumber()
	lastModifiedBy?: number;

	@IsOptional() @IsString()
	lastModifiedByName?: string;
}

export class GetWarehouseList {
	// General search (searches across name, city, and ID)
	@IsOptional() @IsString()
	search?: string;

	// Specific field searches
	@IsOptional() @IsString()
	name?: string;

	@Transform(({ value }) => value ? parseInt(value) : undefined)
	@IsOptional() @IsNumber()
	id?: number;

	@IsOptional() @IsString()
	city?: string;

	// Status filter: 'ACTIVE', 'INACTIVE', or undefined for all
	@IsOptional() @IsEnum(WarehouseStatus)
	status?: WarehouseStatus;

	@Transform(({ value }) => value ? parseInt(value) : undefined)
	@IsOptional() @IsNumber()
	pageNumber?: number;

	@Transform(({ value }) => value ? parseInt(value) : undefined)
	@IsOptional() @IsNumber()
	pageSize?: number;
}