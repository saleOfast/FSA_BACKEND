// @ts-nocheck
import 'reflect-metadata';
import { DbConnections } from '../core/DB/postgresdb';
import { DataSource, Repository } from 'typeorm';

// Entities
import { Country } from '../core/DB/Entities/country.entity';
import { State } from '../core/DB/Entities/state.entity';
import { District } from '../core/DB/Entities/district.entity';
import { CustomerType } from '../core/DB/Entities/customerType.entity';
import { Customer } from '../core/DB/Entities/customer.entity';
import { Products } from '../core/DB/Entities/products.entity';
import { Sku, SkuStatus } from '../core/DB/Entities/sku.entity';
import { Inventory } from '../core/DB/Entities/inventory';
import { Posm } from '../core/DB/Entities/posm.entity';
import { Discount, DiscountCategory, DiscountType, DiscountValueType, DiscountStatus, ApprovalStatus } from '../core/DB/Entities/discount.entity';
import { Scheme } from '../core/DB/Entities/scheme.entity';
import { Beat } from '../core/DB/Entities/beat.entity';
import { User } from '../core/DB/Entities/User.entity';
import { Warehouse } from '../core/DB/Entities/warehouse.entity';
import { ProductCategory } from '../core/DB/Entities/productCategory.entity';
import { Taxes } from '../core/DB/Entities/tax.entity';

// Enums
import {
  BeatType,
  BeatStatus,
  BeatPriority,
  VisitFrequency,
  VisitDay,
  SchemeType,
  SchemeNature,
  SchemeStatus,
  BenefitType,
  ClaimPeriod,
  PosmTypeEnum,
  PosmCategoryEnum,
  POSMMaterialTypeEnum,
  POSMChannelTargetEnum,
  POSMAllocationTargetEnum,
  UserRole,
} from '../core/types/Constent/common';

type AnyRecord = Record<string, unknown>;

async function upsertIfMissing<T>(repo: Repository<T>, findCriteria: AnyRecord, data: AnyRecord): Promise<T> {
  const existing = await repo.findOne({ where: findCriteria as any });
  if (existing) {
    return existing as T;
  }
  return await repo.save(repo.create(data as any)) as T;
}

// Helper to create IUserReference
function createUserRef(user: User) {
  return {
    id: user.emp_id,
    name: `${user.firstname} ${user.lastname || ''}`.trim() || 'System User'
  };
}

// Check if seed data already exists
async function checkSeedDataExists(ds: DataSource): Promise<boolean> {
  try {
    const customerRepo = ds.getRepository(Customer);
    const customerCount = await customerRepo.count();
    
    // If customers exist, assume seed data exists
    if (customerCount > 0) {
      console.log('📊 Seed data check: Data already exists in database');
      return true;
    }
    
    console.log('📊 Seed data check: No data found, will seed...');
    return false;
  } catch (error) {
    console.error('❌ Error checking seed data:', error);
    // If there's an error checking, assume no data exists and proceed with seeding
    return false;
  }
}

// Seed Countries
async function seedCountries(ds: DataSource): Promise<Country[]> {
  const repo = ds.getRepository(Country);
  const now = new Date();
  const countries = [
    { countryName: 'India', createdAt: now, updatedAt: now },
    { countryName: 'United States', createdAt: now, updatedAt: now },
    { countryName: 'United Kingdom', createdAt: now, updatedAt: now }
  ];
  const saved: Country[] = [];
  for (const item of countries) {
    const country = await upsertIfMissing(repo, { countryName: item.countryName }, item);
    saved.push(country);
  }
  console.log(`✅ Seeded ${saved.length} countries`);
  return saved;
}

