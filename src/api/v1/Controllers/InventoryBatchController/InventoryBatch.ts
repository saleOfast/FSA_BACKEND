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

    // 🔹 2. Basic validations
    if (reservedStock > currentStock) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Reserved stock cannot be greater than current stock",
      };
    }

    // 🔹 3. Auto-expire logic
    let finalStatus = status;
    if (expiryDate && new Date(expiryDate) < new Date()) {
      finalStatus = BatchStatusEnum.EXPIRED;
    }

    // 🔹 4. Create batch
    const batch = BatchRepository().create({
      ...input,
      reservedStock,
      status: finalStatus ?? BatchStatusEnum.ACTIVE,
      qualityStatus: qualityStatus ?? QualityStatusEnum.PENDING,
      createdAt: new Date(),
        updatedAt: new Date(),
    });

    await BatchRepository().save(batch);

    // 🔹 5. Update inventory stock
    inventory.stockQuantity += currentStock;
    await this.inventoryRepo.save(inventory);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Inventory batch created successfully",
      data: batch,
    };
  } catch (error) {
    throw error;
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
    await this.inventoryBatchRepo.save(batch);

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
      data: batch,
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
      message: "Inventory batch list retrieved successfully",
      data: {
        data,
      },
    };
  } catch (error) {
    throw error;
  }
}

async updateInventoryBatchById(
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

    await this.inventoryBatchRepo.save(batch);

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