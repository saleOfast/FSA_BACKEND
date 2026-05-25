// @ts-nocheck
import 'reflect-metadata';
import { DbConnections } from '../core/DB/postgresdb';
import { DataSource, Repository, ObjectLiteral } from 'typeorm';

// Entities
import { Status } from '../core/DB/Entities/status.entity';
import { UserTypes } from '../core/DB/Entities/userType.entity';
import { Role } from '../core/DB/Entities/role.entity';
import { PaymentMode } from '../core/DB/Entities/paymentMode.entity';
import { Colour } from '../core/DB/Entities/colour.entity';
import { Size } from '../core/DB/Entities/size.entity';
import { Feature } from '../core/DB/Entities/feature.entity';
import { Reason } from '../core/DB/Entities/reason.entity';
import { StoreCategory } from '../core/DB/Entities/storeCategory.entity';
import { Brand } from '../core/DB/Entities/brand.entity';
import { ProductCategory } from '../core/DB/Entities/productCategory.entity';
import { Products } from '../core/DB/Entities/products.entity';
import { User } from '../core/DB/Entities/User.entity';
import { Stores } from '../core/DB/Entities/stores.entity';
import { Inventory } from '../core/DB/Entities/inventory.entity';
import { Visits } from '../core/DB/Entities/Visit.entity';
import { Beat } from '../core/DB/Entities/beat.entity';
import { Activities } from '../core/DB/Entities/activities.entity';
import { Orders } from '../core/DB/Entities/orders.entity';
import { Payment } from '../core/DB/Entities/payment.entity';
import { Collection } from '../core/DB/Entities/collection.entity';
import { CollectAmount } from '../core/DB/Entities/collected_amount.entity';
import { CollectPayment } from '../core/DB/Entities/collect_payment.entity';
import { PolicyHead } from '../core/DB/Entities/policyHead.entity';
import { PolicyTypeHead } from '../core/DB/Entities/policyHeadType.entity';
import { LeaveHead } from '../core/DB/Entities/Leave.entity';
import { LeaveHeadCount } from '../core/DB/Entities/LeaveCount.entity';
import { UserLeave } from '../core/DB/Entities/userLeave.entity';
import { LeaveApplication } from '../core/DB/Entities/userLeaveApplication.entity';
import { Holiday } from '../core/DB/Entities/holidays.entity';
import { CompetitorBrand } from '../core/DB/Entities/brand.competitor.entity';
import { RCPA } from '../core/DB/Entities/rcpa.entity';
import { Course } from '../core/DB/Entities/LearningModule/course.entity';
import { Quiz } from '../core/DB/Entities/LearningModule/quiz.entity';
import { LearningSession } from '../core/DB/Entities/LearningModule/learningSession.entity';
import { FeedBack } from '../core/DB/Entities/feedback.entity';
import { Samples } from '../core/DB/Entities/samples.entity';
import { Gifts } from '../core/DB/Entities/giftDistribution.entity';
import { Workplace } from '../core/DB/Entities/workplace.entity';
import { OutletInventory } from '../core/DB/Entities/outlet_inventory.entity';
import { Taxes } from '../core/DB/Entities/tax.entity';
import { Edetailing } from '../core/DB/Entities/eDetailing.entity';
import { ActivityRelTo } from '../core/DB/Entities/activityRelatedTo.entity';
import { ActivityType } from '../core/DB/Entities/activityType.entity';
import { NextActionOn } from '../core/DB/Entities/nextActionOn.entity';
import { NewTarget } from '../core/DB/Entities/new.target.entity';
import { Discount } from '../core/DB/Entities/discount.entity';
import { Distributor } from '../core/DB/Entities/distributors.entity';
import { PriceBook } from '../core/DB/Entities/priceBook.entity';
import { PriceBookItem } from '../core/DB/Entities/price_book_item.entity';
import { ItemShippingAddress } from '../core/DB/Entities/shippingAddress.entity';
import { Customer } from '../core/DB/Entities/customer.entity';
import { CustomerType } from '../core/DB/Entities/customerType.entity';
import { Country } from '../core/DB/Entities/country.entity';
import { State } from '../core/DB/Entities/state.entity';
import { District } from '../core/DB/Entities/district.entity';
import { Sku } from '../core/DB/Entities/sku.entity';
import { UserRole, CallType, OrderStatus, PaymentStatus, StockLevelComparison, ExpenseReportClaimType, HolidayType, WorkplaceTypeEnum, PriceBookType, PriceBookStatus, ApprovalStatus, Channel, CurrencyType, PriorityType, ItemType, UOM, TaxInclusive, Status as StatusEnum, PreferredDays } from '../core/types/Constent/common';

type AnyRecord = Record<string, unknown>;

/**
 * Upsert helper: Only inserts data if it doesn't already exist
 * @param repo - Repository instance
 * @param findCriteria - Criteria to check if record exists
 * @param data - Data to insert if record doesn't exist
 * @param entityName - Optional entity name for logging
 */
async function upsertIfMissing<T extends ObjectLiteral>(
	repo: Repository<T>, 
	findCriteria: AnyRecord, 
	data: AnyRecord,
	entityName?: string
): Promise<void> {
	const existing = await repo.findOne({ where: findCriteria as any });
	if (!existing) {
		await repo.save(repo.create(data as any));
		if (entityName) {
			console.log(`✅ Inserted ${entityName}:`, Object.values(findCriteria).join(', '));
		}
	} else {
		if (entityName) {
			console.log(`⏭️  Skipped ${entityName} (already exists):`, Object.values(findCriteria).join(', '));
		}
	}
}

/**
 * Check if table has any data
 * @param repo - Repository instance
 * @returns true if table has data, false if empty
 */
async function tableHasData<T extends ObjectLiteral>(repo: Repository<T>): Promise<boolean> {
	const count = await repo.count();
	return count > 0;
}

/**
 * Seed wrapper: Only seeds if table is empty
 * @param repo - Repository instance
 * @param tableName - Name of the table for logging
 * @param seedFunction - Function to execute if table is empty
 */
async function seedIfTableEmpty<T extends ObjectLiteral>(
	repo: Repository<T>,
	tableName: string,
	seedFunction: () => Promise<void>
): Promise<void> {
	const hasData = await tableHasData(repo);
	if (hasData) {
		console.log(`⏭️  Skipped ${tableName} (table already has data)`);
		return;
	}
	console.log(`📝 Seeding ${tableName}...`);
	await seedFunction();
	console.log(`✅ Completed seeding ${tableName}`);
}

async function seedStatuses(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(Status);
	const items = [
		{ status_code: 'ACTIVE', status_name: 'Active', status: true },
		{ status_code: 'INACTIVE', status_name: 'Inactive', status: true },
		{ status_code: 'DELETED', status_name: 'Deleted', status: true }
	];
	for (const item of items) {
		await upsertIfMissing(repo, { status_code: item.status_code }, item, 'Status');
	}
}

