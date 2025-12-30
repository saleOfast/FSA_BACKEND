#!/bin/bash

# CREATE DISCOUNT WITH ALL FIELDS - PERCENTAGE TYPE
# Replace YOUR_AUTH_TOKEN with your actual token
# Replace the ID values (customerTypeId, customerId, skuId, etc.) with actual IDs from your database

curl -X POST http://localhost:5000/api/v1/discount/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "discountName": "Complete Trade Discount - All Fields Test",
    "discountType": "SKU Level",
    "discountCategory": "Trade discount (Distributor / Retailer margin)",
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
    "pktType": "Box",
    "minQty": 10.5,
    "maxQty": 100.75,
    "minimumOrderValue": 5000.50,
    "discountValueType": "Percentage",
    "discountPercentage": 15.25
  }'