// Seed States
async function seedStates(ds: DataSource, countries: Country[]): Promise<State[]> {
  const repo = ds.getRepository(State);
  const now = new Date();
  const states = [
    { stateName: 'Maharashtra', countryId: countries[0].countryId, createdAt: now, updatedAt: now },
    { stateName: 'Karnataka', countryId: countries[0].countryId, createdAt: now, updatedAt: now },
    { stateName: 'Delhi', countryId: countries[0].countryId, createdAt: now, updatedAt: now }
  ];
  const saved: State[] = [];
  for (const item of states) {
    const state = await upsertIfMissing(repo, { stateName: item.stateName, countryId: item.countryId }, item);
    saved.push(state);
  }
  console.log(`✅ Seeded ${saved.length} states`);
  return saved;
}

// Seed Districts
async function seedDistricts(ds: DataSource, states: State[], countries: Country[]): Promise<District[]> {
  const repo = ds.getRepository(District);
  const now = new Date();
  const districts = [
    { districtName: 'Mumbai', stateId: states[0].stateId, countryId: countries[0].countryId, createdAt: now, updatedAt: now },
    { districtName: 'Pune', stateId: states[0].stateId, countryId: countries[0].countryId, createdAt: now, updatedAt: now },
    { districtName: 'Bangalore', stateId: states[1].stateId, countryId: countries[0].countryId, createdAt: now, updatedAt: now }
  ];
  const saved: District[] = [];
  for (const item of districts) {
    const district = await upsertIfMissing(repo, { districtName: item.districtName, stateId: item.stateId }, item);
    saved.push(district);
  }
  console.log(`✅ Seeded ${saved.length} districts`);
  return saved;
}

// Seed Customer Types
async function seedCustomerTypes(ds: DataSource, user: User): Promise<CustomerType[]> {
  const repo = ds.getRepository(CustomerType);
  const userRef = createUserRef(user);
  const now = new Date();
  const customerTypes = [
    {
      name: 'Retailer',
      description: 'Small retail stores',
      canPurchase: true,
      canSell: false,
      inventoryVisibilityScope: 'Self',
      createdBy: userRef,
      createdDate: now
    },
    {
      name: 'Distributor',
      description: 'Regional distributors',
      canPurchase: true,
      canSell: true,
      inventoryVisibilityScope: 'Full',
      createdBy: userRef,
      createdDate: now
    },
    {
      name: 'Wholesaler',
      description: 'Bulk wholesalers',
      canPurchase: true,
      canSell: true,
      inventoryVisibilityScope: 'Full',
      createdBy: userRef,
      createdDate: now
    }
  ];
  const saved: CustomerType[] = [];
  for (const item of customerTypes) {
    const customerType = await upsertIfMissing(repo, { name: item.name }, item);
    saved.push(customerType);
  }
  console.log(`✅ Seeded ${saved.length} customer types`);
  return saved;
}

// Seed Customers
async function seedCustomers(
  ds: DataSource,
  customerTypes: CustomerType[],
  districts: District[],
  states: State[],
  countries: Country[],
  user: User
): Promise<Customer[]> {
  const repo = ds.getRepository(Customer);
  const userRef = createUserRef(user);
  const now = new Date();
  const customers = [
    {
      customerName: 'ABC Retail Store',
      customerType: 'Retailer',
      channelType: 'GT',
      phone: '9876543210',
      email: 'abc@retail.com',
      shippingCountry: countries[0].countryName,
      shippingState: states[0].stateName,
      shippingDistrict: districts[0].districtName,
      shippingStreet: '123 Main Street',
      shippingCity: 'Mumbai',
      shippingPinCode: '400001',
      deliveryTimeSlot: '10:00 AM - 2:00 PM',
      paymentTerms: 'Net 30',
      createdBy: userRef,
      createdDate: now
    },
    {
      customerName: 'XYZ Distributors',
      customerType: 'Distributor',
      channelType: 'MT',
      phone: '9876543211',
      email: 'xyz@dist.com',
      shippingCountry: countries[0].countryName,
      shippingState: states[1].stateName,
      shippingDistrict: districts[2].districtName,
      shippingStreet: '456 Commercial Road',
      shippingCity: 'Bangalore',
      shippingPinCode: '560001',
      deliveryTimeSlot: '9:00 AM - 5:00 PM',
      paymentTerms: 'Net 45',
      creditLimit: 500000,
      createdBy: userRef,
      createdDate: now
    },
    {
      customerName: 'Premium Wholesale Co',
      customerType: 'Wholesaler',
      channelType: 'GT',
      phone: '9876543212',
      email: 'premium@wholesale.com',
      shippingCountry: countries[0].countryName,
      shippingState: states[0].stateName,
      shippingDistrict: districts[1].districtName,
      shippingStreet: '789 Industrial Area',
      shippingCity: 'Pune',
      shippingPinCode: '411001',
      deliveryTimeSlot: '8:00 AM - 6:00 PM',
      paymentTerms: 'Net 60',
      creditLimit: 1000000,
      createdBy: userRef,
      createdDate: now
    }
  ];
  const saved: Customer[] = [];
  for (const item of customers) {
    const customer = await upsertIfMissing(repo, { customerName: item.customerName }, item);
    saved.push(customer);
  }
  console.log(`✅ Seeded ${saved.length} customers`);
  return saved;
}

