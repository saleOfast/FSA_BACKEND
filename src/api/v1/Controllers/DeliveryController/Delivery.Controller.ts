import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateDeliveryDto,
  UpdateDeliveryHeaderDto,
  UpdateDeliveryItemDto,
  GetDeliveryByIdDto,
  DeleteDeliveryDto,
  ListDeliveryDto,
} from "../../../../core/types/DeliveryService/DeliveryService";
import { DeliveryHeader, DeliveryHeaderRepository } from "../../../../core/DB/Entities/deliveryHeader.entity";
import { DeliveryItemRepository } from "../../../../core/DB/Entities/deliveryItem.entity";
import { SalesOrderHeaderRepository } from "../../../../core/DB/Entities/SalesOrderHeader.entity";
import { SalesOrderItemRepository } from "../../../../core/DB/Entities/salesOrderItem.entity";
import { WarehouseRepository } from "../../../../core/DB/Entities/warehouse.entity";
import { DeliveryStatusEnum, OrderStatusEnum } from "../../../../core/types/Constent/common";

class DeliveryController {
  private deliveryRepo = DeliveryHeaderRepository();
  private deliveryItemRepo = DeliveryItemRepository();
  private salesOrderRepo = SalesOrderHeaderRepository();
  private salesOrderItemRepo = SalesOrderItemRepository();
  private warehouseRepo = WarehouseRepository();

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

  async updateDeliveryHeader(deliveryId: string, input: UpdateDeliveryHeaderDto, payload: IUser): Promise<IApiResponse> {
    try {
      const delivery = await this.deliveryRepo.findOne({
        where: { deliveryId, isDeleted: false },
      });
      if (!delivery) {
        return { status: STATUSCODES.NOT_FOUND, message: "Delivery not found", data: null };
      }
      if (input.deliveryStatus !== undefined) delivery.deliveryStatus = input.deliveryStatus;
      if (input.deliveryDate !== undefined) delivery.deliveryDate = new Date(input.deliveryDate);
      if (input.vehicleNumber !== undefined) delivery.vehicleNumber = input.vehicleNumber;
      if (input.transporterName !== undefined) delivery.transporterName = input.transporterName;
      if (input.driverName !== undefined) delivery.driverName = input.driverName;
      if (input.driverMobile !== undefined) delivery.driverMobile = input.driverMobile;
      if (input.ewayBillNo !== undefined) delivery.ewayBillNo = input.ewayBillNo;
      if (input.dispatchDate !== undefined) delivery.dispatchDate = new Date(input.dispatchDate);
      await this.deliveryRepo.save(delivery);
      const updated = await this.deliveryRepo.findOne({
        where: { deliveryId },
        relations: ["salesOrder", "customer", "warehouse", "items"],
      });
      return {
        status: STATUSCODES.SUCCESS,
        message: "Delivery updated successfully",
        data: updated,
      };
    } catch (error) {
      throw error;
    }
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




  async updateDeliveryItem(input: UpdateDeliveryItemDto, payload: IUser): Promise<IApiResponse> {
    try {
      const item = await this.deliveryItemRepo.findOne({
        where: { deliveryItemId: input.deliveryItemId, isDeleted: false },
      });
      if (!item) {
        return { status: STATUSCODES.NOT_FOUND, message: "Delivery item not found", data: null };
      }
      if (input.dispatchedQty > item.orderedQty) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Dispatched quantity cannot exceed ordered quantity",
          data: null,
        };
      }
      item.dispatchedQty = input.dispatchedQty;
      await this.deliveryItemRepo.save(item);
      return {
        status: STATUSCODES.SUCCESS,
        message: "Delivery item updated successfully",
        data: item,
      };
    } catch (error) {
      throw error;
    }
  }

}

export { DeliveryController as DeliveryService };
