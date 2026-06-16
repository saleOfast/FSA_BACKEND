import { STATUSCODES} from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { DbConnections } from "../../../../core/DB/postgresdb";
import { PurchaseOrder,PurchasedOrderDetailsRepository } from "../../../../core/DB/Entities/purchaseOrder.entity";
import {CreatePurchaseOrderDto, UpdatePurchaseOrderDto, GetPurchaseOrderByIdDto ,ListPurchaseOrderDto, DeletePurchaseOrderDto,SearchPurchaseOrderDto ,IPurchaseOrder} from "../../../../core/types/PurchaseOrderService/PurchaseOrder.types"
import {Customer,CustomerRepository} from "../../../../core/DB/Entities/customer.entity"
import {Warehouse,WarehouseRepository} from "../../../../core/DB/Entities/warehouse.entity"

export class PurchaseOrderController {
    private PurchaseOrder= PurchasedOrderDetailsRepository();
    private customerRepo= CustomerRepository();
    private warehouseRepo= WarehouseRepository();


    constructor() {}

  async createPurchaseOrder(
  input: CreatePurchaseOrderDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    // ================== 1️⃣ Fetch Customer ==================
    const customer = await this.customerRepo.findOne({
      where: {
        customerId: input.customerId,
        isDeleted: false,
      },
    });

    if (!customer) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Customer not found",
        data: null,
      };
    }

    // ================== 2️⃣ Fetch Warehouse ==================
    const warehouse = await this.warehouseRepo.findOne({
      where: {
        warehouseId: input.warehouseId,
        isDeleted: false,
      },
    });

    if (!warehouse) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Warehouse not found",
        data: null,
      };
    }

    // ================== 3️⃣ Duplicate Check ==================
    const existingPO = await this.PurchaseOrder.findOne({
      where: {
        poNumber: input.poNumber,
        isDeleted: false,
      },
    });

    if (existingPO) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Purchase Order already exists",
        data: null,
      };
    }

    // ================== 4️⃣ Date Validation ==================
    if (
      input.expectedDeliveryDate &&
      new Date(input.expectedDeliveryDate) < new Date(input.poDate)
    ) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message:
          "Expected Delivery Date cannot be earlier than PO Date",
        data: null,
      };
    }

    // ================== 5️⃣ Create Purchase Order ==================
    const purchaseOrder = new PurchaseOrder();

    purchaseOrder.poNumber = input.poNumber;

    purchaseOrder.poDate = input.poDate;

    purchaseOrder.customer = customer;
    purchaseOrder.customerId = customer.customerId;
    // purchaseOrder.customerName = customer.customerName;

    purchaseOrder.warehouse = warehouse;
    purchaseOrder.warehouseId = warehouse.warehouseId;

    purchaseOrder.expectedDeliveryDate =
      input.expectedDeliveryDate ?? null;

    purchaseOrder.paymentTerms =
      input.paymentTerms ?? null;

    purchaseOrder.status =
      input.status ?? "Draft";

    purchaseOrder.remarks =
      input.remarks ?? null;

    purchaseOrder.subTotal =
      input.subTotal ?? 0;

    purchaseOrder.totalDiscount =
      input.totalDiscount ?? 0;

    purchaseOrder.totalTax =
      input.totalTax ?? 0;

    purchaseOrder.grandTotal =
      input.grandTotal ?? 0;

    purchaseOrder.isDeleted = false;

    // ================== 6️⃣ Save ==================
    const savedPO =
      await this.PurchaseOrder.save(purchaseOrder);

    // ================== 7️⃣ Response ==================
    const response = {
      purchaseOrderId: savedPO.purchaseOrderId,
      poNumber: savedPO.poNumber,
      poDate: savedPO.poDate,

      customerId: savedPO.customerId,
      customerName: customer.customerName,

      warehouseId: savedPO.warehouseId,
      warehouseName: warehouse.warehouseName,

      expectedDeliveryDate:
        savedPO.expectedDeliveryDate,

      paymentTerms: savedPO.paymentTerms,

      status: savedPO.status,

      remarks: savedPO.remarks,

      subTotal: savedPO.subTotal,

      totalDiscount: savedPO.totalDiscount,

      totalTax: savedPO.totalTax,

      grandTotal: savedPO.grandTotal,

      isDeleted: savedPO.isDeleted,

      createdAt: savedPO.createdAt,

      updatedAt: savedPO.updatedAt,
    };

    return {
      status: STATUSCODES.SUCCESS,
      message: "Purchase Order created successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
}
async listPurchaseOrders(
  input: ListPurchaseOrderDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const query = this.PurchaseOrder
      .createQueryBuilder("po")
      .leftJoinAndSelect("po.customer", "customer")
      .leftJoinAndSelect("po.warehouse", "warehouse")
      .where("po.isDeleted = false");

    // ================= Filters =================

    if (input.purchaseOrderId) {
      query.andWhere(
        "po.purchaseOrderId = :purchaseOrderId",
        {
          purchaseOrderId: input.purchaseOrderId,
        }
      );
    }

    if (input.poNumber) {
      query.andWhere(
        "LOWER(po.poNumber) LIKE :poNumber",
        {
          poNumber: `%${input.poNumber.toLowerCase()}%`,
        }
      );
    }

    if (input.customerId) {
      query.andWhere(
        "po.customerId = :customerId",
        {
          customerId: input.customerId,
        }
      );
    }

    if (input.warehouseId) {
      query.andWhere(
        "po.warehouseId = :warehouseId",
        {
          warehouseId: input.warehouseId,
        }
      );
    }

    if (input.status) {
      query.andWhere(
        "po.status = :status",
        {
          status: input.status,
        }
      );
    }

    if (input.poDate) {
      query.andWhere(
        "po.poDate = :poDate",
        {
          poDate: input.poDate,
        }
      );
    }

    if (input.expectedDeliveryDate) {
      query.andWhere(
        "po.expectedDeliveryDate = :expectedDeliveryDate",
        {
          expectedDeliveryDate: input.expectedDeliveryDate,
        }
      );
    }

    // ================= Sorting =================

    query.orderBy("po.purchaseOrderId", "DESC");

    const purchaseOrders = await query.getMany();

    // ================= Response =================

    const data = purchaseOrders.map((po) => ({
      purchaseOrderId: po.purchaseOrderId,
      poNumber: po.poNumber,
      poDate: po.poDate,

      customerId: po.customerId,
      customerName: po.customer?.customerName ?? null,

      warehouseId: po.warehouseId,
      warehouseName: po.warehouse?.warehouseName ?? null,

      expectedDeliveryDate: po.expectedDeliveryDate,
      paymentTerms: po.paymentTerms,
      status: po.status,
      remarks: po.remarks,

      subTotal: po.subTotal,
      totalDiscount: po.totalDiscount,
      totalTax: po.totalTax,
      grandTotal: po.grandTotal,

      createdAt: po.createdAt,
      updatedAt: po.updatedAt,
    }));

    return {
      status: STATUSCODES.SUCCESS,
      message: "Purchase Order list fetched successfully",
      data,
    };
  } catch (error) {
    throw error;
  }
}

