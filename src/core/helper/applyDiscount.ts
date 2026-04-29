import { Discount, DiscountValueType } from "../DB/Entities/discount.entity";

export function applyDiscountEngine({
  discounts,
  basePrice,
  qty,
  scope,
}: {
  discounts: Discount[];
  basePrice: number;
  qty: number;
  scope: "LINE" | "ORDER";
}) {
  const totalBase = basePrice * qty;

  if (!discounts?.length) {
    return {
      discountPercentage: 0,
      discountValue: 0,
      finalAmount: totalBase,
      appliedDiscounts: [] as Discount[],
    };
  }

  // ✅ Step 1: Filter by scope
  const scoped = discounts.filter((d) => d.scopeType === scope);

  if (!scoped.length) {
    return {
      discountPercentage: 0,
      discountValue: 0,
      finalAmount: totalBase,
      appliedDiscounts: [] as Discount[],
    };
  }

  // ✅ Step 2: Sort by priority (LOWER = HIGHER PRIORITY)
  const sorted = scoped.sort(
    (a, b) => (a.priority || 0) - (b.priority || 0)
  );

  let runningValue = totalBase;
  let totalDiscount = 0;

  const applied: Discount[] = [];

  // ✅ Step 3: Apply discounts sequentially
  for (const d of sorted) {
    // 🔴 Stop if any previous discount is stickable
    if (applied.some((x) => x.isStickable)) break;

    // 🚫 Skip if current is not stackable and something already applied
    if (applied.length > 0 && !d.isStackable) continue;

    let discountAmount = 0;

    // 💰 Calculate discount
    if (d.discountValueType === DiscountValueType.PERCENTAGE) {
      discountAmount =
        (runningValue * Number(d.discountPercentage || 0)) / 100;
    } else {
      discountAmount = Number(d.discountValue || 0);
    }

    // 🧱 Apply cap
    if (scope === "LINE" && d.lineCap && discountAmount > Number(d.lineCap)) {
      discountAmount = Number(d.lineCap);
    }

    if (scope === "ORDER" && d.orderCap && discountAmount > Number(d.orderCap)) {
      discountAmount = Number(d.orderCap);
    }

    // 🚫 Prevent over-discount
    if (discountAmount > runningValue) {
      discountAmount = runningValue;
    }

    // ➖ Apply discount
    runningValue -= discountAmount;
    totalDiscount += discountAmount;

    applied.push(d);

    // 🔴 Stop if current is stickable
    if (d.isStickable) break;
  }

  return {
    discountValue: Number(totalDiscount.toFixed(2)),
    discountPercentage:
      totalBase > 0
        ? Number(((totalDiscount / totalBase) * 100).toFixed(2))
        : 0,
    finalAmount: Number(runningValue.toFixed(2)),
    appliedDiscounts: applied,
  };
}