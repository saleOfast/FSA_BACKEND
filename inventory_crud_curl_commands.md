# Inventory CRUD - cURL Commands

## Base Configuration
- **Base URL**: `http://localhost:8449` (or `http://localhost:5000` if using default port)
- **API Path**: `/api/v1/inventory`
- **Authentication**: All endpoints require `Authorization` header with JWT token

---

## 1. CREATE INVENTORY
**Endpoint**: `POST /api/v1/inventory/create`

```bash
curl -X POST http://localhost:8449/api/v1/inventory/create \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_JWT_TOKEN_HERE" \
  -d '{
    "inventory": [
      {
        "productId": 1,
        "warehouseId": 1,
        "stockQuantity": 100,
        "reservedQuantity": 10,
        "batchNumber": "BATCH001",
        "expiryDate": "2025-12-31",
        "reorderLevel": 20,
        "stockInDate": "2024-01-15",
        "taxId": 1,
        "schemeId": 1,
        "discountId": 1
      },
      {
        "skuId": 2,
        "warehouseId": 1,
        "stockQuantity": 50,
        "batchNumber": "BATCH002",
        "reorderLevel": 15
      }
    ]
  }'
```

**Note**: Either `productId` or `skuId` is required for each inventory item.

---

## 2. GET INVENTORY LIST
**Endpoint**: `GET /api/v1/inventory/getList/:warehouseId`

```bash
curl -X GET http://localhost:8449/api/v1/inventory/getList/1 \
  -H "Authorization: YOUR_JWT_TOKEN_HERE"
```

**Replace `1` with your actual warehouse ID**

---

## 3. UPDATE INVENTORY
**Endpoint**: `PUT /api/v1/inventory/update`

```bash
curl -X PUT http://localhost:8449/api/v1/inventory/update \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_JWT_TOKEN_HERE" \
  -d '{
    "inventory": [
      {
        "inventoryId": 1,
        "stockQuantity": 150,
        "reservedQuantity": 20,
        "batchNumber": "BATCH001-UPDATED",
        "reorderLevel": 25
      },
      {
        "inventoryId": 2,
        "stockQuantity": 75,
        "reorderLevel": 20
      }
    ]
  }'
```

**Note**: `inventoryId` is required for update operations.

---

## 4. DELETE INVENTORY
**Endpoint**: `DELETE /api/v1/inventory/delete`

```bash
curl -X DELETE http://localhost:8449/api/v1/inventory/delete \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_JWT_TOKEN_HERE" \
  -d '{
    "inventoryIds": [1, 2, 3]
  }'
```

**Note**: Provide an array of inventory IDs to delete.

---

## Alternative Route Path
The inventory routes are also available at `/api/v1/inventoryItem`:
- `POST /api/v1/inventoryItem/create`
- `GET /api/v1/inventoryItem/getList/:warehouseId`
- `PUT /api/v1/inventoryItem/update`
- `DELETE /api/v1/inventoryItem/delete`

---

## Request Body Fields Reference

### InventoryItemDto Fields:
- `inventoryId` (number, optional) - Required for updates
- `productId` (number, optional) - Either productId or skuId required
- `skuId` (number, optional) - Either productId or skuId required
- `warehouseId` (number, optional)
- `stockQuantity` (number, required) - Required field
- `reservedQuantity` (number, optional)
- `batchNumber` (string, optional)
- `expiryDate` (string, optional) - ISO date format: "YYYY-MM-DD"
- `reorderLevel` (number, optional)
- `stockInDate` (string, optional) - ISO date format: "YYYY-MM-DD"
- `stockOutDate` (string, optional) - ISO date format: "YYYY-MM-DD"
- `taxId` (number, optional)
- `schemeId` (number, optional)
- `discountId` (number, optional)

---

## Example: Complete CRUD Flow

### 1. Create Inventory
```bash
curl -X POST http://localhost:8449/api/v1/inventory/create \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_JWT_TOKEN_HERE" \
  -d '{
    "inventory": [
      {
        "productId": 1,
        "warehouseId": 1,
        "stockQuantity": 100,
        "batchNumber": "BATCH001"
      }
    ]
  }'
```

### 2. Get Inventory List
```bash
curl -X GET http://localhost:8449/api/v1/inventory/getList/1 \
  -H "Authorization: YOUR_JWT_TOKEN_HERE"
```

### 3. Update Inventory (use inventoryId from step 2 response)
```bash
curl -X PUT http://localhost:8449/api/v1/inventory/update \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_JWT_TOKEN_HERE" \
  -d '{
    "inventory": [
      {
        "inventoryId": 1,
        "stockQuantity": 150
      }
    ]
  }'
```

### 4. Delete Inventory
```bash
curl -X DELETE http://localhost:8449/api/v1/inventory/delete \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_JWT_TOKEN_HERE" \
  -d '{
    "inventoryIds": [1]
  }'
```

---

## Windows PowerShell Alternative

If you're using PowerShell on Windows, use these commands:

### CREATE
```powershell
Invoke-RestMethod -Uri "http://localhost:8449/api/v1/inventory/create" -Method POST -Headers @{"Content-Type"="application/json"; "Authorization"="YOUR_JWT_TOKEN_HERE"} -Body '{"inventory":[{"productId":1,"warehouseId":1,"stockQuantity":100,"batchNumber":"BATCH001"}]}'
```

### GET
```powershell
Invoke-RestMethod -Uri "http://localhost:8449/api/v1/inventory/getList/1" -Method GET -Headers @{"Authorization"="YOUR_JWT_TOKEN_HERE"}
```

### UPDATE
```powershell
Invoke-RestMethod -Uri "http://localhost:8449/api/v1/inventory/update" -Method PUT -Headers @{"Content-Type"="application/json"; "Authorization"="YOUR_JWT_TOKEN_HERE"} -Body '{"inventory":[{"inventoryId":1,"stockQuantity":150}]}'
```

### DELETE
```powershell
Invoke-RestMethod -Uri "http://localhost:8449/api/v1/inventory/delete" -Method DELETE -Headers @{"Content-Type"="application/json"; "Authorization"="YOUR_JWT_TOKEN_HERE"} -Body '{"inventoryIds":[1]}'
```



