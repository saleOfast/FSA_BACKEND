import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsDateString,
  IsUUID,
  Min,
  Max
} from "class-validator";
import { Type } from "class-transformer";
import { ItemType, UOM, TaxInclusive, Status } from "../../types/Constent/common";

export interface IPriceBookItem {
  priceBookItemId: number;

  /* ---------- FKs ---------- */
  priceBookId: number;
  skuId: number;

  /* ---------- Item ---------- */
  itemType: ItemType;
  uom: UOM;

  /* ---------- Pricing ---------- */
  basePrice: number;
 

  /* ---------- Discount ---------- */
  allowDiscount: boolean;
 

  /* ---------- Slab Pricing ---------- */


  /* ---------- Tax ---------- */
  taxInclusive: TaxInclusive;

  status: Status;
  createdAt: Date;
  isDeleted: boolean;

  minPrice: number | null;
maxPrice: number | null;
maxDiscountPct: number | null;
slabFromQty: number | null;
slabToQty: number | null;

}

export class CreatePriceBookItemDTO {
  /* ---------- FK ---------- */
  @Type(() => Number)
  @IsNumber()
  priceBookId: number;

  @Type(() => Number)
  @IsNumber()
  skuId: number;

  /* ---------- Item ---------- */
  @IsEnum(ItemType)
  itemType: ItemType;

  @IsEnum(UOM)
  uom: UOM;

  /* ---------- Pricing ---------- */
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  basePrice: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  maxPrice?: number;

  /* ---------- Discount ---------- */
  @IsOptional()
  @IsBoolean()
  allowDiscount?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  maxDiscountPct?: number;

  /* ---------- Slab Pricing ---------- */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  slabFromQty?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  slabToQty?: number;

  /* ---------- Tax ---------- */
  @IsOptional()
  @IsEnum(TaxInclusive)
  taxInclusive?: TaxInclusive;

  /* ---------- Status ---------- */
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
    @IsBoolean()
    isDeleted?: boolean;
}

export class UpdatePriceBookItemDTO {
  /* ---------- FKs (usually not updated, but kept optional) ---------- */

  @IsOptional()
  @Type(() => Number)
    @IsNumber()
priceBookItemId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceBookId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skuId?: number;

  /* ---------- Item ---------- */
  @IsOptional()
  @IsEnum(ItemType)
  itemType?: ItemType;

  @IsOptional()
  @IsEnum(UOM)
  uom?: UOM;

  /* ---------- Pricing ---------- */
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minPrice?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  maxPrice?: number | null;

  /* ---------- Discount ---------- */
  @IsOptional()
  @IsBoolean()
  allowDiscount?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  maxDiscountPct?: number | null;

  /* ---------- Slab Pricing ---------- */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  slabFromQty?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  slabToQty?: number | null;

  /* ---------- Tax ---------- */
  @IsOptional()
  @IsEnum(TaxInclusive)
  taxInclusive?: TaxInclusive;

  /* ---------- Status ---------- */
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

    @IsOptional()
    @IsBoolean()
    isDeleted?: boolean;


}


export class GetAllPriceBookItemDTO {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceBookId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skuId?: number;

  @IsOptional()
  @IsEnum(ItemType)
  itemType?: ItemType;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  /* ---------- Pagination ---------- */
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}

export class GetPriceBookItemByIdDTO {
  @Type(() => Number)
  @IsNumber()
  priceBookItemId: number;
}
export class DeletePriceBookItemDTO {
  @Type(() => Number)
  @IsNumber()
  priceBookItemId: number;
}