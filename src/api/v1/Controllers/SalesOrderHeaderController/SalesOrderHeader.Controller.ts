import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { Customer,CustomerRepository } from "../../../../core/DB/Entities/customer.entity";
import { SalesOrderHeader,SalesOrderHeaderRepository } from "../../../../core/DB/Entities/SalesOrderHeader.entity";
import {UserRepository} from '../../../../core/DB/Entities/User.entity'
import {CreateSalesOrderDto,UpdateSalesOrderDto,DeleteSalesOrderDto,GetSalesOrderByIdDto,ListSalesOrderDto} from "../../../../core/types/SalesOrderHeaderService/SalesOrderHeaderService"
import{ OrderTypeEnum,OrderStatusEnum,PaymentModeEnum} from "../../../../core/types/Constent/common"

import{ ShippingAddressRepository} from "../../../../core/DB/Entities/shippingAddress.entity"
import { WarehouseRepository } from "../../../../core/DB/Entities/warehouse.entity";
import { SalesOrderItemRepository } from "../../../../core/DB/Entities/salesOrderItem.entity";
import {InventoryRepository } from "../../../../core/DB/Entities/inventory";

class SalesOrderHeaderController {
    private salesOrderHeader= SalesOrderHeaderRepository()
    private Customer=CustomerRepository()
    private User =UserRepository()
    private shippingAddressRepo = ShippingAddressRepository();
    private warehouseRepo = WarehouseRepository();
    private salesOrderItemRepo = SalesOrderItemRepository();
    private inventoryRepo = InventoryRepository();

   
    constructor() { }

async createSalesOrderHeader(
  input: CreateSalesOrderDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const customer = await this.Customer.findOne({
      where: { customerId: input.customerId },
    });
    if (!customer) return { status: STATUSCODES.BAD_REQUEST, message: "customer not found" };;

    const salesUser = await this.User.findOne({
      where: { emp_id: input.salesUserId },
    });
    if (!salesUser)  return { status: STATUSCODES.BAD_REQUEST, message: "salesUser not found" };;

    const createdByUser = await this.User.findOne({
      where: { emp_id: payload.emp_id },
    });
    if (!createdByUser) return { status: STATUSCODES.BAD_REQUEST, message: "cretaedbyUser not found" };;

    const order = this.salesOrderHeader.create({
      orderType: input.orderType,
      customer,
      orderDate: new Date(input.orderDate),
      poDate: input.poDate ? new Date(input.poDate) : undefined,
      paymentMode: input.paymentMode,
      paymentTerms: input.paymentTerms,
      poNumber: input.poNumber,
      remarks: input.remarks,
      salesUser,
      createdBy: createdByUser,
      status: input.status ?? OrderStatusEnum.DRAFT,
      subtotal: 0,
      otherCharges: 0,
      totalDiscount: 0,
      schemeAmount: 0,
      taxAmount: 0,
      grandTotal: 0,
    });

    await this.salesOrderHeader.save(order);

    const savedOrder = await this.salesOrderHeader.findOne({
      where: { soId: order.soId },
      relations: {
    customer: true,
    salesUser: true,
    createdBy: true,
  },  select: {
    soId: true,
    orderType: true,
    orderDate: true,
    status: true,
    subtotal: true,
    taxAmount: true,
    grandTotal: true,

    customer: {
      customerName: true,
    },
    salesUser: {
      emp_id: true,
    },
    createdBy: {
      emp_id: true,
    },
  }
    });

  return {
  status: STATUSCODES.SUCCESS,
  message: "",
  data: savedOrder,
};
  } catch (error) {
    throw error;
  }
}

async DeleteSalesOrderHeader(input:DeleteSalesOrderDto, payload:IUser):Promise<IApiResponse>{
  try{
    const {soId}= input;

    const salesOrder=await this.salesOrderHeader.findOne({where:{soId, isDeleted:false}})

    if(!salesOrder) 
    {   return {
        status: STATUSCODES.NOT_FOUND,
        message: "SalesOrder not found",
        data: null
      }
    };

    await this.salesOrderHeader.update(
      {soId},
      {isDeleted:true}

    )

     return {
      status: STATUSCODES.SUCCESS,
      message: "salesOrder deleted successfully",
      data: null
    };


  }catch(error){
    throw error;
  }
}
async GetSalesOrderHeaderById(
  input: GetSalesOrderByIdDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const { soId } = input;

    const salesOrder = await this.salesOrderHeader
      .createQueryBuilder('orderHeader')

      /* ================= SALES ORDER HEADER FIELDS ================= */
      .select([
        'orderHeader.soId',
        'orderHeader.orderType',
        'orderHeader.paymentTerms',
        'orderHeader.paymentMode',
        'orderHeader.poNumber',
        'orderHeader.poDate',
        'orderHeader.orderDate',
        'orderHeader.status',
        'orderHeader.remarks',
        'orderHeader.subtotal',
        'orderHeader.otherCharges',
        'orderHeader.totalDiscount',
        'orderHeader.schemeAmount',
        'orderHeader.taxAmount',
        'orderHeader.grandTotal',
        'orderHeader.createdDate',
        'orderHeader.updatedAt',
        'orderHeader.isDeleted',
      ])

      /* ================= RELATIONS ================= */
      .leftJoin('orderHeader.customer', 'customer')
      .leftJoin('orderHeader.salesUser', 'salesUser')
      .leftJoin('orderHeader.createdBy', 'createdBy')
      .leftJoin('orderHeader.approvedBy', 'approvedBy')

      /* ================= RELATION FIELDS ================= */
     .addSelect([
    'customer.customerName',        // ✅ only customer name
    'salesUser.emp_id',         // ✅ only sales user id
    'createdBy.emp_id',         // ✅ only created by id
    'approvedBy.emp_id',        // ✅ only approved by id
  ])

      /* ================= FILTERS ================= */
      .where('orderHeader.soId = :soId', { soId })
      .andWhere('orderHeader.isDeleted = false')

      .getOne();

    if (!salesOrder) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: 'Sales order not found',
        data: null,
      };
    }

    return {
      status: STATUSCODES.SUCCESS,
      message: 'Sales order fetched successfully',
      data: salesOrder,
    };
  } catch (error) {
    throw error;
  }
}

