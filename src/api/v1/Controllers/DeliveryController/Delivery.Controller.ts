import { In, MoreThan } from "typeorm";
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
import { SalesOrderHeaderRepository,SalesOrderHeader } from "../../../../core/DB/Entities/SalesOrderHeader.entity";
import { SalesOrderItemRepository,SalesOrderItem } from "../../../../core/DB/Entities/salesOrderItem.entity";
import { WarehouseRepository,Warehouse } from "../../../../core/DB/Entities/warehouse.entity";
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

  const connection = this.deliveryRepo.manager.connection;

  return await connection.transaction(async (manager) => {

    const salesOrderRepo = manager.getRepository(SalesOrderHeader);
    const warehouseRepo = manager.getRepository(Warehouse);
    const deliveryRepo = manager.getRepository(DeliveryHeader);

    // 1️⃣ Fetch Sales Order
    const salesOrder = await salesOrderRepo.findOne({
      where: { soId: input.salesOrderId, isDeleted: false },
      relations: ["customer", "Items", "Items.warehouse"],
    });

    if (!salesOrder)
      return { status: 404, message: "Sales Order not found", data: null };

    const customer = salesOrder.customer;

    if (!customer)
      return { status: 400, message: "Customer not found", data: null };

    // 2️⃣ Get Warehouses from SO Items
    const warehouseIds = salesOrder.Items
      ?.map((item) => item.warehouse?.warehouseId)
      .filter(Boolean);

    if (!warehouseIds?.length)
      return { status: 400, message: "No warehouse assigned", data: null };

    const warehouses = await warehouseRepo.find({
      where: { warehouseId: In(warehouseIds), isDeleted: false },
    });

    // 3️⃣ Smart Warehouse Selection
 const normalize = (val?: string) =>
  val?.trim().toLowerCase();

let selectedWarehouse =
  // 1️⃣ City Match
  warehouses.find(
    (w) =>
      normalize(w.shippingCity) === normalize(customer.shippingCity) &&
      normalize(w.shippingDistrictName) === normalize(customer.shippingDistrict) &&
      normalize(w.shippingStateName) === normalize(customer.shippingState)
  ) ||

  // 2️⃣ District Match
  warehouses.find(
    (w) =>
      normalize(w.shippingDistrictName) === normalize(customer.shippingDistrict) &&
      normalize(w.shippingStateName) === normalize(customer.shippingState)
  ) ||

  // 3️⃣ State Match
  warehouses.find(
    (w) =>
      normalize(w.shippingStateName) === normalize(customer.shippingState)
  );

    if (!selectedWarehouse)
      return {
        status: 400,
        message: "No nearby warehouse found",
        data: null,
      };

    // 4️⃣ Create Header with PENDING
    const delivery = deliveryRepo.create({
      deliveryStatus: DeliveryStatusEnum.PENDING,
      salesOrder,
      customer,
      warehouse: selectedWarehouse,
      deliveryDate: input.deliveryDate ?? null,
      vehicleNumber: input.vehicleNumber ?? null,
      transporterName: input.transporterName ?? null,
      driverName: input.driverName ?? null,
      driverMobile: input.driverMobile ?? null,
      ewayBillNo: input.ewayBillNo ?? null,
      dispatchDate: null,
      remark: input.remark ?? null,
      // createdBy: payload.userId,
    });

    const saved = await deliveryRepo.save(delivery);

    return {
      status: 201,
      message: "Delivery Header Created Successfully",
      data: saved,
    };
  });
}

