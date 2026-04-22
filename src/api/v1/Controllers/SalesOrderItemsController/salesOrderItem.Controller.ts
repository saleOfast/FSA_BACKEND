import { PriceBookStatus, STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateSalesOrderItemDto,UpdateSalesOrderItemDto,GetSalesOrderItemById,DeleteSalesOrderItemById,GetSalesOrderItemsByOrderId,SalesOrderItemListFilter } from '../../../../core/types/SalesOderItemService/salesOrderItemService';
import { SalesOrderItem, SalesOrderItemRepository } from '../../../../core/DB/Entities/salesOrderItem.entity';
import { Sku, SkuRepository } from '../../../../core/DB/Entities/sku.entity';
import {  DiscountRepository } from '../../../../core/DB/Entities/discount.entity';
import { getSchemeRepository } from '../../../../core/DB/Entities/scheme.entity';
import { TaxesRepository } from '../../../../core/DB/Entities/tax.entity';
import { SalesOrderHeaderRepository } from '../../../../core/DB/Entities/SalesOrderHeader.entity';
import { calculateSalesOrderAmounts } from '../../../../core/helper/calculateSalesOrder'; // Add this

import { updateSalesOrderHeaderAmounts } from '../../../../core/helper/updateSalesOrderHeaderAmounts'; // Add this import

import { Products,ProductRepository } from "../../../../core/DB/Entities/products.entity";
import { ShippingAddressRepository } from "../../../../core/DB/Entities/shippingAddress.entity"

import { Warehouse, WarehouseRepository }  from "../../../../core/DB/Entities/warehouse.entity";
import { InventoryRepository } from "../../../../core/DB/Entities/inventory";
import { Inventory } from "../../../../core/DB/Entities/inventory"; // ✅ ADD THIS
// import { Tax } from "../../../../core/DB/Entities/tax.entity";
// import { Discount } from "../../../../core/DB/Entities/discount.entity";
import { Batch } from "../../../../core/DB/Entities/inventoryBatch.entity"
import { PriceBookItemRepository } from "../../../../core/DB/Entities/price_book_item.entity";

async function sumBatchFreeStock(
  batchRepo: import("typeorm").Repository<Batch>,
  inventoryId: number
): Promise<number> {
  const row = await batchRepo
    .createQueryBuilder("b")
    .select("COALESCE(SUM(b.currentStock - b.reservedStock), 0)", "avail")
    .where("b.inventoryId = :inventoryId", { inventoryId })
    .andWhere("b.isDeleted = :d", { d: false })
    .getRawOne();
  return Number(row?.avail) || 0;
}

/** Deduct saleQty from batch currentStock (FEFO), never below reservedStock */
function fifoConsumeCurrentStock(batches: Batch[], saleQty: number): void {
  let remaining = saleQty;
  for (const b of batches) {
    if (remaining <= 0) break;
    const free = Math.max(
      0,
      (b.currentStock ?? 0) - (b.reservedStock ?? 0)
    );
    if (free <= 0) continue;
    const take = Math.min(free, remaining);
    b.currentStock = (b.currentStock ?? 0) - take;
    remaining -= take;
  }
  if (remaining > 0) {
    throw new Error("Insufficient stock in selected warehouse");
  }
}


/** Return qty to stock: adds to first FEFO batch (totals stay correct; per-batch is approximate). */
function fifoRestoreStock(batchesFefoOrdered: Batch[], qty: number): void {
  if (qty <= 0) return;
  if (batchesFefoOrdered.length === 0) {
    throw new Error("No batches to restore stock");
  }
  const b = batchesFefoOrdered[0];
  b.currentStock = (b.currentStock ?? 0) + qty;
}

async function loadLockedBatchesFefo(
  manager: import("typeorm").EntityManager,
  inventoryId: number
): Promise<Batch[]> {
  const batchRepo = manager.getRepository(Batch);
  return batchRepo
    .createQueryBuilder("b")
    .where("b.inventoryId = :inventoryId", { inventoryId })
    .andWhere("b.isDeleted = :d", { d: false })
    .orderBy("b.expiryDate IS NULL", "ASC")
    .addOrderBy("b.expiryDate", "ASC")
    .addOrderBy("b.batchId", "ASC")
    .setLock("pessimistic_write")
    .getMany();
}