async listSalesOrderHeader(
  input: ListSalesOrderDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const query = this.salesOrderHeader
      .createQueryBuilder('orderHeader')

      /* ================= HEADER FIELDS ================= */
      .select([
        'orderHeader.soId',
        'orderHeader.orderType',
        'orderHeader.paymentTerms',
        'orderHeader.paymentMode',
        'orderHeader.poNumber',
        'orderHeader.poDate',
        'orderHeader.orderDate',
        'orderHeader.status',
        'orderHeader.remarks',
        'orderHeader.subtotal',
        'orderHeader.otherCharges',
        'orderHeader.totalDiscount',
        'orderHeader.schemeAmount',
        'orderHeader.taxAmount',
        'orderHeader.grandTotal',
        'orderHeader.createdDate',
        'orderHeader.updatedAt',
      ])

      /* ================= RELATIONS ================= */
      .leftJoin('orderHeader.customer', 'customer')
      .leftJoin('orderHeader.salesUser', 'salesUser')
      .leftJoin('orderHeader.createdBy', 'createdBy')
      .leftJoin('orderHeader.approvedBy', 'approvedBy')

      /* ================= ONLY REQUIRED RELATION FIELDS ================= */
      .addSelect([
        'customer.customerName',
        'salesUser.emp_id',
        'createdBy.emp_id',
        'approvedBy.emp_id',
      ])

      /* ================= SOFT DELETE ================= */
      .where('orderHeader.isDeleted = false');

    /* ================= DYNAMIC FILTERS ================= */
    if (input.customerId) {
      query.andWhere('customer.id = :customerId', { customerId: input.customerId });
    }

    if (input.salesUserId) {
      query.andWhere('salesUser.id = :salesUserId', { salesUserId: input.salesUserId });
    }

    if (input.status) {
      query.andWhere('orderHeader.status = :status', { status: input.status });
    }

    if (input.fromDate) {
      query.andWhere('orderHeader.orderDate >= :fromDate', { fromDate: input.fromDate });
    }

    if (input.toDate) {
      query.andWhere('orderHeader.orderDate <= :toDate', { toDate: input.toDate });
    }

    /* ================= SORTING ================= */
    const sortBy = input.sortBy || 'createdDate';
    const sortOrder = input.sortOrder || 'DESC';
    query.orderBy(`orderHeader.${sortBy}`, sortOrder);

    /* ================= PAGINATION ================= */
    const page = input.page || 1;
    const limit = input.limit || 20;
    query.skip((page - 1) * limit).take(limit);

    /* ================= EXECUTE QUERY ================= */
    const [data, total] = await query.getManyAndCount();

    return {
      status: STATUSCODES.SUCCESS,
      message: 'Sales orders fetched successfully',
      data: {
        
        list: data,
        total,
        page,
        limit
      },
    };
  } catch (error) {
    throw error;
  }
}

