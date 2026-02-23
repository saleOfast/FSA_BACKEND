import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateDeliveryDto,
  UpdateDeliveryHeaderDto,
  UpdateDeliveryItemDto,
  GetDeliveryByIdDto,
  DeleteDeliveryDto,
  ListDeliveryDto,CreateDeliveryItemDto,CancelDeliveryDto,
  ListDeliveryItemDto,
  GetDeliveryItemByIdDto,DeleteDeliveryItemDto
} from "../../../../core/types/DeliveryService/DeliveryService";
import { DeliveryHeader, DeliveryHeaderRepository } from "../../../../core/DB/Entities/deliveryHeader.entity";
import { DeliveryItem, DeliveryItemRepository } from "../../../../core/DB/Entities/deliveryItem.entity";
import { SalesOrderHeaderRepository } from "../../../../core/DB/Entities/SalesOrderHeader.entity";
import { SalesOrderItemRepository,SalesOrderItem } from "../../../../core/DB/Entities/salesOrderItem.entity";
import { WarehouseRepository } from "../../../../core/DB/Entities/warehouse.entity";
import { DeliveryStatusEnum, OrderStatusEnum } from "../../../../core/types/Constent/common";
import { BatchRepository, Batch } from "../../../../core/DB/Entities/inventoryBatch.entity";
import { Inventory, InventoryRepository } from "../../../../core/DB/Entities/inventory";

class DeliveryController {
  private deliveryRepo = DeliveryHeaderRepository();
  private deliveryItemRepo = DeliveryItemRepository();
  private salesOrderRepo = SalesOrderHeaderRepository();
  private salesOrderItemRepo = SalesOrderItemRepository();
  private warehouseRepo = WarehouseRepository();
  private BatchRepo=BatchRepository();
private inventoryRepo=InventoryRepository()
  constructor() {}

async createDeliveryHeader(
  input: CreateDeliveryDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    // ==============================
    // 1️⃣ Validate Sales Order
    // ==============================
    const salesOrder = await this.salesOrderRepo.findOne({
      where: { soId: input.salesOrderId, isDeleted: false },
      relations: ["customer"],
    });

    if (!salesOrder) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Sales order not found",
        data: null,
      };
    }

    if (salesOrder.status !== OrderStatusEnum.CONFIRMED) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Only confirmed sales orders can create delivery",
        data: null,
      };
    }

    // ==============================
    // 2️⃣ Validate Warehouse
    // ==============================
    const warehouse = await this.warehouseRepo.findOne({
      where: { warehouseId: input.warehouseId, isDeleted: false },
    });

    if (!warehouse) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Warehouse not found",
        data: null,
      };
    }

    // ==============================
    // 3️⃣ Create Delivery Header ONLY
    // ==============================
    const deliveryHeader = this.deliveryRepo.create({
      salesOrderId: input.salesOrderId,
      customerId: salesOrder.customer.customerId,
      warehouseId: input.warehouseId,
      deliveryStatus:  input.deliveryStatus?? DeliveryStatusEnum.DRAFT,
      deliveryDate: input.deliveryDate
        ? new Date(input.deliveryDate)
        : null,
      vehicleNumber: input.vehicleNumber ?? null,
      transporterName: input.transporterName ?? null,
      driverName: input.driverName ?? null,
      driverMobile: input.driverMobile ?? null,
      ewayBillNo: input.ewayBillNo ?? null,
      dispatchDate: input.dispatchDate
        ? new Date(input.dispatchDate)
        : null,
      // createdBy: payload.emp_id,
    });

    await this.deliveryRepo.save(deliveryHeader);

    // ==============================
    // 4️⃣ Fetch Saved Header
    // ==============================
    const saved = await this.deliveryRepo.findOne({
      where: { deliveryId: deliveryHeader.deliveryId },
      relations: ["salesOrder", "customer", "warehouse"],
    });

    return {
      status: STATUSCODES.SUCCESS,
      message: "Delivery header created successfully",
      data: saved,
    };
  } catch (error) {
    throw error;
  }
}