/** delta > 0 = consume more stock; delta < 0 = return stock to warehouse. */
async function applyInventoryDeltaForLine(
  manager: import("typeorm").EntityManager,
  inventoryId: number,
  delta: number
): Promise<void> {
  if (delta === 0) return;
  const invRepo = manager.getRepository(Inventory);
  const batchRepo = manager.getRepository(Batch);
  const inv = await invRepo.findOne({
    where: { inventoryId, isDeleted: false },
    lock: { mode: "pessimistic_write" },
  });
  if (!inv) throw new Error("Inventory row missing");
  const batchCount = await batchRepo.count({
    where: { inventoryId, isDeleted: false },
  });
  if (batchCount > 0) {
    const batches = await loadLockedBatchesFefo(manager, inventoryId);
    if (delta > 0) {
      const avail = await sumBatchFreeStock(batchRepo, inventoryId);
      if (avail < delta) {
        throw new Error("Insufficient stock in selected warehouse");
      }
      fifoConsumeCurrentStock(batches, delta);
      // For consumption, keep inventory in sync with batch totals.
      for (const b of batches) {
        await batchRepo.save(b);
      }
      await syncInventoryStockFromBatches(manager, inventoryId);
    } else {
      // For restore, add back to both batch (best effort) and inventory row directly.
      // This avoids losing restored qty when historical batch totals are already inconsistent.
      fifoRestoreStock(batches, -delta);
      for (const b of batches) {
        await batchRepo.save(b);
      }
      inv.stockQuantity += -delta;
      await invRepo.save(inv);
    }
  } else {
    if (delta > 0) {
      if (inv.stockQuantity < delta) {
        throw new Error("Insufficient stock in selected warehouse");
      }
      inv.stockQuantity -= delta;
    } else {
      inv.stockQuantity += -delta;
    }
    await invRepo.save(inv);
  }
}

async function syncInventoryStockFromBatches(
  manager: import("typeorm").EntityManager,
  inventoryId: number
): Promise<void> {
  const batchRepo = manager.getRepository(Batch);
  const invRepo = manager.getRepository(Inventory);
  const total = await batchRepo
    .createQueryBuilder("b")
    .select("COALESCE(SUM(b.currentStock), 0)", "total")
    .where("b.inventoryId = :inventoryId", { inventoryId })
    .andWhere("b.isDeleted = :d", { d: false })
    .getRawOne();
  const inv = await invRepo.findOne({
    where: { inventoryId, isDeleted: false },
    lock: { mode: "pessimistic_write" },
  });
  if (!inv) throw new Error("Inventory row missing");
  inv.stockQuantity = Number(total?.total) || 0;
  await invRepo.save(inv);
}
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
  private priceBookItem=PriceBookItemRepository()

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

    /* =====================================================
       🔥 Fetch PriceBookItem (IMPORTANT FIX APPLIED)
    ====================================================== */
 
const priceBookItem = await this.priceBookItem.findOne({
  where: {
    sku: {
      skuId: sku.skuId,   // ✅ filter by skuId
    },
    isDeleted: false,
    priceBook: {
      status: PriceBookStatus.ACTIVE
    }
  },
  relations: ["sku", "priceBook"]
});

if (!priceBookItem) {
  return {
    status: STATUSCODES.BAD_REQUEST,
    message: "Invalid PriceBookItem"
  };
}

if (priceBookItem.priceBook.status !== PriceBookStatus.ACTIVE) {
  return {
    status: STATUSCODES.BAD_REQUEST,
    message: "Inactive PriceBook"
  };
}

