import { STATUSCODES, DeliveryStatusEnum } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateDeliveryRecordDto,
  UpdateDeliveryRecordHeaderDto,
  UpdateDeliveryRecordItemDto,
  GetDeliveryRecordByIdDto,
  DeleteDeliveryRecordDto,
  ListDeliveryRecordDto,
  ListDeliveryRecordItemDto,
  GetDeliveryRecordItemByIdDto,
  DeleteDeliveryRecordItemDto,
} from "../../../../core/types/DeliveryRecordService/DeliveryRecordService";
import {
  DeliveryHeader,
  DeliveryHeaderRepository,
} from "../../../../core/DB/Entities/deliveryHeader.entity";
import {
  DeliveryItem,
  DeliveryItemRepository,
} from "../../../../core/DB/Entities/deliveryItem.entity";
import {
  DispatchHeader,
  DispatchHeaderRepository,
} from "../../../../core/DB/Entities/dispatchHeader.entity";
import { DispatchItem, DispatchItemRepository } from "../../../../core/DB/Entities/dispatchItem.entity";

class DeliveryRecordController {
  private deliveryRepo = DeliveryHeaderRepository();
  private deliveryItemRepo = DeliveryItemRepository();
  private dispatchRepo = DispatchHeaderRepository();
  private dispatchItemRepo = DispatchItemRepository();

