import { Inventory, InventoryRepository } from "../../../../core/DB/Entities/inventory";
// import { Sku } from "../Entities/sku.entity";
import { Warehouse } from "../../../../core/DB/Entities/warehouse.entity";
import { 
GetInventoryList,  
CreateInventoryDto ,
DeleteInventoryDto,  
InventoryItemDto ,
UpdateInventoryDto 
} from "../../../../core/types/InventoryService/InventoryService";
import {  STATUSCODES} from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";

class InventoryService {
  private inventoryRepo = InventoryRepository();

  constructor() {}


async createInventory(input: CreateInventoryDto, payload: IUser): Promise<IApiResponse> {
  try {
    const inventories: Inventory[] = [];

    for (const item of input.inventory) {
      if (!item.productId && !item.skuId) {
        throw new Error(`Either productId or skuId is required for warehouse ${item.warehouseId}`);
      }

      // ✅ Directly create Inventory instance
      const inventory = new Inventory();

     inventory.productId = item.productId ?? undefined;
inventory.skuId = item.skuId ?? undefined;
inventory.batchNumber = item.batchNumber ?? undefined;
inventory.expiryDate = item.expiryDate ? new Date(item.expiryDate) : undefined;
inventory.reorderLevel = item.reorderLevel ?? undefined;
inventory.stockInDate = item.stockInDate ? new Date(item.stockInDate) : undefined;
inventory.stockOutDate = item.stockOutDate ? new Date(item.stockOutDate) : undefined;
inventory.taxId = item.taxId ?? undefined;
inventory.schemeId = item.schemeId ?? undefined;
inventory.discountId = item.discountId ?? undefined;
inventory.warehouseId = item.warehouseId ?? undefined;

      inventories.push(inventory);
    }

    // ✅ Save all inventories at once
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
  async updateInventory(input: UpdateInventoryDto, payload: IUser): Promise<IApiResponse> {
    try {
      const updatedItems: Inventory[] = [];

      for (const item of input.inventory) {
        if (!item.inventoryId) return { status: STATUSCODES.BAD_REQUEST, message: "inventoryId is required for update" };

        const existing = await this.inventoryRepo.findOne({ where: { inventoryId: item.inventoryId } });
        if (!existing) return { status: STATUSCODES.NOT_FOUND, message: `Inventory not found with id ${item.inventoryId}` };

        // Update only provided fields
        Object.assign(existing, {
          stockQuantity: item.stockQuantity,
          reservedQuantity: item.reservedQuantity ?? existing.reservedQuantity,
          batchNumber: item.batchNumber ?? existing.batchNumber,
          expiryDate: item.expiryDate ?? existing.expiryDate,
          reorderLevel: item.reorderLevel ?? existing.reorderLevel,
          stockInDate: item.stockInDate ?? existing.stockInDate,
          stockOutDate: item.stockOutDate ?? existing.stockOutDate,
          taxId: item.taxId ?? existing.tax,
          schemeId: item.schemeId ?? existing.schemeId,
          discountId: item.discountId ?? existing.discountId,
        });

        const saved = await this.inventoryRepo.save(existing);
        updatedItems.push(saved);
      }

      return { status: STATUSCODES.SUCCESS, message: "Inventory updated successfully", data: updatedItems };
    } catch (err: any) {
      console.error("Update Inventory error:", err);
      return { status: STATUSCODES.BAD_REQUEST, message: "Failed to update inventory", data: err?.message || err };
    }
  }

  // =======================
  // 3️⃣ DELETE INVENTORY
  // =======================
  async deleteInventory(input: DeleteInventoryDto, payload: IUser): Promise<IApiResponse> {
    try {
      const { inventoryIds } = input;

      const existingItems = await this.inventoryRepo.findByIds(inventoryIds);
      if (!existingItems || existingItems.length === 0) return { status: STATUSCODES.BAD_REQUEST, message: "Inventory items not found" };

      await this.inventoryRepo
        .createQueryBuilder()
        .update(Inventory)
        .set({ /* optionally mark as deleted */ })
        .whereInIds(inventoryIds)
        .execute();

      return { status: STATUSCODES.SUCCESS, message: `${existingItems.length} inventory item(s) deleted successfully` };
    } catch (err: any) {
      console.error("Delete Inventory error:", err);
      return { status: STATUSCODES.BAD_REQUEST, message: "Failed to delete inventory", data: err?.message || err };
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
        relations: ["sku", "product", "warehouse", "tax"],
      });

      if (!inventories || inventories.length === 0) return { status: STATUSCODES.NOT_FOUND, message: "No inventory found" };

      return { status: STATUSCODES.SUCCESS, message: "Inventory fetched successfully", data: inventories };
    } catch (err: any) {
      console.error("Get Inventory error:", err);
      return { status: STATUSCODES.BAD_REQUEST, message: "Failed to fetch inventory", data: err?.message || err };
    }
  }
}

export { InventoryService };