console.log("priceBookItem.sku.skuId:", priceBookItem.sku.skuId, "input skuId:", skuId); 
if (priceBookItem.skuId !== skuId) {
  return {
    status: STATUSCODES.BAD_REQUEST,
    message: "PriceBookItem does not match SKU"
  };
}

    const basePrice = Number(priceBookItem.basePrice);
    const uom = sku.vom; // ✅ fixed typo

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
       5️⃣ Validate Warehouse + Inventory
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

    const inventory = await this.inventory.findOne({
      where: {
        sku: { skuId },
        warehouse: { warehouseId },
        product: { productId },
        isDeleted: false,
      },
      relations: ["sku", "warehouse"],
    });

    if (!inventory) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "SKU not available in selected warehouse"
      };
    }

    /* =====================================================
       6️⃣ Pre Stock Check
    ====================================================== */
    const batchRepoPre = this.salesOrderItem.manager.getRepository(Batch);

    const hasBatches =
      (await batchRepoPre.count({
        where: { inventoryId: inventory.inventoryId, isDeleted: false },
      })) > 0;

    if (hasBatches) {
      const avail = await sumBatchFreeStock(batchRepoPre, inventory.inventoryId);
      if (avail < saleQty) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Insufficient stock",
        };
      }
    } else if (inventory.stockQuantity < saleQty) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Insufficient stock",
      };
    }

    /* =====================================================
       7️⃣ Tax
    ====================================================== */
    let tax: any;
    let taxPercent = 0;

    if (taxId) {
      tax = await this.taxRepository.findOne({ where: { taxId } });
      if (!tax) throw new Error("Invalid Tax");
      taxPercent = Number(tax.taxPercentage);
    }

    /* =====================================================
       8️⃣ Discount
    ====================================================== */
    let discount: any;
    let discountPercentage = 0;

    if (discountId) {
      discount = await this.discountRepository.findOne({ where: { discountId } });
      if (!discount) throw new Error("Invalid Discount");
      discountPercentage = Number(discount.discountPercentage);
    }

    /* =====================================================
       9️⃣ Calculation
    ====================================================== */
    const amounts = calculateSalesOrderAmounts({
      saleQty,
      basePrice,
      discountPercentage,
      taxPercent
    });

    /* =====================================================
       🔟 Transaction (Stock + Save)
    ====================================================== */
    const savedItem = await this.salesOrderItem.manager.transaction(
      async (manager) => {
        const itemRepo = manager.getRepository(SalesOrderItem);
        // Keep create/update/delete stock movements consistent with batch-aware logic.
        await applyInventoryDeltaForLine(manager, inventory.inventoryId, saleQty);

        /* ================== FINAL SAVE ================== */
        const item = itemRepo.create({
          salesOrder: salesOrderHeader,
          product,
          sku,
          warehouse,
          warehouseName: warehouse.warehouseName,
          shippingAddress,

          saleQty,

          // 🔥 MOST IMPORTANT LINE
          priceBookItem: { priceBookItemId: priceBookItem.priceBookItemId },

          basePrice,
          uom,

          discountPercentage,
          discount,
          scheme: schemeId ? ({ id: schemeId } as any) : undefined,
          tax,
          taxPercentage: taxPercent,

          ...amounts,
        });

        return itemRepo.save(item);
      }
    );

    /* =====================================================
       1️⃣1️⃣ Update Header
    ====================================================== */
    await updateSalesOrderHeaderAmounts(salesOrderId);

    return {
      status: STATUSCODES.SUCCESS,
      message: 'Sales order item created successfully',
      data: savedItem
    };

  } catch (error: any) {
    const msg = error?.message || "";

    if (msg.includes("stock") || msg.includes("Inventory")) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: msg,
      };
    }

    throw error;
  }
}