  /** Create Delivery from Dispatch: header + items (Deliverable Qty = Dispatched Qty from dispatch items) */
  async createDeliveryRecord(
    input: CreateDeliveryRecordDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const dispatch = await this.dispatchRepo.findOne({
        where: { dispatchId: input.dispatchId, isDeleted: false },
        relations: ["items", "items.sku", "items.product", "items.batch", "salesOrder", "salesOrder.customer"],
      });

      if (!dispatch) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Dispatch not found",
          data: null,
        };
      }

      if (dispatch.items?.length === 0) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Dispatch has no items",
          data: null,
        };
      }

      const customer = dispatch.salesOrder?.customer;
      const deliveryAddress = customer
        ? [customer.shippingStreet, customer.shippingCity, customer.shippingPinCode].filter(Boolean).join(", ")
        : null;
      const customerMobile = customer?.phone ?? null;

      const delivery = this.deliveryRepo.create({
        dispatchId: dispatch.dispatchId,
        deliveryStatus: DeliveryStatusEnum.IN_TRANSIT,
        customerName: dispatch.customerName,
        deliveryAddress,
        customerMobile,
        warehouseName: dispatch.warehouseName,
        vehicleNumber: dispatch.vehicleNumber,
        transporterName: dispatch.transporterName,
        driverName: dispatch.driverName,
        driverMobile: dispatch.driverMobile,
        ewayBillNo: dispatch.ewayBillNo,
        deliveryDate: null,
        remarks: null,
        isDeleted: false,
      });
      await this.deliveryRepo.save(delivery);

      for (const di of dispatch.items) {
        if (di.isDeleted) continue;
        const deliverableQty = di.dispatchedQty;
        const remainingQty = deliverableQty;
        const itemStatus =
          remainingQty === 0 ? DeliveryStatusEnum.FULLY_DELIVERED : DeliveryStatusEnum.PARTIAL_DELIVERED;

        const item = this.deliveryItemRepo.create({
          deliveryId: delivery.deliveryId,
          dispatchItemId: di.dispatchItemId,
          skuId: di.sku?.skuId,
          productId: di.product?.productId,
          orderedQty: di.orderedQty,
          batchId: di.batch?.batchId ?? null,
          deliverableQty,
          deliveredQty:  0,
          deliveryDate: null,
          remainingQty,
          deliveryStatus: itemStatus,
          isDeleted: false,
        });
        await this.deliveryItemRepo.save(item);
      }

      const saved = await this.deliveryRepo.findOne({
        where: { deliveryId: delivery.deliveryId },
        relations: ["items", "items.sku", "items.product"],
      });

      return {
        status: STATUSCODES.SUCCESS,
        message: "Delivery created successfully",
        data: saved,
      };
    } catch (error) {
      throw error;
    }
  }

  /** Update Delivery Header: Delivery Status, Delivery Date, Remarks */
  async updateDeliveryRecordHeader(
    deliveryId: number,
    input: UpdateDeliveryRecordHeaderDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const delivery = await this.deliveryRepo.findOne({
        where: { deliveryId, isDeleted: false },
      });

      if (!delivery) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Delivery not found",
          data: null,
        };
      }

      if (input.deliveryStatus !== undefined) delivery.deliveryStatus = input.deliveryStatus;
      if (input.deliveryDate !== undefined) delivery.deliveryDate = new Date(input.deliveryDate);
      if (input.remarks !== undefined) delivery.remarks = input.remarks;

      await this.deliveryRepo.save(delivery);

      const updated = await this.deliveryRepo.findOne({
        where: { deliveryId },
        relations: ["items", "items.sku", "items.product"],
      });

      return {
        status: STATUSCODES.SUCCESS,
        message: "Delivery header updated successfully",
        data: updated,
      };
    } catch (error) {
      throw error;
    }
  }

  /** Get Delivery by ID */
  async getDeliveryRecordById(
    input: GetDeliveryRecordByIdDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const delivery = await this.deliveryRepo.findOne({
        where: { deliveryId: input.deliveryId, isDeleted: false },
        relations: ["dispatch", "items", "items.sku", "items.product", "items.batch"],
      });

      if (!delivery) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Delivery not found",
          data: null,
        };
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

  /** List Deliveries */
  async listDeliveryRecords(
    input: ListDeliveryRecordDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const qb = this.deliveryRepo
        .createQueryBuilder("d")
        .where("d.isDeleted = false");

      if (input.dispatchId) {
        qb.andWhere("d.dispatchId = :dispatchId", { dispatchId: input.dispatchId });
      }
      if (input.deliveryStatus) {
        qb.andWhere("d.deliveryStatus = :deliveryStatus", { deliveryStatus: input.deliveryStatus });
      }

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

  /** Soft delete Delivery */
  async deleteDeliveryRecord(
    input: DeleteDeliveryRecordDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const delivery = await this.deliveryRepo.findOne({
        where: { deliveryId: input.deliveryId, isDeleted: false },
      });

      if (!delivery) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Delivery not found",
          data: null,
        };
      }

      delivery.isDeleted = true;
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

  /** Update Delivery Item: Delivered Qty, Delivery Date; remaining & status computed */
  async updateDeliveryRecordItem(
    input: UpdateDeliveryRecordItemDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const item = await this.deliveryItemRepo.findOne({
        where: { deliveryItemId: input.deliveryItemId, isDeleted: false },
        relations: ["delivery"],
      });

      if (!item) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Delivery item not found",
          data: null,
        };
      }

      if (input.deliveredQty < 0 || input.deliveredQty > item.deliverableQty) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: `Delivered quantity must be between 0 and ${item.deliverableQty}`,
          data: null,
        };
      }

      item.deliveredQty = input.deliveredQty;
      item.remainingQty = item.deliverableQty - input.deliveredQty;
      item.deliveryStatus =
        item.remainingQty === 0 ? DeliveryStatusEnum.FULLY_DELIVERED : DeliveryStatusEnum.PARTIAL_DELIVERED;
      if (input.deliveryDate !== undefined) item.deliveryDate = new Date(input.deliveryDate);

      await this.deliveryItemRepo.save(item);

      await this.recalculateDeliveryHeaderStatus((Number(item.deliveryId)));

      const updated = await this.deliveryItemRepo.findOne({
        where: { deliveryItemId: item.deliveryItemId },
        relations: ["delivery", "sku", "product"],
      });

      return {
        status: STATUSCODES.SUCCESS,
        message: "Delivery item updated successfully",
        data: updated,
      };
    } catch (error) {
      throw error;
    }
  }

  /** List Delivery Items */
  async listDeliveryRecordItems(
    input: ListDeliveryRecordItemDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const qb = this.deliveryItemRepo
        .createQueryBuilder("di")
        .leftJoinAndSelect("di.delivery", "d")
        .leftJoinAndSelect("di.sku", "sku")
        .leftJoinAndSelect("di.product", "product")
        .leftJoinAndSelect("di.batch", "batch")
        .where("di.isDeleted = false");

      if (input.deliveryId) {
        qb.andWhere("di.deliveryId = :deliveryId", { deliveryId: input.deliveryId });
      }

      const page = input.page ?? 1;
      const limit = input.limit ?? 20;
      qb.skip((page - 1) * limit).take(limit);

      const [records, total] = await qb.getManyAndCount();

      return {
        status: STATUSCODES.SUCCESS,
        message: "Delivery items fetched successfully",
        data: { records, total, page, limit },
      };
    } catch (error) {
      throw error;
    }
  }

  /** Get Delivery Item by ID */
  async getDeliveryRecordItemById(
    input: GetDeliveryRecordItemByIdDto,
    payload: IUser
  ): Promise<IApiResponse> {
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

  /** Soft delete Delivery Item */
  async deleteDeliveryRecordItem(
    input: DeleteDeliveryRecordItemDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const item = await this.deliveryItemRepo.findOne({
        where: { deliveryItemId: input.deliveryItemId, isDeleted: false },
        relations: ["delivery"],
      });

      if (!item) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Delivery item not found",
          data: null,
        };
      }

      item.isDeleted = true;
      await this.deliveryItemRepo.save(item);

      await this.recalculateDeliveryHeaderStatus(Number(item.deliveryId));

      return {
        status: STATUSCODES.SUCCESS,
        message: "Delivery item deleted successfully",
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }

  private async recalculateDeliveryHeaderStatus(deliveryId: number): Promise<void> {
    const delivery = await this.deliveryRepo.findOne({
      where: { deliveryId, isDeleted: false },
      relations: ["items"],
    });

    if (!delivery || !delivery.items?.length) return;

    const activeItems = delivery.items.filter((i) => !i.isDeleted);
    const allFully = activeItems.every((i) => i.remainingQty === 0);
    const anyDelivered = activeItems.some((i) => i.deliveredQty > 0);

    if (allFully && activeItems.length > 0) {
      delivery.deliveryStatus = DeliveryStatusEnum.FULLY_DELIVERED;
    } else if (anyDelivered) {
      delivery.deliveryStatus = DeliveryStatusEnum.PARTIAL_DELIVERED;
    } else {
      delivery.deliveryStatus = DeliveryStatusEnum.IN_TRANSIT;
    }

    await this.deliveryRepo.save(delivery);
  }
}

export { DeliveryRecordController as DeliveryRecordService };