async updateDeliveryHeader(
  deliveryId: string,
  input: UpdateDeliveryHeaderDto,
  payload: IUser
): Promise<IApiResponse> {

  const connection = this.deliveryRepo.manager.connection;

  return await connection.transaction(async (manager) => {

    const deliveryRepo = manager.getRepository(DeliveryHeader);
    const deliveryItemRepo = manager.getRepository(DeliveryItem);
    const inventoryRepo = manager.getRepository(Inventory);

    // 1️⃣ Lock Delivery Header ONLY (No relations here)
    const delivery = await deliveryRepo.findOne({
      where: { deliveryId, isDeleted: false },
      lock: { mode: "pessimistic_write" },
    });

    if (!delivery) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Delivery not found",
        data: null,
      };
    }

    // 2️⃣ Prevent modification if CANCELLED
    if (delivery.deliveryStatus === DeliveryStatusEnum.CANCELLED) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Cancelled delivery cannot be modified",
        data: null,
      };
    }

    const previousStatus = delivery.deliveryStatus;

    // 3️⃣ Fetch Items Separately (IMPORTANT for Postgres)
    const items = await deliveryItemRepo.find({
      where: { deliveryId: delivery.deliveryId, isDeleted: false },
    });

    // 4️⃣ Update Basic Fields
    if (input.deliveryDate !== undefined)
      delivery.deliveryDate = new Date(input.deliveryDate);

    if (input.vehicleNumber !== undefined)
      delivery.vehicleNumber = input.vehicleNumber;

    if (input.transporterName !== undefined)
      delivery.transporterName = input.transporterName;

    if (input.driverName !== undefined)
      delivery.driverName = input.driverName;

    if (input.driverMobile !== undefined)
      delivery.driverMobile = input.driverMobile;

    if (input.ewayBillNo !== undefined)
      delivery.ewayBillNo = input.ewayBillNo;

    if (input.dispatchDate !== undefined)
      delivery.dispatchDate = input.dispatchDate
  ? new Date(input.dispatchDate)
  : null;

    // 5️⃣ Handle Status Change
    if (input.deliveryStatus !== undefined) {

      // ❌ Prevent double dispatch
      if (
        previousStatus === DeliveryStatusEnum.DISPATCHED &&
        input.deliveryStatus === DeliveryStatusEnum.DISPATCHED
      ) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Delivery already dispatched",
          data: null,
        };
      }

      // 🚚 DISPATCH LOGIC
      if (
        previousStatus !== DeliveryStatusEnum.DISPATCHED &&
        input.deliveryStatus === DeliveryStatusEnum.DISPATCHED
      ) {

        if (!items.length) {
          return {
            status: STATUSCODES.BAD_REQUEST,
            message: "Cannot dispatch delivery without items",
            data: null,
          };
        }

        for (const item of items) {

          // Lock inventory row
          const inventory = await inventoryRepo.findOne({
            where: {
              skuId: item.skuId,
              warehouseId: delivery.warehouseId,
              isDeleted: false,
            },
            lock: { mode: "pessimistic_write" },
          });

          if (!inventory) {
            throw new Error(`Inventory not found for SKU ${item.skuId}`);
          }

          // ❌ Stock validation
          if (inventory.stockQuantity < item.dispatchedQty) {
            return {
              status: STATUSCODES.BAD_REQUEST,
              message: `Insufficient stock for SKU ${item.skuId}`,
              data: null,
            };
          }

          // Reduce stock safely
          inventory.stockQuantity -= item.dispatchedQty;
          await inventoryRepo.save(inventory);
        }
      }

      delivery.deliveryStatus = input.deliveryStatus;
    }

    // 6️⃣ Save Delivery
    await deliveryRepo.save(delivery);

    // 7️⃣ Fetch Updated Delivery with relations (NO LOCK NOW)
    const updated = await deliveryRepo.findOne({
      where: { deliveryId },
      relations: ["salesOrder", "customer", "warehouse", "items"],
    });

    return {
      status: STATUSCODES.SUCCESS,
      message: "Delivery updated successfully",
      data: updated,
    };
  });
}
  async getDeliveryById(input: GetDeliveryByIdDto, payload: IUser): Promise<IApiResponse> {
    try {
      const delivery = await this.deliveryRepo.findOne({
        where: { deliveryId: input.deliveryId, isDeleted: false },
        relations: ["salesOrder", "customer", "warehouse", "items", "items.orderItem", "items.sku", "items.product"],
      });
      if (!delivery) {
        return { status: STATUSCODES.NOT_FOUND, message: "Delivery not found", data: null };
      }
      return {
        status: STATUSCODES.SUCCESS,
        message: "Delivery fetched successfully",
        data: delivery,
      };
    } catch (error) {
      throw error;
    }
  }

  async listDeliveries(input: ListDeliveryDto, payload: IUser): Promise<IApiResponse> {
    try {
      const qb = this.deliveryRepo
        .createQueryBuilder("d")
        .leftJoinAndSelect("d.salesOrder", "so")
        .leftJoinAndSelect("d.customer", "customer")
        .leftJoinAndSelect("d.warehouse", "warehouse")
        .leftJoinAndSelect("d.items", "items")
        .where("d.isDeleted = false");
      if (input.salesOrderId) qb.andWhere("d.salesOrderId = :salesOrderId", { salesOrderId: input.salesOrderId });
      if (input.warehouseId) qb.andWhere("d.warehouseId = :warehouseId", { warehouseId: input.warehouseId });
      if (input.deliveryStatus) qb.andWhere("d.deliveryStatus = :deliveryStatus", { deliveryStatus: input.deliveryStatus });
      qb.orderBy("d.createdAt", "DESC");
      const page = input.page ?? 1;
      const limit = input.limit ?? 20;
      qb.skip((page - 1) * limit).take(limit);
      const [list, total] = await qb.getManyAndCount();
      return {
        status: STATUSCODES.SUCCESS,
        message: "Deliveries fetched successfully",
        data: { list, total, page, limit },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteDelivery(input: DeleteDeliveryDto, payload: IUser): Promise<IApiResponse> {
    try {
      const delivery = await this.deliveryRepo.findOne({
        where: { deliveryId: input.deliveryId ,isDeleted: false},
      });
      if (!delivery) {
        return { status: STATUSCODES.NOT_FOUND, message: "Delivery not found", data: null };
      }
    if (delivery.deliveryStatus === DeliveryStatusEnum.DISPATCHED) {
  return {
    status: STATUSCODES.BAD_REQUEST,
    message: "Dispatched delivery cannot be deleted. Cancel it instead.",
    data: null,
  };
}
      await this.deliveryRepo.save(delivery);
      return {
        status: STATUSCODES.SUCCESS,
        message: "Delivery deleted successfully",
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }


async createDeliveryItem(
  deliveryId: string,
  input: CreateDeliveryItemDto,
  payload: IUser
): Promise<IApiResponse> {

  const connection = this.deliveryRepo.manager.connection;

  return await connection.transaction(async (manager) => {

    const deliveryRepo = manager.getRepository(DeliveryHeader);
    const deliveryItemRepo = manager.getRepository(DeliveryItem);
    const salesOrderItemRepo = manager.getRepository(SalesOrderItem);
    const batchRepo = manager.getRepository(Batch);
    const inventoryRepo = manager.getRepository(Inventory);

    // ===============================
    // 1️⃣ Lock Delivery Header
    // ===============================
    const delivery = await deliveryRepo.findOne({
      where: { deliveryId, isDeleted: false },
      lock: { mode: "pessimistic_write" },
    });

    if (!delivery) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Delivery not found",
        data: null,
      };
    }

    if (delivery.deliveryStatus !== DeliveryStatusEnum.DRAFT) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Items can only be added in DRAFT status",
        data: null,
      };
    }

    // ===============================
    // 2️⃣ Lock Sales Order Item (NO relations here)
    // ===============================
    const orderItem = await salesOrderItemRepo.findOne({
      where: { id: input.orderItemId, isDeleted: false },
      lock: { mode: "pessimistic_write" },
    });

    if (!orderItem) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Sales order item not found",
        data: null,
      };
    }

    // Fetch relations separately (no lock)
    const orderItemWithRelations = await salesOrderItemRepo.findOne({
      where: { id: orderItem.id },
      relations: ["salesOrder", "sku", "product"],
    });

    if (!orderItemWithRelations) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Sales order item details not found",
        data: null,
      };
    }

    // Validate Sales Order match
    if (orderItemWithRelations.salesOrder.soId !== delivery.salesOrderId) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Order item does not belong to this delivery's sales order",
        data: null,
      };
    }

    // ===============================
    // 3️⃣ Prevent Duplicate in Same Delivery
    // ===============================
    const existing = await deliveryItemRepo.findOne({
      where: {
        deliveryId,
        orderItemId: input.orderItemId,
        isDeleted: false,
      },
    });

    if (existing) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Delivery item already exists in this delivery",
        data: null,
      };
    }

    // ===============================
    // 4️⃣ Deliverable Qty Calculation
    // ===============================
    const orderedQty = orderItem.saleQty;

    const totalDeliveredResult = await deliveryItemRepo
      .createQueryBuilder("di")
      .select("COALESCE(SUM(di.dispatchedQty),0)", "total")
      .where("di.orderItemId = :orderItemId", {
        orderItemId: input.orderItemId,
      })
      .andWhere("di.isDeleted = false")
      .getRawOne();

    const alreadyDelivered = Number(totalDeliveredResult.total);
    const deliverableQty = orderedQty - alreadyDelivered;

    if (deliverableQty <= 0) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "No quantity left to deliver",
        data: null,
      };
    }

    const dispatchedQty = input.dispatchedQty ?? deliverableQty;

    if (dispatchedQty <= 0) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Dispatched quantity must be greater than 0",
        data: null,
      };
    }

    if (dispatchedQty > deliverableQty) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: `Only ${deliverableQty} quantity left to deliver`,
        data: null,
      };
    }

    // ===============================
    // 5️⃣ Lock Inventory Row
    // ===============================
    const inventory = await inventoryRepo.findOne({
      where: {
        skuId: orderItemWithRelations.sku.skuId,
        warehouseId: delivery.warehouseId,
        isDeleted: false,
      },
      lock: { mode: "pessimistic_write" },
    });

    if (!inventory) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Inventory not found for this SKU",
        data: null,
      };
    }

    // Calculate allocated qty in DRAFT deliveries
    const allocatedResult = await deliveryItemRepo
      .createQueryBuilder("di")
      .leftJoin("di.delivery", "delivery")
      .select("COALESCE(SUM(di.dispatchedQty),0)", "total")
      .where("di.skuId = :skuId", {
        skuId: orderItemWithRelations.sku.skuId,
      })
      .andWhere("delivery.warehouseId = :warehouseId", {
        warehouseId: delivery.warehouseId,
      })
      .andWhere("delivery.deliveryStatus = :status", {
        status: DeliveryStatusEnum.DRAFT,
      })
      .andWhere("delivery.isDeleted = false")
      .andWhere("di.isDeleted = false")
      .getRawOne();

    const alreadyAllocated = Number(allocatedResult.total);
    const availableStock = inventory.stockQuantity - alreadyAllocated;

    if (dispatchedQty > availableStock) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: `Only ${availableStock} quantity available in stock`,
        data: null,
      };
    }

    // ===============================
    // 6️⃣ Batch Validation (Optional)
    // ===============================
    if (input.batchId) {
      const batch = await batchRepo.findOne({
        where: { batchId: input.batchId, isDeleted: false },
      });

      if (!batch) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Batch not found",
          data: null,
        };
      }
    }

    // ===============================
    // 7️⃣ Create Delivery Item
    // ===============================
    const deliveryItem = deliveryItemRepo.create({
      deliveryId: delivery.deliveryId,
      orderItemId: orderItem.id,
      skuId: orderItemWithRelations.sku.skuId,
      productId: orderItemWithRelations.product.productId,
      orderedQty: orderedQty,
      dispatchedQty: dispatchedQty,
      batchId: input.batchId ?? null,
    });

    await deliveryItemRepo.save(deliveryItem);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Delivery item created successfully",
      data: deliveryItem,
    };
  });
}

