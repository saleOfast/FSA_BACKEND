export const calculateSalesOrderAmounts = ({
  saleQty,
  basePrice,
  discountPercentage,
  taxPercent
}: {
  saleQty: number;
  basePrice: number;
  discountPercentage: number;
  taxPercent: number;
}) => {

  // Calculate total base value (quantity * base price)
  const totalBaseValue = saleQty * basePrice;

  // Calculate discount value (percentage of total base value)
  const discountValue = (totalBaseValue * discountPercentage) / 100;

  // Calculate net amount (after discount)
  const netAmount = totalBaseValue - discountValue;

  // Calculate tax amount (on net amount)
  const taxAmount = (netAmount * taxPercent) / 100;

  // Calculate gross amount (net + tax)
  const grossAmount = netAmount + taxAmount;

  return {
    totalBaseValue,
    discountValue,
    netAmount,
    taxAmount,
    grossAmount
  };
};


