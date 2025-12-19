# Country API - cURL Commands for Postman Testing

## Base Configuration
- **Base URL**: `http://localhost:8449` (or your server URL)
- **API Path**: `/api/v1/country`
- **Authentication**: All endpoints require Bearer token in Authorization header
- **Content-Type**: `application/json`

**Note**: Replace `YOUR_AUTH_TOKEN` with your actual JWT token from login.

---

## 1. Create Country

**Endpoint**: `POST /api/v1/country/create`

**cURL Command**:
```bash
curl --location 'http://localhost:8449/api/v1/country/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN' \
--data '{
    "countryName": "United States"
}'
```

**Example with different country**:
```bash
curl --location 'http://localhost:8449/api/v1/country/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN' \
--data '{
    "countryName": "India"
}'
```

---

## 2. Update Country

**Endpoint**: `POST /api/v1/country/update`

**cURL Command**:
```bash
curl --location 'http://localhost:8449/api/v1/country/update' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN' \
--data '{
    "countryId": 1,
    "countryName": "United States of America"
}'
```

**Note**: Replace `countryId` with the actual ID from the create response.

---

## 3. Get Country by ID

**Endpoint**: `GET /api/v1/country/getById/:countryId`

**cURL Command**:
```bash
curl --location 'http://localhost:8449/api/v1/country/getById/1' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

**Note**: Replace `1` with the actual country ID.

---

## 4. List All Countries (with Pagination)

**Endpoint**: `GET /api/v1/country/list`

**cURL Command** (Basic):
```bash
curl --location 'http://localhost:8449/api/v1/country/list?pageNumber=1&pageSize=10' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

**cURL Command** (With Search):
```bash
curl --location 'http://localhost:8449/api/v1/country/list?pageNumber=1&pageSize=10&search=United' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

**Query Parameters**:
- `pageNumber` (required): Page number (e.g., 1, 2, 3...)
- `pageSize` (required): Number of records per page (e.g., 10, 20, 50...)
- `search` (optional): Search term to filter countries by name or ID

---

## 5. Delete Country (Soft Delete)

**Endpoint**: `DELETE /api/v1/country/delete/:countryId`

**cURL Command**:
```bash
curl --location --request DELETE 'http://localhost:8449/api/v1/country/delete/1' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

**Note**: Replace `1` with the actual country ID. This performs a soft delete (sets deletedAt timestamp).

---

## Complete Test Sequence

Here's a complete sequence to test all CRUD operations:

### Step 1: Create a Country
```bash
curl --location 'http://localhost:8449/api/v1/country/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN' \
--data '{
    "countryName": "Test Country"
}'
```

**Save the `countryId` from the response** (e.g., `countryId: 5`)

### Step 2: Get the Created Country
```bash
curl --location 'http://localhost:8449/api/v1/country/getById/5' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

### Step 3: List All Countries
```bash
curl --location 'http://localhost:8449/api/v1/country/list?pageNumber=1&pageSize=10' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

### Step 4: Update the Country
```bash
curl --location 'http://localhost:8449/api/v1/country/update' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN' \
--data '{
    "countryId": 5,
    "countryName": "Updated Test Country"
}'
```

### Step 5: Verify Update
```bash
curl --location 'http://localhost:8449/api/v1/country/getById/5' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

### Step 6: Delete the Country
```bash
curl --location --request DELETE 'http://localhost:8449/api/v1/country/delete/5' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

### Step 7: Verify Deletion (should return 404 or not found)
```bash
curl --location 'http://localhost:8449/api/v1/country/getById/5' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```

---

## Expected Responses

### Success Response Format:
```json
{
    "status": 200,
    "message": "Country created successfully.",
    "data": {
        "countryId": 1,
        "countryName": "United States",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "deletedAt": null
    }
}
```

### Error Response Format:
```json
{
    "status": 400,
    "message": "Country with this name already exists"
}
```

### List Response Format:
```json
{
    "status": 200,
    "message": "Success.",
    "data": {
        "countries": [
            {
                "countryId": 1,
                "countryName": "United States",
                "createdAt": "2024-01-15T10:30:00.000Z",
                "updatedAt": "2024-01-15T10:30:00.000Z",
                "deletedAt": null
            }
        ],
        "pagination": {
            "pageNumber": 1,
            "pageSize": 10,
            "totalRecords": 1
        }
    }
}
```

---

## Troubleshooting

1. **401 Unauthorized**: Make sure you have a valid JWT token in the Authorization header
2. **404 Not Found**: Check if the server is running and the URL is correct
3. **400 Bad Request**: Verify the request body matches the required format
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

