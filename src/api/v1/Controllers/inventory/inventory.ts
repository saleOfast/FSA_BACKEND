import { Request, Response } from "express";
import { InventoryItem, InventoryStatus } from "../../../../core/DB/Entities/inventory";
import { Products } from "../../../../core/DB/Entities/products.entity";
import { RequestHandler } from "../../../../core/helper/RequestHander";
import { ILike } from "typeorm";

export class InventoryController {
 async create(req: Request, res: Response) {
    try {
      const {
        productId,
        warehouseId,
        batchNumber,
        serialNumber,
        quantityOnHand,
        quantityReserved,
        reorderLevel,
        costPrice,
        unitOfMeasure,
        status,
        dateReceived,
        expiryDate,
        averageCost,
      } = req.body;

      const user = RequestHandler.Custom.getUser(req);
      const createdBy = user?.emp_id ? String(user.emp_id) : null;

      // Validate product
      const product = await Products.findOneBy({ productId });
      if (!product) return res.status(400).json({ error: "Invalid productId. Product not found." });

      // Safe numeric parsing
      const parsedWarehouseId = warehouseId !== undefined ? Number(warehouseId) : null;
      if (parsedWarehouseId === null || !Number.isFinite(parsedWarehouseId)) {
        return res.status(400).json({ error: "warehouseId is required and must be a valid number" });
      }

      const onHand = quantityOnHand !== undefined ? Number(quantityOnHand) : 0;
      const reserved = quantityReserved !== undefined ? Number(quantityReserved) : 0;
      const reorder = reorderLevel !== undefined ? Number(reorderLevel) : null;
      const cost = costPrice !== undefined ? Number(costPrice) : null;
      const avgCost = averageCost !== undefined ? Number(averageCost) : null;

      if (!Number.isFinite(onHand) || !Number.isFinite(reserved) || (reorder !== null && !Number.isFinite(reorder))) {
        return res.status(400).json({ error: "Numeric fields must be valid numbers" });
      }

      // Check uniqueness per product + warehouse
      const existingItem = await InventoryItem.findOne({
        where: { warehouseId: parsedWarehouseId, product: { productId } },
      });
      if (existingItem) return res.status(400).json({ error: "Inventory item for this product in this warehouse already exists" });

      const available = onHand - reserved;

      const newItem = InventoryItem.create({
        product,
        warehouseId: parsedWarehouseId,
        batchNumber: batchNumber || null,
        serialNumber: serialNumber || null,
        quantityOnHand: onHand,
        quantityReserved: reserved,
        quantityAvailable: available,
        reorderLevel: reorder,
        dateReceived: dateReceived || null,
        expiryDate: expiryDate || null,
        costPrice: cost,
        averageCost: avgCost,
        unitOfMeasure: unitOfMeasure || null,
        status: status || InventoryStatus.ACTIVE,
        createdBy,
        lastModifiedBy: createdBy,
      } as Partial<InventoryItem>);

      const savedItem = await InventoryItem.save(newItem);

      const plainItem = JSON.parse(JSON.stringify(savedItem));
      delete plainItem.product;

      return res.status(201).json({
        productId: product.productId,
        productName: product.productName,
        ...plainItem,
      });

    } catch (err: any) {
      console.error("Error creating inventory item:", err?.message || err);
      return res.status(500).json({ error: "Error creating inventory item", message: err?.message || "Unknown error" });
    }
  }

async getAll(req: Request, res: Response) {
    try {
      const { productId, productName, batchNumber } = req.query;
      const where: any = {};
      const productWhere: any = {};
      

      // productId filter
      if (productId) {
        const pid = Number(productId);
        if (!Number.isFinite(pid)) {
          return res.status(400).json({ error: "productId must be a number" });
        }
        productWhere.productId = pid;
      }

      // productName filter
      if (productName && String(productName).trim() !== "") {
        productWhere.productName = ILike(`%${String(productName).trim()}%`);
      }

      // batchNumber filter
      if (batchNumber && String(batchNumber).trim() !== "") {
        where.batchNumber = ILike(`%${String(batchNumber).trim()}%`);
      }

      // Add product filters if exist
      if (Object.keys(productWhere).length > 0) {
        where.product = productWhere;
      }

      // Fetch data
      const items = Object.keys(where).length > 0
        ? await InventoryItem.find({ where })
        : await InventoryItem.find();

      const response = items.map((i) => {
        const plain = JSON.parse(JSON.stringify(i));
        delete plain.product;
        return {
          productId: i.product?.productId,
          productName: i.product?.productName,
          ...plain,
        };
      });
      return res.json(response);
    } catch (err: any) {
      return res.status(500).json({
        error: "Error fetching inventory items",
        message: err?.message || "Unknown error",
      });
    }
  }


  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const item = await InventoryItem.findOneBy({ id });

      if (!item) {
        return res.status(404).json({ error: "Inventory item not found" });
      }
      const plain = JSON.parse(JSON.stringify(item));
      delete plain.product;