async deletePurchaseOrder(
  input: DeletePurchaseOrderDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    // ================= Find Purchase Order =================

    const purchaseOrder = await this.PurchaseOrder.findOne({
      where: {
        purchaseOrderId: input.purchaseOrderId,
        isDeleted: false,
      },
    });

    if (!purchaseOrder) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Purchase Order not found",
        data: null,
      };
    }

    // ================= Soft Delete =================

    purchaseOrder.isDeleted = true;

    await this.PurchaseOrder.save(purchaseOrder);

    // ================= Response =================

    return {
      status: STATUSCODES.SUCCESS,
      message: "Purchase Order deleted successfully",
      data: {
        purchaseOrderId: purchaseOrder.purchaseOrderId,
      },
    };
  } catch (error) {
    throw error;
  }
}

async getPurchaseOrderById(
  input: GetPurchaseOrderByIdDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const purchaseOrder = await this.PurchaseOrder.findOne({
      where: {
        purchaseOrderId: input.purchaseOrderId,
        isDeleted: false,
      },
      relations: ["customer", "warehouse"],
    });

    if (!purchaseOrder) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Purchase Order not found",
        data: null,
      };
    }

    const response = {
      purchaseOrderId: purchaseOrder.purchaseOrderId,
      poNumber: purchaseOrder.poNumber,
      poDate: purchaseOrder.poDate,

      customerId: purchaseOrder.customerId,
      customerName: purchaseOrder.customer?.customerName ?? null,

      warehouseId: purchaseOrder.warehouseId,
      warehouseName: purchaseOrder.warehouse?.warehouseName ?? null,

      expectedDeliveryDate: purchaseOrder.expectedDeliveryDate,
      paymentTerms: purchaseOrder.paymentTerms,
      status: purchaseOrder.status,
      remarks: purchaseOrder.remarks,

      subTotal: purchaseOrder.subTotal,
      totalDiscount: purchaseOrder.totalDiscount,
      totalTax: purchaseOrder.totalTax,
      grandTotal: purchaseOrder.grandTotal,

      createdAt: purchaseOrder.createdAt,
      updatedAt: purchaseOrder.updatedAt,
    };

    return {
      status: STATUSCODES.SUCCESS,
      message: "Purchase Order fetched successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
}


