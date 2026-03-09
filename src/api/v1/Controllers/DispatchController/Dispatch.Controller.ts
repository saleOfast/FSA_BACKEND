import { STATUSCODES, DispatchedStatusEnum } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateDispatchDto,
  UpdateDispatchHeaderDto,
  UpdateDispatchItemDto,
  GetDispatchByIdDto,
  DeleteDispatchDto,
  ListDispatchDto,
  CreateDispatchItemDto,
  ListDispatchItemDto,
  GetDispatchItemByIdDto,
  DeleteDispatchItemDto,
} from "../../../../core/types/DispatchService/DispatchService";
import {
  DispatchHeader,
  DispatchHeaderRepository,
} from "../../../../core/DB/Entities/dispatchHeader.entity";
import {
  DispatchItem,
  DispatchItemRepository,
} from "../../../../core/DB/Entities/dispatchItem.entity";
import {
  SalesOrderHeader,
  SalesOrderHeaderRepository,
} from "../../../../core/DB/Entities/SalesOrderHeader.entity";
import {
  SalesOrderItem,
  SalesOrderItemRepository,
} from "../../../../core/DB/Entities/salesOrderItem.entity";
import { Batch } from "../../../../core/DB/Entities/inventoryBatch.entity";

class DeliveryController {
  private dispatchRepo = DispatchHeaderRepository();
  private dispatchItemRepo = DispatchItemRepository();
  private salesOrderRepo = SalesOrderHeaderRepository();
  private salesOrderItemRepo = SalesOrderItemRepository();

  constructor() {}