async updateDeliveryItem(
  input: UpdateDeliveryItemDto,
  payload: IUser
): Promise<IApiResponse> {

  const connection = this.deliveryItemRepo.manager.connection;

  return await connection.transaction(async (manager) => {

    const deliveryItemRepo = manager.getRepository(DeliveryItem);
    const deliveryRepo = manager.getRepository(DeliveryHeader);

    // 1️⃣ Lock Delivery Item
    const item = await deliveryItemRepo.findOne({
      where: { deliveryItemId: input.deliveryItemId, isDeleted: false },
      lock: { mode: "pessimistic_write" },
    });

    // ✅ FIRST null check
    if (!item) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Delivery item not found",
        data: null,
      };
    }

    // 2️⃣ Fetch Delivery separately
    const delivery = await deliveryRepo.findOne({
      where: { deliveryId: item.deliveryId, isDeleted: false },
    });

    if (!delivery) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Delivery header not found",
        data: null,
      };
    }

    // 3️⃣ Allow update only in DRAFT status
    if (delivery.deliveryStatus !== DeliveryStatusEnum.DRAFT) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Items can only be edited in DRAFT status",
        data: null,
      };
    }

    // 4️⃣ Validate dispatchedQty
    if (input.dispatchedQty <= 0) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Dispatched quantity must be greater than 0",
        data: null,
      };
    }

    // 5️⃣ Recalculate Deliverable Qty
    const totalDeliveredResult = await deliveryItemRepo
      .createQueryBuilder("di")
      .select("COALESCE(SUM(di.dispatchedQty),0)", "total")
      .where("di.orderItemId = :orderItemId", {
        orderItemId: item.orderItemId,
      })
      .andWhere("di.isDeleted = false")
      .andWhere("di.deliveryItemId != :currentId", {
        currentId: item.deliveryItemId,
      })
      .getRawOne();

    const alreadyDeliveredExcludingCurrent = Number(totalDeliveredResult.total);

    const deliverableQty =
      item.orderedQty - alreadyDeliveredExcludingCurrent;

    if (input.dispatchedQty > deliverableQty) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: `Only ${deliverableQty} quantity is allowed to dispatch`,
        data: null,
      };
    }

    // 6️⃣ Update Quantity
    item.dispatchedQty = input.dispatchedQty;

    await deliveryItemRepo.save(item);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Delivery item updated successfully",
      data: item,
    };
  });
}

