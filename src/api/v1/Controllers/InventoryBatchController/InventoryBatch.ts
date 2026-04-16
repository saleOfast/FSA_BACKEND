import { Inventory, InventoryRepository } from "../../../../core/DB/Entities/inventory";
import {  BatchStatusEnum, STATUSCODES} from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateInventoryBatchDto, GetInventoryBatchByIdDto, GetInventoryBatchListDto, DeleteInventoryBatchByIdDto, UpdateInventoryBatchDto } from "../../../../core/types/InventoryBatchService/InventoryBatchService";
import { Batch, BatchRepository} from "../../../../core/DB/Entities/inventoryBatch.entity";
import { QualityStatusEnum, StorageConditionEnum} from "../../../../core/types/Constent/common"

class InventoryBatchController {
    private inventoryBatchRepo = BatchRepository();
    private inventoryRepo = InventoryRepository();

    constructor() { }

  async createInventoryBatch(
  input: CreateInventoryBatchDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const {
      inventoryId,
      currentStock,
      reservedStock=0,
      expiryDate,
      qualityStatus,
      status,
    } = input;

    // 🔹 1. Validate inventory exists
    const inventory = await this.inventoryRepo.findOne({
      where: {
        inventoryId,
        isDeleted: false,
      },
    });

    if (!inventory) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Inventory not found",
      };
    }

        if (currentStock < 0) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Current stock cannot be negative",
      };
    }

    if (reservedStock < 0) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Reserved stock cannot be negative",
      };
    }
    
    // 🔹 2. Basic validations
    if (reservedStock > currentStock) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Reserved stock cannot be greater than current stock",
      };
    }
    // 🔹 3. Auto-expire logic (date-only, same-day not expired)
    const normalizeToMidnight = (d?: Date) => {
      if (!d) return null;
      const tmp = new Date(d);
      tmp.setHours(0, 0, 0, 0);
      return tmp;
    };

    const expiryMidnight = normalizeToMidnight(expiryDate ? new Date(expiryDate) : undefined);
    const expiryDateYMD = expiryMidnight
      ? `${expiryMidnight.getFullYear()}-${String(expiryMidnight.getMonth() + 1).padStart(2, "0")}-${String(expiryMidnight.getDate()).padStart(2, "0")}`
      : null;
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    let finalStatus = status;
    if (expiryMidnight && expiryMidnight < todayMidnight) {
      finalStatus = BatchStatusEnum.EXPIRED;
    }

    // 🔹 4. Transaction: save batch + re-sync inventory stock
    const connection = this.inventoryRepo.manager.connection;
    const batch = await connection.transaction(async (manager) => {
      const batchRepo = manager.getRepository(Batch);
      const inventoryRepo = manager.getRepository(Inventory);

      // Re-check duplicate within the same transaction using proper key: inventoryId + batchNo + expiryDate
      const duplicateBatch = await batchRepo
        .createQueryBuilder("batch")
        .where("batch.inventoryId = :inventoryId", { inventoryId })
        .andWhere("batch.isDeleted = false")
        .andWhere("batch.batchNo = :batchNo", { batchNo: input.batchNo })
        .andWhere(
          `(
            (:expiryDate::date IS NULL AND batch.expiryDate IS NULL) OR batch.expiryDate = :expiryDate::date
          )`,
          { expiryDate: expiryDateYMD }
        )
        .getOne();

      if (duplicateBatch) {
        throw new Error("Batch already exists for same inventory, batchNo and expiryDate");
      }

      const b = batchRepo.create({
        ...input,
        reservedStock,
        status: finalStatus ?? BatchStatusEnum.ACTIVE,
        qualityStatus: qualityStatus ?? QualityStatusEnum.PENDING,
        expiryDate: expiryMidnight ?? undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await batchRepo.save(b);

      // 🔹 Sync inventory stock = SUM(non-deleted batches.currentStock)
      const total = await batchRepo
        .createQueryBuilder("b")
        .select("COALESCE(SUM(b.currentStock), 0)", "total")
        .where("b.inventoryId = :inventoryId", { inventoryId })
        .andWhere("b.isDeleted = false")
        .getRawOne();

      inventory.stockQuantity = Number(total.total) || 0;
      await inventoryRepo.save(inventory);

      return b;
    });

   return {
  status: STATUSCODES.SUCCESS,
  message: "Inventory batch created successfully",
  data: {
    ...batch,
    availableQty: currentStock - reservedStock,
    isExpired: expiryMidnight ? expiryMidnight < todayMidnight : false,
  },
};

  } catch (error) {
    const msg = (error as any)?.message || "Failed to create inventory batch";
    if (msg.includes("Batch already exists")) {
      return {
        status: STATUSCODES.CONFLICT,
        message: msg,
      };
    }
    return {
      status: STATUSCODES.BAD_REQUEST,
      message: msg,
    };
  }
}