// Seed Products
async function seedProducts(ds: DataSource, categories: ProductCategory[]): Promise<Products[]> {
  const repo = ds.getRepository(Products);
  const products = [
    {
      productName: 'Paracetamol 500mg',
      productCode: 'PRD001',
      categoryId: categories[0]?.productCategoryId || 1,
      status: 'Active' as const,
      productType: 'FG' as const
    },
    {
      productName: 'Ibuprofen 400mg',
      productCode: 'PRD002',
      categoryId: categories[0]?.productCategoryId || 1,
      status: 'Active' as const,
      productType: 'FG' as const
    },
    {
      productName: 'Vitamin D3 1000IU',
      productCode: 'PRD003',
      categoryId: categories[0]?.productCategoryId || 1,
      status: 'Active' as const,
      productType: 'FG' as const
    }
  ];
  const saved: Products[] = [];
  for (const item of products) {
    const product = await upsertIfMissing(repo, { productCode: item.productCode }, item);
    saved.push(product);
  }
  console.log(`✅ Seeded ${saved.length} products`);
  return saved;
}

// Seed SKUs
async function seedSkus(ds: DataSource, products: Products[], taxes: Taxes[]): Promise<Sku[]> {
  const repo = ds.getRepository(Sku);
  const skus = [
    {
      skuName: 'Paracetamol 500mg - Strip of 10',
      productId: products[0].productId,
      packSize: '10 tablets',
      vom: 'Strip',
      mrp: 25.00,
      basePrice: 20.00,
      taxId: taxes[0]?.taxId,
      status: SkuStatus.ACTIVE
    },
    {
      skuName: 'Ibuprofen 400mg - Bottle of 100',
      productId: products[1].productId,
      packSize: '100 tablets',
      vom: 'Bottle',
      mrp: 150.00,
      basePrice: 120.00,
      taxId: taxes[0]?.taxId,
      status: SkuStatus.ACTIVE
    },
    {
      skuName: 'Vitamin D3 1000IU - Pack of 30',
      productId: products[2].productId,
      packSize: '30 capsules',
      vom: 'Pack',
      mrp: 350.00,
      basePrice: 280.00,
      taxId: taxes[0]?.taxId,
      status: SkuStatus.ACTIVE
    }
  ];
  const saved: Sku[] = [];
  for (const item of skus) {
    const sku = await upsertIfMissing(repo, { skuName: item.skuName, productId: item.productId }, item);
    saved.push(sku);
  }
  console.log(`✅ Seeded ${saved.length} SKUs`);
  return saved;
}

