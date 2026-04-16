import { Inventory, InventoryRepository } from "../../../../core/DB/Entities/inventory";
import { Sku, SkuRepository } from "../../../../core/DB/Entities/sku.entity";
import { Warehouse,WarehouseRepository } from "../../../../core/DB/Entities/warehouse.entity";
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
import { IsNull } from "typeorm";
import { Batch, BatchRepository} from "../../../../core/DB/Entities/inventoryBatch.entity";
import { Taxes, TaxesRepository } from "../../../../core/DB/Entities/tax.entity";
import { DataSource } from "typeorm";
// import { Warehouse } from "../../../../core/DB/Entities/warehouse.entity";


class InventoryService {
  private inventoryRepo = InventoryRepository();
  private skuRepo = SkuRepository();
  private batchRepo = BatchRepository();
  private warehouseRepo =WarehouseRepository(); 
  private taxRepo = TaxesRepository();

  constructor() {}


async createInventory(
  input: CreateInventoryDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    // ============================
    // ✅ Common Date Formatter (FIXED)
    // ============================
    const formatDate = (date: any) => {
      if (!date) return "null";

      const d = new Date(date);
      if (isNaN(d.getTime())) return "null";

      return d.toISOString().slice(0, 10); // YYYY-MM-DD
    };

    // ============================
    // 0️⃣ Input Size Protection
    // ============================
    if (!input.inventory || input.inventory.length === 0) {
      throw new Error("Inventory cannot be empty");
    }

    if (input.inventory.length > 100) {
      throw new Error("Maximum 100 items allowed per request");
    }

    // ============================
    // 1️⃣ Duplicate Request Check
    // ============================
    const requestSet = new Set<string>();

    for (const item of input.inventory) {
      const key = `${item.skuId}-${item.warehouseId}`;
      if (requestSet.has(key)) {
        throw new Error(`Duplicate inventory in request: ${key}`);
      }
      requestSet.add(key);
    }

    // ============================
    // 2️⃣ Prepare Bulk Data
    // ============================
    const skuIds = input.inventory.map(i => i.skuId);
    const warehouseIds = input.inventory.map(i => i.warehouseId);
    const taxIds = input.inventory.filter(i => i.taxId).map(i => i.taxId);
    // const batchNumbers = input.inventory
    //   .filter(i => i.batchNumber)
    //   .map(i => i.batchNumber!.trim());

    // ============================
    // 3️⃣ Bulk Fetch
    // ============================
    const [skus, warehouses, taxes, existingInventories] =
      await Promise.all([
        this.skuRepo.find({
          where: { skuId: In(skuIds), isDeleted: false },
          select: ["skuId", "productId"],
        }),
        this.warehouseRepo.find({
          where: { warehouseId: In(warehouseIds), isDeleted: false },
        }),
        this.taxRepo.find({
          where: { taxId: In(taxIds) },
        }),
        this.inventoryRepo.find({
          where: {
            skuId: In(skuIds),
            warehouseId: In(warehouseIds),
            isDeleted: false,
          },
        }),
      ]);

    // ============================
    // 4️⃣ Maps / Sets
    // ============================
    const skuMap = new Map(skus.map(s => [s.skuId, s]));
    const warehouseSet = new Set(warehouses.map(w => w.warehouseId));
    const taxSet = new Set(taxes.map(t => t.taxId));

    // ✅ FIXED: Safe expiry handling
    const inventoryMap = new Map(
      existingInventories.map(i => [
        `${i.skuId}-${i.warehouseId}}`,
        i,
      ])
    );

    // ============================
    // 5️⃣ TRANSACTION
    // ============================
    const result = await this.inventoryRepo.manager.transaction(
      async manager => {
        const inventoryRepo = manager.getRepository(Inventory);
        const results: Inventory[] = [];

        for (const item of input.inventory) {
          // ============================
          // 6️⃣ VALIDATIONS
          // ============================
          if (!item.inventoryName?.trim()) {
            throw new Error("inventoryName cannot be empty");
          }

          const normalizedName = item.inventoryName.trim().toLowerCase();

          if (!item.skuId) throw new Error("skuId is required");
          if (!item.warehouseId) throw new Error("warehouseId is required");

          if (!warehouseSet.has(item.warehouseId)) {
            throw new Error(`Invalid warehouseId: ${item.warehouseId}`);
          }

          if (item.stockQuantity == null || item.stockQuantity <= 0) {
            throw new Error("stockQuantity must be greater than 0");
          }

          // if (!!item.batchNumber !== !!item.expiryDate) {
          //   throw new Error("batchNumber and expiryDate must be together");
          // }

          if (item.taxId && !taxSet.has(item.taxId)) {
            throw new Error(`Invalid taxId: ${item.taxId}`);
          }

          const sku = skuMap.get(item.skuId);
          if (!sku) {
            throw new Error(`Invalid or deleted skuId: ${item.skuId}`);
          }

          // ============================
          // 7️⃣ Normalize Batch
          // ============================
          if (item.batchNumber) {
            item.batchNumber = item.batchNumber.trim();
          }
     
          // let availableQuantity = item.stockQuantity;
          // ============================
          // 8️⃣ Expiry Fix (DATE ONLY)
          // ============================
          let expiryDate: Date | undefined;

          if (item.expiryDate) {
            const d = new Date(item.expiryDate);
            d.setUTCHours(0, 0, 0, 0); // normalize
            expiryDate = d;
          }

          // ============================
          // 9️⃣ Find Existing Inventory
          // ============================
          const key = `${item.skuId}-${item.warehouseId}}`;
          let inventory = inventoryMap.get(key);

          // ============================
          // 🔟 CREATE / UPDATE
          // ============================
          if (inventory) {
            // Do not mutate stock in create API for existing inventory key.
            // This prevents accidental stock inflation on repeated create calls.
            throw new Error(
              `Inventory already exists for skuId=${item.skuId}, warehouseId=${item.warehouseId}}. Use update API for stock changes.`
            );

          } else {
            inventory = inventoryRepo.create({
              inventoryName: normalizedName,
              stockQuantity: item.stockQuantity,
              warehouseId: item.warehouseId,
              skuId: sku.skuId,
              productId: sku.productId,
              // batchNumber: item.batchNumber || undefined,
              expiryDate,
              stockInDate: item.stockInDate
                ? new Date(item.stockInDate)
                : new Date(),
              reorderLevel: item.reorderLevel,
              taxId: item.taxId,
              availableQuantity: item.stockQuantity, // Initial available = stock
            });

            inventoryMap.set(key, inventory);
          }

          results.push(inventory);
        }

        return await inventoryRepo.save(results);
      }
    );

    return {
      status: STATUSCODES.SUCCESS,
      message: "Inventory processed successfully",
      data: result,
    };

  } catch (err: any) {
    console.error("Create Inventory error:", err);

    if ((err?.message || "").includes("Inventory already exists for")) {
      return {
        status: STATUSCODES.CONFLICT,
        message: err.message,
      };
    }

    return {
      status: STATUSCODES.BAD_REQUEST,
      message: err.message || "Failed to process inventory",
    };
  }
}

