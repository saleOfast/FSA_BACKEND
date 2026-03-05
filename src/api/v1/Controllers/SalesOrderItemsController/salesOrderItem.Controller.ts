import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateSalesOrderItemDto,UpdateSalesOrderItemDto,GetSalesOrderItemById,DeleteSalesOrderItemById,GetSalesOrderItemsByOrderId,SalesOrderItemListFilter } from '../../../../core/types/SalesOderItemService/salesOrderItemService';
import { SalesOrderItem, SalesOrderItemRepository } from '../../../../core/DB/Entities/salesOrderItem.entity';
import { Sku, SkuRepository } from '../../../../core/DB/Entities/sku.entity';
import { DiscountRepository } from '../../../../core/DB/Entities/discount.entity';
import { getSchemeRepository } from '../../../../core/DB/Entities/scheme.entity';
import { TaxesRepository } from '../../../../core/DB/Entities/tax.entity';
import { SalesOrderHeaderRepository } from '../../../../core/DB/Entities/SalesOrderHeader.entity';
import { calculateSalesOrderAmounts } from '../../../../core/helper/calculateSalesOrder'; // Add this

import { updateSalesOrderHeaderAmounts } from '../../../../core/helper/updateSalesOrderHeaderAmounts'; // Add this import

import { Products,ProductRepository } from "../../../../core/DB/Entities/products.entity";
import { ShippingAddressRepository } from "../../../../core/DB/Entities/shippingAddress.entity"

import { Warehouse, WarehouseRepository }  from "../../../../core/DB/Entities/warehouse.entity";
import { InventoryRepository } from "../../../../core/DB/Entities/inventory"

export class SalesOrderItemController {
  private salesOrderHeaderRepository = SalesOrderHeaderRepository();
  private salesOrderItem = SalesOrderItemRepository();
  private skuRepository = SkuRepository();
  private discountRepository = DiscountRepository();
  private schemeRepository = getSchemeRepository();
  private taxRepository = TaxesRepository();
  private products = ProductRepository()
  private shippingAddress= ShippingAddressRepository()
  private warehouse=WarehouseRepository()
  private inventory=InventoryRepository()