// Seed Inventory
async function seedInventory(
  ds: DataSource,
  skus: Sku[],
  products: Products[],
  warehouses: Warehouse[]
): Promise<Inventory[]> {
  const repo = ds.getRepository(Inventory);
  const now = new Date();
  const inventoryItems = [
    {
      inventoryName: 'Paracetamol Stock - Warehouse 1',
      skuId: skus[0].skuId,
      productId: products[0].productId,
      warehouseId: warehouses[0]?.warehouseId,
      stockQuantity: 500,
      batchNumber: 'BATCH001',
      reorderLevel: 100,
      createdAt: now,
      updatedAt: now
    },
    {
      inventoryName: 'Ibuprofen Stock - Warehouse 1',
      skuId: skus[1].skuId,
      productId: products[1].productId,
      warehouseId: warehouses[0]?.warehouseId,
      stockQuantity: 300,
      batchNumber: 'BATCH002',
      reorderLevel: 50,
      createdAt: now,
      updatedAt: now
    },
    {
      inventoryName: 'Vitamin D3 Stock - Warehouse 1',
      skuId: skus[2].skuId,
      productId: products[2].productId,
      warehouseId: warehouses[0]?.warehouseId,
      stockQuantity: 200,
      batchNumber: 'BATCH003',
      reorderLevel: 30,
      createdAt: now,
      updatedAt: now
    }
  ];
  const saved: Inventory[] = [];
  for (const item of inventoryItems) {
    const inventory = await upsertIfMissing(
      repo,
      { skuId: item.skuId, warehouseId: item.warehouseId },
      item
    );
    saved.push(inventory);
  }
  console.log(`✅ Seeded ${saved.length} inventory items`);
  return saved;
}

// Seed POSM
async function seedPosm(ds: DataSource, customers: Customer[]): Promise<Posm[]> {
  const repo = ds.getRepository(Posm);
  const posmItems = [
    {
      posmName: 'Product Display Stand',
      posmType: PosmTypeEnum.POSTER,
      posmCategory: PosmCategoryEnum.PERMANENT,
      materialType: POSMMaterialTypeEnum.CARDBOARD,
      campaignId: 'CAMP001',
      channelTarget: POSMChannelTargetEnum.GT,
      regionTarget: 'Mumbai',
      allocationTarget: POSMAllocationTargetEnum.RETAILER,
      quantityAllocated: 50,
      allocationDate: new Date().toISOString().split('T')[0],
      sku: 'PRD001',
      customerId: customers[0].customerId,
      unitCost: 500.00
    },
    {
      posmName: 'Shelf Strip',
      posmType: PosmTypeEnum.SHELF_STRIP,
      posmCategory: PosmCategoryEnum.SEMI_PERMANENT,
      materialType: POSMMaterialTypeEnum.PLASTIC,
      campaignId: 'CAMP002',
      channelTarget: POSMChannelTargetEnum.MT,
      regionTarget: 'Bangalore',
      allocationTarget: POSMAllocationTargetEnum.DISTRIBUTOR,
      quantityAllocated: 100,
      allocationDate: new Date().toISOString().split('T')[0],
      sku: 'PRD002',
      customerId: customers[1].customerId,
      unitCost: 200.00
    },
    {
      posmName: 'Digital Screen',
      posmType: PosmTypeEnum.DIGITAL_SCREEN,
      posmCategory: PosmCategoryEnum.PERMANENT,
      materialType: POSMMaterialTypeEnum.DIGITAL,
      campaignId: 'CAMP003',
      channelTarget: POSMChannelTargetEnum.GT,
      regionTarget: 'Pune',
      allocationTarget: POSMAllocationTargetEnum.RETAILER,
      quantityAllocated: 25,
      allocationDate: new Date().toISOString().split('T')[0],
      sku: 'PRD003',
      customerId: customers[2].customerId,
      unitCost: 5000.00
    }
  ];
  const saved: Posm[] = [];
  for (const item of posmItems) {
    const posm = await upsertIfMissing(repo, { posmName: item.posmName, customerId: item.customerId }, item);
    saved.push(posm);
  }
  console.log(`✅ Seeded ${saved.length} POSM items`);
  return saved;
}

