# Location Hierarchy API - cURL Commands

## Base Configuration
- **Base URL**: `http://localhost:5000/api/v1` (or your server URL)
- **Port**: Default is 5000 (check your .env file for PORT)
- **Authentication**: All endpoints require `Authorization` header with AUTH_TOKEN

**Note**: Replace `YOUR_AUTH_TOKEN` with your actual authentication token in all requests.

---

## 1. GET STATES BY COUNTRY ID

### Endpoint
**GET** `/api/v1/state/getByCountryId/:countryId`

Returns all states for a given country ID, sorted alphabetically by state name.

### cURL Command
```bash
curl -X GET http://localhost:5000/api/v1/state/getByCountryId/1 \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Example with Different Country ID
```bash
curl -X GET http://localhost:5000/api/v1/state/getByCountryId/2 \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Expected Success Response
```json
{
  "status": 200,
  "message": "Success.",
  "data": [
    {
      "stateId": 1,
      "stateName": "Maharashtra",
      "countryId": 1,
      "country": {
        "countryId": 1,
        "countryName": "India",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "stateId": 2,
      "stateName": "Karnataka",
      "countryId": 1,
      "country": {
        "countryId": 1,
        "countryName": "India",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Error Response (Country Not Found)
```json
{
  "status": 404,
  "message": "Country not found"
}
```

---

## 2. GET DISTRICTS BY STATE ID

### Endpoint
**GET** `/api/v1/district/getByStateId/:stateId`

Returns all districts for a given state ID, sorted alphabetically by district name.

### cURL Command
```bash
curl -X GET http://localhost:5000/api/v1/district/getByStateId/1 \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Example with Different State ID
```bash
curl -X GET http://localhost:5000/api/v1/district/getByStateId/2 \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Expected Success Response
```json
{
  "status": 200,
  "message": "Success.",
  "data": [
    {
      "districtId": 1,
      "districtName": "Mumbai",
      "stateId": 1,
      "countryId": 1,
      "state": {
        "stateId": 1,
        "stateName": "Maharashtra",
        "countryId": 1,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "country": {
        "countryId": 1,
        "countryName": "India",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "districtId": 2,
      "districtName": "Pune",
      "stateId": 1,
      "countryId": 1,
      "state": {
        "stateId": 1,
        "stateName": "Maharashtra",
        "countryId": 1,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "country": {
        "countryId": 1,
        "countryName": "India",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Error Response (State Not Found)
```json
{
  "status": 404,
  "message": "State not found"
}
```

---

## Testing Workflow (Cascading Dropdown Example)

### Step 1: Get States by Country ID
```bash
# Get all states for country ID 1 (e.g., India)
curl -X GET http://localhost:5000/api/v1/state/getByCountryId/1 \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Step 2: Get Districts by State ID
```bash
# Get all districts for state ID 1 (e.g., Maharashtra)
# Use a stateId from the response of Step 1
curl -X GET http://localhost:5000/api/v1/district/getByStateId/1 \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

---

## Windows PowerShell Commands

If you're using Windows PowerShell, use these commands:

### Get States by Country ID
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/state/getByCountryId/1" `
  -Method Get `
  -Headers @{ "Authorization" = "Bearer YOUR_AUTH_TOKEN" }
```

### Get Districts by State ID
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/district/getByStateId/1" `
  -Method Get `
  -Headers @{ "Authorization" = "Bearer YOUR_AUTH_TOKEN" }
```

---

## Quick Test Script (Bash)

```bash
#!/bin/bash

# Configuration
BASE_URL="http://localhost:5000/api/v1"
AUTH_TOKEN="YOUR_AUTH_TOKEN"
COUNTRY_ID=1
STATE_ID=1

echo "=== Testing Get States by Country ID ==="
curl -X GET "${BASE_URL}/state/getByCountryId/${COUNTRY_ID}" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -H "Content-Type: application/json"

echo -e "\n\n=== Testing Get Districts by State ID ==="
curl -X GET "${BASE_URL}/district/getByStateId/${STATE_ID}" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -H "Content-Type: application/json"
```

---

## Notes

1. **Replace IDs**: Make sure to replace `1` with actual IDs from your database
2. **Authentication**: All endpoints require a valid authentication token
3. **Port**: Adjust the port (default 5000) if your server runs on a different port
4. **Empty Results**: If a country/state has no states/districts, you'll get an empty array `[]`
5. **Sorting**: Results are sorted alphabetically by name (stateName/districtName)

---

## Common Error Responses

- **401 Unauthorized**: Invalid or missing authentication token
- **404 Not Found**: Country or State not found
- **500 Internal Server Error**: Server-side errors