public async updateSalesOrderItem(
  input: UpdateSalesOrderItemDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const {
      id,
      productId,
      skuId,
      shippingAddressId,
      saleQty,
      discountId,
      schemeId,
      taxId
    } = input;

    /* =====================================================
       1️⃣ Fetch Item
    ====================================================== */
    const item = await this.salesOrderItem.findOne({
      where: { id, isDeleted: false },
      relations: ["salesOrder", "sku", "tax", "discount", "warehouse", "priceBookItem"],
    });

    if (!item) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Sales order item not found",
      };
    }

    /* =====================================================
       2️⃣ Prevent SKU Change
    ====================================================== */
    if (skuId !== undefined && skuId !== item.sku.skuId) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Changing SKU is not supported. Create new line item.",
      };
    }

    const salesOrderId = item.salesOrder.soId;

    /* =====================================================
       3️⃣ Inventory Handling
    ====================================================== */
    const prevQty = Number(item.saleQty);
    const nextQty = saleQty !== undefined ? saleQty : prevQty;

    const invRow = await this.inventory.findOne({
      where: {
        sku: { skuId: item.sku.skuId },
        warehouse: { warehouseId: item.warehouse.warehouseId },
        isDeleted: false,
      },
    });

    if (!invRow) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Inventory not found",
      };
    }

    if (nextQty !== prevQty) {
      const delta = nextQty - prevQty;

      try {
        await this.salesOrderItem.manager.transaction(async (manager) => {
          await applyInventoryDeltaForLine(manager, invRow.inventoryId, delta);
        });
      } catch (e: any) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: e.message,
        };
      }
    }

    /* =====================================================
       4️⃣ Basic Updates
    ====================================================== */
    if (productId !== undefined) {
      if (!productId) {
        return { status: STATUSCODES.BAD_REQUEST, message: "Invalid Product" };
      }
      const product = await this.products.findOne({
        where: { productId, isDeleted: false },
      });
      if (!product) {
        return { status: STATUSCODES.BAD_REQUEST, message: "Invalid Product" };
      }
      item.product = product;
    }

    if (shippingAddressId !== undefined) {
      if (!shippingAddressId) {
        return { status: STATUSCODES.BAD_REQUEST, message: "Invalid Shipping Address" };
      }
      const shippingAddress = await this.shippingAddress.findOne({
        where: { addressId: shippingAddressId, isDeleted: false },
      });
      if (!shippingAddress) {
        return { status: STATUSCODES.BAD_REQUEST, message: "Invalid Shipping Address" };
      }
      item.shippingAddress = shippingAddress;
    }
    if (saleQty !== undefined) item.saleQty = nextQty;

    /* =====================================================
       5️⃣ Pricing (DO NOT CHANGE ❗)
    ====================================================== */
    let basePrice = Number(item.basePrice); // snapshot
    let discountPercentage = Number(item.discountPercentage);
    let taxPercent = Number(item.taxPercentage);

    let needsRecalculation = false;

    /* =====================================================
       6️⃣ Discount
    ====================================================== */
    if (discountId !== undefined) {
      if (discountId) {
        const discount = await this.discountRepository.findOne({
          where: { discountId },
        });

        if (!discount) {
          return {
            status: STATUSCODES.BAD_REQUEST,
            message: "Invalid Discount",
          };
        }

        discountPercentage = Number(discount.discountPercentage);
        item.discount = { discountId } as any;
      } else {
        discountPercentage = 0;
        item.discount = undefined;
      }

      item.discountPercentage = discountPercentage;
      needsRecalculation = true;
    }

    /* =====================================================
       7️⃣ Tax
    ====================================================== */
    if (taxId !== undefined) {
      const tax = await this.taxRepository.findOne({
        where: { taxId },
      });

      if (!tax) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Invalid Tax",
        };
      }

      taxPercent = Number(tax.taxPercentage);
      item.tax = { taxId } as any; // ensure PK matches entity
      item.taxPercentage = taxPercent;

      needsRecalculation = true;
    }

    /* =====================================================
       8️⃣ Scheme
    ====================================================== */
    if (schemeId !== undefined) {
      if (schemeId) {
        const scheme = await this.schemeRepository.findOne({
          where: { id: schemeId, isDeleted: false },
        });

        if (!scheme) {
          return {
            status: STATUSCODES.BAD_REQUEST,
            message: "Invalid Scheme",
          };
        }

        item.scheme = scheme;
      } else {
        item.scheme = undefined;
      }
    }

    /* =====================================================
       9️⃣ Recalculate
    ====================================================== */
    if (needsRecalculation || saleQty !== undefined) {
      const amounts = calculateSalesOrderAmounts({
        saleQty: item.saleQty,
        basePrice,
        discountPercentage,
        taxPercent,
      });

      Object.assign(item, amounts);
    }

    /* =====================================================
       🔟 Save
    ====================================================== */
    await item.save();

    /* =====================================================
       1️⃣1️⃣ Update Header
    ====================================================== */
    await updateSalesOrderHeaderAmounts(salesOrderId);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Sales order item updated successfully",
      data: item,
    };

  } catch (error) {
    throw error;
  }
}