async dispatchDelivery(
  deliveryId: string,
  input: UpdateDeliveryHeaderDto,
  payload: IUser
): Promise<IApiResponse> {
  const connection = this.deliveryRepo.manager.connection;

  return await connection.transaction(async (manager) => {
    const deliveryRepo = manager.getRepository(DeliveryHeader);
    const deliveryItemRepo = manager.getRepository(DeliveryItem);
    const inventoryRepo = manager.getRepository(Inventory);

    const delivery = await deliveryRepo.findOne({
      where: { deliveryId, isDeleted: false },
      relations: ["items", "items.product", "warehouse", "salesOrder"],
    });

    if (!delivery) return { status: 404, message: "Delivery not found", data: null };
    if (delivery.deliveryStatus !== DeliveryStatusEnum.PENDING)
      return { status: 400, message: "Only PENDING deliveries can be dispatched", data: null };
    if (!delivery.items?.length)
      return { status: 400, message: "No items to dispatch", data: null };

    let totalOrdered = 0;
    let totalDispatched = 0;

    for (const reqItem of input.items) {
      // Include soft-deleted items
      const item = delivery.items.find(i => i.deliveryItemId === reqItem.deliveryItemId);
      if (!item)
        return { status: 400, message: `Delivery item ID ${reqItem.deliveryItemId} not found`, data: null };

      const inventory = await inventoryRepo.findOne({
        where: {
          product: { productId: item.product.productId },
          warehouse: { warehouseId: delivery.warehouse.warehouseId },
          isDeleted: false,
        },
        lock: { mode: "pessimistic_write" },
      });

      const availableStock = inventory?.stockQuantity ?? 0;
      const actualDispatched = Math.min(reqItem.dispatchedQty, availableStock);

      // Update dispatchedQty regardless of isDeleted
      item.dispatchedQty = actualDispatched;

      // Reduce inventory safely
      if (inventory && actualDispatched > 0) {
        inventory.stockQuantity -= actualDispatched;
        await inventoryRepo.save(inventory);
      }

      // Remaining stock for response
      (item as any).remainingStock = inventory?.stockQuantity ?? 0;

      // Save delivery item including soft-deleted ones
      await deliveryItemRepo.save(item, { reload: false });

      totalOrdered += item.orderedQty;
      totalDispatched += actualDispatched;
    }

    // Update delivery status
    if (totalDispatched === 0) {
      delivery.deliveryStatus = DeliveryStatusEnum.PENDING;
    } else if (totalDispatched < totalOrdered) {
      delivery.deliveryStatus = DeliveryStatusEnum.PARTIAL_DELIVERED;
    } else {
      delivery.deliveryStatus = DeliveryStatusEnum.FULLY_DELIVERED;
    }

    delivery.dispatchDate = new Date();
    await deliveryRepo.save(delivery);

    // Fetch updated delivery for response
    const updated = await deliveryRepo.findOne({
      where: { deliveryId },
      relations: ["items", "items.product", "warehouse", "salesOrder"],
    });

    // Attach remaining stock for all items
    if (updated) {
      for (const item of updated.items) {
        const inventory = await inventoryRepo.findOne({
          where: {
            product: { productId: item.product.productId },
            warehouse: { warehouseId: updated.warehouse.warehouseId },
            isDeleted: false,
          },
        });
        (item as any).remainingStock = inventory?.stockQuantity ?? 0;
      }
    }

    return {
      status: 200,
      message: "Delivery dispatched successfully",
      data: updated,
    };
  });
}