async searchPurchaseOrder(
  input: SearchPurchaseOrderDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const query = this.PurchaseOrder
      .createQueryBuilder("po")
      .leftJoinAndSelect("po.customer", "customer")
      .leftJoinAndSelect("po.warehouse", "warehouse")
      .where("po.isDeleted = false");

    // Search by PO Number
    if (input.poNumber) {
      query.andWhere(
        "LOWER(po.poNumber) LIKE :poNumber",
        {
          poNumber: `%${input.poNumber.toLowerCase()}%`,
        }
      );
    }

    // Search by Customer Name
    if (input.customerName) {
      query.andWhere(
        "LOWER(customer.customerName) LIKE :customerName",
        {
          customerName: `%${input.customerName.toLowerCase()}%`,
        }
      );
    }

    // Search by Warehouse Name
    if (input.warehouseName) {
      query.andWhere(
        "LOWER(warehouse.warehouseName) LIKE :warehouseName",
        {
          warehouseName: `%${input.warehouseName.toLowerCase()}%`,
        }
      );
    }

    // Search by Status
    if (input.status) {
      query.andWhere(
        "LOWER(po.status) LIKE :status",
        {
          status: `%${input.status.toLowerCase()}%`,
        }
      );
    }

    // Search by PO Date
    if (input.poDate) {
      query.andWhere(
        "po.poDate = :poDate",
        {
          poDate: input.poDate,
        }
      );
    }

    query.orderBy("po.purchaseOrderId", "DESC");

    const purchaseOrders = await query.getMany();

    const data = purchaseOrders.map((po) => ({
      purchaseOrderId: po.purchaseOrderId,
      poNumber: po.poNumber,
      poDate: po.poDate,

      customerId: po.customerId,
      customerName: po.customer?.customerName,

      warehouseId: po.warehouseId,
      warehouseName: po.warehouse?.warehouseName,

      expectedDeliveryDate: po.expectedDeliveryDate,
      paymentTerms: po.paymentTerms,
      status: po.status,
      remarks: po.remarks,

      subTotal: po.subTotal,
      totalDiscount: po.totalDiscount,
      totalTax: po.totalTax,
      grandTotal: po.grandTotal,

      createdAt: po.createdAt,
      updatedAt: po.updatedAt,
    }));

    return {
      status: STATUSCODES.SUCCESS,
      message: "Purchase Orders fetched successfully",
      data,
    };
  } catch (error) {
    throw error;
  }
}

