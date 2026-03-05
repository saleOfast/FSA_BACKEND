import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IsUUID } from "class-validator";
import { GrnStatusEnum} from "../Constent/common";

export class GrnHeaderCreateDto{
    @IsNotEmpty()
    @IsString()
    warehouseId: string;

    @IsOptional()
    @IsString()
    poId?: string;

    // @IsNotEmpty()
    // @IsNumber()
    // createdBy: number;

    @IsNotEmpty()
    @IsEnum(GrnStatusEnum)
    status: GrnStatusEnum;

}

export class GrnHeaderUpdateDto{
    @IsNotEmpty()
    @IsString()
    grnId: string;

    @IsOptional()
    @IsString()
    warehouseId?: string;

    @IsOptional()
    @IsString()
    poId?: string;

    @IsOptional()
    @IsEnum(GrnStatusEnum)
    status?: GrnStatusEnum;

}

export class GrnHeaderDeleteDto{
     @IsNotEmpty()
  @IsUUID()
  grnId: string;
}

export class GrnHeaderGetDto{
        @IsNotEmpty()
  @IsUUID()
  grnId: string;

  
    @IsOptional()
    @IsString()
    poId?: string;
}

export class GrnHeaderListDto{

        @IsOptional()
    @IsString()
    grnId?: string;



    @IsOptional()
    @IsString()
    warehouseId?: string;

    @IsOptional()
    @IsString()
    poId?: string;

    @IsOptional()
    @IsEnum(GrnStatusEnum)
    status?: GrnStatusEnum;


}