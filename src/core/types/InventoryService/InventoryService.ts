import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested } from "class-validator";

export class GetInventoryList {
    @IsNotEmpty()
    @IsString()
    storeId: string;
}

export class Inventory {
    @IsNotEmpty()
    @IsNumber()
    inventoryId: number;

    @IsNotEmpty()
    @IsNumber()
    noOfCase: number;

    @IsNotEmpty()
    @IsNumber()
    noOfPiece: number;
}

export class UpdateInventoryDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Inventory)
    inventory: Inventory[];
}