async function seedUserTypes(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(UserTypes);
	const items = [
		{ userTypeName: 'Administrator', userTypeCode: 'ADMIN', status: true },
		{ userTypeName: 'Manager', userTypeCode: 'MANAGER', status: true },
		{ userTypeName: 'Employee', userTypeCode: 'EMP', status: true }
	];
	for (const item of items) {
		await upsertIfMissing(repo, { userTypeCode: item.userTypeCode }, item, 'UserType');
	}
}

async function seedRoles(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(Role);
	const profileRepo = ds.getRepository(Profile);
	const adminProfile = await profileRepo.findOne({ where: { isDeleted: false } });
	const profileId = adminProfile?.profileId ?? 1;
	const admin = await upsertIfMissing(
	  repo,
	  { name: "Administrator" },
	  {
		name: "Administrator",
		profileId,
		parentRoleId: null,
		description: "Top level",
		isActive: true,
		isDeleted: false,
	  }
	);
}

async function seedPaymentModes(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(PaymentMode);
	const items = [
		{ name: 'Cash', empId: 0, isDeleted: false },
		{ name: 'UPI', empId: 0, isDeleted: false },
		{ name: 'Card', empId: 0, isDeleted: false },
		{ name: 'Cheque', empId: 0, isDeleted: false }
	];
	for (const item of items) {
		await upsertIfMissing(repo, { name: item.name }, item, 'PaymentMode');
	}
}

async function seedColours(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(Colour);
	const items = [
		{ name: 'Red', empId: 0, isDeleted: false },
		{ name: 'Blue', empId: 0, isDeleted: false },
		{ name: 'Green', empId: 0, isDeleted: false }
	];
	for (const item of items) {
		await upsertIfMissing(repo, { name: item.name }, item, 'Colour');
	}
}

async function seedSizes(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(Size);
	const items = [
		{ name: 'Small', empId: 0, isDeleted: false },
		{ name: 'Medium', empId: 0, isDeleted: false },
		{ name: 'Large', empId: 0, isDeleted: false }
	];
	for (const item of items) {
		await upsertIfMissing(repo, { name: item.name }, item, 'Size');
	}
}

async function seedFeatures(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(Feature);
	const items = [
		{ key: 'REPORTS', name: 'Reports', empId: 0, isActive: true, isDeleted: false },
		{ key: 'ORDERS', name: 'Orders', empId: 0, isActive: true, isDeleted: false }
	];
	for (const item of items) {
		await upsertIfMissing(repo, { key: item.key }, item, 'Feature');
	}
}

async function seedReasons(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(Reason);
	const items = [
		{ description: 'Store closed', empId: 0, isDeleted: false },
		{ description: 'Owner not available', empId: 0, isDeleted: false }
	];
	for (const item of items) {
		await upsertIfMissing(repo, { description: item.description }, item, 'Reason');
	}
}

async function seedStoreCategories(ds: DataSource): Promise<StoreCategory[]> {
	const repo = ds.getRepository(StoreCategory);
	const items = [
		{ categoryName: 'Pharmacy', empId: 0, isDeleted: false },
		{ categoryName: 'Clinic', empId: 0, isDeleted: false }
	];
    const saved: StoreCategory[] = [];
	for (const item of items) {
        let row = await repo.findOne({ where: { categoryName: item.categoryName } });
        if (!row) {
			row = await repo.save(repo.create(item as any));
			console.log(`✅ Inserted StoreCategory: ${item.categoryName}`);
		} else {
			console.log(`⏭️  Skipped StoreCategory (already exists): ${item.categoryName}`);
		}
        saved.push(row as StoreCategory);
	}
	return saved;
}

async function seedBrands(ds: DataSource): Promise<Brand[]> {
	const repo = ds.getRepository(Brand);
	const items = [
		{ name: 'Brand A', empId: 0, isDeleted: false },
		{ name: 'Brand B', empId: 0, isDeleted: false }
	];
    const saved: Brand[] = [];
	for (const item of items) {
        let row = await repo.findOne({ where: { name: item.name } });
        if (!row) {
			row = await repo.save(repo.create(item as any));
			console.log(`✅ Inserted Brand: ${item.name}`);
		} else {
			console.log(`⏭️  Skipped Brand (already exists): ${item.name}`);
		}
        saved.push(row as Brand);
	}
	return saved;
}

async function seedProductCategories(ds: DataSource): Promise<ProductCategory[]> {
	const repo = ds.getRepository(ProductCategory);
	const items = [
		{ name: 'OTC', empId: 0, isActive: true, isDeleted: false },
		{ name: 'Rx', empId: 0, isActive: true, isDeleted: false }
	];
    const saved: ProductCategory[] = [];
	for (const item of items) {
        let row = await repo.findOne({ where: { name: item.name } });
        if (!row) {
			row = await repo.save(repo.create(item as any));
			console.log(`✅ Inserted ProductCategory: ${item.name}`);
		} else {
			console.log(`⏭️  Skipped ProductCategory (already exists): ${item.name}`);
		}
        saved.push(row as ProductCategory);
	}
	return saved;
}

async function seedUsers(ds: DataSource): Promise<User[]> {
	const repo = ds.getRepository(User);
	const users: Array<Partial<User>> = [
		{
			firstname: 'Admin', lastname: 'User', phone: '9999999999', email: 'admin@example.com',
			joining_date: new Date(), password: 'password', managerId: 0, role: UserRole.SUPER_ADMIN,
			city: 'City', state: 'State', pincode: '000000', address: 'Address', orgName: 'Org'
		},
		{
			firstname: 'Sales', lastname: 'User', phone: '8888888888', email: 'sales@example.com',
			joining_date: new Date(), password: 'password', managerId: 1, role: UserRole.SSM,
			city: 'City', state: 'State', pincode: '000000', address: 'Address', orgName: 'Org'
		}
	];
    const saved: User[] = [];
	for (const u of users) {
        let row = await repo.findOne({ where: { email: u.email as string } });
        if (!row) {
			row = await repo.save(repo.create(u as any));
			console.log(`✅ Inserted User: ${u.email}`);
		} else {
			console.log(`⏭️  Skipped User (already exists): ${u.email}`);
		}
        saved.push(row as User);
	}
	return saved;
}

async function seedStores(ds: DataSource, users: User[], categories: StoreCategory[]): Promise<Stores[]> {
	const repo = ds.getRepository(Stores);
	const owner = users[1] || users[0];
	const cat = categories[0];
	const items: Array<Partial<Stores>> = [
		{
			empId: owner.emp_id, retailorId: 1, storeName: 'Health Plus Store', uid: 'S001', storeType: cat?.storeCategoryId,
			lat: '28.61', long: '77.20', addressLine1: '123 Main St', addressLine2: 'Block A', townCity: 'New Delhi', state: 'Delhi',
			district: 'Central', pinCode: '110001', ownerName: 'Mr. Kumar', mobileNumber: '9123456789', isPremiumStore: false, isActive: true
		}
	];
    const saved: Stores[] = [];
	for (const item of items) {
        let row = await repo.findOne({ where: { storeName: item.storeName as string } });
        if (!row) {
			row = await repo.save(repo.create(item as any));
			console.log(`✅ Inserted Store: ${item.storeName}`);
		} else {
			console.log(`⏭️  Skipped Store (already exists): ${item.storeName}`);
		}
        saved.push(row as Stores);
	}
	return saved;
}