async updateInventory(
  input: UpdateInventoryDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    if (!input.inventory || input.inventory.length === 0) {
      throw new Error("Inventory cannot be empty");
    }

    if (input.inventory.length > 100) {
      throw new Error("Maximum 100 items allowed per request");
    }

    const inventoryIds = input.inventory.map(i => i.inventoryId);

    const existingInventories = await this.inventoryRepo.find({
      where: {
        inventoryId: In(inventoryIds),
        isDeleted: false,
      },
    });

    const inventoryMap = new Map(
      existingInventories.map(i => [i.inventoryId, i])
    );

    const result = await this.inventoryRepo.manager.transaction(
      async manager => {
        const repo = manager.getRepository(Inventory);
        const updatedItems: Inventory[] = [];

        for (const item of input.inventory) {

          if (!item.inventoryId) {
            throw new Error("inventoryId is required");
          }

          const existing = inventoryMap.get(item.inventoryId);

          if (!existing) {
            throw new Error(`Inventory not found: ${item.inventoryId}`);
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

          // ❌ Prevent direct stock update
          if (item.stockQuantity !== undefined) {
            throw new Error(
              "Stock cannot be updated directly. Use batch API."
            );
          }

          updatedItems.push(existing);
        }

        return await repo.save(updatedItems);
      }
    );

    return {
      status: STATUSCODES.SUCCESS,
      message: "Inventory updated successfully",
      data: result,
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
      where: { isDeleted: false },
      relations: {
        product: true,
        warehouse: true,
        batches: true, // 👈 IMPORTANT (relation must exist)
      },
      order: { createdAt: "DESC" },
    });

    if (!inventories.length) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "No inventory found",
      };
    }

    // ✅ Calculate availableQuantity from batches
    const updatedInventories = inventories.map(inv => {
      const availableQuantity = (inv.batches || []).reduce(
        (sum, batch) =>
          sum + ((batch.currentStock || 0) - (batch.reservedStock || 0)),
        0
      );

      return {
        ...inv,
        availableQuantity,
      };
    });

    return {
      status: STATUSCODES.SUCCESS,
      message: "Inventory list fetched successfully",
      data: updatedInventories,
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
      const { warehouseId,inventoryId } = input;

      const inventories = await this.inventoryRepo.find({
        relations: ["product", "warehouse", "tax"],
        where: { 
          warehouseId: String(warehouseId),
          inventoryId: inventoryId,
          isDeleted: false,  
        },
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
      relations: ["product","batches"],
    });

    if (!inventory) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "No inventory found",
      };
    }

        const availableQuantity = inventory.batches
      ? inventory.batches.reduce(
          (sum, batch) =>
            sum + ((batch.currentStock || 0) - (batch.reservedStock || 0)),
          0
        )
      : 0;

    return {
      status: STATUSCODES.SUCCESS,
      message: "Inventory fetched successfully",
      data: { ...inventory, availableQuantity },
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