// Seed Discounts
async function seedDiscounts(
  ds: DataSource,
  customerTypes: CustomerType[],
  customers: Customer[],
  skus: Sku[],
  countries: Country[],
  states: State[],
  districts: District[]
): Promise<Discount[]> {
  const repo = ds.getRepository(Discount);
  const discounts = [
    {
      discountName: 'New Customer Discount',
      discountType: DiscountType.PERCENTAGE,
      discountCategory: DiscountCategory.SPECIAL_CUSTOMER,
      customerTypeId: customerTypes[0].customerTypeId,
      discountValueType: DiscountValueType.PERCENTAGE,
      discountPercentage: 10,
      status: DiscountStatus.ACTIVE,
      approvalStatus: ApprovalStatus.APPROVED,
      validFrom: new Date(),
      validTill: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
    },
    {
      discountName: 'Volume Discount',
      discountType: DiscountType.SLAB,
      discountCategory: DiscountCategory.VOLUME_BASED,
      customerId: customers[1].customerId,
      skuId: skus[1].skuId,
      discountValueType: DiscountValueType.AMOUNT,
      discountValue: 50,
      minQty: 100,
      maxQty: 500,
      status: DiscountStatus.ACTIVE,
      approvalStatus: ApprovalStatus.APPROVED,
      validFrom: new Date(),
      validTill: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    },
    {
      discountName: 'Regional Discount - Mumbai',
      discountType: DiscountType.FLAT,
      discountCategory: DiscountCategory.TERRITORY_CHANNEL,
      countryId: countries[0].countryId,
      stateId: states[0].stateId,
      districtId: districts[0].districtId,
      discountValueType: DiscountValueType.AMOUNT,
      discountValue: 25,
      minimumOrderValue: 1000,
      status: DiscountStatus.ACTIVE,
      approvalStatus: ApprovalStatus.APPROVED,
      validFrom: new Date(),
      validTill: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    }
  ];
  const saved: Discount[] = [];
  for (const item of discounts) {
    const discount = await upsertIfMissing(repo, { discountName: item.discountName }, item);
    saved.push(discount);
  }
  console.log(`✅ Seeded ${saved.length} discounts`);
  return saved;
}

// Seed Schemes
async function seedSchemes(
  ds: DataSource,
  customers: Customer[],
  customerTypes: CustomerType[],
  skus: Sku[],
  beats: Beat[],
  user: User
): Promise<Scheme[]> {
  const repo = ds.getRepository(Scheme);
  const schemes = [
    {
      schemeName: 'Buy 2 Get 1 Free',
      schemeType: SchemeType.QTY_BASED,
      schemeNature: SchemeNature.PRIMARY,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: SchemeStatus.ACTIVE,
      beatId: beats[0]?.beatId || 1,
      minQty: 2,
      benefitType: BenefitType.FREE_SKU,
      benefitQty: 1,
      autoApply: true,
      createdBy: user.emp_id
    },
    {
      schemeName: 'Value Based Scheme',
      schemeType: SchemeType.VALUE_BASED,
      schemeNature: SchemeNature.SECONDARY,
      startDate: new Date(),
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      status: SchemeStatus.ACTIVE,
      beatId: beats[1]?.beatId || 1,
      minValue: 5000,
      benefitType: BenefitType.VALUE_OFF,
      benefitQty: 500,
      autoApply: false,
      createdBy: user.emp_id
    },
    {
      schemeName: 'Slab Scheme',
      schemeType: SchemeType.SLAB,
      schemeNature: SchemeNature.TRADE,
      startDate: new Date(),
      endDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
      status: SchemeStatus.ACTIVE,
      beatId: beats[2]?.beatId || 1,
      slabFrom: 50,
      slabTo: 100,
      benefitType: BenefitType.EXTRA_QTY,
      benefitQty: 10,
      isClaimable: true,
      claimPeriod: ClaimPeriod.MONTHLY,
      createdBy: user.emp_id
    }
  ];
  const saved: Scheme[] = [];
  for (const item of schemes) {
    const scheme = await upsertIfMissing(repo, { schemeName: item.schemeName }, item);
    saved.push(scheme);
  }
  console.log(`✅ Seeded ${saved.length} schemes`);
  return saved;
}