async cancelDelivery(
  input: CancelDeliveryDto,
  payload: IUser
): Promise<IApiResponse> {

  const connection = this.deliveryRepo.manager.connection;

  return await connection.transaction(async (manager) => {

    const deliveryRepo = manager.getRepository(DeliveryHeader);
    const deliveryItemRepo = manager.getRepository(DeliveryItem);
    const inventoryRepo = manager.getRepository(Inventory);

    // 1️⃣ Lock Delivery Header ONLY
    const delivery = await deliveryRepo.findOne({
      where: { deliveryId: input.deliveryId, isDeleted: false },
      lock: { mode: "pessimistic_write" },
    });

    if (!delivery) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Delivery not found",
        data: null,
      };
    }

    // 2️⃣ Prevent double cancel
    if (delivery.deliveryStatus === DeliveryStatusEnum.CANCELLED) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Delivery is already cancelled",
        data: null,
      };
    }

    const updatedInventory: any[] = [];

    // 3️⃣ If already dispatched → restore inventory
    if (delivery.deliveryStatus === DeliveryStatusEnum.DISPATCHED) {

      // Fetch items separately (Postgres safe)
      const items = await deliveryItemRepo.find({
        where: { deliveryId: delivery.deliveryId, isDeleted: false },
      });

      for (const item of items) {

        // Lock inventory row
        const inventory = await inventoryRepo.findOne({
          where: {
            skuId: item.skuId,
            warehouseId: delivery.warehouseId,
            isDeleted: false,
          },
          lock: { mode: "pessimistic_write" },
        });

        if (!inventory) {
          throw new Error(`Inventory not found for SKU ${item.skuId}`);
        }

        // Restore dispatched qty
        inventory.stockQuantity += item.dispatchedQty;

        await inventoryRepo.save(inventory);

        updatedInventory.push({
          skuId: inventory.skuId,
          warehouseId: inventory.warehouseId,
          restoredQty: item.dispatchedQty,
          currentStock: inventory.stockQuantity,
        });
      }
    }

    // 4️⃣ Update status to CANCELLED
    delivery.deliveryStatus = DeliveryStatusEnum.CANCELLED;
    await deliveryRepo.save(delivery);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Delivery cancelled successfully",
      data: {
        deliveryId: delivery.deliveryId,
        updatedInventory,
      },
    };
  });
}

