import { Inventory } from "../../../../core/DB/Entities/inventory";
import { Batch } from "../../../../core/DB/Entities/inventoryBatch.entity";
import { Sku } from "../../../../core/DB/Entities/sku.entity";
import { DbConnections } from "../../../../core/DB/postgresdb";
import {
  BatchStatusEnum,
  QualityStatusEnum,
  STATUSCODES,
  StorageConditionEnum,
} from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateGrnItemByIdsDto,
  DeleteGrnItemDto,
  GetGrnItemByIdDto,
  GrnItemListDto,
  ProcessGrnItemDto,
  UpdateGrnItemDto,
} from "../../../../core/types/GrnItemService/GrnItemService";
import { GrnItem } from "../../../../core/DB/Entities/grnItem.entity";
import { GrnHeader } from "../../../../core/DB/Entities/grnHeader.entity"

class GrnItemController {
  // UI-driven create (Inventory & Batch already selected/created):
  // - validates inventory + batch exist
  // - validates batch belongs to inventory
  // - updates stock in both
  // - creates a grn_item row
async createGrnItemByIds(
  input: CreateGrnItemByIdsDto,
  _payload: IUser
): Promise<IApiResponse> {
  try {
    const { grnId, skuId, inventoryId, batchId, receivedQty } = input;

    if (receivedQty <= 0) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Received quantity must be greater than zero",
        data: null,
      };
    }

    const connection = DbConnections.AppDbConnection.getConnection();

    return await connection.transaction(async (manager) => {
      const inventoryRepo = manager.getRepository(Inventory);
      const batchRepo = manager.getRepository(Batch);
      const grnItemRepo = manager.getRepository(GrnItem);
      const grnRepo = manager.getRepository(GrnHeader);

      // ✅ Check GRN exists
      const grn = await grnRepo.findOne({
        where: { grnId, isDeleted: false },
      });

      if (!grn) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "GRN not found",
          data: null,
        };
      }

      // ✅ Get Inventory with lock
      const inventory = await inventoryRepo.findOne({
        where: { inventoryId, isDeleted: false },
        lock: { mode: "pessimistic_write" },
      });

