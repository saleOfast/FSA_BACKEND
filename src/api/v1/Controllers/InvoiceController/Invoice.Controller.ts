import { InvoiceHeader, InvoiceHeaderRepository } from "../../../../core/DB/Entities/invoiceHeader.entity";
import { InvoiceItem, InvoiceItemRepository } from "../../../../core/DB/Entities/invoiceItem.entity";
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  GetInvoiceByIdDto,
  ListInvoiceDto,
  DeleteInvoiceDto,
  CreateInvoiceItemStandaloneDto,
  UpdateInvoiceItemDto,
  GetInvoiceItemByIdDto,
  ListInvoiceItemDto,
  DeleteInvoiceItemDto,
  ReadyForInvoiceResponseDto
} from "../../../../core/types/InvoiceService/InvoiceService";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import {  STATUSCODES} from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { DispatchHeader } from "../../../../core/DB/Entities/dispatchHeader.entity";
import { DeliveryHeader, DeliveryHeaderRepository } from "../../../../core/DB/Entities/deliveryHeader.entity";
import { Customer } from "../../../../core/DB/Entities/customer.entity";
import { Warehouse } from "../../../../core/DB/Entities/warehouse.entity";
import { InvoiceStatusEnum } from "../../../../core/types/Constent/common";


class InvoiceController {
  private invoiceRepo = InvoiceHeaderRepository();
  private invoiceItemRepo = InvoiceItemRepository();
  private deliveryRepo = DeliveryHeaderRepository();
  
  

  constructor() {}

async createInvoice(
  input: CreateInvoiceDto,
  payload: IUser
): Promise<IApiResponse> {

  const connection = this.invoiceRepo.manager.connection;

  return await connection.transaction(async (manager) => {

    const invoiceRepo = manager.getRepository(InvoiceHeader);
    const invoiceItemRepo = manager.getRepository(InvoiceItem);
    const deliveryRepo = manager.getRepository(DeliveryHeader);
    const warehouseRepo = manager.getRepository(Warehouse);

    /* ================= FETCH DELIVERY ================= */

    const delivery = await deliveryRepo.findOne({
      where: { deliveryId: input.deliveryId, isDeleted: false },
      relations: [
        "dispatch",
        "dispatch.salesOrder",
        "dispatch.salesOrder.customer",
        "dispatch.items",
        "dispatch.items.product",
        "dispatch.items.sku",
       "dispatch.items.salesOrderItem"
      ],
    });

    if (!delivery) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Delivery not found",
        data: null,
      };
    }

    const dispatch = delivery.dispatch;
    const salesOrder = dispatch.salesOrder;
    const customer = salesOrder.customer;

    /* ================= FETCH WAREHOUSE ================= */

    const warehouse = await warehouseRepo.findOne({
      where: { warehouseName: delivery.warehouseName },
    });

    if (!warehouse) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Warehouse not found",
        data: null,
      };
    }

    /* ================= CREATE INVOICE HEADER ================= */

    const invoice = new InvoiceHeader();

    invoice.documentType = input.documentType;
    invoice.invoiceDate = new Date(input.invoiceDate);

    invoice.delivery = delivery;
    invoice.salesOrder = salesOrder;

    /* Customer */
    invoice.customer = customer;
    invoice.customerName = customer.customerName;

    /* Warehouse */
    invoice.warehouse = warehouse;
    invoice.warehouseId = warehouse.warehouseId;
    invoice.warehouseName = warehouse.warehouseName;

    /* Billing Address */
    invoice.billingAddress = [
      customer.billingStreet,
      customer.billingCity,
      customer.billingPinCode,
    ]
      .filter(Boolean)
      .join(", ");

    /* Shipping Address */
    invoice.shippingAddress = [
      customer.shippingStreet,
      customer.shippingCity,
      customer.shippingPinCode,
    ]
      .filter(Boolean)
      .join(", ");

    /* GST */
    invoice.customerGstin = customer.gstNo || "";
    invoice.sellerGstin = warehouse.gstNo || "";

    /* Place Of Supply */
    invoice.placeOfSupply = warehouse.shippingStateName || "";

    /* Transport Details */
    invoice.transporterName = delivery.transporterName || "";
    invoice.vehicleNumber = delivery.vehicleNumber || "";
    invoice.ewayBillNo = delivery.ewayBillNo || "";

    /* Status */
    invoice.status = InvoiceStatusEnum.DRAFT;

    /* Created By */
    invoice.createdByUser = payload as any;

    /* ================= GENERATE INVOICE NUMBER ================= */

    const count = await invoiceRepo.count({
      where: { isDeleted: false },
    });

    invoice.invoiceNumber = `INV-${new Date().getFullYear()}-${String(
      count + 1
    ).padStart(5, "0")}`;

    /* ================= CREATE INVOICE ITEMS ================= */

    let netAmount = 0;
    let taxAmount = 0;
    let grossAmount = 0;
    let discountAmount = 0;

    const invoiceItems: InvoiceItem[] = [];

   for (const dItem of dispatch.items) {

  if (dItem.dispatchedQty <= 0) continue;

  const item = new InvoiceItem();
  const soItem = dItem.salesOrderItem;

  item.invoice = invoice;
  item.orderItem = soItem;

  item.product = dItem.product;
  item.sku = dItem.sku;

  item.hsnCode = dItem.sku?.hsnCode ||"";

  item.quantity = dItem.dispatchedQty;

  item.unitPrice = soItem.basePrice || 0;

  item.netAmount = soItem.netAmount || 0;
  item.discountAmount = soItem.discountValue || 0;

  item.taxAmount = soItem.taxAmount || 0;

  item.cgstAmount =0;
  item.sgstAmount = 0;
  item.igstAmount = 0;
  item.cessAmount = 0;

  item.grossAmount = soItem.grossAmount || 0;

  item.lineTotal = soItem.grossAmount || 0;

  netAmount += item.netAmount;
  taxAmount += item.taxAmount;
  grossAmount += item.grossAmount;
  discountAmount += item.discountAmount;

  invoiceItems.push(item);
}

    /* ================= AMOUNT SUMMARY ================= */

    invoice.discountAmount = discountAmount;
    invoice.netAmount = netAmount;
    invoice.taxAmount = taxAmount;
    invoice.cgstAmount = taxAmount / 2;
    invoice.sgstAmount = taxAmount / 2;
    invoice.grossAmount = grossAmount;

    if (input.remarks) {
      invoice.remarks = input.remarks;
    }

    /* ================= SAVE INVOICE ================= */

    const savedInvoice = await invoiceRepo.save(invoice);

    /* ================= SAVE ITEMS ================= */

    invoiceItems.forEach((item) => {
      item.invoice = savedInvoice;
    });

    await invoiceItemRepo.save(invoiceItems);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Invoice created successfully",
      data: savedInvoice,
    };
  });
}

  async getInvoice(
    input: GetInvoiceByIdDto,
    payload: IUser
  ): Promise<IApiResponse> {
    const invoice = await this.invoiceRepo.findOne({
      where: { invoiceId: Number(input.invoiceId), isDeleted: false },
      relations: ["items", "items.product", "items.sku", "customer", "warehouse"],
    });

    if (!invoice) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Invoice not found",
        data: null,
      };
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: "Invoice fetched successfully",
      data: invoice,
    };
  }

  async listInvoices(
    input: ListInvoiceDto,
    payload: IUser
  ): Promise<IApiResponse> {
    const qb = this.invoiceRepo
      .createQueryBuilder("inv")
      .leftJoinAndSelect("inv.customer", "customer")
      .leftJoinAndSelect("inv.warehouse", "warehouse")
      .where("inv.isDeleted = false");

    if (input.status) {
      qb.andWhere("inv.status = :status", { status: input.status });
    }

    if (input.customerId) {
      qb.andWhere("customer.customerId = :customerId", {
        customerId: input.customerId,
      });
    }

    qb.orderBy("inv.createdAt", "DESC");

    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    qb.skip((page - 1) * limit).take(limit);

    const [list, total] = await qb.getManyAndCount();

    return {
      status: STATUSCODES.SUCCESS,
      message: "Invoices fetched successfully",
      data: { list, total, page, limit },
    };
  }

