import { STATUSCODES} from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { PriceBookItem, PriceBookItemRepository } from "../../../../core/DB/Entities/price_book_item.entity";

import { CreatePriceBookItemDTO , UpdatePriceBookItemDTO , GetAllPriceBookItemDTO , GetPriceBookItemByIdDTO, DeletePriceBookItemDTO } from "../../../../core/types/PriceBookItemService/PriceBookItmService";
import { PriceBookRepository } from "../../../../core/DB/Entities/priceBook.entity";
import { Sku, SkuRepository } from "../../../../core/DB/Entities/sku.entity";
import { TaxInclusive, Status, ItemType, UOM } from "../../../../core/types/Constent/common";
import{IsNull} from "typeorm";

export class PriceBookItmController {
    private priceBookItemRepo = PriceBookItemRepository();
    private priceBookRepo = PriceBookRepository();
    private skuRepo = SkuRepository();
    constructor() { }

async createPriceBookItem(
  input: CreatePriceBookItemDTO,
  payload: IUser
): Promise<IApiResponse> {
  try {
    // ================== 1️⃣ Fetch related entities ==================
    const priceBook = await this.priceBookRepo.findOne({
      where: { priceBookId: input.priceBookId, isDeleted: false },
    });

    if (!priceBook) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "PriceBook not found",
        data: null,
      };
    }

    const sku = await this.skuRepo.findOne({
      where: { skuId: input.skuId, isDeleted: false },
    });

    if (!sku) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "SKU not found",
        data: null,
      };
    }

    // ================== 2️⃣ Business validations ==================

    // Discount validation
    if (input.allowDiscount === false && input.maxDiscountPct !== undefined) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "maxDiscountPct is not allowed when allowDiscount is false",
        data: null,
      };
    }

    // Slab validation
    if (
      input.slabFromQty !== undefined &&
      input.slabToQty !== undefined &&
      input.slabFromQty > input.slabToQty
    ) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "slabFromQty cannot be greater than slabToQty",
        data: null,
      };
    }

    // Price validation
    if (
      input.minPrice !== undefined &&
      input.maxPrice !== undefined &&
      input.minPrice > input.maxPrice
    ) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "minPrice cannot be greater than maxPrice",
        data: null,
      };
    }

    // ================== 🔴 3️⃣ DUPLICATE CHECK ==================
    const existingItem = await this.priceBookItemRepo.findOne({
      where: {
        priceBookId: input.priceBookId,
        skuId: input.skuId,
        slabFromQty: input.slabFromQty ?? IsNull(),
        slabToQty: input.slabToQty ?? IsNull(),
        isDeleted: false,
      },
    });

    if (existingItem) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message:
          "Duplicate PriceBookItem already exists for same PriceBook + SKU + slab range",
        data: null,
      };
    }

    // ================== 🔴 4️⃣ OVERLAPPING SLAB CHECK ==================
    if (
      input.slabFromQty !== undefined &&
      input.slabToQty !== undefined
    ) {
      const overlapping = await this.priceBookItemRepo
        .createQueryBuilder("item")
        .where("item.priceBookId = :priceBookId", {
          priceBookId: input.priceBookId,
        })
        .andWhere("item.skuId = :skuId", { skuId: input.skuId })
        .andWhere("item.isDeleted = false")
        .andWhere(
          `(
            (:from BETWEEN item.slabFromQty AND item.slabToQty)
            OR (:to BETWEEN item.slabFromQty AND item.slabToQty)
            OR (item.slabFromQty BETWEEN :from AND :to)
          )`,
          {
            from: input.slabFromQty,
            to: input.slabToQty,
          }
        )
        .getOne();

      if (overlapping) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message:
            "Overlapping slab range already exists for this SKU in PriceBook",
          data: null,
        };
      }
    }

    // ================== 5️⃣ Create PriceBookItem ==================
    const item = new PriceBookItem();

    // Relations
    item.priceBook = priceBook;
    item.priceBookId = priceBook.priceBookId;

    item.sku = sku;
    item.skuId = sku.skuId;

    // Item info
    item.itemType = input.itemType;
    item.uom = input.uom;

    // Pricing
    item.basePrice = input.basePrice;
    item.minPrice = input.minPrice ?? null;
    item.maxPrice = input.maxPrice ?? null;

    // Discount
    item.allowDiscount = input.allowDiscount ?? false;
    item.maxDiscountPct = input.allowDiscount
      ? input.maxDiscountPct ?? null
      : null;

    // Slab
    item.slabFromQty = input.slabFromQty ?? null;
    item.slabToQty = input.slabToQty ?? null;

    // Tax & Status
    item.taxInclusive = input.taxInclusive ?? TaxInclusive.EXCLUSIVE;
    item.status = input.status ?? Status.ACTIVE;
    item.isDeleted = false;

    // Audit
    item.createdAt = new Date();


    // ================== 6️⃣ Save ==================
    const savedItem = await this.priceBookItemRepo.save(item);

    // ================== 7️⃣ Response ==================
    const response = {
      priceBookItemId: savedItem.priceBookItemId,
      priceBookId: savedItem.priceBookId,
      skuId: savedItem.skuId,
      itemType: savedItem.itemType,
      uom: savedItem.uom,
      basePrice: savedItem.basePrice,
      minPrice: savedItem.minPrice,
      maxPrice: savedItem.maxPrice,
      allowDiscount: savedItem.allowDiscount,
      maxDiscountPct: savedItem.maxDiscountPct,
      slabFromQty: savedItem.slabFromQty,
      slabToQty: savedItem.slabToQty,
      taxInclusive: savedItem.taxInclusive,
      status: savedItem.status,
      isDeleted: savedItem.isDeleted,
      createdAt: savedItem.createdAt,
      
    };

    return {
      status: STATUSCODES.SUCCESS,
      message: "PriceBookItem created successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
}