async listDeliveryItems(input: ListDeliveryItemDto, payload: IUser): Promise<IApiResponse> {
  try {

    const query = this.deliveryItemRepo
      .createQueryBuilder("di")
      .leftJoinAndSelect("di.delivery", "delivery")
      .leftJoinAndSelect("di.orderItem", "orderItem")
      .leftJoinAndSelect("di.sku", "sku")
      .leftJoinAndSelect("di.product", "product");

    if (input.deliveryId) {
      query.andWhere("di.deliveryId = :deliveryId", {
        deliveryId: input.deliveryId,
      });
    }

    if (input.orderItemId) {
      query.andWhere("di.orderItemId = :orderItemId", {
        orderItemId: input.orderItemId,
      });
    }

    if (input.skuId) {
      query.andWhere("di.skuId = :skuId", { skuId: input.skuId });
    }

    if (input.productId) {
      query.andWhere("di.productId = :productId", {
        productId: input.productId,
      });
    }

    if (!input.isDeleted) {
      query.andWhere("di.isDeleted = false");
    }

    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      status: STATUSCODES.SUCCESS,
      message: "Delivery items fetched successfully",
      data: {
        total,
        page,
        limit,
        records: data,
      },
    };

  } catch (error) {
    throw error;
  }
}


async getDeliveryItemById(input:GetDeliveryItemByIdDto, payload: IUser): Promise<IApiResponse> {
  try {
    const item = await this.deliveryItemRepo.findOne({
      where: { deliveryItemId: input.deliveryItemId, isDeleted: false },
      relations: ["delivery", "sku", "product", "batch"],
    });

    if (!item) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Delivery item not found",
        data: null,
      };
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: "Delivery item fetched successfully",
      data: item,
    };
  } catch (error) {
    throw error;
  }
}

