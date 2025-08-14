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
import { UserRole, CallType, OrderStatus, PaymentStatus, StockLevelComparison, ExpenseReportClaimType, HolidayType, WorkplaceTypeEnum } from '../core/types/Constent/common';

type AnyRecord = Record<string, unknown>;

async function upsertIfMissing<T extends ObjectLiteral>(repo: Repository<T>, findCriteria: AnyRecord, data: AnyRecord): Promise<void> {
	const existing = await repo.findOne({ where: findCriteria as any });
	if (!existing) {
		await repo.save(repo.create(data as any));
	}
}

async function seedStatuses(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(Status);
	const items = [
		{ status_code: 'ACTIVE', status_name: 'Active', status: true },
		{ status_code: 'INACTIVE', status_name: 'Inactive', status: true },
		{ status_code: 'DELETED', status_name: 'Deleted', status: true }
	];
	for (const item of items) {
		await upsertIfMissing(repo, { status_code: item.status_code }, item);
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
		await upsertIfMissing(repo, { userTypeCode: item.userTypeCode }, item);
	}
}

async function seedRoles(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(Role);
	const items = [
		{ key: 'ADMIN', name: 'Administrator', empId: 0, isActive: true, isDeleted: false },
		{ key: 'MANAGER', name: 'Manager', empId: 0, isActive: true, isDeleted: false },
		{ key: 'USER', name: 'User', empId: 0, isActive: true, isDeleted: false }
	];
	for (const item of items) {
		await upsertIfMissing(repo, { key: item.key }, item);
	}
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
		await upsertIfMissing(repo, { name: item.name }, item);
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
		await upsertIfMissing(repo, { name: item.name }, item);
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
		await upsertIfMissing(repo, { name: item.name }, item);
	}
}

async function seedFeatures(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(Feature);
	const items = [
		{ key: 'REPORTS', name: 'Reports', empId: 0, isActive: true, isDeleted: false },
		{ key: 'ORDERS', name: 'Orders', empId: 0, isActive: true, isDeleted: false }
	];
	for (const item of items) {
		await upsertIfMissing(repo, { key: item.key }, item);
	}
}

async function seedReasons(ds: DataSource): Promise<void> {
	const repo = ds.getRepository(Reason);
	const items = [
		{ description: 'Store closed', empId: 0, isDeleted: false },
		{ description: 'Owner not available', empId: 0, isDeleted: false }
	];
	for (const item of items) {
		await upsertIfMissing(repo, { description: item.description }, item);
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
        if (!row) row = await repo.save(repo.create(item as any));
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
        if (!row) row = await repo.save(repo.create(item as any));
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
        if (!row) row = await repo.save(repo.create(item as any));
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
        if (!row) row = await repo.save(repo.create(u as any));
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
        if (!row) row = await repo.save(repo.create(item as any));
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
        if (!row) row = await repo.save(repo.create(item as any));
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
	});
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
	await upsertIfMissing(repo, { taxName: 'GST 18%' }, {
		taxName: 'GST 18%', taxAmount: 18, description: 'Goods and Services Tax', addedBy: user.emp_id, status: true
	});
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

async function main(): Promise<void> {
	console.log('Starting database seed...');
	const ds = await DbConnections.AppDbConnection.initialize();
	try {
		// Global guard: skip seeding if data already exists unless FORCE_SEED=true
		const forceSeed = String(process.env.FORCE_SEED || '').toLowerCase() === 'true';
		const existingUsers = await ds.getRepository(User).count();
		if (!forceSeed && existingUsers > 0) {
			console.log('Seed skipped: existing data detected (users > 0). Set FORCE_SEED=true to override.');
			return;
		}

		// Lookup / config
		await seedStatuses(ds);
		await seedUserTypes(ds);
		await seedRoles(ds);
		await seedPaymentModes(ds);
		await seedColours(ds);
		await seedSizes(ds);
		await seedFeatures(ds);
		await seedReasons(ds);
		await seedActivityConfigs(ds);

		// Hierarchical catalog data
		const storeCategories = await seedStoreCategories(ds);
		const brands = await seedBrands(ds);
		const productCategories = await seedProductCategories(ds);

		// Users and org-dependent
		const users = await seedUsers(ds);
		const owner = users[1] || users[0];

		// Stores and products
		const stores = await seedStores(ds, users, storeCategories);
		const store = stores[0];
		const products = await seedProducts(ds, brands, productCategories);
		const product = products[0];

		// Operational data
		await seedInventory(ds, store, product);
		await seedBeat(ds, owner, store);
		await seedActivities(ds, owner, store, product);
		const visit = await seedVisits(ds, owner, store);
		const order = await seedOrders(ds, owner, store, product);
		await seedPayments(ds, owner, order);
		await seedCollections(ds, order, store);
		await seedCollectAmounts(ds, order);
		await seedCollectPayments(ds, order);

		// HR and leave
		await seedPolicy(ds);
		await seedLeaves(ds, owner);
		await seedHoliday(ds, owner);

		// Competition and market
		const competitor = await seedCompetitorBrand(ds);
		await seedRCPAEntry(ds, owner, store, product, competitor);

		// Learning
		await seedLearning(ds, owner, product);

		// Feedback, samples, gifts
		await seedFeedback(ds, owner, store, product);
		await seedSamples(ds, owner, store, product);
		await seedGifts(ds, owner, store, product);

		// Misc
		await seedWorkplace(ds, owner, store);
		await seedOutletInventory(ds);
		await seedTaxes(ds, owner);
		await seedEdetailing(ds);
		await seedTargets(ds, owner);
		await seedDiscounts(ds);
		await seedDistributors(ds);
		console.log('Seeding completed successfully.');
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