async deletePriceBookItem(
  input: DeletePriceBookItemDTO,payload: IUser
): Promise<IApiResponse> {
  try {
    const { priceBookItemId } = input;

    // 1️⃣ Find the item, only if not already deleted
    const item = await this.priceBookItemRepo.findOne({
      where: {
        priceBookItemId,
        isDeleted: false,
      },
    });

    if (!item) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "PriceBookItem not found",
        data: null,
      };
    }

    // 2️⃣ Soft delete by setting isDeleted = true
    await this.priceBookItemRepo.update(
      { priceBookItemId },
      { isDeleted: true }
    );

    return {
      status: STATUSCODES.SUCCESS,
      message: "PriceBookItem deleted successfully",
      data: null,
    };
  } catch (error) {
    throw error;
  }
}

async getPriceBookItemById(input: GetPriceBookItemByIdDTO,payload: IUser): Promise<IApiResponse> {
    try {
        const { priceBookItemId } = input;
        if(!priceBookItemId){
            return {
                status: STATUSCODES.BAD_REQUEST,
                message: "priceBookItemId is required",
                data: null,
            }
        }

        const priceBookItem= await this.priceBookItemRepo.createQueryBuilder("priceBookItem")
              .leftJoinAndSelect("priceBookItem.priceBook", "priceBook")
                .leftJoinAndSelect("priceBookItem.sku", "sku")
                .where("priceBookItem.priceBookItemId = :priceBookItemId", { priceBookItemId })
                .andWhere("priceBookItem.isDeleted = false")
                .getOne();

        if (!priceBookItem) {
            return {
                status: STATUSCODES.NOT_FOUND,
                message: "PriceBookItem not found",
                data: null,
            };
        }
        return {
            status: STATUSCODES.SUCCESS,
            message: "PriceBookItem fetched successfully",
            data: { priceBookItemId: priceBookItem.priceBookItemId,
  priceBookId: priceBookItem.priceBookId,
  priceBookCode: priceBookItem.priceBook.priceBookCode,
  skuId: priceBookItem.skuId,
  itemType: priceBookItem.itemType,
  uom: priceBookItem.uom,
  basePrice: priceBookItem.basePrice,
  minPrice: priceBookItem.minPrice,
  maxPrice: priceBookItem.maxPrice,
  allowDiscount: priceBookItem.allowDiscount,
  maxDiscountPct: priceBookItem.maxDiscountPct,
  slabFromQty: priceBookItem.slabFromQty,
  slabToQty: priceBookItem.slabToQty,
  taxInclusive: priceBookItem.taxInclusive,
  status: priceBookItem.status,
  isDeleted: priceBookItem.isDeleted,
  createdAt: priceBookItem.createdAt,
 
            }
        };
    } catch (error) {
        throw error;
    }
}


async getAllPriceBookItems(input: GetAllPriceBookItemDTO,payload: IUser): Promise<IApiResponse> {
    try{
        const query = this.priceBookItemRepo.createQueryBuilder("priceBookItem")
        .leftJoinAndSelect("priceBookItem.priceBook", "priceBook")
            .leftJoinAndSelect("priceBookItem.sku", "sku")
            .where("priceBookItem.isDeleted = false");
        const priceBookItems = await query.getMany();
        const responseData = priceBookItems.map((item) => ({
            priceBookItemId: item.priceBookItemId,
            priceBookId: item.priceBookId,
            skuId: item.skuId,
            itemType: item.itemType,
            uom: item.uom,
            basePrice: item.basePrice,
            minPrice: item.minPrice,
            maxPrice: item.maxPrice,
            allowDiscount: item.allowDiscount,
            maxDiscountPct: item.maxDiscountPct,
            slabFromQty: item.slabFromQty,
            slabToQty: item.slabToQty,
            taxInclusive: item.taxInclusive,
            status: item.status,
            isDeleted: item.isDeleted,
            createdAt: item.createdAt,
        }));

        return {
            status: STATUSCODES.SUCCESS,
            message: "PriceBookItems fetched successfully",
            data: responseData,
    }
    } catch (error) {
        throw error;
    }

}