      return res.json({
        productId: item.product?.productId,
        productName: item.product?.productName,
         ...plain
      });
    } catch (err) {
      return res.status(500).json({ error: "Error fetching inventory item" });
    }
  }

  async update(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const item = await InventoryItem.findOneBy({ id });

    if (!item) {
      return res.status(404).json({ error: "Inventory item is not found" });
    }

    const user = RequestHandler.Custom.getUser(req);
    const lastModifiedBy = user?.emp_id ? String(user.emp_id) : null;
    let didChange = false;

    // --- Validate and update warehouseId ---
   if (req.body.warehouseId !== undefined) {
  const parsed = Number(req.body.warehouseId);
  if (!Number.isFinite(parsed)) {
    return res.status(400).json({ error: "warehouseId must be a number" });
  }

  // 🔑 Only check if it's different from the current item's warehouseId
  if (parsed !== item.warehouseId) {
    const exists = await InventoryItem.findOne({ where: { warehouseId: parsed } });
    if (exists && exists.id !== item.id) {
      return res.status(400).json({ error: "warehouseId already exists" });
    }
    item.warehouseId = parsed;
    didChange = true;
  }
}

    // --- Validate and update serialNumber ---
    if (req.body.serialNumber !== undefined) {
      const newSerial = req.body.serialNumber;
      if (newSerial !== item.serialNumber) {
        const exists = await InventoryItem.findOne({ where: { serialNumber: newSerial } });
        if (exists && exists.id !== item.id) {
          return res.status(400).json({ error: "serialNumber already exists" });
        }
        item.serialNumber = newSerial;
        didChange = true;
      }
    }

    // --- Merge other fields ---
    const {
      productId,
      batchNumber,
      quantityOnHand,
      quantityReserved,
      reorderLevel,
      costPrice,
      unitOfMeasure,
      status,
      dateReceived,
      expiryDate,
      averageCost,
    } = req.body;

    // Update product relation
    if (productId !== undefined) {
      const product = await Products.findOneBy({ productId });
      if (!product) {
        return res.status(400).json({ error: "Invalid productId. Product not found." });
      }
      if (item.product?.productId !== product.productId) {
        item.product = product;
        didChange = true;
      }
    }

    if (batchNumber !== undefined && batchNumber !== item.batchNumber) { item.batchNumber = batchNumber; didChange = true; }
    if (quantityOnHand !== undefined && quantityOnHand !== item.quantityOnHand) { item.quantityOnHand = quantityOnHand; didChange = true; }
    if (quantityReserved !== undefined && quantityReserved !== item.quantityReserved) { item.quantityReserved = quantityReserved; didChange = true; }
    if (reorderLevel !== undefined && reorderLevel !== item.reorderLevel) { item.reorderLevel = reorderLevel; didChange = true; }
    if (costPrice !== undefined && costPrice !== item.costPrice) { item.costPrice = costPrice; didChange = true; }
    if (unitOfMeasure !== undefined && unitOfMeasure !== item.unitOfMeasure) { item.unitOfMeasure = unitOfMeasure; didChange = true; }
    if (status !== undefined && status !== item.status) { item.status = status; didChange = true; }
    if (dateReceived !== undefined && dateReceived !== item.dateReceived) { item.dateReceived = dateReceived; didChange = true; }
    if (expiryDate !== undefined && expiryDate !== item.expiryDate) { item.expiryDate = expiryDate; didChange = true; }
    if (averageCost !== undefined && averageCost !== item.averageCost) { item.averageCost = averageCost; didChange = true; }

    // --- Recompute available ---
    const newAvailable =
      typeof item.quantityOnHand === "number" && typeof item.quantityReserved === "number"
        ? item.quantityOnHand - item.quantityReserved
        : item.quantityAvailable || 0;

    if (newAvailable !== item.quantityAvailable) {
      item.quantityAvailable = newAvailable;
      didChange = true;
    }

    // --- Save only if something changed ---
    if (didChange) {
      item.lastModifiedBy = lastModifiedBy;
    }

    const updateItem = await InventoryItem.save(item);

    const plain = JSON.parse(JSON.stringify(updateItem));
    delete plain.product;

    return res.json({
      ...plain,
      productId: item.product?.productId,
      productName: item.product?.productName,
    });
  } catch (err) {
    return res.status(500).json({ error: "Error updating inventory item" });
  }
}


  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const item = await InventoryItem.findOneBy({ id });

      if (!item) {
        return res.status(404).json({ error: "Inventory item not found" });
      }

      await InventoryItem.remove(item);
      return res.json({ message: "Inventory item deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: "Error deleting inventory item" });
    }
  }

  
  async getSummary(req: Request, res: Response) {
    try {
      // Fetch all items
      const items = await InventoryItem.find();

      const totalItems = items.length;

      const lowStockItems = items.filter(
        (i) =>
          typeof i.quantityOnHand === "number" &&
          typeof i.reorderLevel === "number" &&
          i.reorderLevel !== null &&
          i.quantityOnHand <= i.reorderLevel
      ).length;

      const activeItems = items.filter(
        (i) => i.status === InventoryStatus.ACTIVE
      ).length;

      const totalValue = items.reduce((sum, i) => {
        if (i.costPrice !== null && typeof i.quantityOnHand === "number") {
          return sum + Number(i.costPrice) * i.quantityOnHand;
        }
        return sum;
      }, 0);

      return res.json({
        totalItems,
        lowStockItems,
        activeItems,
        totalValue,
      });
    } catch (err: any) {
      console.error("Error generating inventory summary:", err);
      return res.status(500).json({
        error: "Error generating inventory summary",
        message: err?.message || "Unknown error",
      });
    }
  }
  async getLowStock(req: Request, res: Response) {
  try {
    // Fetch all inventory items with product relation
    const items = await InventoryItem.find({ relations: ["product"] });

    // Filter items that are low stock
    const lowStockItems = items
      .filter(
        (i) =>
          i.reorderLevel !== null &&
          typeof i.quantityOnHand === "number" &&
          i.quantityOnHand <= i.reorderLevel
      )
      .map((i) => ({
        productName: i.product?.productName || "Unknown",
        available: i.quantityOnHand,
        reorderLevel: i.reorderLevel,
      }));

    return res.json({
      lowStockItems,
    });
  } catch (err: any) {
    console.error("Error fetching low stock items:", err);
    return res.status(500).json({
      error: "Error fetching low stock items",
      message: err?.message || "Unknown error",
    });
  }
}
}

const inventoryController = new InventoryController();
export default inventoryController;
