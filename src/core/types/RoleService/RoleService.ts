import { Type, Transform } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";

/** Coerce query/body numbers (Postman often sends strings). */
const toOptionalNumber = ({ value }: { value: unknown }) => {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isNaN(n) ? value : n;
};

const toNumber = ({ value }: { value: unknown }) => {
  const n = Number(value);
  return Number.isNaN(n) ? value : n;
};

export interface IRoleListItem {
  roleId: number;
  name: string;
  profileId: number;
  linkedProfileName: string;
  parentRoleId: number | null;
  reportsToLabel: string;
  description?: string;
  assignedUserCount: number;
  assignedUsers: { emp_id: number; name: string }[];
  modifiedOn?: Date;
}

export interface IRoleHierarchyNode {
  roleId: number;
  name: string;
  profileId: number;
  linkedProfileName: string;
  assignedUserCount: number;
  children: IRoleHierarchyNode[];
}

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @Transform(toNumber)
  @IsNumber()
  profileId!: number;

  @IsOptional()
  @Transform(toOptionalNumber)
  @ValidateIf((o) => o.parentRoleId != null && o.parentRoleId !== "")
  @IsNumber()
  parentRoleId?: number | null;

  @IsOptional()
  @IsString()
  description?: string;

  /** Saves to `users.role_id` + `users.profile_id` for each user. */
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  assignedEmpIds?: number[];
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @Transform(toNumber)
  @IsNumber()
  profileId?: number;

  @IsOptional()
  @Transform(toOptionalNumber)
  @ValidateIf((o) => o.parentRoleId != null && o.parentRoleId !== "")
  @IsNumber()
  parentRoleId?: number | null;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  assignedEmpIds?: number[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  removeEmpIds?: number[];

}

export class RoleListQuery {
  @IsOptional()
  @IsString()
  search?: string;
}

export class RoleIdParam {
  @IsNotEmpty()
  @IsString()
  roleId!: string;
}