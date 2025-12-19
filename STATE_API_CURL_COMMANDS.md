# State API - cURL Commands for Postman Testing

## Base Configuration
- **Base URL**: `http://localhost:8449` (or your server URL)
- **API Path**: `/api/v1/state`
- **Authentication**: All endpoints require Bearer token in Authorization header
- **Content-Type**: `application/json`

**Note**: 
- Replace `YOUR_AUTH_TOKEN` with your actual JWT token from login
- Replace `COUNTRY_ID` with an actual country ID from your database (create a country first if needed)

---

## Prerequisites

Before testing State CRUD, make sure you have at least one Country created. If not, create one first:

```bash
curl --location 'http://localhost:8449/api/v1/country/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN' \
--data '{
    "countryName": "United States"
}'
```

**Save the `countryId` from the response** (e.g., `countryId: 1`)

---

## 1. Create State

**Endpoint**: `POST /api/v1/state/create`

**cURL Command**:
```bash
curl --location 'http://localhost:8449/api/v1/state/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN' \
--data '{
    "stateName": "California",
    "countryId": 1
}'
```

**More Examples**:
```bash
# Create Texas state
curl --location 'http://localhost:8449/api/v1/state/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN' \
--data '{
    "stateName": "Texas",
    "countryId": 1
}'

# Create Maharashtra state (for India)
curl --location 'http://localhost:8449/api/v1/state/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN' \
--data '{
    "stateName": "Maharashtra",
    "countryId": 2
}'
```

---

## 2. Update State

**Endpoint**: `POST /api/v1/state/update`

**cURL Command**:
```bash
curl --location 'http://localhost:8449/api/v1/state/update' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN' \
--data '{
    "stateId": 1,
    "stateName": "California Updated",
    "countryId": 1
}'
```

**Note**: Replace `stateId` and `countryId` with actual IDs from your database.

---

## 3. Get State by ID

**Endpoint**: `GET /api/v1/state/getById/:stateId`

**cURL Command**:
```bash
curl --location 'http://localhost:8449/api/v1/state/getById/1' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

**Note**: Replace `1` with the actual state ID. The response will include the country details.

---

## 4. List All States (with Pagination)

**Endpoint**: `GET /api/v1/state/list`

**cURL Command** (Basic - List all states):
```bash
curl --location 'http://localhost:8449/api/v1/state/list?pageNumber=1&pageSize=10' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

**cURL Command** (Filter by Country):
```bash
curl --location 'http://localhost:8449/api/v1/state/list?pageNumber=1&pageSize=10&countryId=1' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

**cURL Command** (With Search):
```bash
curl --location 'http://localhost:8449/api/v1/state/list?pageNumber=1&pageSize=10&search=California' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

**cURL Command** (Search + Country Filter):
```bash
curl --location 'http://localhost:8449/api/v1/state/list?pageNumber=1&pageSize=10&countryId=1&search=Cal' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

**Query Parameters**:
- `pageNumber` (required): Page number (e.g., 1, 2, 3...)
- `pageSize` (required): Number of records per page (e.g., 10, 20, 50...)
- `search` (optional): Search term to filter states by name, country name, or state ID
- `countryId` (optional): Filter states by specific country ID

---

## 5. Delete State

**Endpoint**: `DELETE /api/v1/state/delete/:stateId`

**cURL Command**:
```bash
curl --location --request DELETE 'http://localhost:8449/api/v1/state/delete/1' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

**Note**: Replace `1` with the actual state ID. This performs a hard delete (permanently removes the record).

---

## Complete Test Sequence

Here's a complete sequence to test all CRUD operations:

### Step 1: Create a Country (if not exists)
```bash
curl --location 'http://localhost:8449/api/v1/country/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN' \
--data '{
    "countryName": "Test Country"
}'
```

**Save the `countryId` from response** (e.g., `countryId: 5`)

### Step 2: Create a State
```bash
curl --location 'http://localhost:8449/api/v1/state/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN' \
--data '{
    "stateName": "Test State",
    "countryId": 5
}'
```

**Save the `stateId` from response** (e.g., `stateId: 3`)

### Step 3: Get the Created State
```bash
curl --location 'http://localhost:8449/api/v1/state/getById/3' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

### Step 4: List All States
```bash
curl --location 'http://localhost:8449/api/v1/state/list?pageNumber=1&pageSize=10' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