async updatePurchaseOrder(
  input: UpdatePurchaseOrderDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    // ================== 1️⃣ Find Purchase Order ==================

    const purchaseOrder = await this.PurchaseOrder.findOne({
      where: {
        purchaseOrderId: input.purchaseOrderId,
        isDeleted: false,
      },
      relations: ["customer", "warehouse"],
    });

    if (!purchaseOrder) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Purchase Order not found",
        data: null,
      };
    }

    // ================== 2️⃣ Validate Customer ==================

    if (input.customerName) {
      const customer = await this.customerRepo.findOne({
        where: {
          customerName: input.customerName,
          isDeleted: false,
        },
      });

      if (!customer) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Customer not found",
          data: null,
        };
      }

      purchaseOrder.customer = customer;
      purchaseOrder.customerId = customer.customerId;
    }

    // ================== 3️⃣ Validate Warehouse ==================

    if (input.warehouseName) {
      const warehouse = await this.warehouseRepo.findOne({
        where: {
          warehouseName: input.warehouseName,
          isDeleted: false,
        },
      });

      if (!warehouse) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Warehouse not found",
          data: null,
        };
      }

      purchaseOrder.warehouse = warehouse;
      purchaseOrder.warehouseId = warehouse.warehouseId;
    }

    // ================== 4️⃣ Update Fields ==================

    purchaseOrder.poDate =
      input.poDate ?? purchaseOrder.poDate;

    purchaseOrder.expectedDeliveryDate =
      input.expectedDeliveryDate ??
      purchaseOrder.expectedDeliveryDate;

    purchaseOrder.paymentTerms =
      input.paymentTerms ??
      purchaseOrder.paymentTerms;

    purchaseOrder.status =
      input.status ?? purchaseOrder.status;

    purchaseOrder.remarks =
      input.remarks ?? purchaseOrder.remarks;

    purchaseOrder.subTotal =
      input.subTotal ?? purchaseOrder.subTotal;

    purchaseOrder.totalDiscount =
      input.totalDiscount ?? purchaseOrder.totalDiscount;

    purchaseOrder.totalTax =
      input.totalTax ?? purchaseOrder.totalTax;

    purchaseOrder.grandTotal =
      input.grandTotal ?? purchaseOrder.grandTotal;

    // ================== 5️⃣ Save ==================

    const updatedPurchaseOrder =
      await this.PurchaseOrder.save(purchaseOrder);

    // ================== 6️⃣ Response ==================

    return {
      status: STATUSCODES.SUCCESS,
      message: "Purchase Order updated successfully",
      data: {
        purchaseOrderId: updatedPurchaseOrder.purchaseOrderId,
        poNumber: updatedPurchaseOrder.poNumber,
        poDate: updatedPurchaseOrder.poDate,

        customerId: updatedPurchaseOrder.customerId,
        customerName:
          updatedPurchaseOrder.customer?.customerName,

        warehouseId: updatedPurchaseOrder.warehouseId,
        warehouseName:
          updatedPurchaseOrder.warehouse?.warehouseName,

        expectedDeliveryDate:
          updatedPurchaseOrder.expectedDeliveryDate,

        paymentTerms:
          updatedPurchaseOrder.paymentTerms,

        status: updatedPurchaseOrder.status,
        remarks: updatedPurchaseOrder.remarks,

        subTotal: updatedPurchaseOrder.subTotal,
        totalDiscount:
          updatedPurchaseOrder.totalDiscount,
        totalTax: updatedPurchaseOrder.totalTax,
        grandTotal:
          updatedPurchaseOrder.grandTotal,

        updatedAt: updatedPurchaseOrder.updatedAt,
      },
    };
  } catch (error) {
    throw error;
  }
}

}



export { PurchaseOrderController as PurchaseOrderService };
    

