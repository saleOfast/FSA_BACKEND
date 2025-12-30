# Discount API - cURL Commands for Testing

## Base Configuration
- **Base URL**: `http://localhost:5000/api/v1` (or your server URL)
- **Port**: Default is 5000 (check your .env file for PORT)
- **Authentication**: All endpoints require `Authorization` header with AUTH_TOKEN

**Note**: Replace `YOUR_AUTH_TOKEN` with your actual authentication token in all requests.

---

## 1. CREATE DISCOUNT

### Create Discount with Percentage Type
```bash
curl -X POST http://localhost:5000/api/v1/discount/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "discountName": "Summer Sale 2024",
    "discountType": "Flat",
    "discountCategory": "Seasonal",
    "discountValueType": "Percentage",
    "discountPercentage": 15.5,
    "status": "Active",
    "approvalStatus": "Approved",
    "validFrom": "2024-06-01",
    "validTill": "2024-08-31",
    "minQty": 10,
    "maxQty": 100,
    "minimumOrderValue": 5000,
    "pktType": "Box"
  }'
```

### Create Discount with Amount Type
```bash
curl -X POST http://localhost:5000/api/v1/discount/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "discountName": "Festival Discount",
    "discountType": "Bill Level",
    "discountCategory": "Festival",
    "discountValueType": "Amount",
    "discountValue": 500,
    "status": "Active",
    "approvalStatus": "Approved",
    "validFrom": "2024-10-01",
    "validTill": "2024-10-15",
    "minimumOrderValue": 2000
  }'
```

### Create Discount with Relationships (Customer, SKU, Location)
```bash
curl -X POST http://localhost:5000/api/v1/discount/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "discountName": "Trade Discount for Distributors",
    "discountType": "SKU Level",
    "discountCategory": "Trade discount (Distributor / Retailer margin)",
    "discountValueType": "Percentage",
    "discountPercentage": 20,
    "customerTypeId": 1,
    "customerId": 5,
    "skuId": 10,
    "countryId": 1,
    "stateId": 1,
    "districtId": 1,
    "beatId": 1,
    "status": "Active",
    "approvalStatus": "Approved",
    "validFrom": "2024-01-01",
    "validTill": "2024-12-31",
    "minQty": 50,
    "maxQty": 500,
    "minimumOrderValue": 10000,
    "pktType": "Pieces"
  }'
```

### Create Discount - Minimal Required Fields
```bash
curl -X POST http://localhost:5000/api/v1/discount/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "discountName": "Basic Discount",
    "discountType": "Flat",
    "discountCategory": "Loyalty",
    "discountValueType": "Percentage",
    "discountPercentage": 10
  }'
```

---

## 2. GET DISCOUNT BY ID

```bash
curl -X GET http://localhost:5000/api/v1/discount/getById/1 \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Replace `1` with the actual discountId from the create response**

---

## 3. LIST DISCOUNTS (with filters)

### List All Discounts (Paginated)
```bash
curl -X GET "http://localhost:5000/api/v1/discount/list?pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### List Discounts with Search
```bash
curl -X GET "http://localhost:5000/api/v1/discount/list?search=Summer&pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### List Discounts by Type
```bash
curl -X GET "http://localhost:5000/api/v1/discount/list?discountType=Flat&pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### List Discounts by Category
```bash
curl -X GET "http://localhost:5000/api/v1/discount/list?discountCategory=Seasonal&pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### List Active Discounts
```bash
curl -X GET "http://localhost:5000/api/v1/discount/list?status=Active&pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### List Approved Discounts
```bash
curl -X GET "http://localhost:5000/api/v1/discount/list?approvalStatus=Approved&pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### List Discounts by Customer Type
```bash
curl -X GET "http://localhost:5000/api/v1/discount/list?customerTypeId=1&pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### List Discounts by Customer
```bash
curl -X GET "http://localhost:5000/api/v1/discount/list?customerId=5&pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### List Discounts by SKU
```bash
curl -X GET "http://localhost:5000/api/v1/discount/list?skuId=10&pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### List Discounts by Location (Country, State, District)
```bash
curl -X GET "http://localhost:5000/api/v1/discount/list?countryId=1&stateId=1&districtId=1&pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### List Discounts by Beat
```bash
curl -X GET "http://localhost:5000/api/v1/discount/list?beatId=1&pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### List Discounts - Multiple Filters
```bash
curl -X GET "http://localhost:5000/api/v1/discount/list?discountType=Flat&status=Active&approvalStatus=Approved&pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

---

## 4. UPDATE DISCOUNT

```bash
curl -X POST http://localhost:5000/api/v1/discount/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "discountId": 1,
    "discountName": "Updated Summer Sale 2024",
    "discountType": "Flat",
    "discountCategory": "Seasonal",
    "discountValueType": "Percentage",
    "discountPercentage": 20,
    "status": "Active",
    "approvalStatus": "Approved",
    "validFrom": "2024-06-01",
    "validTill": "2024-09-30",
    "minQty": 15,
    "maxQty": 200,
    "minimumOrderValue": 6000,
    "pktType": "Box",
    "customerTypeId": 1,
    "countryId": 1
  }'
```

**Replace `discountId: 1` with the actual discountId you want to update**

---

## 5. DELETE DISCOUNT

```bash
curl -X DELETE http://localhost:5000/api/v1/discount/delete/1 \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Replace `1` with the actual discountId you want to delete**

---

## ENUM VALUES REFERENCE

### DiscountType
- `"Flat"`
- `"%age"`
- `"Slab"`
- `"Bill Level"`
- `"SKU Level"`
- `"Product Level"`

### DiscountCategory
- `"Trade discount (Distributor / Retailer margin)"`
- `"Cash discount (early payment)"`
- `"Special customer discount"`
- `"Volume-based discount (₹ or %)"`
- `"Territory / channel-specific discount"`
- `"Loyalty"`
- `"Seasonal"`
- `"Festival"`

### DiscountStatus
- `"Active"`
- `"Inactive"`

### ApprovalStatus
- `"Approved"`
- `"Rejected"`

### PktType
- `"Box"`
- `"Pieces"`
- `"Bags"`

### DiscountValueType
- `"Percentage"`
- `"Amount"`

---

## TESTING WORKFLOW

1. **Create a discount** using POST `/discount/create`
2. **Note the `discountId`** from the response
3. **Get the discount** using GET `/discount/getById/{discountId}`
4. **List discounts** using GET `/discount/list`
5. **Update the discount** using POST `/discount/update`
6. **Delete the discount** using DELETE `/discount/delete/{discountId}`

---

## ERROR RESPONSES

Common error responses you might encounter:

- **401 Unauthorized**: Invalid or missing authentication token
- **400 Bad Request**: Validation errors (missing required fields, invalid enum values, etc.)
- **404 Not Found**: Discount or related entity (Customer, SKU, etc.) not found
- **500 Internal Server Error**: Server-side errors

---

## NOTES

- All date fields should be in format: `YYYY-MM-DD`
- All numeric fields (minQty, maxQty, discountValue, discountPercentage) should be numbers
- When `discountValueType` is `"Percentage"`, provide `discountPercentage` (0-100)
- When `discountValueType` is `"Amount"`, provide `discountValue` (>= 0)
- Optional fields can be omitted from the request
- Relationship IDs (customerTypeId, customerId, skuId, etc.) must exist in their respective tables