public async deleteSalesOrderItem(
  input: DeleteSalesOrderItemById
): Promise<IApiResponse> {
  try {
    const { id } = input;
    let salesOrderId: number | null = null;

    await this.salesOrderItem.manager.transaction(async (manager) => {
      const itemRepo = manager.getRepository(SalesOrderItem);
      const invRepo = manager.getRepository(Inventory);

      /* =====================================================
         1️⃣ Fetch RAW DATA
      ===================================================== */
      const rawItem = await itemRepo
        .createQueryBuilder("item")
        .select("item.id", "id")
        .addSelect("item.saleQty", "saleQty")
        .addSelect("item.sku_id", "skuId")
        .addSelect("item.warehouse_id", "warehouseId")
        .addSelect("item.product_id", "productId")
        .addSelect("item.sales_order_id", "salesOrderId")
        .where("item.id = :id", { id })
        .andWhere("item.isDeleted = false")
        .setLock("pessimistic_write")
        .getRawOne();

      if (!rawItem) {
        throw new Error("Sales order item not found");
      }

      const skuId = Number(rawItem.skuId);
      const warehouseId = String(rawItem.warehouseId ?? "");
      const productId = Number(rawItem.productId);
      salesOrderId = Number(rawItem.salesOrderId) || null;
      const saleQty = Number(rawItem.saleQty);
      if (
        !Number.isFinite(skuId) ||
        !warehouseId ||
        !Number.isFinite(productId) ||
        !Number.isFinite(salesOrderId) ||
        !Number.isFinite(saleQty) ||
        saleQty < 0
      ) {
        throw new Error("Invalid item mapping");
      }

      if (!skuId || !warehouseId || !productId || !salesOrderId) {
        throw new Error("Invalid item mapping");
      }

      /* =====================================================
         2️⃣ Soft Delete
      ===================================================== */
      const updateRes = await itemRepo.update({ id, isDeleted: false }, { isDeleted: true });
      if (!updateRes.affected) {
        throw new Error("Sales order item not found");
      }

      /* =====================================================
         3️⃣ Fetch Inventory (LOCK)
      ===================================================== */
      const inventory = await invRepo
        .createQueryBuilder("inv")
        .where("inv.sku_id = :skuId", { skuId })
        .andWhere("inv.warehouse_id = :warehouseId", { warehouseId }) // ✅ string match
        .andWhere("inv.product_id = :productId", { productId })
        .andWhere("inv.is_deleted = false")
        .setLock("pessimistic_write")
        .getOne();

      if (!inventory) {
        throw new Error("Inventory not found");
      }

      /* =====================================================
         4️⃣ RESTORE STOCK
      ===================================================== */
      await applyInventoryDeltaForLine(
        manager,
        inventory.inventoryId,
        -saleQty
      );
    });

    /* =====================================================
       5️⃣ Update Header
    ===================================================== */
    if (!salesOrderId) {
      throw new Error("SalesOrderId not found");
    }

    await updateSalesOrderHeaderAmounts(salesOrderId);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Sales order item deleted successfully",
    };

  } catch (error: any) {
    const msg = error?.message || "";

    if (
      msg.includes("stock") ||
      msg.includes("Inventory") ||
      msg.includes("not found") ||
      msg.includes("mapping")
    ) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: msg,
      };
    }

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