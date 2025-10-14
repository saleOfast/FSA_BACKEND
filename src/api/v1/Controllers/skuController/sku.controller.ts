
import { ISku } from "core/types/skuService/skuService";
import { Sku, SkuRepository } from "../../../../core/DB/Entities/sku.entity";
import { ProductRepository } from "../../../../core/DB/Entities/products.entity";
import { STATUSCODES } from "../../../../core/types/Constent/common";
import { Request, Response } from "express";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { WarehouseRepository } from "../../../../core/DB/Entities/warehouse.entity";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";

import {CreateSkuRequest, UpdateSkuRequest,GetSkuListRequest,DeleteSkuById, SearchSkuRequest,GetStatusRequest} from "core/types/skuService/skuService"

class SkuController {
       private  SkuRepository= SkuRepository();
       private productRepository= ProductRepository();

           constructor() { }

    // Create SKU
    async createSku(input: CreateSkuRequest, payload: IUser): Promise<IApiResponse> {
    try {
        // Find product by name
        const product = await this.productRepository.findOne({ where: {  productName: input.productName } });
        if (!product) {
            return { status: STATUSCODES.BAD_REQUEST, message: "Product not found" };
        }

        // Find warehouse by location (optional)
        let warehouse;
        if (input.warehouseLocation) {
            warehouse = await WarehouseRepository().findOne({ where: { address: input.warehouseLocation } });
            if (!warehouse) {
                return { status: STATUSCODES.BAD_REQUEST, message: "Warehouse not found" };
            }
        }

        // Create SKU
        const newSku = this.SkuRepository.create({
            skuNumber: input.skuNumber,
            salesChannel: input.salesChannel,
            channelSku: input.channelSku,
            barcode: input.barcode,
            description: input.description,
            attributeColor: input.attributeColor,
            attributeSize: input.attributeSize,
            stockLevel: input.stockLevel,
            product,
            warehouse,
            productDescription: input.productDescription,
            isActive: input.isActive ?? true,
        });

        const savedSku = await this.SkuRepository.save(newSku);

        return { status: STATUSCODES.SUCCESS, message: "SKU created successfully", data: savedSku };
    } catch (error) {
       console.error("Error in createSku:", error);
    throw error;
    }
}   
    // Update SKU
async updateSku(id: number, input: Partial<UpdateSkuRequest>, payload: IUser): Promise<IApiResponse> {
    try {
        // Find existing SKU
        const existingSku = await this.SkuRepository.findOne({
            where: { id },
            relations: ["product", "warehouse"], // ensure relations are loaded
        });
        console.log("Existing SKU:", existingSku);

        if (!existingSku) {
            return { status: STATUSCODES.NOT_FOUND, message: "SKU not found" };
        }

        // If productName is provided, update product
        if (input.productName) {
            const product = await this.productRepository.findOne({ where: { productName: input.productName } });

            console.log("Found product:", product);
            if (!product) {
                return { status: STATUSCODES.BAD_REQUEST, message: "Product not found" };
            }
            existingSku.product = product;
        }

        // If warehouseLocation is provided, update warehouse
        if (input.warehouseLocation) {
            const warehouse = await WarehouseRepository().findOne({ where: { address: input.warehouseLocation } });
            if (!warehouse) {
                return { status: STATUSCODES.BAD_REQUEST, message: "Warehouse not found" };
            }
            existingSku.warehouse = warehouse;
        }
        // Update other fields
        const updateData: Partial<Sku>=({
            skuNumber: input.skuNumber ?? existingSku.skuNumber,
            salesChannel: input.salesChannel ?? existingSku.salesChannel,
            channelSku: input.channelSku ?? existingSku.channelSku,
            barcode: input.barcode ?? existingSku.barcode,
            description: input.description ?? existingSku.description,
            attributeColor: input.attributeColor ?? existingSku.attributeColor,
            attributeSize: input.attributeSize ?? existingSku.attributeSize,
            stockLevel: input.stockLevel ?? existingSku.stockLevel,
            productDescription: input.productDescription ?? existingSku.productDescription,
            isActive: input.isActive ?? existingSku.isActive,
            updatedAt: new Date(),
        });

        // Save updated SKU
        const updatedSku = await this.SkuRepository.save(existingSku);

        return { status: STATUSCODES.SUCCESS, message: "SKU updated successfully", data: updatedSku };
    } catch (error) {
        console.error("Error in updateSku:", error);
        throw error;
    }
}
    // Delete SKU
async deleteSku(input: DeleteSkuById): Promise<IApiResponse> {
  try {
    const existingSku = await this.SkuRepository.findOne({
      where: { id: Number(input.skuId) },
    });

    if (!existingSku) {
      return { status: STATUSCODES.NOT_FOUND, message: "SKU not found" };
    }

    if (existingSku.isDeleted) {
      return { status: STATUSCODES.BAD_REQUEST, message: "SKU already deleted" };
    }

    existingSku.isDeleted = true;
    await this.SkuRepository.save(existingSku);

    return {
      status: STATUSCODES.SUCCESS,
      message: "SKU marked as deleted successfully",
    };
  } catch (error: any) {
    console.error("Error in deleteSku:", error);
    throw error;
}
}
    // Get SKU list with filters
async getSkuList(input: GetSkuListRequest): Promise<IApiResponse> {
  try {
    const query = this.SkuRepository
      .createQueryBuilder("sku")
      .leftJoinAndSelect("sku.product", "product")
      .leftJoinAndSelect("sku.warehouse", "warehouse")
      .where("sku.isDeleted = false"); // soft-delete filter

    if (input.salesChannel) {
      query.andWhere("sku.salesChannel = :salesChannel", { salesChannel: input.salesChannel });
    }

    if (input.productName) {
      query.andWhere("product.productName ILIKE :productName", { productName: `%${input.productName}%` });
    }

    if (input.search) {
      const search = `%${input.search}%`;
      query.andWhere(
        "(sku.skuNumber ILIKE :search OR sku.channelSku ILIKE :search OR sku.barcode ILIKE :search)",
        { search }
      );
    }

    if (input.isActive !== undefined) {
      const isActive = input.isActive === "true";
      query.andWhere("sku.isActive = :isActive", { isActive });
    }

    const [data, total] = await query.getManyAndCount();

    return {
      status: 200,
      message: "SKU list fetched successfully",
      data: { skus: data, total }
    };
  } catch (error) {
    console.error("Error fetching SKU list:", error);
    throw { status: 500, message: "Failed to fetch SKU list" };
  }
}
    // get SKU by ID
  async searchSkus(input: SearchSkuRequest): Promise<IApiResponse> {
  try {
    const query = this.SkuRepository
      .createQueryBuilder("sku")
      .leftJoinAndSelect("sku.product", "product")
      .leftJoinAndSelect("sku.warehouse", "warehouse")
      .where("sku.isDeleted = false"); // soft-delete

    // SKU ID filter
    if (input.skuId) {
      const skuIdNum = Number(input.skuId);
      if (!isNaN(skuIdNum)) {
        query.andWhere("sku.id = :skuId", { skuId: skuIdNum });
      } else {
        return { status: 400, message: "Invalid skuId", data: [] };
      }
    }

    // Product Name filter
    if (input.productName) {
      query.andWhere("product.productName ILIKE :productName", { productName: `%${input.productName}%` });
    }

    // Warehouse Location filter
    if (input.warehouseLocation) {
      query.andWhere("warehouse.location ILIKE :warehouseLocation", { warehouseLocation: `%${input.warehouseLocation}%` });
    }

    const skus = await query.getMany();

    if (skus.length === 0) {
      return { status: 404, message: "Data not found", data: [] };
    }

    return { status: 200, message: "SKUs fetched successfully", data: skus };
  } catch (error) {
    console.error("Error searching SKUs:", error);
    return { status: 500, message: "Failed to search SKUs", data: [] };
  }
}
async getStatus(input: GetStatusRequest, payload: IUser): Promise<IApiResponse> {
  try {
    if (!input.status) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Status is required (Active / Inactive)",
        data: [],
      };
    }

    // Normalize input to lower case
    const statusLower = input.status.toLowerCase();

    let isActiveFilter: boolean;
    if (statusLower === "active") {
      isActiveFilter = true;
    } else if (statusLower === "inactive") {
      isActiveFilter = false;
    } else {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Invalid status. Allowed values: Active, Inactive",
        data: [],
      };
    }

    // Fetch SKUs by isActive
    const skus = await this.SkuRepository
      .createQueryBuilder("sku")
      .leftJoinAndSelect("sku.product", "product")
      .leftJoinAndSelect("sku.warehouse", "warehouse")
      .where("sku.isActive = :isActive", { isActive: isActiveFilter })
      .orderBy("sku.skuNumber", "ASC")
      .getMany();

    if (!skus.length) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: `No ${statusLower} SKUs found`,
        data: [],
      };
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: `${statusLower} SKUs fetched successfully`,
      data: skus.map(sku => ({
        skuId: sku.id,
        skuNumber: sku.skuNumber,
        isActive: sku.isActive,
        product: sku.product,
        warehouse: sku.warehouse,
      })),
    };
  } catch (error: any) {
    console.error("Error fetching SKUs by status:", error);
    throw error;
  }
}


}


export { SkuController as skuController };


