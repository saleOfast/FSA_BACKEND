import { Request, Response } from "express";
import { InventoryItem } from "../../../../core/DB/Entities/inventory";
import { Products } from "../../../../core/DB/Entities/products.entity";
import { RequestHandler } from "../../../../core/helper/RequestHander";

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

      const product = await Products.findOneBy({ productId });
      if (!product) {
        return res.status(400).json({ error: "Invalid productId. Product not found." });
      }

      // Required validations
      const parsedWarehouseId = Number(warehouseId);
      const noWarehouseId =
        warehouseId === undefined || warehouseId === null || !Number.isFinite(parsedWarehouseId);
      // const noSerial = !serialNumber || String(serialNumber).trim() === "";

     
      if (noWarehouseId) {
        return res.status(400).json({ error: "warehouseId is required and must be a number" });
      }
      
      // Uniqueness checks
      const existingWarehouse = await InventoryItem.findOne({
        where: { warehouseId: parsedWarehouseId },
      });
      if (existingWarehouse) {
        return res.status(400).json({ error: "warehouseId already exists" });
      }

      // if (serialNumber) {
      //   const existingItem = await InventoryItem.findOne({ where: { serialNumber } });
      //   if (existingItem) {
      //     return res.status(400).json({ error: "serialNumber already exists" });
      //   }
      // }

      const reserved = typeof quantityReserved === "number" ? quantityReserved : 0;
      const available =
        typeof quantityOnHand === "number" ? quantityOnHand - reserved : 0;

      const newItem = InventoryItem.create({
        product,
        warehouseId: parsedWarehouseId,
        batchNumber,
        serialNumber,
        quantityOnHand,
        quantityReserved: reserved,
        quantityAvailable: available,
        reorderLevel,
        dateReceived,
        expiryDate,
        costPrice,
        averageCost,
        unitOfMeasure,
        status,
        createdBy,
        lastModifiedBy: createdBy,
      } as Partial<InventoryItem>);

      const saveItem = await InventoryItem.save(newItem);

const plainItem = JSON.parse(JSON.stringify(saveItem));
delete plainItem.product;

const response = {
    productId: product.productId,
  productName: product.productName,
  ...plainItem

};


return res.status(201).json(response);

    } catch (err) {
      console.error("Error in creating inventory items", err);
      return res.status(500).json({ error: "Error saving inventory item" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const items = await InventoryItem.find();
      const response = items.map((i) => {
        const plain = JSON.parse(JSON.stringify(i));
        delete plain.product;
        return {
          productId: i.product?.productId,
          productName: i.product?.productName,
           ...plain
        };
      });
      return res.json(response);
    } catch (err) {
      console.error("Error fetching inventory items:", err);
      return res.status(500).json({ error: "Error fetching inventory items" });
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

      // Optional: validate incoming warehouseId/serialNumber on update
      if (req.body.warehouseId !== undefined) {
        const parsed = Number(req.body.warehouseId);
        if (!Number.isFinite(parsed)) {
          return res.status(400).json({ error: "warehouseId must be a number" });
        }
        if (parsed !== item.warehouseId) {
          const exists = await InventoryItem.findOne({ where: { warehouseId: parsed } });
          if (exists) {
            return res.status(400).json({ error: "warehouseId already exists" });
          }
          item.warehouseId = parsed;
          didChange = true;
        }
      }

      if (req.body.serialNumber !== undefined) {
        const sn = String(req.body.serialNumber).trim();
        if (!sn) {
          return res.status(400).json({ error: "serialNumber is required" });
        }
        if (sn !== item.serialNumber) {
          const exists = await InventoryItem.findOne({ where: { serialNumber: sn } });
          if (exists) {
            return res.status(400).json({ error: "serialNumber already exists" });
          }
          item.serialNumber = sn;
          didChange = true;
        }
      }

      // Merge other fields
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

      // Update product relation when productId is provided
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
      // if (supplierId !== undefined && supplierId !== item.supplierId) { item.supplierId = supplierId; didChange = true; }

      // Recompute available
      const newAvailable =
        typeof item.quantityOnHand === "number" && typeof item.quantityReserved === "number"
          ? item.quantityOnHand - item.quantityReserved
          : item.quantityAvailable || 0;
      if (newAvailable !== item.quantityAvailable) {
        item.quantityAvailable = newAvailable;
        didChange = true;
      }

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
}

const inventoryController = new InventoryController();
export default inventoryController;
