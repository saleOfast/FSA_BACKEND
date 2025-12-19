import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber
} from "class-validator";

export interface IState {
  stateId: number;
  stateName: string;
  countryId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateState {
  @IsNotEmpty()
  @IsString()
  stateName!: string;

  @IsNotEmpty()
  @IsNumber()
  countryId!: number;
}

export class UpdateState {
  @IsNotEmpty()
  @IsNumber()
  stateId!: number;

  @IsNotEmpty()
  @IsString()
  stateName!: string;

  @IsNotEmpty()
  @IsNumber()
  countryId!: number;
}

export class GetStateById {
  @IsNotEmpty()
  @IsString()
  stateId!: string;
}

export class DeleteStateById {
  @IsNotEmpty()
  @IsString()
  stateId!: string;
}

export class StateListFilter {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  countryId?: number;

  @IsNotEmpty()
  @IsString()
  pageNumber!: string;

  @IsNotEmpty()
  @IsString()
  pageSize!: string;
}