  /** Create Dispatch Header (Pending / for a Sales Order) */
async createDispatchHeader(
  input: CreateDispatchDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const salesOrder = await this.salesOrderRepo.findOne({
      where: { soId: input.salesOrderId, isDeleted: false },
      relations: ["customer", "Items", "Items.warehouse"],
    });

    if (!salesOrder) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Sales Order not found",
        data: null,
      };
    }

    const customer = salesOrder.customer;

    if (!customer) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Customer not found for sales order",
        data: null,
      };
    }

    let warehouseName: string | null = null;

    // ✅ STEP 1: If warehouse already stored in customer
    if (customer.warehouseName) {
      warehouseName = customer.warehouseName;
    } else {
      // 🔥 STEP 2: Priority Based Matching (inside same method)

      const normalize = (val?: string) =>
        val?.trim().toLowerCase();

      const customerCity = normalize(customer.shippingCity);
      const customerDistrict = normalize(customer.shippingDistrict);
      const customerState = normalize(customer.shippingState);

      let matchedItem = null;

      // 1️⃣ Priority: City + District + State
      matchedItem = salesOrder.Items.find((item) => {
        const wh = item.warehouse;
        if (!wh) return false;

        return (
          normalize(wh.shippingCity) === customerCity &&
          normalize(wh.shippingDistrictName) === customerDistrict &&
          normalize(wh.shippingStateName) === customerState
        );
      });

      // 2️⃣ Priority: District + State
      if (!matchedItem) {
        matchedItem = salesOrder.Items.find((item) => {
          const wh = item.warehouse;
          if (!wh) return false;

          return (
            normalize(wh.shippingDistrictName) === customerDistrict &&
            normalize(wh.shippingStateName) === customerState
          );
        });
      }

      // 3️⃣ Priority: Only State
      if (!matchedItem) {
        matchedItem = salesOrder.Items.find((item) => {
          const wh = item.warehouse;
          if (!wh) return false;

          return (
            normalize(wh.shippingStateName) === customerState
          );
        });
      }

      warehouseName = matchedItem?.warehouse?.warehouseName ?? null;
    }

    // ❌ If still not found
    if (!warehouseName) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "No matching warehouse found",
        data: null,
      };
    }

    const dispatch = this.dispatchRepo.create({
      dispatchStatus:
        input.dispatchStatus ?? DispatchedStatusEnum.PENDING,
      salesOrderId: salesOrder.soId,
      customerName: customer.customerName,
      warehouseName: warehouseName,
      vehicleNumber: input.vehicleNumber ?? null,
      transporterName: input.transporterName ?? null,
      driverName: input.driverName ?? null,
      driverMobile: input.driverMobile ?? null,
      ewayBillNo: input.ewayBillNo ?? null,
      dispatchDate: input.dispatchDate
        ? new Date(input.dispatchDate)
        : null,
      remarks: input.remarks ?? null,
      isDeleted: false,
    });

    const saved = await this.dispatchRepo.save(dispatch);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Dispatch Header created successfully",
      data: saved,
    };

  } catch (error: any) {
    console.error("DISPATCH ERROR:", error);
    return {
      status: STATUSCODES.BAD_REQUEST,
      message: error.message,
      data: null,
    };
  }
}


  /** Update Dispatch Header meta (vehicle, transporter, etc.) */
  async updateDispatchHeader(
    dispatchId: string,
    input: UpdateDispatchHeaderDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const dispatch = await this.dispatchRepo.findOne({
        where: { dispatchId: Number(dispatchId), isDeleted: false },
        relations: ["items"],
      });

      if (!dispatch) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Dispatch not found",
          data: null,
        };
      }

      if (dispatch.dispatchStatus === DispatchedStatusEnum.CANCELLED) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Cancelled dispatch cannot be updated",
          data: null,
        };
      }

      if (input.vehicleNumber !== undefined)
        dispatch.vehicleNumber = input.vehicleNumber;
      if (input.transporterName !== undefined)
        dispatch.transporterName = input.transporterName;
      if (input.driverName !== undefined)
        dispatch.driverName = input.driverName;
      if (input.driverMobile !== undefined)
        dispatch.driverMobile = input.driverMobile;
      if (input.ewayBillNo !== undefined)
        dispatch.ewayBillNo = input.ewayBillNo;
      if (input.dispatchDate !== undefined)
        dispatch.dispatchDate = new Date(input.dispatchDate);
      if (input.remarks !== undefined) dispatch.remarks = input.remarks;

      await this.dispatchRepo.save(dispatch);

      return {
        status: STATUSCODES.SUCCESS,
        message: "Dispatch header updated successfully",
        data: dispatch,
      };
    } catch (error) {
      throw error;
    }
  }

  /** Get Dispatch Header + Items by ID */
  async getDispatchById(
    input: GetDispatchByIdDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
    const dispatch = await this.dispatchRepo
  .createQueryBuilder("dispatch")
  .leftJoinAndSelect("dispatch.items", "items")
  .leftJoinAndSelect("items.salesOrderItem", "salesOrderItem")
  .leftJoinAndSelect("salesOrderItem.sku", "sku")
  .leftJoinAndSelect("items.product", "product")
  .leftJoinAndSelect("items.batch", "batch")
  .where("dispatch.dispatchId = :dispatchId", { dispatchId: input.dispatchId })
  .andWhere("dispatch.isDeleted = false")
  .getOne();

      if (!dispatch) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Dispatch not found",
          data: null,
        };
      }

      return {
        status: STATUSCODES.SUCCESS,
        message: "Dispatch fetched successfully",
        data: dispatch,
      };
    } catch (error) {
      throw error;
    }
  }

  /** List Dispatch headers with basic filters */
  async listDispatches(
    input: ListDispatchDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const qb = this.dispatchRepo
        .createQueryBuilder("d")
        .where("d.isDeleted = false");

      if (input.salesOrderId) {
        qb.andWhere("d.salesOrderId = :salesOrderId", {
          salesOrderId: input.salesOrderId,
        });
      }

      if (input.dispatchStatus) {
        qb.andWhere("d.dispatchStatus = :dispatchStatus", {
          dispatchStatus: input.dispatchStatus,
        });
      }

      qb.orderBy("d.createdAt", "DESC");

      const page = input.page ?? 1;
      const limit = input.limit ?? 20;
      qb.skip((page - 1) * limit).take(limit);

      const [list, total] = await qb.getManyAndCount();

      return {
        status: STATUSCODES.SUCCESS,
        message: "Dispatches fetched successfully",
        data: { list, total, page, limit },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * List Dispatches eligible for Delivery creation
   * Only headers with status PARTIALLY_DISPATCHED or FULLY_DISPATCHED.
   * Dispatched Qty (sum of dispatch items) is treated as Deliverable Qty.
   */
  async listDispatchesForDelivery(
    input: ListDispatchDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const qb = this.dispatchRepo
        .createQueryBuilder("d")
        .leftJoin("d.salesOrder", "so")
        .leftJoin("so.customer", "customer")
        .leftJoin("d.items", "di", "di.isDeleted = false")
        .where("d.isDeleted = false")
        .andWhere("d.dispatchStatus IN (:...statuses)", {
          statuses: [
            DispatchedStatusEnum.PARTIALLY_DISPATCHED,
            DispatchedStatusEnum.FULLY_DISPATCHED,
          ],
        });

      if (input.salesOrderId) {
        qb.andWhere("d.salesOrderId = :salesOrderId", {
          salesOrderId: input.salesOrderId,
        });
      }

      qb
        .select("d.dispatchId", "dispatchId")
        .addSelect("so.soId", "salesOrderId")
        .addSelect("so.orderDate", "orderDate")
        .addSelect("customer.customerName", "customerName")
        .addSelect("customer.shippingStreet", "shippingStreet")
        .addSelect("customer.shippingCity", "shippingCity")
        .addSelect("customer.shippingPinCode", "shippingPinCode")
        .addSelect("d.warehouseName", "warehouseName")
        .addSelect("COUNT(DISTINCT di.dispatchItemId)", "skuCount")
        .addSelect("COALESCE(SUM(di.orderedQty), 0)", "orderedQty")
        .addSelect("COALESCE(SUM(di.dispatchedQty), 0)", "deliverableQty")
        .groupBy("d.dispatchId")
        .addGroupBy("so.soId")
        .addGroupBy("so.orderDate")
        .addGroupBy("customer.customerId")
        .addGroupBy("customer.shippingStreet")
        .addGroupBy("customer.shippingCity")
        .addGroupBy("customer.shippingPinCode")
        .addGroupBy("d.warehouseName");

      const rows = await qb.getRawMany();

      const data = rows.map((row: any) => {
        const ordered = Number(row.orderedQty) || 0;
        const deliverable = Number(row.deliverableQty) || 0;

        return {
          dispatchId: row.dispatchId,
          salesOrderId: row.salesOrderId,
          salesOrderNo: `SO-${row.salesOrderId}`,
          orderDate: row.orderDate,
          customerName: row.customerName,
          deliveryAddress: `${row.shippingStreet || ""}, ${row.shippingCity || ""} ${
            row.shippingPinCode || ""
          }`.trim(),
          warehouseName: row.warehouseName,
          skuCount: Number(row.skuCount) || 0,
          orderedQty: ordered,
          deliverableQty: deliverable,
        };
      });

      return {
        status: STATUSCODES.SUCCESS,
        message: "Dispatches for delivery fetched successfully",
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  /** Soft delete a Dispatch header (only when still pending) */
  async deleteDispatch(
    input: DeleteDispatchDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const dispatch = await this.dispatchRepo.findOne({
        where: { dispatchId: Number(input.dispatchId), isDeleted: false },
        relations: ["items"],
      });

      if (!dispatch) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Dispatch not found",
          data: null,
        };
      }

      if (dispatch.dispatchStatus !== DispatchedStatusEnum.PENDING) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Only PENDING dispatch can be deleted",
          data: null,
        };
      }

      dispatch.isDeleted = true;
      await this.dispatchRepo.save(dispatch);

      return {
        status: STATUSCODES.SUCCESS,
        message: "Dispatch deleted successfully",
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }

  /** Create a Dispatch Item and update remaining qty + status */
  async createDispatchItem(
    dispatchId: string,
    input: CreateDispatchItemDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const dispatch = await this.dispatchRepo.findOne({
        where: { dispatchId: Number(dispatchId), isDeleted: false },
        relations: ["items"],
      });

      if (!dispatch) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Dispatch not found",
          data: null,
        };
      }

      if (dispatch.dispatchStatus === DispatchedStatusEnum.CANCELLED) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Cannot add items to a cancelled dispatch",
          data: null,
        };
      }

      const orderItem = await this.salesOrderItemRepo.findOne({
        where: { id: input.salesOrderItemId, isDeleted: false },
        relations: ["salesOrder", "product","sku"],
      });

      if (!orderItem) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Sales order item not found",
          data: null,
        };
      }

      if (orderItem.salesOrder.soId !== dispatch.salesOrderId) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Sales order item does not belong to this dispatch's sales order",
          data: null,
        };
      }

      // Total already dispatched for this sales order item (all dispatches)
      const agg = await this.dispatchItemRepo
        .createQueryBuilder("di")
        .select("COALESCE(SUM(di.dispatchedQty), 0)", "total")
        .leftJoin("di.salesOrderItem", "soi")
        .where("soi.id = :itemId", { itemId: orderItem.id })
        .andWhere("di.isDeleted = false")
        .getRawOne();

      const alreadyDispatched = Number(agg.total) || 0;
      const orderedQty = orderItem.saleQty;
      const maxDeliverable = orderedQty - alreadyDispatched;

      if (maxDeliverable <= 0) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "No quantity left to dispatch for this item",
          data: null,
        };
      }

      const requested = input.dispatchedQty;
      if (requested <= 0 || requested > maxDeliverable) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: `Dispatched quantity must be between 1 and ${maxDeliverable}`,
          data: null,
        };
      }

      const remainingQty = orderedQty - (alreadyDispatched + requested);

      const itemStatus =
        remainingQty === 0
          ? DispatchedStatusEnum.FULLY_DISPATCHED
          : DispatchedStatusEnum.PARTIALLY_DISPATCHED;

      const dispatchItem = this.dispatchItemRepo.create();
      dispatchItem.dispatch = dispatch;
      dispatchItem.salesOrderItem = orderItem;
      dispatchItem.product = orderItem.product;
      dispatchItem.sku = orderItem.sku; 

      if (input.batchId) {
        dispatchItem.batch = ({ batchId: input.batchId } as Batch);
      }
      dispatchItem.orderedQty = orderedQty;
      dispatchItem.dispatchedQty = requested;
      dispatchItem.remainingQty = remainingQty;
      dispatchItem.dispatchStatus = itemStatus;
      dispatchItem.isDeleted = false;

      await this.dispatchItemRepo.save(dispatchItem);

      // Recalculate header status
      await this.recalculateDispatchStatus(dispatch.dispatchId);

      return {
        status: STATUSCODES.SUCCESS,
        message: "Dispatch item created successfully",
        data: dispatchItem,
      };
    } catch (error) {
      throw error;
    }
  }

  /** Update a Dispatch Item quantity and recompute remaining/status */
  async updateDispatchItem(
    input: UpdateDispatchItemDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const item = await this.dispatchItemRepo.findOne({
        where: { dispatchItemId: input.dispatchItemId, isDeleted: false },
        relations: ["dispatch", "salesOrderItem","salesOrderItem.sku","batch"],
      });

      if (!item) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Dispatch item not found",
          data: null,
        };
      }

      const dispatch = item.dispatch;
      if (!dispatch || dispatch.isDeleted) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Dispatch header not found",
          data: null,
        };
      }

      if (dispatch.dispatchStatus === DispatchedStatusEnum.CANCELLED) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Cannot edit items of a cancelled dispatch",
          data: null,
        };
      }

      const orderItem = item.salesOrderItem;
      const orderedQty = orderItem.saleQty;