async deleteDeliveryItem(
  input: DeleteDeliveryItemDto,
  payload: IUser
): Promise<IApiResponse> {

  const connection = this.deliveryItemRepo.manager.connection;

  return await connection.transaction(async (manager) => {

    const deliveryItemRepo = manager.getRepository(DeliveryItem);
    const deliveryRepo = manager.getRepository(DeliveryHeader);

    // 1️⃣ Lock ONLY delivery item (no relations here)
    const item = await deliveryItemRepo.findOne({
      where: {
        deliveryItemId: input.deliveryItemId,
        isDeleted: false,
      },
      lock: { mode: "pessimistic_write" },
    });

    if (!item) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Delivery item not found",
        data: null,
      };
    }

    // 2️⃣ Fetch delivery separately (NO LOCK needed)
    const delivery = await deliveryRepo.findOne({
      where: {
        deliveryId: item.deliveryId,
        isDeleted: false,
      },
    });

    if (!delivery) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Delivery not found",
        data: null,
      };
    }

    // 3️⃣ Allow delete only in DRAFT
    if (delivery.deliveryStatus !== DeliveryStatusEnum.DRAFT) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Items can only be deleted in DRAFT status",
        data: null,
      };
    }

    // 4️⃣ Soft delete
    item.isDeleted = true;
    // item.updatedBy = payload.userId; // optional good practice

    await deliveryItemRepo.save(item);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Delivery item deleted successfully",
      data: null,
    };
  });
}
}

export { DeliveryController as DeliveryService };