async function seedProducts(ds: DataSource, brands: Brand[], categories: ProductCategory[]): Promise<Products[]> {
	const repo = ds.getRepository(Products);
	const brand = brands[0];
	const cat = categories[0];
	const items: Array<Partial<Products>> = [
		{
			productName: 'Paracetamol 500mg', empId: 0, brandId: brand.brandId, categoryId: cat.productCategoryId,
			mrp: 100, rlp: 90, caseQty: 10, isFocused: true, isActive: true, isDeleted: false, image: 'no-image.png'
		}
	];
    const saved: Products[] = [];
	for (const item of items) {
        let row = await repo.findOne({ where: { productName: item.productName as string } });
        if (!row) {
			row = await repo.save(repo.create(item as any));
			console.log(`✅ Inserted Product: ${item.productName}`);
		} else {
			console.log(`⏭️  Skipped Product (already exists): ${item.productName}`);
		}
        saved.push(row as Products);
	}
	return saved;
}

async function seedInventory(ds: DataSource, store: Stores, product: Products): Promise<void> {
	const repo = ds.getRepository(Inventory);
	await upsertIfMissing(repo, { storeId: store.storeId, productId: product.productId }, {
		storeId: store.storeId, productId: product.productId, empId: store.empId, noOfCase: 5, noOfPiece: 20
	});
}

async function seedVisits(ds: DataSource, user: User, store: Stores): Promise<Visits> {
	const repo = ds.getRepository(Visits);
	let row = await repo.findOne({ where: { empId: user.emp_id, storeId: store.storeId } });
	if (!row) {
		row = await repo.save(repo.create({
			empId: user.emp_id, beat: 1, store: [store.storeId], storeId: store.storeId,
			visitDate: new Date(), status: 1 as any, isCallType: CallType.PHYSICAL
		} as any));
		console.log(`✅ Inserted Visit for User ${user.emp_id} and Store ${store.storeId}`);
	} else {
		console.log(`⏭️  Skipped Visit (already exists) for User ${user.emp_id} and Store ${store.storeId}`);
	}
    return row as Visits;
}

async function seedBeat(ds: DataSource, user: User, store: Stores): Promise<void> {
	const repo = ds.getRepository(Beat);
	await upsertIfMissing(repo, { empId: user.emp_id, beatName: 'Default Beat' }, {
		empId: user.emp_id, beatName: 'Default Beat', store: [store.storeId], IsEnable: true, isDeleted: false
	});
}

async function seedActivities(ds: DataSource, user: User, store: Stores, product: Products): Promise<void> {
	const repo = ds.getRepository(Activities);
	await upsertIfMissing(repo, { addedBy: user.emp_id, productId: product.productId, date: new Date().toDateString() as any }, {
		storeId: store.storeId, activityType: null as any, date: new Date(), duration: '01:00:00', addedBy: user.emp_id,
		productId: product.productId, remarks: 'Initial activity', status: true
	});
}

async function seedOrders(ds: DataSource, user: User, store: Stores, product: Products): Promise<Orders> {
	const repo = ds.getRepository(Orders);
	let row = await repo.findOne({ where: { empId: user.emp_id, storeId: store.storeId } });
	if (!row) {
		row = await repo.save(repo.create({
			empId: user.emp_id, storeId: store.storeId, isCallType: CallType.PHYSICAL as any,
			orderDate: new Date().toISOString(), orderAmount: 1000, products: [{ productId: product.productId, qty: 2, price: 100 }],
			paymentStatus: PaymentStatus.PENDING, netAmount: 900, totalDiscountAmount: 100, orderStatus: OrderStatus.ORDERSAVED,
			statusHistory: []
		} as any));
		console.log(`✅ Inserted Order for User ${user.emp_id} and Store ${store.storeId}`);
	} else {
		console.log(`⏭️  Skipped Order (already exists) for User ${user.emp_id} and Store ${store.storeId}`);
	}
    return row as Orders;
}

async function seedPayments(ds: DataSource, user: User, order: Orders): Promise<void> {
	const repo = ds.getRepository(Payment);
	await upsertIfMissing(repo, { orderId: order.orderId }, {
		empId: user.emp_id, orderId: order.orderId, paymentDate: new Date().toISOString(), transactionId: 'TXN001',
		status: 'SUCCESS', paymentMode: 'Cash', amount: 900
	});
}

async function seedCollections(ds: DataSource, order: Orders, store: Stores): Promise<void> {
	const repo = ds.getRepository(Collection);
		await upsertIfMissing(repo, { orderId: order.orderId }, {
			orderId: order.orderId, storeId: store.storeId, orderAmount: 1000, collectedAmount: 900, pendingAmount: 100
		}, `Collection (OrderId: ${order.orderId})`);
}

async function seedCollectAmounts(ds: DataSource, order: Orders): Promise<void> {
	const repo = ds.getRepository(CollectAmount);
	await upsertIfMissing(repo, { orderId: order.orderId }, {
		orderId: order.orderId, collectAmount: 900, pendingAmount: 100, totalCollectedAmount: 900, totalPendingAmount: 100
	});
}

async function seedCollectPayments(ds: DataSource, order: Orders): Promise<void> {
	const repo = ds.getRepository(CollectPayment);
	await upsertIfMissing(repo, { orderId: order.orderId }, {
		date: new Date(), orderId: order.orderId, orderAmount: 1000, collectAmount: 900
	});
}

async function seedPolicy(ds: DataSource): Promise<{ head: PolicyHead; type: PolicyTypeHead; }> {
	const headRepo = ds.getRepository(PolicyHead);
	const typeRepo = ds.getRepository(PolicyTypeHead);
    let head = await headRepo.findOne({ where: { policy_code: 'TRVL' } });
    if (!head) head = await headRepo.save(headRepo.create({ policy_name: 'Travel Policy', policy_code: 'TRVL', is_travel: true } as any));
    const ensuredHead = head as PolicyHead;
    let type = await typeRepo.findOne({ where: { policy_type_name: 'Daily Allowance' } });
    if (!type) type = await typeRepo.save(typeRepo.create({ policy_type_name: 'Daily Allowance', policy_id: ensuredHead.policy_id, claim_type: ExpenseReportClaimType.DA, cost_per_km: 0 } as any));
    return { head: ensuredHead, type: type as PolicyTypeHead };
}