async updateDeliveryHeader(
  deliveryId: string,
  input: UpdateDeliveryHeaderDto,
  payload: IUser
): Promise<IApiResponse> {
  const connection = this.deliveryRepo.manager.connection;

  return await connection.transaction(async (manager) => {
    const deliveryRepo = manager.getRepository(DeliveryHeader);

    // 1️⃣ Fetch delivery
    const delivery = await deliveryRepo.findOne({
      where: { deliveryId, isDeleted: false },
      relations: ["items", "warehouse", "salesOrder"],
    });

    if (!delivery) {
      return { status: 404, message: "Delivery not found", data: null };
    }

    // 2️⃣ Prevent update if already dispatched or cancelled
    if ([DeliveryStatusEnum.DISPATCHED, DeliveryStatusEnum.FULLY_DELIVERED, DeliveryStatusEnum.CANCELLED].includes(delivery.deliveryStatus)) {
      return {
        status: 400,
        message: `Cannot update delivery with status ${delivery.deliveryStatus}`,
        data: null,
      };
    }

    // 3️⃣ Update allowed fields
    if (input.deliveryDate !== undefined) delivery.deliveryDate = new Date(input.deliveryDate);
    if (input.vehicleNumber !== undefined) delivery.vehicleNumber = input.vehicleNumber;
    if (input.transporterName !== undefined) delivery.transporterName = input.transporterName;
    if (input.driverName !== undefined) delivery.driverName = input.driverName;
    if (input.driverMobile !== undefined) delivery.driverMobile = input.driverMobile;
    if (input.ewayBillNo !== undefined) delivery.ewayBillNo = input.ewayBillNo;
    if (input.dispatchDate !== undefined) delivery.dispatchDate = new Date(input.dispatchDate);

    // 4️⃣ Optional: Update status if provided but only to allowed values
    if (input.deliveryStatus !== undefined) {
      if ([DeliveryStatusEnum.PENDING, DeliveryStatusEnum.PARTIAL_DELIVERED].includes(input.deliveryStatus)) {
        delivery.deliveryStatus = input.deliveryStatus;
      } else {
        return {
          status: 400,
          message: `Cannot set delivery status to ${input.deliveryStatus} via update`,
          data: null,
        };
      }
    }

    // 5️⃣ Save delivery
    await deliveryRepo.save(delivery);

    // 6️⃣ Fetch updated delivery
    const updated = await deliveryRepo.findOne({
      where: { deliveryId },
      relations: ["items", "items.product", "warehouse", "salesOrder"],
    });

    return {
      status: 200,
      message: "Delivery header updated successfully",
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

    // 1️⃣ Lock Delivery Header
    const delivery = await deliveryRepo.findOne({
      where: { deliveryId, isDeleted: false },
      lock: { mode: "pessimistic_write" },
    });

    if (!delivery) return { status: STATUSCODES.NOT_FOUND, message: "Delivery not found", data: null };
    if (delivery.deliveryStatus !== DeliveryStatusEnum.PENDING)
      return { status: STATUSCODES.BAD_REQUEST, message: "Items can only be added in PENDING status", data: null };

    // 2️⃣ Lock Sales Order Item
    const orderItem = await salesOrderItemRepo.findOne({
      where: { id: input.orderItemId, isDeleted: false },
      lock: { mode: "pessimistic_write" },
    });
    if (!orderItem) return { status: STATUSCODES.NOT_FOUND, message: "Sales order item not found", data: null };

    const orderItemWithRelations = await salesOrderItemRepo.findOne({
      where: { id: orderItem.id },
      relations: ["salesOrder", "sku", "product"],
    });
    if (!orderItemWithRelations)
      return { status: STATUSCODES.NOT_FOUND, message: "Sales order item details not found", data: null };

    if (orderItemWithRelations.salesOrder.soId !== delivery.salesOrderId)
      return { status: STATUSCODES.BAD_REQUEST, message: "Order item does not belong to this delivery's sales order", data: null };

    // 3️⃣ Prevent duplicate
    const existing = await deliveryItemRepo.findOne({
      where: { deliveryId, orderItemId: input.orderItemId, isDeleted: false },
    });
    if (existing)
      return { status: STATUSCODES.BAD_REQUEST, message: "Delivery item already exists in this delivery", data: null };

    // 4️⃣ Calculate deliverable quantity
    const orderedQty = orderItem.saleQty;

    const totalDeliveredResult = await deliveryItemRepo
      .createQueryBuilder("di")
      .select("COALESCE(SUM(di.dispatchedQty),0)", "total")
      .where("di.orderItemId = :orderItemId", { orderItemId: input.orderItemId })
      .andWhere("di.isDeleted = false")
      .getRawOne();

    const alreadyDelivered = Number(totalDeliveredResult.total);
    const deliverableQty = orderedQty - alreadyDelivered;
    if (deliverableQty <= 0)
      return { status: STATUSCODES.BAD_REQUEST, message: "No quantity left to deliver", data: null };

    const dispatchedQty = input.dispatchedQty ?? deliverableQty;
    if (dispatchedQty <= 0 || dispatchedQty > deliverableQty)
      return { status: STATUSCODES.BAD_REQUEST, message: `Only ${deliverableQty} quantity left to deliver`, data: null };

    // 5️⃣ Lock Inventory
    const inventory = await inventoryRepo.findOne({
      where: { skuId: orderItemWithRelations.sku.skuId, warehouseId: delivery.warehouseId, isDeleted: false },
      lock: { mode: "pessimistic_write" },
    });
    if (!inventory) return { status: STATUSCODES.NOT_FOUND, message: "Inventory not found for this SKU", data: null };

    // 6️⃣ Check available stock
    const allocatedResult = await deliveryItemRepo
      .createQueryBuilder("di")
      .leftJoin("di.delivery", "delivery")
      .select("COALESCE(SUM(di.dispatchedQty),0)", "total")
      .where("di.skuId = :skuId", { skuId: orderItemWithRelations.sku.skuId })
      .andWhere("delivery.warehouseId = :warehouseId", { warehouseId: delivery.warehouseId })
      .andWhere("delivery.deliveryStatus = :status", { status: DeliveryStatusEnum.PENDING })
      .andWhere("delivery.isDeleted = false")
      .andWhere("di.isDeleted = false")
      .getRawOne();

    const alreadyAllocated = Number(allocatedResult.total);
    const availableStock = inventory.stockQuantity - alreadyAllocated;
    if (dispatchedQty > availableStock)
      return { status: STATUSCODES.BAD_REQUEST, message: `Only ${availableStock} quantity available in stock`, data: null };

    // 7️⃣ Batch validation
    if (input.batchId) {
      const batch = await batchRepo.findOne({ where: { batchId: input.batchId, isDeleted: false } });
      if (!batch) return { status: STATUSCODES.NOT_FOUND, message: "Batch not found", data: null };
    }

    // 8️⃣ Deduct stock
    inventory.stockQuantity -= dispatchedQty;
    await inventoryRepo.save(inventory);

    // 9️⃣ Create delivery item
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
      message: "Delivery item created successfully, stock deducted",
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

    // 3️⃣ Allow update only in PENDING status
    if (delivery.deliveryStatus !== DeliveryStatusEnum.PENDING) {
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

    // 1️⃣ Lock Delivery Header
    const delivery = await deliveryRepo.findOne({
      where: { deliveryId: input.deliveryId, isDeleted: false },
      lock: { mode: "pessimistic_write" },
    });

    if (!delivery) {
      return { status: STATUSCODES.NOT_FOUND, message: "Delivery not found", data: null };
    }

    if (delivery.deliveryStatus === DeliveryStatusEnum.CANCELLED) {
      return { status: STATUSCODES.BAD_REQUEST, message: "Delivery is already cancelled", data: null };
    }

    // 2️⃣ Fetch delivery items
    const items = await deliveryItemRepo.find({
      where: { deliveryId: delivery.deliveryId, isDeleted: false },
      lock: { mode: "pessimistic_write" },
    });

    const updatedInventory: any[] = [];

    // 3️⃣ Restore stock for each item
    for (const item of items) {

      if (item.dispatchedQty <= 0) continue; // skip if nothing was dispatched

      // Find all batches to choose the best one to restore to
      const inventories = await inventoryRepo.find({
        where: { 
          skuId: item.skuId, 
          warehouseId: delivery.warehouseId, 
          isDeleted: false 
        },
        order: { expiryDate: "DESC", createdAt: "DESC" }, // Restore to freshest/newest batch
        lock: { mode: "pessimistic_write" },
      });

      if (!inventories.length) {
        // Edge case: All batches deleted? 
        // We cannot easily restore. Throwing error to alert user.
        throw new Error(`No active inventory batch found for SKU ${item.skuId} to restore stock.`);
      }

      const targetBatch = inventories[0];
      const restoredQty = item.dispatchedQty;

      // Restore stock
      targetBatch.stockQuantity += restoredQty;
      await inventoryRepo.save(targetBatch);

      // Reset dispatchedQty
      item.dispatchedQty = 0;
      await deliveryItemRepo.save(item);

      // Push info for response
      updatedInventory.push({
        skuId: item.skuId,
        warehouseId: delivery.warehouseId,
        restoredQty: restoredQty,
        batchId: targetBatch.inventoryId, // useful for debugging
        newStock: targetBatch.stockQuantity
      });
    }

    // 4️⃣ Update delivery status
    delivery.deliveryStatus = DeliveryStatusEnum.CANCELLED;
    await deliveryRepo.save(delivery);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Delivery cancelled and inventory restored",
      data: {
        deliveryId: delivery.deliveryId,
        updatedInventory, // includes restored quantities
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
    if (delivery.deliveryStatus !== DeliveryStatusEnum.PENDING) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Items can only be deleted in PENDING status",
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
