# SKU CRUD API - cURL Commands

## Base URL
Replace `YOUR_BASE_URL` with your server URL (e.g., `http://localhost:8449` or your production URL)
Replace `YOUR_AUTH_TOKEN` with your actual authentication token

---

## 1. Create SKU

```bash
curl -X POST "YOUR_BASE_URL/api/v1/sku/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "skuName": "Coca Cola 500ml",
    "productId": 1,
    "packSize": "500ml",
    "vom": "Bottle",
    "mrp": 35.00,
    "basePrice": 30.00,
    "taxId": 1,
    "barcode": "8901030865119",
    "caseSize": "24",
    "shelfLifeDays": "365",
    "netWeight": "0.50",
    "grossWeight": "0.55",
    "dimension": "10x5x20 cm",
    "status": "active",
    "launchDate": "2024-01-01",
    "image": "https://example.com/image.jpg",
    "schemeId": 1,
    "discountId": 1,
    "remarks": "Test SKU"
  }'
```

**Minimal Create (with only required fields):**
```bash
curl -X POST "YOUR_BASE_URL/api/v1/sku/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "skuName": "Test SKU"
  }'
```

---

## 2. Update SKU

```bash
curl -X POST "YOUR_BASE_URL/api/v1/sku/update" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "skuId": 1,
    "skuName": "Coca Cola 500ml Updated",
    "mrp": 40.00,
    "basePrice": 35.00,
    "status": "active"
  }'
```

---

## 3. Get SKU by ID

```bash
curl -X GET "YOUR_BASE_URL/api/v1/sku/getById/1" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

---

## 4. List SKUs

**Get all SKUs:**
```bash
curl -X GET "YOUR_BASE_URL/api/v1/sku/list" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**List with filters and pagination:**
```bash
curl -X GET "YOUR_BASE_URL/api/v1/sku/list?search=coca&status=active&productId=1&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Query Parameters:**
- `search` - Search by SKU name or barcode (optional)
- `status` - Filter by status: `active`, `inactive`, `discontinued` (optional)
- `productId` - Filter by product ID (optional)
- `page` - Page number for pagination (optional, default: 1)
- `limit` - Items per page (optional, default: 100)

---

## 5. Delete SKU (Soft Delete)

```bash
curl -X DELETE "YOUR_BASE_URL/api/v1/sku/delete/1" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

---

## Example Response Format

**Success Response:**
```json
{
  "message": "Success.",
  "status": 200,
  "data": {
    "skuId": 1,
    "skuName": "Coca Cola 500ml",
    "productId": 1,
    "packSize": "500ml",
    "vom": "Bottle",
    "mrp": 35.00,
    "basePrice": 30.00,
    "status": "active",
    ...
  }
}
```

**List Response with Pagination:**
```json
{
  "message": "Success.",
  "status": 200,
  "data": {
    "skus": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

## Status Values
- `active` - SKU is active
- `inactive` - SKU is inactive
- `discontinued` - SKU is discontinued

---

## Notes
- All endpoints require authentication token in the Authorization header
- `productId` is optional (can be null)
- `taxId`, `schemeId`, and `discountId` are optional lookup fields
- Delete operation performs a soft delete (sets `isDeleted` flag to true)