async function seedLeaves(ds: DataSource, user: User): Promise<{ head: LeaveHead; headCount: LeaveHeadCount; userLeave: UserLeave; app: LeaveApplication; }> {
	const headRepo = ds.getRepository(LeaveHead);
	const cntRepo = ds.getRepository(LeaveHeadCount);
	const userLeaveRepo = ds.getRepository(UserLeave);
	const appRepo = ds.getRepository(LeaveApplication);
    let head = await headRepo.findOne({ where: { head_leave_code: 'CL' } });
    if (!head) head = await headRepo.save(headRepo.create({ head_leave_code: 'CL', head_leave_short_name: 'Casual', head_leave_name: 'Casual Leave', status: true } as any));
    const ensuredHead = head as LeaveHead;
    let headCount = await cntRepo.findOne({ where: { headLeaveId: ensuredHead.head_leave_id } });
    if (!headCount) headCount = await cntRepo.save(cntRepo.create({ headLeaveId: ensuredHead.head_leave_id, status: true, financialStart: new Date(), financialEnd: new Date(), totalHeadLeave: 12 } as any));
    const ensuredHeadCount = headCount as LeaveHeadCount;
    let userLeave = await userLeaveRepo.findOne({ where: { user_id: user.emp_id, head_leave_id: ensuredHead.head_leave_id } });
    if (!userLeave) userLeave = await userLeaveRepo.save(userLeaveRepo.create({ user_id: user.emp_id, head_leave_id: ensuredHead.head_leave_id, head_leave_cnt_id: ensuredHeadCount.headLeaveCntId, left_leave: 12, extra_leaves: 0 } as any));
    let app = await appRepo.findOne({ where: { emp_id: user.emp_id } });
    if (!app) app = await appRepo.save(appRepo.create({ emp_id: user.emp_id, manager_id: user.managerId, head_leave_id: ensuredHead.head_leave_id, head_leave_cnt_id: ensuredHeadCount.headLeaveCntId, leave_type: 'CL', reason: 'Personal', no_of_days: 1, from_date: new Date(), to_date: new Date(), leave_app_status: 'pending' } as any));
    return { head: ensuredHead, headCount: ensuredHeadCount, userLeave: userLeave as UserLeave, app: app as LeaveApplication };
}

async function seedHoliday(ds: DataSource, user: User): Promise<void> {
	const repo = ds.getRepository(Holiday);
	await upsertIfMissing(repo, { name: 'Republic Day' }, {
		name: 'Republic Day', holidayType: HolidayType.GAZETTED, date: new Date(), day: 'Monday', addedBy: user.emp_id, remarks: 'National holiday', status: true
	});
}

async function seedCompetitorBrand(ds: DataSource): Promise<CompetitorBrand> {
	const repo = ds.getRepository(CompetitorBrand);
	let row = await repo.findOne({ where: { name: 'Competitor X' } });
	if (!row) row = await repo.save(repo.create({ name: 'Competitor X', empId: 0, isDeleted: false } as any));
    return row as CompetitorBrand;
}

async function seedRCPAEntry(ds: DataSource, user: User, store: Stores, product: Products, competitor: CompetitorBrand): Promise<void> {
	const repo = ds.getRepository(RCPA);
	await upsertIfMissing(repo, { productId: product.productId, storeId: store.storeId }, {
		storeId: store.storeId, addedBy: user.emp_id, productId: product.productId, quantitySold: 10, stockLevel: 5, stockLevelCompetitor: 8,
		competitorBrandId: competitor.CompetitorBrandId, priceComparison: StockLevelComparison.SAME, PromotionalOffers: 'None', deliveryIssues: false,
		ServicesProvided: 'Good', rating: 4, remarks: 'Stable', date: new Date(), status: true
	});
}

async function seedLearning(ds: DataSource, user: User, product: Products): Promise<{ course: Course; quiz: Quiz; session: LearningSession; }> {
	const courseRepo = ds.getRepository(Course);
	const quizRepo = ds.getRepository(Quiz);
	const sessionRepo = ds.getRepository(LearningSession);
    let course = await courseRepo.findOne({ where: { courseName: 'Onboarding' } });
    if (!course) course = await courseRepo.save(courseRepo.create({ empId: user.emp_id, courseName: 'Onboarding', description: 'Welcome course', isActive: true } as any));
    const ensuredCourse = course as Course;
    let quiz = await quizRepo.findOne({ where: { courseId: ensuredCourse.courseId } });
    if (!quiz) quiz = await quizRepo.save(quizRepo.create({ courseId: ensuredCourse.courseId, question: 'Q1', marks: 1, option1: 'A', option2: 'B', option3: 'C', option4: 'D', answer: 'A' } as any));
    let session = await sessionRepo.findOne({ where: { courseId: ensuredCourse.courseId, userId: user.emp_id } });
    if (!session) session = await sessionRepo.save(sessionRepo.create({ courseId: ensuredCourse.courseId, userId: user.emp_id } as any));
    return { course: ensuredCourse, quiz: quiz as Quiz, session: session as LearningSession };
}

async function seedFeedback(ds: DataSource, user: User, store: Stores, product: Products): Promise<void> {
	const repo = ds.getRepository(FeedBack);
	await upsertIfMissing(repo, { productId: product.productId, storeId: store.storeId }, {
		storeId: store.storeId, productId: product.productId, date: new Date(), addedBy: user.emp_id, rating: 5, remarks: 'Great product', status: true
	});
}

async function seedSamples(ds: DataSource, user: User, store: Stores, product: Products): Promise<void> {
	const repo = ds.getRepository(Samples);
	await upsertIfMissing(repo, { productId: product.productId, storeId: store.storeId }, {
		storeId: store.storeId, productId: product.productId, date: new Date(), addedBy: user.emp_id, quantity: 5, remarks: 'Sample provided', status: true
	});
}

async function seedGifts(ds: DataSource, user: User, store: Stores, product: Products): Promise<void> {
	const repo = ds.getRepository(Gifts);
	await upsertIfMissing(repo, { productId: product.productId, storeId: store.storeId }, {
		storeId: store.storeId, productId: product.productId, date: new Date(), addedBy: user.emp_id, quantity: 1, remarks: 'Gifted', gift: 'Pen', status: true
	});
}

async function seedWorkplace(ds: DataSource, user: User, store: Stores): Promise<void> {
	const repo = ds.getRepository(Workplace);
	await upsertIfMissing(repo, { addedBy: user.emp_id, storeId: store.storeId }, {
		storeId: store.storeId, addedBy: user.emp_id, workplaceType: WorkplaceTypeEnum.OTHERS, townCity: store.townCity, status: true
	});
}

async function seedOutletInventory(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(OutletInventory);
	await upsertIfMissing(repo, { productName: 'Generic Item' }, {
		productName: 'Generic Item', caseQty: 1, pieces: 12, mrp: 100, rlp: 90
	});
}