async DeleteInventoryBatch(input: DeleteInventoryBatchByIdDto, payload: IUser): Promise<IApiResponse> {
  try {
    const { batchId } = input;

    const batch = await this.inventoryBatchRepo.findOne({
      where: {
        batchId,
        isDeleted: false,
      },
    });

    if (!batch) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Inventory batch not found",
      };
    }

    // 🔹 Soft delete the batch
    batch.isDeleted = true;
    const connection = this.inventoryBatchRepo.manager.connection;
    await connection.transaction(async (manager) => {
      const batchRepo = manager.getRepository(Batch);
      const inventoryRepo = manager.getRepository(Inventory);

      await batchRepo.save(batch);

      // 🔹 Sync inventory after delete
      const invId = batch.inventoryId;
      const total = await batchRepo
        .createQueryBuilder("b")
        .select("COALESCE(SUM(b.currentStock), 0)", "total")
        .where("b.inventoryId = :inventoryId", { inventoryId: invId })
        .andWhere("b.isDeleted = false")
        .getRawOne();

      const inv = await inventoryRepo.findOne({ where: { inventoryId: invId, isDeleted: false } });
      if (inv) {
        inv.stockQuantity = Number(total.total) || 0;
        await inventoryRepo.save(inv);
      }
    });

    return {
      status: STATUSCODES.SUCCESS,
      message: "Inventory batch deleted successfully",
      data: null,
    };
  } catch (error) {
    throw error;
  }
}
async getInventoryBatchById(
  input: GetInventoryBatchByIdDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const { batchId } = input;

    const batch = await this.inventoryBatchRepo
      .createQueryBuilder("batch")
      .leftJoinAndSelect("batch.inventory", "inventory")
      .where("batch.batchId = :batchId", { batchId })
      .andWhere("batch.isDeleted = false")
      .getOne();

    if (!batch) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Inventory batch not found",
      };
    }

  return {
  status: STATUSCODES.SUCCESS,
  message: "Inventory batch retrieved successfully",
  data: {
    ...batch,
    availableQty: batch.currentStock - batch.reservedStock,
    isExpired: batch.expiryDate
      ? new Date(batch.expiryDate) < new Date()
      : false,
  },
};

  } catch (error) {
    throw error;
  }
}
async getInventoryBatchList(
  input: GetInventoryBatchListDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const data = await this.inventoryBatchRepo
      .createQueryBuilder("batch")
      .leftJoinAndSelect("batch.inventory", "inventory")
      .where("batch.isDeleted = false")
      .andWhere("inventory.isDeleted = false")
      .getMany();

return {
  status: STATUSCODES.SUCCESS,
  message: "Inventory batch retrieved successfully",
  data: {
    ...data.map((batch) => ({
      ...batch,
      availableQty: batch.currentStock - batch.reservedStock,
      isExpired: batch.expiryDate
        ? new Date(batch.expiryDate) < new Date()
        : false,
    })),
  },
};

  } catch (error) {
    throw error;
  }
}

async updateInventoryBatch(
  input: UpdateInventoryBatchDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const { batchId, ...updateData } = input;

    const batch = await this.inventoryBatchRepo.findOne({
      where: {
        batchId,
        isDeleted: false,
      },
    });

    if (!batch) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Inventory batch not found",
      };
    }

    Object.assign(batch, updateData);
    batch.updatedAt = new Date();
    const connection = this.inventoryBatchRepo.manager.connection;
    await connection.transaction(async (manager) => {
      const batchRepo = manager.getRepository(Batch);
      const inventoryRepo = manager.getRepository(Inventory);

      await batchRepo.save(batch);

      // 🔹 Sync inventory after update
      const invId = batch.inventoryId;
      const total = await batchRepo
        .createQueryBuilder("b")
        .select("COALESCE(SUM(b.currentStock), 0)", "total")
        .where("b.inventoryId = :inventoryId", { inventoryId: invId })
        .andWhere("b.isDeleted = false")
        .getRawOne();

      const inv = await inventoryRepo.findOne({ where: { inventoryId: invId, isDeleted: false } });
      if (inv) {
        inv.stockQuantity = Number(total.total) || 0;
        await inventoryRepo.save(inv);
      }
    });

    return {
      status: STATUSCODES.SUCCESS,
      message: "Inventory batch updated successfully",
      data: batch,
    };
  } catch (error) {
    throw error;
  }
}
}
export { InventoryBatchController as InventoryBatchService };