      if (!inventory) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Inventory not found",
          data: null,
        };
      }

      // ✅ SKU match validation
      if (inventory.skuId !== skuId) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Selected inventory does not match selected SKU",
          data: null,
        };
      }

            if (inventory.warehouseId !== grn.warehouseId) {
        throw new Error(
          "Inventory does not belong to the same warehouse as GRN"
        );
      }
      // ✅ Get Batch with lock
      const batch = await batchRepo.findOne({
        where: { batchId, isDeleted: false },
        lock: { mode: "pessimistic_write" },
      });

      if (!batch) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Batch not found",
          data: null,
        };
      }

      // ✅ Ensure batch belongs to inventory
      if (batch.inventoryId !== inventoryId) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Selected batch does not belong to selected inventory",
          data: null,
        };
      }

       const existingItem = await grnItemRepo.findOne({
        where: {
          grnId,
          inventoryId,
          batchId,
        },
      });
           if (existingItem) {
        throw new Error(
          "GRN item already exists for this GRN + Inventory + Batch"
        );
      }

      // ✅ Update batch stock
      batch.currentStock += receivedQty;
      await batchRepo.save(batch);

      // ✅ Update inventory stock
      inventory.stockQuantity += receivedQty;
      await inventoryRepo.save(inventory);

      // ✅ Create GRN item
      const grnItem = grnItemRepo.create({
        grnId,
        skuId,
        inventoryId,
        batchId,
        receivedQty,
      });

      await grnItemRepo.save(grnItem);

      return {
        status: STATUSCODES.SUCCESS,
        message: "GRN item created successfully",
        data: {
          grnItemId: grnItem.grnItemId,
          grnId,
          skuId,
          inventoryId,
          batchId,
          receivedQty,
          inventoryStockQuantity: inventory.stockQuantity,
          batchCurrentStock: batch.currentStock,
        },
      };
    });
  } catch (error: any) {
    return {
      status: STATUSCODES.BAD_REQUEST,
      message: error?.message || "Failed to create GRN item",
      data: error,
    };
  }
}


  // async processGrnItem(
  //   input: ProcessGrnItemDto,
  //   _payload: IUser
  // ): Promise<IApiResponse> {
  //   try {
  //     const {
  //       grnId,
  //       skuId,
  //       warehouseId,
  //       batchNo,
  //       receivedQty,
  //       unit,
  //       mfgDate,
  //       expiryDate,
  //       receivedDate,

  //     } = input;

  //     const connection = DbConnections.AppDbConnection.getConnection();

  //     const result = await connection.transaction(async (manager) => {
  //       const inventoryRepo = manager.getRepository(Inventory);
  //       const batchRepo = manager.getRepository(Batch);
  //       const skuRepo = manager.getRepository(Sku);
  //       const grnItemRepo = manager.getRepository(GrnItem);

  //       // 1️⃣ Validate SKU exists to derive productId
  //       const sku = await skuRepo.findOne({
  //         where: { skuId },
  //         select: ["skuId", "productId"],
  //       });

  //       if (!sku) {
  //         return {
  //           status: STATUSCODES.BAD_REQUEST,
  //           message: `Invalid skuId: ${skuId}`,
  //         } as IApiResponse;
  //       }

  //       // 2️⃣ Find or create Inventory by (skuId + warehouseId)
  //       let inventory = await inventoryRepo.findOne({
  //         where: {
  //           skuId,
  //           warehouseId,
  //           isDeleted: false,
  //         },
  //         lock: { mode: "pessimistic_write" },
  //       });

  //       const isNewInventory = !inventory;

  //       if (!inventory) {
  //         inventory = inventoryRepo.create({
  //           skuId: sku.skuId,
  //           productId: sku.productId,
  //           warehouseId,
  //           stockQuantity: 0,
  //           inventoryName: `SKU-${sku.skuId}-${warehouseId}`,
  //         });

  //         inventory = await inventoryRepo.save(inventory);
  //       }

  //       // 3️⃣ Find or create Batch under that Inventory by batchNo
  //       let batch = await batchRepo.findOne({
  //         where: {
  //           inventoryId: inventory.inventoryId,
  //           batchNo,
  //           isDeleted: false,
  //         },
  //         lock: { mode: "pessimistic_write" },
  //       });

  //       const isNewBatch = !batch;

  //       if (batch) {
  //         // Update existing batch stock
  //         batch.currentStock += receivedQty;

  //         if (mfgDate !== undefined) {
  //           batch.mfgDate = mfgDate ? new Date(mfgDate) : undefined;
  //         }
  //         if (expiryDate !== undefined) {
  //           batch.expiryDate = expiryDate ? new Date(expiryDate) : undefined;
  //         }
  //         if (receivedDate !== undefined) {
  //           batch.receivedDate = receivedDate ? new Date(receivedDate) : undefined;
  //         }
  //       } else {
  //         // Create new batch
  //         batch = batchRepo.create({
  //           inventoryId: inventory.inventoryId,
  //           batchNo,
  //           currentStock: receivedQty,
  //           reservedStock: 0,
  //           unit,
  //           status: BatchStatusEnum.ACTIVE,
  //           qualityStatus: QualityStatusEnum.PENDING,
  //           storageCondition: StorageConditionEnum.AMBIENT,
  //           mfgDate: mfgDate ? new Date(mfgDate) : undefined,
  //           expiryDate: expiryDate ? new Date(expiryDate) : undefined,
  //           receivedDate: receivedDate ? new Date(receivedDate) : undefined,
  //         });
  //       }

  //       await batchRepo.save(batch);

  //       // 4️⃣ Roll up quantity to Inventory
  //       inventory.stockQuantity += receivedQty;
  //       await inventoryRepo.save(inventory);

  //       // 5️⃣ Create GRN Item row
  //       const grnItem = grnItemRepo.create({
  //         grnId,
  //         skuId,
  //         inventoryId: inventory.inventoryId,
  //         batchId: batch.batchId,
  //         receivedQty,
  //       });
  //       await grnItemRepo.save(grnItem);

  //       return {
  //         status: STATUSCODES.SUCCESS,
  //         message: "GRN item processed successfully",
  //         data: {
  //           grnItemId: grnItem.grnItemId,
  //           grnId,
  //           inventoryId: inventory.inventoryId,
  //           batchId: batch.batchId,
  //           isNewInventory,
  //           isNewBatch,
  //           inventoryStockQuantity: inventory.stockQuantity,
  //           batchCurrentStock: batch.currentStock,
  //         },
  //       } as IApiResponse;
  //     });

  //     return result;
  //   } catch (error: any) {
  //     return {
  //       status: STATUSCODES.BAD_REQUEST,
  //       message: error?.message || "Failed to process GRN item",
  //       data: error,
  //     };
  //   }
  // }

  async getGrnItemById(
    input: GetGrnItemByIdDto,
    _payload: IUser
  ): Promise<IApiResponse> {
    try {
      const { grnItemId } = input;

      const repo = DbConnections.AppDbConnection.getConnection().getRepository(GrnItem);

      const item = await repo.findOne({
        where: {
          grnItemId,
          isDeleted: false,
        },
        relations: ["grnHeader", "inventory", "batch"],
      });

      if (!item) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "GRN Item not found",
          data: null,
        };
      }

      return {
        status: STATUSCODES.SUCCESS,
        message: "GRN Item fetched successfully",
        data: item,
      };
    } catch (error: any) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: error?.message || "Failed to get GRN item",
        data: error,
      };
    }
  }

  async listGrnItems(
    input: GrnItemListDto,
    _payload: IUser
  ): Promise<IApiResponse> {
    try {
      const repo = DbConnections.AppDbConnection.getConnection().getRepository(GrnItem);
      const qb = repo
        .createQueryBuilder("item")
        .leftJoinAndSelect("item.grnHeader", "grn")
        .leftJoinAndSelect("item.inventory", "inventory")
        .leftJoinAndSelect("item.batch", "batch")
        .where("item.isDeleted = false");

      if (input.grnId) {
        qb.andWhere("item.grnId = :grnId", { grnId: input.grnId });
      }
      if (input.skuId) {
        qb.andWhere("item.skuId = :skuId", { skuId: input.skuId });
      }
      if (input.inventoryId) {
        qb.andWhere("item.inventoryId = :inventoryId", {
          inventoryId: input.inventoryId,
        });
      }
      if (input.batchId) {
        qb.andWhere("item.batchId = :batchId", { batchId: input.batchId });
      }

      qb.orderBy("item.createdAt", "DESC");

      const items = await qb.getMany();

      return {
        status: STATUSCODES.SUCCESS,
        message: "GRN Items fetched successfully",
        data: items,
      };
    } catch (error: any) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: error?.message || "Failed to list GRN items",
        data: error,
      };
    }
  }

  async deleteGrnItem(
  input: DeleteGrnItemDto,
  _payload: IUser
): Promise<IApiResponse> {
  try {
    const { grnItemId } = input;

    const connection = DbConnections.AppDbConnection.getConnection();

    return await connection.transaction(async (manager) => {
      const grnItemRepo = manager.getRepository(GrnItem);
      const inventoryRepo = manager.getRepository(Inventory);
      const batchRepo = manager.getRepository(Batch);

      // ✅ Lock GRN item
      const item = await grnItemRepo.findOne({
        where: { grnItemId, isDeleted: false },
        lock: { mode: "pessimistic_write" },
      });

      if (!item) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "GRN Item not found",
          data: null,
        };
      }

      // ✅ Lock Inventory
      const inventory = await inventoryRepo.findOne({
        where: { inventoryId: item.inventoryId, isDeleted: false },
        lock: { mode: "pessimistic_write" },
      });

      if (!inventory) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Inventory not found",
          data: null,
        };
      }

      // ✅ Lock Batch
      const batch = await batchRepo.findOne({
        where: { batchId: item.batchId, isDeleted: false },
        lock: { mode: "pessimistic_write" },
      });

      if (!batch) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Batch not found",
          data: null,
        };
      }

      // ✅ Stock validation before subtracting
      if (batch.currentStock < item.receivedQty) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Invalid batch stock state",
          data: null,
        };
      }

      if (inventory.stockQuantity < item.receivedQty) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Invalid inventory stock state",
          data: null,
        };
      }

      // ✅ Reverse stock
      batch.currentStock -= item.receivedQty;
      await batchRepo.save(batch);

      inventory.stockQuantity -= item.receivedQty;
      await inventoryRepo.save(inventory);

      // ✅ Soft delete GRN item
      item.isDeleted = true;
      await grnItemRepo.save(item);

      return {
        status: STATUSCODES.SUCCESS,
        message: "GRN Item deleted successfully",
        data: {
          grnItemId,
          updatedInventoryStock: inventory.stockQuantity,
          updatedBatchStock: batch.currentStock,
        },
      };
    });
  } catch (error: any) {
    return {
      status: STATUSCODES.BAD_REQUEST,
      message: error?.message || "Failed to delete GRN item",
      data: error,
    };
  }
}