  constructor() { }

public async createSalesOrderItem(
  input: CreateSalesOrderItemDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const {
      salesOrderId,
      productId,
      shippingAddressId,
      saleQty,
      discountId,
      schemeId,
      taxId,
      skuId,
      warehouseId
    } = input;

    /* =====================================================
       1️⃣ Validate Sales Order
    ====================================================== */
    if (!salesOrderId) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: 'Sales Order ID is required'
      };
    }

    const salesOrderHeader = await this.salesOrderHeaderRepository.findOne({
      where: { soId: salesOrderId, isDeleted: false }
    });

    if (!salesOrderHeader) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: 'Sales Order Header not found'
      };
    }

    /* =====================================================
       2️⃣ Validate SKU
    ====================================================== */
    const sku = await this.skuRepository.findOne({
      where: { skuId, isDeleted: false }
    });

    if (!sku) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: 'Invalid SKU'
      };
    }

    const basePrice = Number(sku.basePrice);
    const uom = sku.vom;

    /* =====================================================
       3️⃣ Validate Product
    ====================================================== */
    const product = await this.products.findOne({
      where: { productId, isDeleted: false }
    });

    if (!product) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: 'Invalid Product'
      };
    }

    /* =====================================================
       4️⃣ Validate Shipping Address
    ====================================================== */
    const shippingAddress = await this.shippingAddress.findOne({
      where: { addressId: shippingAddressId, isDeleted: false }
    });

    if (!shippingAddress) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: 'Invalid Shipping Address'
      };
    }

    /* =====================================================
       5️⃣ Validate Warehouse
    ====================================================== */
    const warehouse = await this.warehouse.findOne({
      where: { warehouseId, isDeleted: false }
    });

    if (!warehouse) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: 'Invalid Warehouse'
      };
    }

    /* =====================================================
       6️⃣ Validate SKU exists in Warehouse (Inventory Check)
    ====================================================== */
    const inventory = await this.inventory.findOne({
      where: {
        sku: { skuId },
        warehouse: { warehouseId },
        isDeleted: false
      },
      relations: ['sku', 'warehouse']
    });

    if (!inventory) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: 'This SKU is not available in selected warehouse'
      };
    }

    if (inventory.stockQuantity < saleQty) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: 'Insufficient stock in selected warehouse'
      };
    }

    /* =====================================================
       7️⃣ Fetch Tax
    ====================================================== */
    let tax;
    let taxPercent = 0;

    if (taxId) {
      tax = await this.taxRepository.findOne({
        where: { taxId }
      });

      if (!tax) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: 'Invalid Tax'
        };
      }

      taxPercent = Number(tax.taxPercentage);
    }

    /* =====================================================
       8️⃣ Fetch Discount
    ====================================================== */
    let discount;
    let discountPercentage = 0;

    if (discountId) {
      discount = await this.discountRepository.findOne({
        where: { discountId }
      });

      if (!discount) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: 'Invalid Discount'
        };
      }

      discountPercentage = Number(discount.discountPercentage);
    }

    /* =====================================================
       9️⃣ Calculations
    ====================================================== */
    const amounts = calculateSalesOrderAmounts({
      saleQty,
      basePrice,
      discountPercentage,
      taxPercent
    });

    /* =====================================================
       🔟 Create Sales Order Item
    ====================================================== */
    const item = this.salesOrderItem.create({
      salesOrder: salesOrderHeader,
      product: product,
      sku: sku,
      warehouse: warehouse,                       // FK relation
      warehouseName: warehouse.warehouseName,     // Snapshot name stored in DB
      shippingAddress: shippingAddress,
      saleQty,
      basePrice,
      uom,
      discountPercentage,
      scheme: schemeId ? { id: schemeId } : undefined,
      tax: tax,
      taxPercentage: taxPercent,
      discount: discount,
      ...amounts,
      // createdBy: payload.userId
    });

    const savedItem = await this.salesOrderItem.save(item);

    /* =====================================================
       1️⃣1️⃣ Update Header Amounts
    ====================================================== */
    await updateSalesOrderHeaderAmounts(salesOrderId);

    return {
      status: STATUSCODES.SUCCESS,
      message: 'Sales order item created successfully',
      data: savedItem
    };

  } catch (error) {
    console.error(error);
    throw error;
  }
}

 public async updateSalesOrderItem(
    input: UpdateSalesOrderItemDto,
    payload: IUser
  ): Promise<IApiResponse> {
    try {
      const { id, productId, skuId, shippingAddressId, saleQty, discountId, schemeId, taxId } = input;

      const item = await this.salesOrderItem.findOne({
        where: { id, isDeleted: false },
        relations: ['salesOrder', 'sku', 'tax', 'discount']
      });

      if (!item) {
        return { status: STATUSCODES.NOT_FOUND, message: 'Sales order item not found' };
      }

      const salesOrderId = item.salesOrder.soId;

      // Update fields if provided
      if (productId) item.product = { id: productId } as any;
      if (shippingAddressId) item.shippingAddress = { id: shippingAddressId } as any;
      if (saleQty !== undefined) item.saleQty = saleQty;

      // Recalculate if SKU, discount, scheme, or tax changed
      let needsRecalculation = false;
      let basePrice = item.basePrice;
      let uom = item.uom;
      let discountPercentage = item.discountPercentage;
      let taxPercent = item.taxPercentage;

      if (skuId) {
        const sku = await Sku.findOne({ where: { skuId } });
        if (!sku) {
          return { status: STATUSCODES.BAD_REQUEST, message: 'Invalid SKU' };
        }
        basePrice = Number(sku.basePrice);
        uom = sku.vom || item.uom; // Use existing uom if sku.vom is undefined
        item.basePrice = basePrice;
        item.uom = uom;
        needsRecalculation = true;
      }

      if (discountId !== undefined) {
        if (discountId) {
           const discount = await this.discountRepository.findOne({ where: { discountId } });
          if (!discount) {
            return { status: STATUSCODES.BAD_REQUEST, message: 'Invalid Discount' };
          }
          discountPercentage = Number(discount.discountPercentage);
          item.discount = { id: discountId } as any;
        } else {
          discountPercentage = 0;
          item.discount = undefined;
        }
        item.discountPercentage = discountPercentage;
        needsRecalculation = true;
      }

      if (taxId !== undefined) {
        const tax = await this.taxRepository.findOne({ where: { taxId } });
        if (!tax) {
          return { status: STATUSCODES.BAD_REQUEST, message: 'Invalid Tax' };
        }
        taxPercent = Number(tax.taxPercentage);
        item.tax = { taxId } as any;
        item.taxPercentage = taxPercent;
        needsRecalculation = true;
      }

      if (schemeId !== undefined) {
        if (schemeId) {
          const scheme = await this.schemeRepository.findOne({ where: { id: schemeId } });
          if (!scheme) {
            return { status: STATUSCODES.BAD_REQUEST, message: 'Invalid Scheme' };
          }
          item.scheme = { id: schemeId } as any;
        } else {
          item.scheme = undefined;
        }
        if (schemeId !== undefined) {
          item.schemeId = schemeId;
        }
      }

      // Recalculate amounts if needed
      if (needsRecalculation || saleQty !== undefined) {
        const amounts = calculateSalesOrderAmounts({
          saleQty: item.saleQty,
          basePrice,
          discountPercentage,
          taxPercent
        });
        Object.assign(item, amounts);
      }

      await item.save();

      /* ---------- Update SalesOrderHeader Amounts ---------- */
      await updateSalesOrderHeaderAmounts(salesOrderId);

      return {
        status: STATUSCODES.SUCCESS,
        message: 'Sales order item updated successfully',
        data: item
      };
    } catch (error) {
      throw error;
    }
  }

  public async deleteSalesOrderItem(input: DeleteSalesOrderItemById): Promise<IApiResponse> {
    try {
      const { id } = input;

      const item = await this.salesOrderItem.findOne({
        where: { id, isDeleted: false },
        relations: ['salesOrder']
      });

      if (!item) {
        return { status: STATUSCODES.NOT_FOUND, message: 'Sales order item not found' };
      }

      const salesOrderId = item.salesOrder.soId;

      item.isDeleted = true;
      await item.save();

      /* ---------- Update SalesOrderHeader Amounts ---------- */
      await updateSalesOrderHeaderAmounts(salesOrderId);

      return {
        status: STATUSCODES.SUCCESS,
        message: 'Sales order item deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  public async getSalesOrderItemById(input: GetSalesOrderItemById): Promise<IApiResponse> {
    try {
      const { id } = input;

      const item = await this.salesOrderItem.findOne({
        where: { id, isDeleted: false },
        relations: [
          'salesOrder',
          'product',
          'sku',
          'shippingAddress',
          'discount',
          'scheme',
          'tax'
        ]
      });

      if (!item) {
        return { status: STATUSCODES.NOT_FOUND, message: 'Sales order item not found' };
      }

      return {
        status: STATUSCODES.SUCCESS,
        message: 'Sales order item retrieved successfully',
        data: item
      };
    } catch (error) {
      throw error;
    }
  }

  public async salesOrderItemList(input: SalesOrderItemListFilter, payload: IUser): Promise<IApiResponse> {
    try {
      const { search, salesOrderId, productId } = input;

      const queryBuilder = this.salesOrderItem.createQueryBuilder('item')
        .leftJoinAndSelect('item.salesOrder', 'salesOrder')
        .leftJoinAndSelect('item.product', 'product')
        .leftJoinAndSelect('item.sku', 'sku')
        .leftJoinAndSelect('item.shippingAddress', 'shippingAddress')
        .leftJoinAndSelect('item.discount', 'discount')
        .leftJoinAndSelect('item.scheme', 'scheme')
        .leftJoinAndSelect('item.tax', 'tax')
        .where('item.isDeleted = :isDeleted', { isDeleted: false });

      // Search filter
      if (search) {
        queryBuilder.andWhere(
          `(CAST(item.id AS TEXT) LIKE :search OR
           CAST(item.saleQty AS TEXT) LIKE :search OR
           CAST(item.basePrice AS TEXT) LIKE :search OR
           CAST(item.totalBaseValue AS TEXT) LIKE :search OR
           LOWER(item.uom) LIKE LOWER(:search))`,
          { search: `%${search}%` }
        );
      }

      // Filter by salesOrderId
      if (salesOrderId) {
        queryBuilder.andWhere('salesOrder.soId = :salesOrderId', { salesOrderId });
      }

      // Filter by productId
      if (productId) {
        queryBuilder.andWhere('product.id = :productId', { productId });
      }

      // Order by creation date
      queryBuilder.orderBy('item.createdAt', 'DESC');

      const items = await queryBuilder.getMany();

      return {
        status: STATUSCODES.SUCCESS,
        message: 'Sales order items retrieved successfully',
        data: {
          items,
          totalRecords: items.length
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

export { SalesOrderItemController as SalesOrderItemService }