async function seedTaxes(ds: DataSource, user: User): Promise<void> {
	const repo = ds.getRepository(Taxes);
	const taxes = [
		{ taxName: 'GST 18%', taxAmount: 18, description: 'Goods and Services Tax 18%', addedBy: user.emp_id, status: true },
		{ taxName: 'GST 12%', taxAmount: 12, description: 'Goods and Services Tax 12%', addedBy: user.emp_id, status: true },
		{ taxName: 'GST 5%', taxAmount: 5, description: 'Goods and Services Tax 5%', addedBy: user.emp_id, status: true },
		{ taxName: 'CGST 9%', taxAmount: 9, description: 'Central Goods and Services Tax', addedBy: user.emp_id, status: true },
		{ taxName: 'SGST 9%', taxAmount: 9, description: 'State Goods and Services Tax', addedBy: user.emp_id, status: true }
	];
	for (const tax of taxes) {
		await upsertIfMissing(repo, { taxName: tax.taxName }, tax, 'Tax');
	}
}

async function seedEdetailing(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(Edetailing);
	await upsertIfMissing(repo, { course_name: 'Product A Intro' }, {
		course_name: 'Product A Intro', learning_category: 'Product', course_material: 'PDF', product_category: 'OTC', doctor_specialisation: 'General', expire_date: new Date(), status: true
	});
}

async function seedActivityConfigs(ds: DataSource): Promise<void> {
	const relRepo = ds.getRepository(ActivityRelTo);
	const typeRepo = ds.getRepository(ActivityType);
	const nextRepo = ds.getRepository(NextActionOn);
	await upsertIfMissing(relRepo, { activity_rel_to_code: 'STORE' }, { activity_rel_to_code: 'STORE', activity_rel_to_name: 'Store', status: true });
	await upsertIfMissing(typeRepo, { activity_type_code: 'CALL' }, { activity_type_code: 'CALL', activity_type_name: 'Phone Call', status: true });
	await upsertIfMissing(nextRepo, { next_action_on_code: 'FOLLOWUP' }, { next_action_on_code: 'FOLLOWUP', next_action_on_name: 'Follow Up', status: true });
}

async function seedTargets(ds: DataSource, user: User): Promise<void> {
	const repo = ds.getRepository(NewTarget);
	await upsertIfMissing(repo, { empId: user.emp_id, date: new Date().toDateString() as any }, {
		empId: user.emp_id, storeTarget: 10, amountTarget: 50000, collectionTarget: 30000, month: new Date(), year: new Date(), date: new Date(), isActive: true
	});
}

async function seedDiscounts(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(Discount);
	await upsertIfMissing(repo, { name: 'Intro Discount' } as any, { name: 'Intro Discount', value: 10, isActive: true, isDeleted: false } as any);
}

async function seedDistributors(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(Distributor);
	await upsertIfMissing(repo, { distributorName: 'Default Distributor' }, { distributorName: 'Default Distributor', type: 'Regional', address: 'Address', isActive: true });
}

async function seedCustomers(ds: DataSource, user: User): Promise<Customer[]> {
	const repo = ds.getRepository(Customer);
	const customers: Array<Partial<Customer>> = [
		{
			customerName: 'ABC Retail Store',
			customerType: 'Retailer',
			channelType: 'GT',
			phone: '9876543210',
			email: 'abc@retail.com',
			accountOwnerId: user.emp_id,
			category: 'A',
			billingCountry: 'India',
			billingState: 'Delhi',
			billingDistrict: 'Central',
			billingStreet: '123 Main St',
			billingCity: 'New Delhi',
			billingPinCode: '110001',
			shippingCountry: 'India',
			shippingState: 'Delhi',
			shippingDistrict: 'Central',
			shippingStreet: '123 Main St',
			shippingCity: 'New Delhi',
			shippingPinCode: '110001',
			deliveryTimeSlot: '10:00-18:00',
			paymentTerms: 'Net 30',
			creditLimit: 100000,
			isDeleted: false
		}
	];
	const saved: Customer[] = [];
	for (const customer of customers) {
		let row = await repo.findOne({ where: { customerName: customer.customerName as string } });
		if (!row) {
			row = await repo.save(repo.create(customer as any));
			console.log(`✅ Inserted Customer: ${customer.customerName}`);
		} else {
			console.log(`⏭️  Skipped Customer (already exists): ${customer.customerName}`);
		}
		saved.push(row as Customer);
	}
	return saved;
}

async function seedSkus(ds: DataSource, product: Products): Promise<Sku[]> {
	const repo = ds.getRepository(Sku);
	const skus: Array<Partial<Sku>> = [
		{
			skuName: 'Paracetamol 500mg Tablet',
			productId: product.productId,
			barcode: '1234567890123',
			mrp: 100,
			basePrice: 90,
			status: 'active' as any,
			isDeleted: false
		},
		{
			skuName: 'Paracetamol 500mg Strip',
			productId: product.productId,
			barcode: '1234567890124',
			mrp: 200,
			basePrice: 180,
			status: 'active' as any,
			isDeleted: false
		}
	];
	const saved: Sku[] = [];
	for (const sku of skus) {
		let row = await repo.findOne({ where: { skuName: sku.skuName as string, productId: sku.productId } });
		if (!row) {
			row = await repo.save(repo.create(sku as any));
			console.log(`✅ Inserted SKU: ${sku.skuName}`);
		} else {
			console.log(`⏭️  Skipped SKU (already exists): ${sku.skuName}`);
		}
		saved.push(row as Sku);
	}
	return saved;
}

async function seedCountries(ds: DataSource): Promise<Country[]> {
	const repo = ds.getRepository(Country);
	const countries: Array<Partial<Country>> = [
		{ countryName: 'India', countryCode: 'IN', isActive: true, isDeleted: false }
	];
	const saved: Country[] = [];
	for (const country of countries) {
		let row = await repo.findOne({ where: { countryCode: country.countryCode as string } });
		if (!row) {
			row = await repo.save(repo.create(country as any));
			console.log(`✅ Inserted Country: ${country.countryName}`);
		} else {
			console.log(`⏭️  Skipped Country (already exists): ${country.countryName}`);
		}
		saved.push(row as Country);
	}
	return saved;
}

async function seedStates(ds: DataSource, country: Country): Promise<State[]> {
	const repo = ds.getRepository(State);
	const states: Array<Partial<State>> = [
		{ stateName: 'Delhi', stateCode: 'DL', countryId: country.countryId, isActive: true, isDeleted: false },
		{ stateName: 'Maharashtra', stateCode: 'MH', countryId: country.countryId, isActive: true, isDeleted: false }
	];
	const saved: State[] = [];
	for (const state of states) {
		let row = await repo.findOne({ where: { stateCode: state.stateCode as string } });
		if (!row) {
			row = await repo.save(repo.create(state as any));
			console.log(`✅ Inserted State: ${state.stateName}`);
		} else {
			console.log(`⏭️  Skipped State (already exists): ${state.stateName}`);
		}
		saved.push(row as State);
	}
	return saved;
}

