import { SalesOrderHeaderRepository } from '../DB/Entities/SalesOrderHeader.entity';
import { SalesOrderItemRepository } from '../DB/Entities/salesOrderItem.entity';

/**
 * Updates SalesOrderHeader amount fields by aggregating all items
 * @param salesOrderId - The Sales Order Header ID
 */
export const updateSalesOrderHeaderAmounts = async (salesOrderId: number): Promise<void> => {
  const salesOrderHeaderRepository = SalesOrderHeaderRepository();
  const salesOrderItemRepository = SalesOrderItemRepository();

  // Get all non-deleted items for this sales order
  const items = await salesOrderItemRepository.find({
    where: {
      salesOrder: { soId: salesOrderId },
      isDeleted: false
    }
  });

  // Calculate totals by aggregating all items
  let subtotal = 0;
  let totalDiscount = 0;
  let schemeAmount = 0;
  let taxAmount = 0;
  let grandTotal = 0;

  items.forEach(item => {
    subtotal += Number(item.totalBaseValue) || 0;
    totalDiscount += Number(item.discountValue) || 0;
    // If scheme amount is stored separately, add it here
    // schemeAmount += Number(item.schemeAmount) || 0;
    taxAmount += Number(item.taxAmount) || 0;
    grandTotal += Number(item.grossAmount) || 0;
  });

  // Update the SalesOrderHeader
  const header = await salesOrderHeaderRepository.findOne({
    where: { soId: salesOrderId }
  });

  if (header) {
    header.subtotal = subtotal;
    header.totalDiscount = totalDiscount;
    header.schemeAmount = schemeAmount;
    header.taxAmount = taxAmount;
    header.grandTotal = grandTotal;
    
    await header.save();
  }
};