### Step 5: List States by Country
```bash
curl --location 'http://localhost:8449/api/v1/state/list?pageNumber=1&pageSize=10&countryId=5' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

### Step 6: Update the State
```bash
curl --location 'http://localhost:8449/api/v1/state/update' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN' \
--data '{
    "stateId": 3,
    "stateName": "Updated Test State",
    "countryId": 5
}'
```

### Step 7: Verify Update
```bash
curl --location 'http://localhost:8449/api/v1/state/getById/3' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

### Step 8: Delete the State
```bash
curl --location --request DELETE 'http://localhost:8449/api/v1/state/delete/3' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

### Step 9: Verify Deletion (should return 404 or not found)
```bash
curl --location 'http://localhost:8449/api/v1/state/getById/3' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

---

## Expected Responses

### Success Response - Create/Update:
```json
{
    "status": 200,
    "message": "State created successfully.",
    "data": {
        "stateId": 1,
        "stateName": "California",
        "countryId": 1,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "country": {
            "countryId": 1,
            "countryName": "United States",
            "createdAt": "2024-01-15T09:00:00.000Z",
            "updatedAt": "2024-01-15T09:00:00.000Z",
            "deletedAt": null
        }
    }
}
```

### Success Response - Get by ID:
```json
{
    "status": 200,
    "message": "Success.",
    "data": {
        "stateId": 1,
        "stateName": "California",
        "countryId": 1,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "country": {
            "countryId": 1,
            "countryName": "United States",
            "createdAt": "2024-01-15T09:00:00.000Z",
            "updatedAt": "2024-01-15T09:00:00.000Z",
            "deletedAt": null
        }
    }
}
```

### Success Response - List:
```json
{
    "status": 200,
    "message": "Success.",
    "data": {
        "states": [
            {
                "stateId": 1,
                "stateName": "California",
                "countryId": 1,
                "createdAt": "2024-01-15T10:30:00.000Z",
                "updatedAt": "2024-01-15T10:30:00.000Z",
                "country": {
                    "countryId": 1,
                    "countryName": "United States",
                    "createdAt": "2024-01-15T09:00:00.000Z",
                    "updatedAt": "2024-01-15T09:00:00.000Z",
                    "deletedAt": null
                }
            },
            {
                "stateId": 2,
                "stateName": "Texas",
                "countryId": 1,
                "createdAt": "2024-01-15T11:00:00.000Z",
                "updatedAt": "2024-01-15T11:00:00.000Z",
                "country": {
                    "countryId": 1,
                    "countryName": "United States",
                    "createdAt": "2024-01-15T09:00:00.000Z",
                    "updatedAt": "2024-01-15T09:00:00.000Z",
                    "deletedAt": null
                }
            }
        ],
        "pagination": {
            "pageNumber": 1,
            "pageSize": 10,
            "totalRecords": 2
        }
    }
}
```

### Error Response - Country Not Found:
```json
{
    "status": 404,
    "message": "Country not found"
}
```

### Error Response - Duplicate State Name:
```json
{
    "status": 400,
    "message": "State with this name already exists in the selected country"
}
```

### Error Response - State Not Found:
```json
{
    "status": 404,
    "message": "State not found"
}
```

---

## Troubleshooting

1. **401 Unauthorized**: Make sure you have a valid JWT token in the Authorization header
2. **404 Not Found**: 
   - Check if the server is running and the URL is correct
   - Verify the countryId exists before creating a state
   - Verify the stateId exists before updating/deleting
3. **400 Bad Request**: 
   - Verify the request body matches the required format
   - Check if state name already exists in the same country
   - Ensure countryId is a valid number
4. **500 Internal Server Error**: Check server logs for detailed error information

---

## Getting Authentication Token

To get your authentication token, you need to login first:

```bash
curl --location 'http://localhost:8449/api/v1/user/login' \
--header 'Content-Type: application/json' \
--data '{
    "email": "your-email@example.com",
    "password": "your-password"
}'
```

Copy the `token` from the response and use it as `YOUR_AUTH_TOKEN` in all requests above.

---

## Quick Reference

| Operation | Method | Endpoint | Required Fields |
|-----------|--------|----------|----------------|
| Create | POST | `/api/v1/state/create` | `stateName`, `countryId` |
| Update | POST | `/api/v1/state/update` | `stateId`, `stateName`, `countryId` |
| Get by ID | GET | `/api/v1/state/getById/:stateId` | `stateId` (in URL) |
| List | GET | `/api/v1/state/list` | `pageNumber`, `pageSize` (query params) |
| Delete | DELETE | `/api/v1/state/delete/:stateId` | `stateId` (in URL) |