// Seed Beats
async function seedBeats(
  ds: DataSource,
  customers: Customer[],
  countries: Country[],
  states: State[],
  districts: District[],
  user: User
): Promise<Beat[]> {
  const repo = ds.getRepository(Beat);
  const now = new Date();
  const beats = [
    {
      beatCode: 'BT-S-001',
      beatName: 'Mumbai Central Beat',
      customerId: customers[0].customerId,
      countryId: countries[0].countryId,
      stateId: states[0].stateId,
      districtId: districts[0].districtId,
      beatType: BeatType.SALES,
      visitFrequency: VisitFrequency.DAILY,
      defaultVisitDays: null, // Setting to null due to TypeORM enum array serialization issue
      priority: BeatPriority.HIGH,
      status: BeatStatus.ACTIVE,
      createdBy: user.emp_id,
      createdAt: now,
      updatedAt: now
    },
    {
      beatCode: 'BT-S-002',
      beatName: 'Bangalore North Beat',
      customerId: customers[1].customerId,
      countryId: countries[0].countryId,
      stateId: states[1].stateId,
      districtId: districts[2].districtId,
      beatType: BeatType.DELIVERY,
      visitFrequency: VisitFrequency.WEEKLY,
      defaultVisitDays: null, // Setting to null due to TypeORM enum array serialization issue
      priority: BeatPriority.MEDIUM,
      status: BeatStatus.ACTIVE,
      createdBy: user.emp_id,
      createdAt: now,
      updatedAt: now
    },
    {
      beatCode: 'BT-S-003',
      beatName: 'Pune Industrial Beat',
      customerId: customers[2].customerId,
      countryId: countries[0].countryId,
      stateId: states[0].stateId,
      districtId: districts[1].districtId,
      beatType: BeatType.COLLECTION,
      visitFrequency: VisitFrequency.FORTNIGHTLY,
      defaultVisitDays: null, // Setting to null due to TypeORM enum array serialization issue
      priority: BeatPriority.LOW,
      status: BeatStatus.ACTIVE,
      createdBy: user.emp_id,
      createdAt: now,
      updatedAt: now
    }
  ];
  const saved: Beat[] = [];
  for (const item of beats) {
    const beat = await upsertIfMissing(repo, { beatCode: item.beatCode }, item);
    saved.push(beat);
  }
  console.log(`✅ Seeded ${saved.length} beats`);
  return saved;
}