const agg = await this.dispatchItemRepo
  .createQueryBuilder("di")
  .select("COALESCE(SUM(di.dispatched_qty), 0)", "total")
  .where("di.sales_order_item_id = :itemId", { itemId: orderItem.id })
  .where("di.batch_id = :batchId", { batchId: input.batchId })
  .andWhere("di.dispatch_item_id <> :currentId", {
    currentId: item.dispatchItemId,
  })
 
  .andWhere("di.is_deleted = false")
  .getRawOne();
      const alreadyDispatchedOther = Number(agg.total) || 0;
      const maxDeliverable = orderedQty - alreadyDispatchedOther;

      if (input.dispatchedQty <= 0 || input.dispatchedQty > maxDeliverable) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: `Dispatched quantity must be between 1 and ${maxDeliverable}`,
          data: null,
        };
      }

      const remainingQty = orderedQty - (alreadyDispatchedOther + input.dispatchedQty);

      item.dispatchedQty = input.dispatchedQty;
      item.remainingQty = remainingQty;
      item.dispatchStatus =
        remainingQty === 0
          ? DispatchedStatusEnum.FULLY_DISPATCHED
          : DispatchedStatusEnum.PARTIALLY_DISPATCHED;
          item.sku = item.sku;

            // ✅ batch update logic
      if (input.batchId !== undefined) {
        if (input.batchId === 0 || input.batchId === null) {
          
          item.batch = null as any;
        } else {
          item.batch = { batchId: input.batchId } as Batch;
        }
      }



      await this.dispatchItemRepo.save(item);

      // Recalculate header
      await this.recalculateDispatchStatus(dispatch.dispatchId);

          const updatedItem = await this.dispatchItemRepo.findOne({
      where: { dispatchItemId: item.dispatchItemId },
      relations: [
        "dispatch",
        "salesOrderItem",
        "salesOrderItem.sku",
        "batch"
      ],
    });

      return {
        status: STATUSCODES.SUCCESS,
        message: "Dispatch item updated successfully",
        data: updatedItem,
      };
    } catch (error) {
      throw error;
    }
  }

  /** List Dispatch Items with filters */
  async listDispatchItems(
    input: ListDispatchItemDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const qb = this.dispatchItemRepo
        .createQueryBuilder("di")
        .leftJoinAndSelect("di.dispatch", "dispatch")
        .leftJoinAndSelect("di.salesOrderItem", "salesOrderItem")
        .leftJoinAndSelect("di.product", "product")
        .leftJoinAndSelect("di.batch", "batch");

      if (input.dispatchId) {
        qb.andWhere("dispatch.dispatchId = :dispatchId", {
          dispatchId: input.dispatchId,
        });
      }

      if (input.salesOrderItemId) {
        qb.andWhere("salesOrderItem.id = :itemId", {
          itemId: input.salesOrderItemId,
        });
      }

      if (input.productId) {
        qb.andWhere("product.productId = :productId", {
          productId: input.productId,
        });
      }

      if (input.isDeleted === false || input.isDeleted === undefined) {
        qb.andWhere("di.isDeleted = false");
      }

      const page = input.page ?? 1;
      const limit = input.limit ?? 10;
      qb.skip((page - 1) * limit).take(limit);

      const [records, total] = await qb.getManyAndCount();

      return {
        status: STATUSCODES.SUCCESS,
        message: "Dispatch items fetched successfully",
        data: { total, page, limit, records },
      };
    } catch (error) {
      throw error;
    }
  }

  /** Get a single Dispatch Item */
  async getDispatchItemById(
    input: GetDispatchItemByIdDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const item = await this.dispatchItemRepo.findOne({
        where: { dispatchItemId: input.dispatchItemId, isDeleted: false },
        relations: ["dispatch", "salesOrderItem", "product", "batch"],
      });

      if (!item) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Dispatch item not found",
          data: null,
        };
      }

      return {
        status: STATUSCODES.SUCCESS,
        message: "Dispatch item fetched successfully",
        data: item,
      };
    } catch (error) {
      throw error;
    }
  }

  /** Soft delete a Dispatch Item (only when header is PENDING) */
  async deleteDispatchItem(
    input: DeleteDispatchItemDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const item = await this.dispatchItemRepo.findOne({
        where: { dispatchItemId: input.dispatchItemId, isDeleted: false },
        relations: ["dispatch"],
      });

      if (!item) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Dispatch item not found",
          data: null,
        };
      }

      const dispatch = item.dispatch;
      if (!dispatch || dispatch.isDeleted) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Dispatch header not found",
          data: null,
        };
      }

      if (dispatch.dispatchStatus === DispatchedStatusEnum.CANCELLED) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Cannot delete items of a cancelled dispatch",
          data: null,
        };
      }

      item.isDeleted = true;
      await this.dispatchItemRepo.save(item);

      await this.recalculateDispatchStatus(dispatch.dispatchId);

      return {
        status: STATUSCODES.SUCCESS,
        message: "Dispatch item deleted successfully",
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }

  /** Helper: recompute header dispatchStatus from its items */
  private async recalculateDispatchStatus(dispatchId: number): Promise<void> {
    const dispatch = await this.dispatchRepo.findOne({
      where: { dispatchId, isDeleted: false },
      relations: ["items"],
    });

    if (!dispatch || !dispatch.items || dispatch.items.length === 0) {
      return;
    }

    let totalOrdered = 0;
    let totalDispatched = 0;

    for (const item of dispatch.items) {
      if (item.isDeleted) continue;
      totalOrdered += item.orderedQty;
      totalDispatched += item.dispatchedQty;
    }

    if (totalDispatched === 0) {
      dispatch.dispatchStatus = DispatchedStatusEnum.PENDING;
    } else if (totalDispatched < totalOrdered) {
      dispatch.dispatchStatus = DispatchedStatusEnum.PARTIALLY_DISPATCHED;
    } else {
      dispatch.dispatchStatus = DispatchedStatusEnum.FULLY_DISPATCHED;
    }

    await this.dispatchRepo.save(dispatch);
  }
}

export { DeliveryController as DeliveryService };