//  async updateInvoice(
//   invoiceId: number,
//   input: UpdateInvoiceDto,
//   payload: IUser
// ): Promise<IApiResponse> {
//   const invoice = await this.invoiceRepo.findOne({
//     where: { invoiceId, isDeleted: false },
//   });

//   if (!invoice) {
//     return {
//       status: STATUSCODES.NOT_FOUND,
//       message: "Invoice not found",
//       data: null,
//     };
//   }

//   // Update only if value is provided
//   invoice.status = input.status ?? invoice.status;
//   invoice.remarks = input.remarks ?? invoice.remarks;
//   invoice.irnNo = input.irnNo ?? invoice.irnNo;
//   invoice.qrCode = input.qrCode ?? invoice.qrCode;

//   // Save and return updated entity
//   const updatedInvoice = await this.invoiceRepo.save(invoice);

//   return {
//     status: STATUSCODES.SUCCESS,
//     message: "Invoice updated successfully",
//     data: updatedInvoice,
//   };
// }

  async deleteInvoice(
    input: DeleteInvoiceDto,
    payload: IUser
  ): Promise<IApiResponse> {
    const invoice = await this.invoiceRepo.findOne({
      where: { invoiceId: Number(input.invoiceId), isDeleted: false },
      relations: ["items"],
    });

    if (!invoice) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Invoice not found",
        data: null,
      };
    }

    invoice.isDeleted = true;
    await this.invoiceRepo.save(invoice);

    if (invoice.items?.length) {
      for (const item of invoice.items) {
        item.isDeleted = true;
      }
      await this.invoiceItemRepo.save(invoice.items);
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: "Invoice deleted successfully",
      data: null,
    };
  }

  // -------- Invoice Item CRUD --------

  async createInvoiceItem(
    input: CreateInvoiceItemStandaloneDto,
    payload: IUser
  ): Promise<IApiResponse> {
    const invoice = await this.invoiceRepo.findOne({
      where: { invoiceId: Number(input.invoiceId), isDeleted: false },
    });

    if (!invoice) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Invoice not found",
        data: null,
      };
    }

    const item = new InvoiceItem();
    item.invoice = invoice;
    item.skuId = input.skuId;
    item.productId = input.productId;
    item.quantity = input.quantity;
    item.unitPrice = input.unitPrice;

    // Basic calculations; taxes/discounts can be extended later
    item.netAmount = item.quantity * item.unitPrice;
    item.discountAmount = 0;
    item.taxAmount = 0;
    item.cgstAmount = 0;
    item.sgstAmount = 0;
    item.igstAmount = 0;
    item.cessAmount = 0;
    item.grossAmount = item.netAmount;
    item.lineTotal = item.grossAmount;

    if (input.discountId) item.discountId = input.discountId;
    if (input.schemeId) item.schemeId = input.schemeId;

    const saved = await this.invoiceItemRepo.save(item);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Invoice item created successfully",
      data: saved,
    };
  }

  async updateInvoiceItem(
    input: UpdateInvoiceItemDto,
    payload: IUser
  ): Promise<IApiResponse> {
    const item = await this.invoiceItemRepo.findOne({
      where: { invoiceItemId: input.invoiceItemId, isDeleted: false },
    });

    if (!item) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Invoice item not found",
        data: null,
      };
    }

    if (input.quantity !== undefined) {
      item.quantity = input.quantity;
    }
    if (input.unitPrice !== undefined) {
      item.unitPrice = input.unitPrice;
    }
    if (input.discountId !== undefined) {
      item.discountId = input.discountId;
    }
    if (input.schemeId !== undefined) {
      item.schemeId = input.schemeId;
    }

    // Re-calc amounts
    item.netAmount = item.quantity * item.unitPrice;
    item.grossAmount = item.netAmount; // taxes/discounts zeroed for now
    item.lineTotal = item.grossAmount;

    const saved = await this.invoiceItemRepo.save(item);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Invoice item updated successfully",
      data: saved,
    };
  }

  async getInvoiceItem(
    input: GetInvoiceItemByIdDto,
    payload: IUser
  ): Promise<IApiResponse> {
    const item = await this.invoiceItemRepo.findOne({
      where: { invoiceItemId: input.invoiceItemId, isDeleted: false },
      relations: ["invoice", "sku", "product"],
    });

    if (!item) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Invoice item not found",
        data: null,
      };
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: "Invoice item fetched successfully",
      data: item,
    };
  }

  async listInvoiceItems(
    input: ListInvoiceItemDto,
    payload: IUser
  ): Promise<IApiResponse> {
    const qb = this.invoiceItemRepo
      .createQueryBuilder("item")
      .leftJoinAndSelect("item.invoice", "inv")
      .leftJoinAndSelect("item.sku", "sku")
      .leftJoinAndSelect("item.product", "product")
      .where("item.isDeleted = false");

    if (input.invoiceId) {
      qb.andWhere("item.invoiceId = :invoiceId", { invoiceId: input.invoiceId });
    }

    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    qb.skip((page - 1) * limit).take(limit);

    const [records, total] = await qb.getManyAndCount();

    return {
      status: STATUSCODES.SUCCESS,
      message: "Invoice items fetched successfully",
      data: { records, total, page, limit },
    };
  }

  async deleteInvoiceItem(
    input: DeleteInvoiceItemDto,
    payload: IUser
  ): Promise<IApiResponse> {
    const item = await this.invoiceItemRepo.findOne({
      where: { invoiceItemId: input.invoiceItemId, isDeleted: false },
    });

    if (!item) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Invoice item not found",
        data: null,
      };
    }

    item.isDeleted = true;
    await this.invoiceItemRepo.save(item);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Invoice item deleted successfully",
      data: null,
    };
  }

async getReadyForInvoice(
  payload: IUser
): Promise<IApiResponse> {
  try {

    const deliveries = await this.deliveryRepo.find({
      where: { isDeleted: false },
      relations: [
        "dispatch",
        "dispatch.salesOrder",
        "dispatch.salesOrder.customer"
      ]
    });

    const result: ReadyForInvoiceResponseDto[] = deliveries.map((delivery) => {

      const dto = new ReadyForInvoiceResponseDto();

      dto.deliveryNo = delivery.deliveryId;

      dto.salesOrderNo =
        delivery.dispatch?.salesOrder?.soId ?? undefined;

      dto.customerName =
        delivery.dispatch?.salesOrder?.customer?.customerName ?? undefined;

      dto.warehouseName =
        delivery.warehouseName ?? undefined;

      dto.amount =
        Number(delivery.dispatch?.salesOrder?.grandTotal) ?? 0;

      dto.pendingQty = 0;

      return dto;
    });

    return {
      status: STATUSCODES.SUCCESS,
      message: "Ready for Invoice deliveries fetched successfully",
      data: result
    };

  } catch (error: any) {
    throw error;
  }
}
  
}



export { InvoiceController as InvoiceService };
