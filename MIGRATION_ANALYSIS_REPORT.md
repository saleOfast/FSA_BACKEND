# Database Migration Analysis Report

## Summary
This report analyzes your codebase to identify which table entities have migration files and which are missing.

## Migration File Status

### ✅ Existing Migration File
- **Location**: `src/core/DB/migrations/1767714228665-InitialSchema.ts`
- **Type**: Dynamic migration that creates tables from all entities registered in `AppDataSource` (from `data-source.ts`)
- **Status**: This migration will create tables for all entities registered in `data-source.ts`

## ⚠️ Missing Entities in Migration Configuration

The following entities exist in your codebase but are **NOT included** in `data-source.ts`, which means they **WON'T be included in migrations**:

### 1. **PriceBook** ❌
   - **Entity File**: `src/core/DB/Entities/priceBook.entity.ts`
   - **Table Name**: `price_book`
   - **Status**: 
     - ✅ Imported in `postgresdb.ts` (line 81)
     - ✅ Included in `postgresdb.ts` entities array (line 142)
     - ❌ **MISSING** from `data-source.ts` imports
     - ❌ **MISSING** from `data-source.ts` entities array

### 2. **PriceBookItem** ❌
   - **Entity File**: `src/core/DB/Entities/price_book_item.entity.ts`
   - **Table Name**: `price_book_items`
   - **Status**: 
     - ✅ Imported in `postgresdb.ts` (line 82)
     - ✅ Included in `postgresdb.ts` entities array (line 142)
     - ❌ **MISSING** from `data-source.ts` imports
     - ❌ **MISSING** from `data-source.ts` entities array

### 3. **ItemShippingAddress** ❌
   - **Entity File**: `src/core/DB/Entities/shippingAddress.entity.ts`
   - **Table Name**: `item_shipping_address`
   - **Status**: 
     - ✅ Imported in `postgresdb.ts` (line 83)
     - ✅ Included in `postgresdb.ts` entities array (line 142)
     - ❌ **MISSING** from `data-source.ts` imports
     - ❌ **MISSING** from `data-source.ts` entities array

### 4. **Collection** ❌
   - **Entity File**: `src/core/DB/Entities/collection.entity.ts`
   - **Table Name**: `collection` (default)
   - **Status**: 
     - ❌ **MISSING** from `postgresdb.ts` imports
     - ❌ **MISSING** from `postgresdb.ts` entities array
     - ❌ **MISSING** from `data-source.ts` imports
     - ❌ **MISSING** from `data-source.ts` entities array

## ✅ Entities Properly Configured

All other entities (approximately 60+ entities) are properly configured in both `postgresdb.ts` and `data-source.ts`, including:
- User, Attendance, Beat, Orders, Products, Stores, Visits
- Warehouse, SalesReturn, Customer, CustomerType
- Country, State, District
- Sku, Posm, Taxes, RCPA
- And many more...

## 🔧 Issues Found

### Issue 1: Duplicate Inventory Import
- **Location**: `postgresdb.ts` line 15
- **Problem**: Imports from `'./Entities/inventory'` but should be `'./Entities/inventory.entity'`
- **Impact**: May cause import errors

### Issue 2: Duplicate Entities in Array
- **Location**: `postgresdb.ts` lines 141-142
- **Problem**: Some entities are listed twice (Inventory, Warehouse, SalesReturn, Customer, CustomerType, Country, State, District, Profile, ObjectPermission, Tab, TabPermission, SystemPermission)
- **Impact**: Redundant but not breaking

## 📋 Recommendations

### Immediate Actions Required:

1. **Add Missing Entities to `data-source.ts`**:
   ```typescript
   // Add these imports at the top
   import { PriceBook } from './Entities/priceBook.entity';
   import { PriceBookItem } from './Entities/price_book_item.entity';
   import { ItemShippingAddress } from './Entities/shippingAddress.entity';
   import { Collection } from './Entities/collection.entity';
   
   // Add to entities array (around line 99)
   PriceBook, PriceBookItem, ItemShippingAddress, Collection
   ```

2. **Fix Inventory Import**:
   ```typescript
   // Change line 15 in postgresdb.ts from:
   import { Inventory } from './Entities/inventory';
   // To:
   import { Inventory } from './Entities/inventory.entity';
   ```

3. **Remove Duplicates**:
   - Clean up duplicate entries in `postgresdb.ts` entities array (lines 141-142)

4. **Regenerate Migration** (if needed):
   - After adding missing entities to `data-source.ts`, you may want to create a new migration or update the existing one

## 📊 Statistics

- **Total Entity Files Found**: 74
- **Entities in postgresdb.ts**: ~67 (with duplicates)
- **Entities in data-source.ts**: ~63
- **Missing from Migrations**: 4 entities
- **Migration Files**: 1 (InitialSchema.ts)

## ⚠️ Important Note

Since your migration file (`1767714228665-InitialSchema.ts`) dynamically reads entities from `AppDataSource.entityMetadatas`, it will only create tables for entities registered in `data-source.ts`. The missing entities listed above will **NOT** have their tables created when running migrations.

---

**Generated**: $(date)
**Project**: FSA_BACKEND
