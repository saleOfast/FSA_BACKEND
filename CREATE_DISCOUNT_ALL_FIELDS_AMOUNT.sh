#!/bin/bash

# CREATE DISCOUNT WITH ALL FIELDS - AMOUNT TYPE
# Replace YOUR_AUTH_TOKEN with your actual token
# Replace the ID values (customerTypeId, customerId, skuId, etc.) with actual IDs from your database

curl -X POST http://localhost:5000/api/v1/discount/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "discountName": "Complete Flat Discount - All Fields Test",
    "discountType": "Bill Level",
    "discountCategory": "Volume-based discount (₹ or %)",
    "customerTypeId": 1,
    "customerId": 1,
    "skuId": 1,
    "countryId": 1,
    "stateId": 1,
    "districtId": 1,
    "beatId": 1,
    "validFrom": "2024-01-01",
    "validTill": "2024-12-31",
    "status": "Active",
    "approvalStatus": "Approved",
    "pktType": "Pieces",
    "minQty": 20.0,
    "maxQty": 200.0,
    "minimumOrderValue": 10000.0,
    "discountValueType": "Amount",
    "discountValue": 500.75
  }'

