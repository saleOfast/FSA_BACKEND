/**
 * Optional explicit mapping between RBAC object names and DB table names.
 * Keep empty to rely on heuristic resolution.
 */
export const OBJECT_TO_TABLE_MAP: Record<string, string> = {
  Customer: "customers",
  Product: "products",
  Inventory: "inventory",
  "Sales Order": "sales_order_header",
};

export function mappedTableForObject(objectName: string): string | null {
  return OBJECT_TO_TABLE_MAP[objectName] ?? null;
}
