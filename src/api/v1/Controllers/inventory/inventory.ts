import { Inventory, InventoryRepository } from "../../../../core/DB/Entities/inventory";
import { Sku, SkuRepository } from "../../../../core/DB/Entities/sku.entity";
import { Warehouse } from "../../../../core/DB/Entities/warehouse.entity";
import { In } from "typeorm";
import { 
GetInventoryList,  
CreateInventoryDto ,
DeleteInventoryDto,  
InventoryItemDto ,
UpdateInventoryDto ,GetInventoryById
} from "../../../../core/types/InventoryService/InventoryService";
import {  STATUSCODES} from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";

class InventoryService {
  private inventoryRepo = InventoryRepository();
  private skuRepo = SkuRepository();

  constructor() {}


async createInventory(
  input: CreateInventoryDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const inventories: Inventory[] = [];


    for (const item of input.inventory) {

      // ============================
      // Validation
      // ============================
      if (!item.skuId) {
        throw new Error("skuId is required");
      }

      if (!item.warehouseId) {
        throw new Error("warehouseId is required");
      }

      // ============================
      // Fetch SKU → Product
      // ============================
      const sku = await this.skuRepo.findOne({
        where: { skuId: item.skuId },
        select: ["skuId", "productId"],
      });

      if (!sku) {
        throw new Error(`Invalid skuId: ${item.skuId}`);
      }

      // ============================
      // Create Inventory
      // ============================
      const inventory = new Inventory();

      inventory.inventoryName = item.inventoryName;
      inventory.stockQuantity = item.stockQuantity;
      inventory.warehouseId = item.warehouseId;

      inventory.skuId = sku.skuId;           // ✅ real SKU
      inventory.productId = sku.productId;   // ✅ derived product

      inventory.batchNumber = item.batchNumber;
      inventory.expiryDate = item.expiryDate
        ? new Date(item.expiryDate)
        : undefined;

      inventory.reorderLevel = item.reorderLevel;
      inventory.stockInDate = item.stockInDate
        ? new Date(item.stockInDate)
        : undefined;

      inventory.stockOutDate = item.stockOutDate
        ? new Date(item.stockOutDate)
        : undefined;

      inventory.taxId = item.taxId;
      inventory.schemeId = item.schemeId;
      inventory.discountId = item.discountId;

      inventories.push(inventory);
    }

    const savedInventories = await this.inventoryRepo.save(inventories);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Inventory created successfully",
      data: savedInventories,
    };
  } catch (err: any) {
    console.error("Create Inventory error:", err);

    return {
      status: STATUSCODES.BAD_REQUEST,
      message: err.message || "Failed to create inventory",
    };
  }
}


  // =======================
  // 2️⃣ UPDATE INVENTORY
  // =======================
 async updateInventory(
  input: UpdateInventoryDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const updatedItems: Inventory[] = [];

    for (const item of input.inventory) {

      if (!item.inventoryId) {
        throw new Error("inventoryId is required for update");
      }

      const existing = await this.inventoryRepo.findOne({
        where: { inventoryId: item.inventoryId },
      });

      if (!existing) {
        throw new Error(`Inventory not found with id ${item.inventoryId}`);
      }

      // ============================
      // Update only provided fields
      // ============================

      if (item.stockQuantity !== undefined) {
        existing.stockQuantity = item.stockQuantity;
      }

      if (item.batchNumber !== undefined) {
        existing.batchNumber = item.batchNumber;
      }

      if (item.expiryDate !== undefined) {
        existing.expiryDate = item.expiryDate
          ? new Date(item.expiryDate)
          : undefined;
      }

      if (item.reorderLevel !== undefined) {
        existing.reorderLevel = item.reorderLevel;
      }

      if (item.stockInDate !== undefined) {
        existing.stockInDate = item.stockInDate
          ? new Date(item.stockInDate)
          : undefined;
      }

      if (item.stockOutDate !== undefined) {
        existing.stockOutDate = item.stockOutDate
          ? new Date(item.stockOutDate)
          : undefined;
      }

      if (item.taxId !== undefined) {
        existing.taxId = item.taxId;
      }

      if (item.schemeId !== undefined) {
        existing.schemeId = item.schemeId;
      }

      if (item.discountId !== undefined) {
        existing.discountId = item.discountId;
      }

      const saved = await this.inventoryRepo.save(existing);
      updatedItems.push(saved);
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: "Inventory updated successfully",
      data: updatedItems,
    };
  } catch (err: any) {
    console.error("Update Inventory error:", err);

    return {
      status: STATUSCODES.BAD_REQUEST,
      message: err.message || "Failed to update inventory",
    };
  }
}


  // =======================
  // 3️⃣ DELETE INVENTORY
  // =======================
 

async deleteInventory(
  input: DeleteInventoryDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const { inventoryIds } = input;

    const existingItems = await this.inventoryRepo.find({
      where: {
        inventoryId: In(inventoryIds),
        isDeleted: false,
      },
    });

    if (existingItems.length === 0) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Inventory items not found",
      };
    }

    await this.inventoryRepo.update(
      { inventoryId: In(inventoryIds) },
      { isDeleted: true }
    );

    return {
      status: STATUSCODES.SUCCESS,
      message: `${existingItems.length} inventory item(s) deleted successfully`,
    };
  } catch (err: any) {
    console.error("Delete Inventory error:", err);
    return {
      status: STATUSCODES.BAD_REQUEST,
      message: "Failed to delete inventory",
      data: err?.message || err,
    };
  }
}

async getAllInventory(payload: IUser): Promise<IApiResponse> {
  try {
    const inventories = await this.inventoryRepo.find({
      relations: {
        product: true,
        warehouse: true, // include if you have sku relation
      },
      order: {
        createdAt: "DESC",
      },
    });

    if (!inventories.length) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "No inventory found",
      };
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: "Inventory list fetched successfully",
      data: inventories,
    };
  } catch (err: any) {
    console.error("Get all inventory error:", err);
    return {
      status: STATUSCODES.BAD_REQUEST,
      message: "Failed to fetch inventory",
      data: err?.message,
    };
  }
}

  // =======================
  // 4️⃣ GET INVENTORY BY WAREHOUSE
  // =======================
  async getInventory(input: GetInventoryList, payload: IUser): Promise<IApiResponse> {
    try {
      const { warehouseId } = input;

      const inventories = await this.inventoryRepo.find({
        where: { warehouseId },
        relations: [ "product", "warehouse"],
      });

      if (!inventories || inventories.length === 0) return { status: STATUSCODES.NOT_FOUND, message: "No inventory found" };
      

      return { status: STATUSCODES.SUCCESS, message: "Inventory fetched successfully", data: inventories };
    } catch (err: any) {
      console.error("Get Inventory error:", err);
      return { status: STATUSCODES.BAD_REQUEST, message: "Failed to fetch inventory", data: err?.message || err };
    }
  }



async getInventoryById(
  input: GetInventoryById,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const inventoryId = Number(input.inventoryId);

    const inventory = await this.inventoryRepo.findOne({
      where: {
        inventoryId,
        isDeleted: false, 
      },
      relations: ["product"],
    });

    if (!inventory) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "No inventory found",
      };
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: "Inventory fetched successfully",
      data: inventory,
    };
  } catch (err: any) {
    console.error("Get Inventory By ID error:", err);
    return {
      status: STATUSCODES.BAD_REQUEST,
      message: "Failed to fetch inventory",
      data: err?.message || err,
    };
  }
}


}



export { InventoryService };
