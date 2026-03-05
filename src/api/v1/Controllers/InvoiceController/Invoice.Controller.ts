import {
  InvoiceHeader,
  InvoiceHeaderRepository,
} from "../../../../core/DB/Entities/invoiceHeader.entity";
import {
  InvoiceItem,
  InvoiceItemRepository,
} from "../../../../core/DB/Entities/invoiceItem.entity";
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  GetInvoiceByIdDto
} from "../../../../core/types/InvoiceService/InvoiceService";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import {  STATUSCODES} from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { DispatchHeader } from "../../../../core/DB/Entities/dispatchHeader.entity";
import { DispatchItem } from "../../../../core/DB/Entities/dispatchItem.entity";
import { Customer } from "../../../../core/DB/Entities/customer.entity";
import { Warehouse } from "../../../../core/DB/Entities/warehouse.entity";
import { InvoiceStatusEnum } from "../../../../core/types/Constent/common";

class InvoiceController {
  private invoiceRepo = InvoiceHeaderRepository();
  private invoiceItemRepo = InvoiceItemRepository();
  

  constructor() {}

  async createInvoice(
    input: CreateInvoiceDto,
    payload: IUser
  ): Promise<IApiResponse> {
    const connection = this.invoiceRepo.manager.connection;

    return await connection.transaction(async (manager) => {
      const invoiceRepo = manager.getRepository(InvoiceHeader);
      const invoiceItemRepo = manager.getRepository(InvoiceItem);
      const deliveryRepo = manager.getRepository(DispatchHeader);
      const customerRepo = manager.getRepository(Customer);

      // 1. Fetch Delivery
      const delivery = await deliveryRepo.findOne({
        where: { dispatchId: input.deliveryId, isDeleted: false },
        relations: ["salesOrder", "warehouse", "items", "items.product", "items.sku"],
      });

      if (!delivery) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Delivery not found",
          data: null,
        };
      }

      // 2. Fetch Customer
      const customer = await customerRepo.findOne({
        where: {  customerId: delivery.salesOrder.customer.customerId},
      });

      if (!customer) {
        return {
          status: STATUSCODES.NOT_FOUND,
          message: "Customer not found",
          data: null,
        };
      }

      // 3. Create Invoice Header
      const invoice = new InvoiceHeader();
      invoice.documentType = input.documentType;
      invoice.invoiceDate = new Date(input.invoiceDate);
      invoice.delivery = delivery;
      invoice.salesOrder = delivery.salesOrder;
      invoice.customer = customer;
      // invoice.warehouse = delivery.warehouse;
      invoice.createdByUser = payload as any; // simplified
      invoice.status = InvoiceStatusEnum.DRAFT;

      // Auto-populate addresses
      invoice.billingAddress = `${customer.billingStreet}, ${customer.billingCity}, ${customer.billingPinCode}`;
      invoice.shippingAddress = `${customer.shippingStreet}, ${customer.shippingCity}, ${customer.shippingPinCode}`;
      
      // Auto-populate GSTINs
      invoice.customerGstin = customer.gstNo || "";

      // Generate Invoice Number
      const count = await invoiceRepo.count();
      invoice.invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

      // 4. Create Invoice Items from Delivery Items
      let netAmount = 0;
      let taxAmount = 0;
      let grossAmount = 0;

      const invoiceItems: InvoiceItem[] = [];

      // Only process items that are dispatched > 0? Or all items in delivery?
      // Assuming we invoice what was dispatched.
      for (const dItem of delivery.items) {
        if (dItem.dispatchedQty <= 0) continue;

        const iItem = new InvoiceItem();
        // iItem.sku = dItem.sku;
        iItem.product = dItem.product;
        iItem.quantity = dItem.dispatchedQty;
        // iItem.unitPrice = Number(dItem.product.price) || 0; // Fallback if price missing
        
        // Basic calculation
        iItem.netAmount = iItem.quantity * iItem.unitPrice;
        
        // Placeholder tax logic (18% GST)
        const taxRate = 18; 
        iItem.taxAmount = (iItem.netAmount * taxRate) / 100;
        iItem.cgstAmount = iItem.taxAmount / 2;
        iItem.sgstAmount = iItem.taxAmount / 2;
        iItem.grossAmount = iItem.netAmount + iItem.taxAmount;
        iItem.lineTotal = iItem.grossAmount;

        invoiceItems.push(iItem);

        netAmount += iItem.netAmount;
        taxAmount += iItem.taxAmount;
        grossAmount += iItem.grossAmount;
      }

      invoice.netAmount = netAmount;
      invoice.taxAmount = taxAmount;
      invoice.cgstAmount = taxAmount / 2;
      invoice.sgstAmount = taxAmount / 2;
      invoice.grossAmount = grossAmount;

      if (input.remarks) invoice.remarks = input.remarks;

      // Save Header first
      const savedInvoice = await invoiceRepo.save(invoice);

      // Save Items
      for (const item of invoiceItems) {
        item.invoice = savedInvoice;
        await invoiceItemRepo.save(item);
      }

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
      where: { invoiceId: input.invoiceId, isDeleted: false },
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

  async updateInvoice(
    invoiceId: string,
    input: UpdateInvoiceDto,
    payload: IUser
  ): Promise<IApiResponse> {
    const invoice = await this.invoiceRepo.findOne({
      where: { invoiceId, isDeleted: false },
    });

    if (!invoice) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Invoice not found",
        data: null,
      };
    }

    if (input.status) invoice.status = input.status;
    if (input.remarks) invoice.remarks = input.remarks;
    if (input.irnNo) invoice.irnNo = input.irnNo;
    if (input.qrCode) invoice.qrCode = input.qrCode;

    await this.invoiceRepo.save(invoice);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Invoice updated successfully",
      data: invoice,
    };
  }
}

export { InvoiceController as InvoiceService };