async updateSalesOrderHeader(
  soId: number,
  input: UpdateSalesOrderDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    // 🔹 Find existing sales order
    const salesOrder = await this.salesOrderHeader.findOne({
      where: { soId, isDeleted: false },
      relations: ['customer', 'salesUser', 'createdBy'],
    });

    if (!salesOrder) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: 'Sales order not found',
        data: null,
      };
    }

    // 🔹 Update simple fields
    if (input.orderType !== undefined) salesOrder.orderType = input.orderType;
    if (input.orderDate !== undefined) salesOrder.orderDate = input.orderDate;
    if (input.paymentTerms !== undefined) salesOrder.paymentTerms = input.paymentTerms;
    if (input.paymentMode !== undefined) salesOrder.paymentMode = input.paymentMode;
    if (input.poNumber !== undefined) salesOrder.poNumber = input.poNumber;
    if (input.poDate !== undefined) salesOrder.poDate = input.poDate;
    if (input.remarks !== undefined) salesOrder.remarks = input.remarks;

    // 🔹 Update relation fields
    if (input.customerId !== undefined) {
      salesOrder.customer = { id: input.customerId } as any;
    }
    if (input.salesUserId !== undefined) {
      salesOrder.salesUser = { id: input.salesUserId } as any;
    }

     if (input.subtotal !== undefined) salesOrder.subtotal = input.subtotal;
    if (input.otherCharges !== undefined) salesOrder.otherCharges = input.otherCharges;
    if (input.totalDiscount !== undefined) salesOrder.totalDiscount = input.totalDiscount;
    if (input.schemeAmount !== undefined) salesOrder.schemeAmount = input.schemeAmount;
    if (input.taxAmount !== undefined) salesOrder.taxAmount = input.taxAmount;
    if (input.grandTotal !== undefined) salesOrder.grandTotal = input.grandTotal;

    // 🔹 Save updated sales order
    await this.salesOrderHeader.save(salesOrder);

    // 🔹 Prepare response with only required fields
    const responseData = {
      soId: salesOrder.soId,
      orderType: salesOrder.orderType,
      paymentTerms: salesOrder.paymentTerms,
      paymentMode: salesOrder.paymentMode,
      poNumber: salesOrder.poNumber,
      poDate: salesOrder.poDate,
      orderDate: salesOrder.orderDate,
      status: salesOrder.status,
      remarks: salesOrder.remarks,
      subtotal: salesOrder.subtotal,
      otherCharges: salesOrder.otherCharges,
      totalDiscount: salesOrder.totalDiscount,
      schemeAmount: salesOrder.schemeAmount,
      taxAmount: salesOrder.taxAmount,
      grandTotal: salesOrder.grandTotal,
      createdDate: salesOrder.createdDate,
      updatedAt: salesOrder.updatedAt,
      isDeleted: salesOrder.isDeleted,
      customer: {
        customerName: salesOrder.customer?.customerName,
      },
      salesUser: {
        id: salesOrder.salesUser?.emp_id,
      },
      createdBy: {
        id: salesOrder.createdBy?.emp_id,
      },
    };

    return {
      status: STATUSCODES.SUCCESS,
      message: 'Sales order updated successfully',
      data: responseData,
    };
  } catch (error) {
    throw error;
  }
}

async getConfirmedOrdersForDelivery(payload: IUser): Promise<IApiResponse> {
  try {
  const data = await this.salesOrderHeader
  .createQueryBuilder("so")

  // Customer Join
  .leftJoin("so.customer", "customer")

  // Items Join
      .leftJoin("so.Items", "item", "item.isDeleted = false")

      // ✅ FIXED: Join aggregated inventory to prevent fan-out (double counting)
      .leftJoin(
        (qb) =>
          qb
            .subQuery()
            .select("inv.sku_id", "sku_id")
            .addSelect("inv.warehouse_id", "warehouse_id")
            .addSelect("SUM(inv.stock_quantity)", "stock_quantity")
            .from("inventory", "inv")
            .where("inv.is_deleted = false")
            .groupBy("inv.sku_id, inv.warehouse_id"),
        "inv",
        "inv.sku_id = item.sku_id"
      )

      // Warehouse Join
      .leftJoin(
        "warehouses",
        "warehouse",
        "warehouse.warehouse_id = inv.warehouse_id"
      )

      // Delivery Items Join
      .leftJoin(
        "delivery_items",
        "di",
        "di.order_item_id = item.id AND di.is_deleted = false"
      )

  // Filters
  .where("so.status = :status", { status: OrderStatusEnum.CONFIRMED })
  .andWhere("so.is_deleted = false")

  // Select fields
  .select([
    "so.so_id AS salesOrderId",
    "CONCAT('SO-', so.so_id) AS salesOrderNo",
    "so.orderDate AS orderDate",
    "customer.customer_name AS customerName",
    `CONCAT(
      COALESCE(customer.shipping_street, ''),
      ', ',
      COALESCE(customer.shipping_city, ''),
      ' ',
      COALESCE(customer.shipping_pin_code, '')
    ) AS deliveryAddress`,
    "warehouse.warehouse_name AS warehouseName",
    "COUNT(DISTINCT item.sku_id) AS skuCount",
    "COALESCE(SUM(item.saleQty), 0) AS orderedQty",
    "COALESCE(SUM(inv.stock_quantity), 0) AS availableQty",
    "COALESCE(SUM(di.dispatched_qty), 0) AS deliveredQty",
    `COALESCE(SUM(item.saleQty), 0) - COALESCE(SUM(di.dispatched_qty), 0) AS deliverableQty`
  ])

  .groupBy(`
    so.so_id,
    so.orderDate,
    customer.customer_id,
    customer.shipping_street,
    customer.shipping_city,
    customer.shipping_pin_code,
    warehouse.warehouse_id,
    warehouse.warehouse_name
  `)
  .getRawMany();

    return {
      status: STATUSCODES.SUCCESS,
      message: "Confirmed Orders fetched successfully",
      data,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}


}





export{SalesOrderHeaderController as SalesOrderHeaderService}