async function seedDistricts(ds: DataSource, state: State): Promise<District[]> {
	const repo = ds.getRepository(District);
	const districts: Array<Partial<District>> = [
		{ districtName: 'Central', stateId: state.stateId, isActive: true, isDeleted: false },
		{ districtName: 'North', stateId: state.stateId, isActive: true, isDeleted: false }
	];
	const saved: District[] = [];
	for (const district of districts) {
		let row = await repo.findOne({ where: { districtName: district.districtName as string, stateId: district.stateId } });
		if (!row) {
			row = await repo.save(repo.create(district as any));
			console.log(`✅ Inserted District: ${district.districtName}`);
		} else {
			console.log(`⏭️  Skipped District (already exists): ${district.districtName}`);
		}
		saved.push(row as District);
	}
	return saved;
}

async function seedPriceBooks(ds: DataSource, user: User, customer: Customer, country: Country, state: State, district: District): Promise<PriceBook[]> {
	const repo = ds.getRepository(PriceBook);
	const priceBooks: Array<Partial<PriceBook>> = [
		{
			priceBookCode: 'PB001',
			priceBookName: 'Standard Trade Price Book',
			priceBookType: PriceBookType.TRADE,
			Channel: Channel.GT,
			currency: CurrencyType.INR,
			priority: PriorityType.MEDIUM,
			effectiveFrom: new Date(),
			effectiveTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
			version: 1,
			status: PriceBookStatus.ACTIVE,
			approvalStatus: ApprovalStatus.APPROVED,
			createdBy: user.emp_id,
			isDeleted: false
		},
		{
			priceBookCode: 'PB002',
			priceBookName: 'MRP Price Book',
			priceBookType: PriceBookType.MRP,
			Channel: Channel.MT,
			currency: CurrencyType.INR,
			priority: PriorityType.HIGH,
			effectiveFrom: new Date(),
			effectiveTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
			version: 1,
			status: PriceBookStatus.DRAFT,
			approvalStatus: ApprovalStatus.PENDING,
			createdBy: user.emp_id,
			isDeleted: false
		}
	];
	const saved: PriceBook[] = [];
	for (const pb of priceBooks) {
		let row = await repo.findOne({ where: { priceBookCode: pb.priceBookCode as string } });
		if (!row) {
			row = await repo.save(repo.create(pb as any));
			console.log(`✅ Inserted PriceBook: ${pb.priceBookCode} - ${pb.priceBookName}`);
		} else {
			console.log(`⏭️  Skipped PriceBook (already exists): ${pb.priceBookCode} - ${pb.priceBookName}`);
		}
		saved.push(row as PriceBook);
	}
	return saved;
}

async function seedPriceBookItems(ds: DataSource, priceBook: PriceBook, sku: Sku): Promise<void> {
	const repo = ds.getRepository(PriceBookItem);
	const items = [
		{
			priceBookId: priceBook.priceBookId,
			skuId: sku.skuId,
			itemType: ItemType.SKU,
			uom: UOM.PC,
			basePrice: 90,
			minPrice: 85,
			maxPrice: 95,
			allowDiscount: true,
			maxDiscountPct: 10,
			slabFromQty: 1,
			slabToQty: 100,
			taxInclusive: TaxInclusive.EXCLUSIVE,
			status: StatusEnum.ACTIVE,
			isDeleted: false
		},
		{
			priceBookId: priceBook.priceBookId,
			skuId: sku.skuId,
			itemType: ItemType.SKU,
			uom: UOM.CASE,
			basePrice: 900,
			minPrice: 850,
			maxPrice: 950,
			allowDiscount: true,
			maxDiscountPct: 15,
			slabFromQty: 10,
			slabToQty: 50,
			taxInclusive: TaxInclusive.EXCLUSIVE,
			status: StatusEnum.ACTIVE,
			isDeleted: false
		}
	];
	for (const item of items) {
		await upsertIfMissing(repo, { priceBookId: item.priceBookId, skuId: item.skuId, uom: item.uom }, item, `PriceBookItem (PB:${item.priceBookId}, SKU:${item.skuId}, UOM:${item.uom})`);
	}
}

async function seedShippingAddresses(ds: DataSource, customer: Customer, country: Country, state: State, district: District): Promise<void> {
	const repo = ds.getRepository(ItemShippingAddress);
	const addresses = [
		{
			customerId: customer.customerId,
			shippingCountryId: country.countryId,
			shippingStateId: state.stateId,
			shippingDistrictId: district.districtId,
			shippingStreet: '456 Shipping St',
			shippingCity: 'New Delhi',
			shippingPinCode: '110002',
			deliveryTimeSlot: '10:00-18:00',
			preferredDays: PreferredDays.MONDAY,
			receiverName: 'John Doe',
			receiverContactNo: '9876543210',
			isDeleted: false
		},
		{
			customerId: customer.customerId,
			shippingCountryId: country.countryId,
			shippingStateId: state.stateId,
			shippingDistrictId: district.districtId,
			shippingStreet: '789 Warehouse St',
			shippingCity: 'New Delhi',
			shippingPinCode: '110003',
			deliveryTimeSlot: '09:00-17:00',
			preferredDays: PreferredDays.WEDNESDAY,
			receiverName: 'Jane Smith',
			receiverContactNo: '9876543211',
			isDeleted: false
		}
	];
	for (const address of addresses) {
		await upsertIfMissing(repo, { customerId: address.customerId, shippingStreet: address.shippingStreet }, address, `ShippingAddress (${address.shippingStreet})`);
	}
}

/**
 * Seed only new entities (PriceBook, PriceBookItem, ItemShippingAddress)
 * This can be run independently even if other data exists
 */
async function seedNewEntitiesOnly(ds: DataSource): Promise<void> {
	console.log('\n📦 Seeding NEW entities only: PriceBook, PriceBookItem, ItemShippingAddress...');
	
	// Get existing data (users, products) - required dependencies
	const users = await ds.getRepository(User).find({ take: 1 });
	if (users.length === 0) {
		console.error('❌ Error: No users found. Please run full seed first or seed users.');
		return;
	}
	const owner = users[0];
	
	const products = await ds.getRepository(Products).find({ take: 1 });
	if (products.length === 0) {
		console.error('❌ Error: No products found. Please run full seed first or seed products.');
		return;
	}
	const product = products[0];
	
	// Geography data for PriceBook and ShippingAddress
	console.log('🌍 Seeding geography data (Country, State, District)...');
	const countries = await seedCountries(ds);
	const country = countries[0];
	const states = await seedStates(ds, country);
	const state = states[0];
	const districts = await seedDistricts(ds, state);
	const district = districts[0];

	// Customers and SKUs for PriceBook
	console.log('👥 Seeding Customers and SKUs...');
	const customers = await seedCustomers(ds, owner);
	const customer = customers[0];
	const skus = await seedSkus(ds, product);
	const sku = skus[0];

	// PriceBook and related entities
	console.log('📚 Seeding PriceBooks...');
	const priceBooks = await seedPriceBooks(ds, owner, customer, country, state, district);
	const priceBook = priceBooks[0];
	
	console.log('📋 Seeding PriceBookItems...');
	await seedPriceBookItems(ds, priceBook, sku);
	
	console.log('🚚 Seeding ShippingAddresses...');
	await seedShippingAddresses(ds, customer, country, state, district);
	
	console.log('✅ New entities seeding completed!\n');
}