async updatePriceBookItem(
  input: UpdatePriceBookItemDTO,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const { priceBookItemId, ...updateData } = input;

    // 1️⃣ Find existing item
    const item = await this.priceBookItemRepo.findOne({
      where: {
        priceBookItemId,
        isDeleted: false,
      },
      relations: ["priceBook", "sku"],
    });

    if (!item) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "PriceBookItem not found",
        data: null,
      };
    }

    // 2️⃣ Validate & update PriceBook (optional)
    if (updateData.priceBookId) {
      const priceBook = await this.priceBookRepo.findOne({
        where: { priceBookId: updateData.priceBookId, isDeleted: false },
      });

      if (!priceBook) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "PriceBook not found",
          data: null,
        };
      }

      item.priceBook = priceBook;
      item.priceBookId = priceBook.priceBookId;
    }

    // 3️⃣ Validate & update SKU (optional)
    if (updateData.skuId) {
      const sku = await this.skuRepo.findOne({
        where: { skuId: updateData.skuId },
      });

      if (!sku) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "SKU not found",
          data: null,
        };
      }

      item.sku = sku;
      item.skuId = sku.skuId;
    }

    // 4️⃣ Business validations
    if (updateData.allowDiscount === false && updateData.maxDiscountPct) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "maxDiscountPct is not allowed when allowDiscount is false",
        data: null,
      };
    }

 if (
  updateData.slabFromQty !== undefined &&
  updateData.slabFromQty !== null &&
  updateData.slabToQty !== undefined &&
  updateData.slabToQty !== null &&
  updateData.slabFromQty > updateData.slabToQty
) {
  return {
    status: STATUSCODES.BAD_REQUEST,
    message: "slabFromQty cannot be greater than slabToQty",
    data: null,
  };
}

    if (
      updateData.minPrice !== undefined &&
      updateData.maxPrice !== undefined &&
      updateData.minPrice !== null &&
      updateData.maxPrice !== null &&
      updateData.minPrice > updateData.maxPrice
    ) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "minPrice cannot be greater than maxPrice",
        data: null,
      };
    }

    // 5️⃣ Update fields (ONLY if provided)
    if (updateData.itemType) item.itemType = updateData.itemType;
    if (updateData.uom) item.uom = updateData.uom;

    if (updateData.basePrice !== undefined) item.basePrice = updateData.basePrice;
    if (updateData.minPrice !== undefined) item.minPrice = updateData.minPrice;
    if (updateData.maxPrice !== undefined) item.maxPrice = updateData.maxPrice;

    if (updateData.allowDiscount !== undefined)
      item.allowDiscount = updateData.allowDiscount;

    if (updateData.maxDiscountPct !== undefined)
      item.maxDiscountPct = updateData.maxDiscountPct;

    if (updateData.slabFromQty !== undefined)
      item.slabFromQty = updateData.slabFromQty;

    if (updateData.slabToQty !== undefined)
      item.slabToQty = updateData.slabToQty;

    if (updateData.taxInclusive) item.taxInclusive = updateData.taxInclusive;
    if (updateData.status) item.status = updateData.status;

    if (updateData.isDeleted !== undefined)
      item.isDeleted = updateData.isDeleted;

    // 6️⃣ Save
    const updatedItem = await this.priceBookItemRepo.save(item);

    // 7️⃣ Flattened response
    const response = {
      priceBookItemId: updatedItem.priceBookItemId,
      priceBookId: updatedItem.priceBookId,
      skuId: updatedItem.skuId,
      itemType: updatedItem.itemType,
      uom: updatedItem.uom,
      basePrice: updatedItem.basePrice,
      minPrice: updatedItem.minPrice,
      maxPrice: updatedItem.maxPrice,
      allowDiscount: updatedItem.allowDiscount,
      maxDiscountPct: updatedItem.maxDiscountPct,
      slabFromQty: updatedItem.slabFromQty,
      slabToQty: updatedItem.slabToQty,
      taxInclusive: updatedItem.taxInclusive,
      status: updatedItem.status,
      isDeleted: updatedItem.isDeleted,
      createdAt: updatedItem.createdAt,
    };

    return {
      status: STATUSCODES.SUCCESS,
      message: "PriceBookItem updated successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
}

}

    export { PriceBookItmController as PriceBookItemService

     }