// Internal seed function that assumes DB is already initialized
async function seedCustomerDataInternal(ds: DataSource): Promise<void> {
  try {
    // Get or create a default user for createdBy fields
    const userRepo = ds.getRepository(User);
    let user = await userRepo.findOne({ where: { email: 'admin@example.com' } });
    if (!user) {
      // Create a default admin user if none exists
      // Check if any users exist to determine manager_id
      const existingUsers = await userRepo.find({ take: 1 });
      const managerId = existingUsers.length > 0 ? existingUsers[0].emp_id : 0;
      
      user = await userRepo.save(userRepo.create({
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@example.com',
        phone: '9999999999',
        password: 'password',
        joining_date: new Date(),
        managerId: managerId, // Required field - use 0 for first user
        role: UserRole.SUPER_ADMIN // Set a default role
      } as any));
      console.log('✅ Created default admin user');
    }

    // Get required dependencies
    const categoryRepo = ds.getRepository(ProductCategory);
    const categories = await categoryRepo.find({ take: 1 });
    if (categories.length === 0) {
      // Create a default category if none exists
      const defaultCategory = await categoryRepo.save(categoryRepo.create({
        name: 'General',
        empId: user.emp_id,
        isActive: true,
        isDeleted: false
      } as any));
      categories.push(defaultCategory);
    }

    const taxRepo = ds.getRepository(Taxes);
    let taxes = await taxRepo.find({ take: 1 });
    if (taxes.length === 0) {
      const defaultTax = await taxRepo.save(taxRepo.create({
        taxName: 'GST 18%',
        taxAmount: 18,
        description: 'Goods and Services Tax',
        addedBy: user.emp_id,
        status: true
      } as any));
      taxes.push(defaultTax);
    }

    const warehouseRepo = ds.getRepository(Warehouse);
    let warehouses = await warehouseRepo.find({ take: 1 });
    if (warehouses.length === 0) {
      const defaultWarehouse = await warehouseRepo.save(warehouseRepo.create({
        warehouseName: 'Main Warehouse',
        address: '123 Warehouse Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zip: '400001',
        status: 'ACTIVE' as any
      } as any));
      warehouses.push(defaultWarehouse);
    }

    // Seed in dependency order
    const countries = await seedCountries(ds);
    const states = await seedStates(ds, countries);
    const districts = await seedDistricts(ds, states, countries);
    const customerTypes = await seedCustomerTypes(ds, user);
    const customers = await seedCustomers(ds, customerTypes, districts, states, countries, user);
    const products = await seedProducts(ds, categories);
    const skus = await seedSkus(ds, products, taxes);
    const inventory = await seedInventory(ds, skus, products, warehouses);
    const posm = await seedPosm(ds, customers);
    const beats = await seedBeats(ds, customers, countries, states, districts, user);
    const discounts = await seedDiscounts(ds, customerTypes, customers, skus, countries, states, districts);
    const schemes = await seedSchemes(ds, customers, customerTypes, skus, beats, user);

    console.log('\n✅ All seed data created successfully!');
    console.log(`   - Countries: ${countries.length}`);
    console.log(`   - States: ${states.length}`);
    console.log(`   - Districts: ${districts.length}`);
    console.log(`   - Customer Types: ${customerTypes.length}`);
    console.log(`   - Customers: ${customers.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - SKUs: ${skus.length}`);
    console.log(`   - Inventory: ${inventory.length}`);
    console.log(`   - POSM: ${posm.length}`);
    console.log(`   - Beats: ${beats.length}`);
    console.log(`   - Discounts: ${discounts.length}`);
    console.log(`   - Schemes: ${schemes.length}`);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    throw err; // Re-throw for internal function
  }
}

// Main function for CLI usage (initializes and closes connection)
async function main(): Promise<void> {
  console.log('🌱 Starting customer data seed...');
  const ds = await DbConnections.AppDbConnection.initialize();
  
  try {
    // Check if data already exists
    const dataExists = await checkSeedDataExists(ds);
    if (dataExists) {
      console.log('⏭️  Skipping seed: Data already exists in database');
      return;
    }
    
    // Proceed with seeding
    await seedCustomerDataInternal(ds);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    try {
      await DbConnections.AppDbConnection.close();
    } catch (e) {
      // ignore
    }
  }
}

// Run only if executed directly
if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  main();
}

// Auto-seed function that checks and seeds if needed
export async function autoSeedCustomerData(): Promise<void> {
  try {
    const ds = DbConnections.AppDbConnection.getConnection();
    
    // Check if data already exists
    const dataExists = await checkSeedDataExists(ds);
    if (dataExists) {
      console.log('⏭️  Auto-seed skipped: Customer data already exists');
      return;
    }
    
    // Data doesn't exist, proceed with seeding
    console.log('🌱 Auto-seeding customer data...');
    await seedCustomerDataInternal(ds);
  } catch (error) {
    console.error('❌ Auto-seed failed:', error);
    // Don't throw - allow server to continue even if seeding fails
  }
}

// Main function for CLI usage (initializes and closes connection)
async function main(): Promise<void> {
  console.log('🌱 Starting customer data seed...');
  const ds = await DbConnections.AppDbConnection.initialize();
  
  try {
    // Check if data already exists
    const dataExists = await checkSeedDataExists(ds);
    if (dataExists) {
      console.log('⏭️  Skipping seed: Data already exists in database');
      return;
    }
    
    // Proceed with seeding
    await seedCustomerDataInternal(ds);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    try {
      await DbConnections.AppDbConnection.close();
    } catch (e) {
      // ignore
    }
  }
}