async function main(): Promise<void> {
	console.log('Starting database seed...');
	console.log('📋 This script will check each table and insert data only if table is empty.\n');
	const ds = await DbConnections.AppDbConnection.initialize();
	try {
		// Check if we should seed only new entities
		const seedNewOnly = String(process.env.SEED_NEW_ONLY || '').toLowerCase() === 'true';
		if (seedNewOnly) {
			await seedNewEntitiesOnly(ds);
			return;
		}
		
		// Check if FORCE_SEED is enabled (will reseed even if data exists)
		const forceSeed = String(process.env.FORCE_SEED || '').toLowerCase() === 'true';
		if (forceSeed) {
			console.log('⚠️  FORCE_SEED=true: Will check and insert data for all tables (may skip if already exists).\n');
		} else {
			console.log('ℹ️  Running in safe mode: Each table will be checked individually.\n');
		}

		// Lookup / config tables - check each individually
		await seedIfTableEmpty(ds.getRepository(Status), 'Status', () => seedStatuses(ds));
		await seedIfTableEmpty(ds.getRepository(UserTypes), 'UserTypes', () => seedUserTypes(ds));
		await seedIfTableEmpty(ds.getRepository(Role), 'Role', () => seedRoles(ds));
		await seedIfTableEmpty(ds.getRepository(PaymentMode), 'PaymentMode', () => seedPaymentModes(ds));
		await seedIfTableEmpty(ds.getRepository(Colour), 'Colour', () => seedColours(ds));
		await seedIfTableEmpty(ds.getRepository(Size), 'Size', () => seedSizes(ds));
		await seedIfTableEmpty(ds.getRepository(Feature), 'Feature', () => seedFeatures(ds));
		await seedIfTableEmpty(ds.getRepository(Reason), 'Reason', () => seedReasons(ds));
		await seedIfTableEmpty(ds.getRepository(ActivityRelTo), 'ActivityRelTo', () => seedActivityConfigs(ds));

		// Hierarchical catalog data - need to get results for dependencies
		let storeCategories: StoreCategory[] = [];
		if (!(await tableHasData(ds.getRepository(StoreCategory)))) {
			storeCategories = await seedStoreCategories(ds);
		} else {
			console.log('⏭️  Skipped StoreCategory (table already has data)');
			storeCategories = await ds.getRepository(StoreCategory).find({ take: 2 });
		}

		let brands: Brand[] = [];
		if (!(await tableHasData(ds.getRepository(Brand)))) {
			brands = await seedBrands(ds);
		} else {
			console.log('⏭️  Skipped Brand (table already has data)');
			brands = await ds.getRepository(Brand).find({ take: 2 });
		}

		let productCategories: ProductCategory[] = [];
		if (!(await tableHasData(ds.getRepository(ProductCategory)))) {
			productCategories = await seedProductCategories(ds);
		} else {
			console.log('⏭️  Skipped ProductCategory (table already has data)');
			productCategories = await ds.getRepository(ProductCategory).find({ take: 2 });
		}

		// Users and org-dependent
		let users: User[] = [];
		if (!(await tableHasData(ds.getRepository(User)))) {
			users = await seedUsers(ds);
		} else {
			console.log('⏭️  Skipped User (table already has data)');
			users = await ds.getRepository(User).find({ take: 2 });
		}
		const owner = users[1] || users[0];
		if (!owner) {
			console.error('❌ Error: No users found. Cannot seed dependent tables.');
		}

		// Stores and products
		let stores: Stores[] = [];
		if (!(await tableHasData(ds.getRepository(Stores)))) {
			stores = await seedStores(ds, users, storeCategories);
		} else {
			console.log('⏭️  Skipped Stores (table already has data)');
			stores = await ds.getRepository(Stores).find({ take: 1 });
		}
		const store = stores[0];

		let products: Products[] = [];
		if (!(await tableHasData(ds.getRepository(Products)))) {
			products = await seedProducts(ds, brands, productCategories);
		} else {
			console.log('⏭️  Skipped Products (table already has data)');
			products = await ds.getRepository(Products).find({ take: 1 });
		}
		const product = products[0];

		// Operational data - check each table
		if (store && product) {
			await seedIfTableEmpty(ds.getRepository(Inventory), 'Inventory', () => seedInventory(ds, store, product));
			await seedIfTableEmpty(ds.getRepository(Beat), 'Beat', () => seedBeat(ds, owner, store));
			await seedIfTableEmpty(ds.getRepository(Activities), 'Activities', () => seedActivities(ds, owner, store, product));
			
			let visit: Visits | undefined;
			if (!(await tableHasData(ds.getRepository(Visits)))) {
				visit = await seedVisits(ds, owner, store);
			} else {
				console.log('⏭️  Skipped Visits (table already has data)');
			}

			let order: Orders | undefined;
			if (!(await tableHasData(ds.getRepository(Orders)))) {
				order = await seedOrders(ds, owner, store, product);
			} else {
				console.log('⏭️  Skipped Orders (table already has data)');
				order = await ds.getRepository(Orders).findOne({ where: {} });
			}

			if (order) {
				await seedIfTableEmpty(ds.getRepository(Payment), 'Payment', () => seedPayments(ds, owner, order!));
				await seedIfTableEmpty(ds.getRepository(Collection), 'Collection', () => seedCollections(ds, order!, store));
				await seedIfTableEmpty(ds.getRepository(CollectAmount), 'CollectAmount', () => seedCollectAmounts(ds, order!));
				await seedIfTableEmpty(ds.getRepository(CollectPayment), 'CollectPayment', () => seedCollectPayments(ds, order!));
			}
		}

		// HR and leave
		await seedIfTableEmpty(ds.getRepository(PolicyHead), 'PolicyHead', () => seedPolicy(ds));
		if (owner) {
			await seedIfTableEmpty(ds.getRepository(LeaveHead), 'LeaveHead', () => seedLeaves(ds, owner));
			await seedIfTableEmpty(ds.getRepository(Holiday), 'Holiday', () => seedHoliday(ds, owner));
		}

		// Competition and market
		let competitor: CompetitorBrand | undefined;
		if (!(await tableHasData(ds.getRepository(CompetitorBrand)))) {
			competitor = await seedCompetitorBrand(ds);
		} else {
			console.log('⏭️  Skipped CompetitorBrand (table already has data)');
			competitor = await ds.getRepository(CompetitorBrand).findOne({ where: {} });
		}

		if (owner && store && product && competitor) {
			await seedIfTableEmpty(ds.getRepository(RCPA), 'RCPA', () => seedRCPAEntry(ds, owner, store, product, competitor!));
		}

		// Learning
		if (owner && product) {
			await seedIfTableEmpty(ds.getRepository(Course), 'Course', () => seedLearning(ds, owner, product));
		}

		// Feedback, samples, gifts
		if (owner && store && product) {
			await seedIfTableEmpty(ds.getRepository(FeedBack), 'FeedBack', () => seedFeedback(ds, owner, store, product));
			await seedIfTableEmpty(ds.getRepository(Samples), 'Samples', () => seedSamples(ds, owner, store, product));
			await seedIfTableEmpty(ds.getRepository(Gifts), 'Gifts', () => seedGifts(ds, owner, store, product));
		}

		// Misc
		if (owner && store) {
			await seedIfTableEmpty(ds.getRepository(Workplace), 'Workplace', () => seedWorkplace(ds, owner, store));
		}
		await seedIfTableEmpty(ds.getRepository(OutletInventory), 'OutletInventory', () => seedOutletInventory(ds));
		if (owner) {
			await seedIfTableEmpty(ds.getRepository(Taxes), 'Taxes', () => seedTaxes(ds, owner));
		}
		await seedIfTableEmpty(ds.getRepository(Edetailing), 'Edetailing', () => seedEdetailing(ds));
		if (owner) {
			await seedIfTableEmpty(ds.getRepository(NewTarget), 'NewTarget', () => seedTargets(ds, owner));
		}
		await seedIfTableEmpty(ds.getRepository(Discount), 'Discount', () => seedDiscounts(ds));
		await seedIfTableEmpty(ds.getRepository(Distributor), 'Distributor', () => seedDistributors(ds));

		// ============================================
		// NEW ENTITIES: PriceBook, PriceBookItem, ItemShippingAddress
		// ============================================
		console.log('\n📦 Checking new entities: PriceBook, PriceBookItem, ItemShippingAddress...');
		
		// Check and seed PriceBook dependencies first
		let countries: Country[] = [];
		if (!(await tableHasData(ds.getRepository(Country)))) {
			countries = await seedCountries(ds);
		} else {
			console.log('⏭️  Skipped Country (table already has data)');
			countries = await ds.getRepository(Country).find({ take: 1 });
		}
		const country = countries.length > 0 ? countries[0] : undefined;
		if (!country) {
			console.error('❌ Error: No country found. Seeding Country...');
			countries = await seedCountries(ds);
			if (countries.length > 0) {
				console.log('✅ Country seeded successfully');
			}
		}

		let states: State[] = [];
		if (country) {
			if (!(await tableHasData(ds.getRepository(State)))) {
				states = await seedStates(ds, country);
			} else {
				console.log('⏭️  Skipped State (table already has data)');
				states = await ds.getRepository(State).find({ take: 1 });
			}
		}
		const state = states.length > 0 ? states[0] : undefined;
		if (!state && country) {
			console.error('❌ Error: No state found. Seeding State...');
			states = await seedStates(ds, country);
			if (states.length > 0) {
				console.log('✅ State seeded successfully');
			}
		}

		let districts: District[] = [];
		if (state) {
			if (!(await tableHasData(ds.getRepository(District)))) {
				districts = await seedDistricts(ds, state);
			} else {
				console.log('⏭️  Skipped District (table already has data)');
				districts = await ds.getRepository(District).find({ take: 1 });
			}
		}
		const district = districts.length > 0 ? districts[0] : undefined;
		if (!district && state) {
			console.error('❌ Error: No district found. Seeding District...');
			districts = await seedDistricts(ds, state);
			if (districts.length > 0) {
				console.log('✅ District seeded successfully');
			}
		}

		// Check and seed Customers
		let customers: Customer[] = [];
		if (!owner) {
			console.error('❌ Error: Owner (User) is required for Customer seeding');
		} else {
			if (!(await tableHasData(ds.getRepository(Customer)))) {
				customers = await seedCustomers(ds, owner);
			} else {
				console.log('⏭️  Skipped Customer (table already has data)');
				customers = await ds.getRepository(Customer).find({ take: 1 });
			}
		}
		const customer = customers.length > 0 ? customers[0] : undefined;
		if (!customer && owner) {
			console.error('❌ Error: No customer found. Seeding Customer...');
			customers = await seedCustomers(ds, owner);
			if (customers.length > 0) {
				console.log('✅ Customer seeded successfully');
			}
		}

		// Check and seed SKUs
		let skus: Sku[] = [];
		if (!product) {
			console.error('❌ Error: Product is required for SKU seeding');
		} else {
			if (!(await tableHasData(ds.getRepository(Sku)))) {
				skus = await seedSkus(ds, product);
			} else {
				console.log('⏭️  Skipped Sku (table already has data)');
				skus = await ds.getRepository(Sku).find({ take: 1 });
			}
		}
		const sku = skus.length > 0 ? skus[0] : undefined;
		if (!sku && product) {
			console.error('❌ Error: No SKU found. Seeding SKU...');
			skus = await seedSkus(ds, product);
			if (skus.length > 0) {
				console.log('✅ SKU seeded successfully');
			}
		}

		// Check PriceBook
		let priceBooks: PriceBook[] = [];
		if (!owner) {
			console.error('❌ Cannot seed PriceBook: Owner (User) is missing');
		} else if (!customer) {
			console.error('❌ Cannot seed PriceBook: Customer is missing');
		} else if (!country) {
			console.error('❌ Cannot seed PriceBook: Country is missing');
		} else if (!state) {
			console.error('❌ Cannot seed PriceBook: State is missing');
		} else if (!district) {
			console.error('❌ Cannot seed PriceBook: District is missing');
		} else {
			if (!(await tableHasData(ds.getRepository(PriceBook)))) {
				console.log('📝 Seeding PriceBook...');
				priceBooks = await seedPriceBooks(ds, owner, customer, country, state, district);
				console.log('✅ Completed seeding PriceBook');
			} else {
				console.log('⏭️  Skipped PriceBook (table already has data)');
				priceBooks = await ds.getRepository(PriceBook).find({ take: 1 });
			}
		}
		const priceBook = priceBooks[0];

		// Check PriceBookItem
		if (!priceBook) {
			console.error('❌ Cannot seed PriceBookItem: PriceBook is missing');
		} else if (!sku) {
			console.error('❌ Cannot seed PriceBookItem: SKU is missing');
		} else {
			await seedIfTableEmpty(ds.getRepository(PriceBookItem), 'PriceBookItem', () => 
				seedPriceBookItems(ds, priceBook, sku)
			);
		}

		// Check ItemShippingAddress
		if (!customer) {
			console.error('❌ Cannot seed ItemShippingAddress: Customer is missing');
		} else if (!country) {
			console.error('❌ Cannot seed ItemShippingAddress: Country is missing');
		} else if (!state) {
			console.error('❌ Cannot seed ItemShippingAddress: State is missing');
		} else if (!district) {
			console.error('❌ Cannot seed ItemShippingAddress: District is missing');
		} else {
			await seedIfTableEmpty(ds.getRepository(ItemShippingAddress), 'ItemShippingAddress', () => 
				seedShippingAddresses(ds, customer, country, state, district)
			);
		}
		
		console.log('\n🎉 Seeding completed successfully.');
	} catch (err) {
		console.error('Seeding failed:', err);
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
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();


