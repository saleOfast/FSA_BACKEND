import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum
} from "class-validator";
import { IUserReference } from "../Profile/Profile.types";
import { InventoryVisibilityScope } from "../Constent/common";

export interface ICustomerType {
  customerTypeId: number;
  name: string;
  description?: string;
  parentId?: number |null;
  tradeCategory?: string;
  canPurchase: boolean;
  canSell: boolean;
  inventoryVisibilityScope: string;
  createdBy: IUserReference;
  createdDate: Date;
  lastModifiedBy?: IUserReference;
  lastModifiedDate?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

export class CreateCustomerType {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsOptional()
  @IsString()
  tradeCategory?: string;

  @IsNotEmpty()
  @IsBoolean()
  canPurchase!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  canSell!: boolean;

  @IsNotEmpty()
  @IsEnum(InventoryVisibilityScope)
  inventoryVisibilityScope!: InventoryVisibilityScope;
}

export class UpdateCustomerType {
  @IsNotEmpty()
  @IsNumber()
  customerTypeId!: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsOptional()
  @IsString()
  tradeCategory?: string;

  @IsNotEmpty()
  @IsBoolean()
  canPurchase!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  canSell!: boolean;

  @IsNotEmpty()
  @IsEnum(InventoryVisibilityScope)
  inventoryVisibilityScope!: InventoryVisibilityScope;
}

export class GetCustomerTypeById {
  @IsNotEmpty()
  @IsString()
  customerTypeId!: string;
}

export class DeleteCustomerTypeById {
  @IsNotEmpty()
  @IsString()
  customerTypeId!: string;
}

export class CustomerTypeListFilter {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  tradeCategory?: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsNotEmpty()
  @IsString()
  pageNumber!: string;

  @IsNotEmpty()
  @IsString()
  pageSize!: string;
}