async updateGrnItem(
  input: UpdateGrnItemDto,
  _payload: IUser
): Promise<IApiResponse> {
  try {
    const { grnItemId, receivedQty } = input;

    if (receivedQty <= 0) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Received quantity must be greater than zero",
        data: null,
      };
    }

    const connection = DbConnections.AppDbConnection.getConnection();

    return await connection.transaction(async (manager) => {
      const grnItemRepo = manager.getRepository(GrnItem);
      const inventoryRepo = manager.getRepository(Inventory);
      const batchRepo = manager.getRepository(Batch);
       const grnRepo = manager.getRepository(GrnHeader);

      // ✅ Lock GRN item
      const item = await grnItemRepo.findOne({
        where: { grnItemId, isDeleted: false },
        lock: { mode: "pessimistic_write" },
      });

      if (!item) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "GRN Item not found",
          data: null,
        };
      }

           const grn = await grnRepo.findOne({
        where: { grnId: item.grnId, isDeleted: false },
      });

      if (!grn) {
        throw new Error("GRN not found");
      }


      const delta = receivedQty - item.receivedQty;

      // ✅ Lock inventory
      const inventory = await inventoryRepo.findOne({
        where: { inventoryId: item.inventoryId, isDeleted: false },
        lock: { mode: "pessimistic_write" },
      });

      if (!inventory) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Inventory not found",
          data: null,
        };
      }

      // ✅ Lock batch
      const batch = await batchRepo.findOne({
        where: { batchId: item.batchId, isDeleted: false },
        lock: { mode: "pessimistic_write" },
      });

      if (!batch) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Batch not found",
          data: null,
        };
      }

      // ✅ If decreasing quantity, validate stock
      if (delta < 0) {
        const absDelta = Math.abs(delta);

        if (batch.currentStock < absDelta) {
          return {
            status: STATUSCODES.BAD_REQUEST,
            message: "Insufficient batch stock for update",
            data: null,
          };
        }

              if (batch.currentStock + delta < 0) {
        throw new Error("Batch stock cannot go negative");
      }

      if (inventory.stockQuantity + delta < 0) {
        throw new Error("Inventory stock cannot go negative");
      }

        if (inventory.stockQuantity < absDelta) {
          return {
            status: STATUSCODES.BAD_REQUEST,
            message: "Insufficient inventory stock for update",
            data: null,
          };
        }
      }

      // ✅ Apply stock change
      batch.currentStock += delta;
      await batchRepo.save(batch);

      inventory.stockQuantity += delta;
      await inventoryRepo.save(inventory);

      // ✅ Update GRN item
      item.receivedQty = receivedQty;
      await grnItemRepo.save(item);

      return {
        status: STATUSCODES.SUCCESS,
        message: "GRN Item updated successfully",
        data: {
          grnItemId,
          updatedInventoryStock: inventory.stockQuantity,
          updatedBatchStock: batch.currentStock,
          receivedQty,
        },
      };
    });
  } catch (error: any) {
    return {
      status: STATUSCODES.BAD_REQUEST,
      message: error?.message || "Failed to update GRN item",
      data: error,
    };
  }
}

}

export { GrnItemController as GrnItemService };

