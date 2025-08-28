@echo off
echo Testing Enhanced Warehouse Search API
echo =====================================
echo.

echo 1. Testing all warehouses:
curl -X GET "http://localhost:8449/api/v1/warehouse/list"
echo.
echo.

echo 2. Testing search by name:
curl -X GET "http://localhost:8449/api/v1/warehouse/list?name=main"
echo.
echo.

echo 3. Testing search by city:
curl -X GET "http://localhost:8449/api/v1/warehouse/list?city=mumbai"
echo.
echo.

echo 4. Testing active warehouses filter:
curl -X GET "http://localhost:8449/api/v1/warehouse/list?status=ACTIVE"
echo.
echo.

echo 5. Testing inactive warehouses filter:
curl -X GET "http://localhost:8449/api/v1/warehouse/list?status=INACTIVE"
echo.
echo.

echo 6. Testing search by ID:
curl -X GET "http://localhost:8449/api/v1/warehouse/list?id=1"
echo.
echo.

echo 7. Testing combined search and filter:
curl -X GET "http://localhost:8449/api/v1/warehouse/list?city=delhi&status=ACTIVE"
echo.
echo.

echo 8. Testing general search:
curl -X GET "http://localhost:8449/api/v1/warehouse/list?search=warehouse"
echo.
echo.

echo Tests completed!
pause
