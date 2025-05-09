"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileService = void 0;
const common_1 = require("../../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../../core/DB/Entities/User.entity");
const typeorm_1 = require("typeorm");
const attendance_entity_1 = require("../../../../../core/DB/Entities/attendance.entity");
const date_fns_1 = require("date-fns");
const stores_entity_1 = require("../../../../../core/DB/Entities/stores.entity");
const orders_entity_1 = require("../../../../../core/DB/Entities/orders.entity");
const Visit_entity_1 = require("../../../../../core/DB/Entities/Visit.entity");
const target_entity_1 = require("../../../../../core/DB/Entities/target.entity");
const products_entity_1 = require("../../../../../core/DB/Entities/products.entity");
const scheme_entity_1 = require("../../../../../core/DB/Entities/scheme.entity");
const beat_entity_1 = require("../../../../../core/DB/Entities/beat.entity");
class ProfileController {
    constructor() {
        this.getUserRepositry = (0, User_entity_1.UserRepository)();
        this.getAttendanceRepositry = (0, attendance_entity_1.AttendanceRepository)();
        this.getStoreRepositry = (0, stores_entity_1.StoreRepository)();
        this.getOrderRepositry = (0, orders_entity_1.OrdersRepository)();
        this.getVisitRepository = (0, Visit_entity_1.VisitRepository)();
        this.getTargetRepository = (0, target_entity_1.TargetRepository)();
        this.getProductRepository = (0, products_entity_1.ProductRepository)();
        this.getSchemeRepo = (0, scheme_entity_1.getSchemeRepository)();
        this.beatRespositry = (0, beat_entity_1.BeatRepository)();
    }
    getProfile(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const user = yield this.getUserRepositry.findOne({ where: { emp_id } });
                if (!user) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
                }
                let manager = null;
                if (user.managerId) {
                    manager = yield this.getUserRepositry.findOne({ where: { emp_id: user.managerId } });
                }
                // console.log({user, manager})
                // if (!manager) {
                //     return { status: STATUSCODES.NOT_FOUND, message: "Manager Data Not Found." };
                // }
                const mdata = { firstname: "", lastname: "" };
                return { status: common_1.STATUSCODES.SUCCESS, message: "Success.", data: yield this.profileTransformer(user, manager || mdata) };
            }
            catch (error) {
                throw error;
            }
        });
    }
    profileTransformer(user, manager) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = {
                id: user.emp_id,
                name: `${user.firstname} ${user.lastname}`,
                emailId: user.email,
                contactNumber: user.phone,
                manager: `${manager.firstname || ""} ${manager.lastname || ""}`,
                address: user.address,
                zone: user.zone,
                joiningDate: this.convertTimestamptoDate(user.joining_date),
                isCheckInMarked: yield this.checkInAttendance(user.emp_id),
                isCheckOutMarked: yield this.checkOutAttendance(user.emp_id),
                role: user.role,
                image: user.image
            };
            return profile;
        });
    }
    checkInAttendance(empId) {
        return __awaiter(this, void 0, void 0, function* () {
            const todayStart = (0, date_fns_1.startOfDay)(new Date());
            const todayEnd = (0, date_fns_1.endOfDay)(new Date());
            const attendanceData = yield this.getAttendanceRepositry.findOne({ where: { empId, checkIn: (0, typeorm_1.Between)(todayStart, todayEnd) } });
            if (!attendanceData) {
                return false;
            }
            return true;
        });
    }
    checkOutAttendance(empId) {
        return __awaiter(this, void 0, void 0, function* () {
            const todayStart = (0, date_fns_1.startOfDay)(new Date());
            const todayEnd = (0, date_fns_1.endOfDay)(new Date());
            const attendanceData = yield this.getAttendanceRepositry.findOne({ where: { empId, checkOut: (0, typeorm_1.Between)(todayStart, todayEnd) } });
            if (!attendanceData) {
                return false;
            }
            return true;
        });
    }
    convertTimestamptoDate(date) {
        const inputDate = new Date(date);
        const day = inputDate.getDate().toString().padStart(2, '0');
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = inputDate.getFullYear();
        const formattedDateString = `${day}-${month}-${year}`;
        return formattedDateString;
    }
    updateImage(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const { image, empId } = input;
                yield this.getUserRepositry.createQueryBuilder().update({ image }).where({ emp_id: Number(empId) }).execute();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteProfile(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const { empId } = input;
                yield this.getUserRepositry.createQueryBuilder().update({ image: null }).where({ emp_id: Number(empId) }).execute();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    dashboard(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const today = new Date();
                const currentYear = today.getFullYear();
                const { timePeriod = [common_1.TimelineEnum.YEAR, currentYear] } = input;
                const quarters = {
                    1: {
                        start: new Date(Date.UTC(currentYear, 3, 1)).toISOString(),
                        end: new Date(Date.UTC(currentYear, 5, 30, 23, 59, 59)).toISOString()
                    },
                    2: {
                        start: new Date(Date.UTC(currentYear, 6, 1)).toISOString(),
                        end: new Date(Date.UTC(currentYear, 8, 30, 23, 59, 59)).toISOString()
                    },
                    3: {
                        start: new Date(Date.UTC(currentYear, 9, 1)).toISOString(),
                        end: new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59)).toISOString()
                    },
                    4: {
                        start: new Date(Date.UTC(currentYear + 1, 0, 1)).toISOString(),
                        end: new Date(Date.UTC(currentYear + 1, 2, 31, 23, 59, 59)).toISOString()
                    }
                };
                let startTimeline = null, endTimeline = null;
                let startPreTimeline = null, endPreTimeline = null;
                if (timePeriod[0] === common_1.TimelineEnum.MONTH && timePeriod[1]) {
                    const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
                    const monthIndex = monthNames.indexOf(timePeriod[1].toLowerCase());
                    startTimeline = new Date(Date.UTC(currentYear, monthIndex, 1)).toISOString();
                    endTimeline = new Date(Date.UTC(currentYear, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();
                    if (monthIndex === 0) {
                        startPreTimeline = new Date(Date.UTC(currentYear - 1, 11, 1)).toISOString();
                        endPreTimeline = new Date(Date.UTC(currentYear - 1, 12, 0, 23, 59, 59, 999)).toISOString();
                    }
                    else {
                        startPreTimeline = new Date(Date.UTC(currentYear, monthIndex - 1, 1)).toISOString();
                        endPreTimeline = new Date(Date.UTC(currentYear, monthIndex, 0, 23, 59, 59, 999)).toISOString();
                    }
                }
                else if (timePeriod[0] === common_1.TimelineEnum.YEAR && timePeriod[1]) {
                    startTimeline = new Date(Date.UTC(timePeriod[1], 0, 1)).toISOString();
                    endTimeline = new Date(Date.UTC(timePeriod[1], 11, 31, 23, 59, 59, 999)).toISOString();
                    startPreTimeline = new Date(Date.UTC(timePeriod[1] - 1, 0, 1)).toISOString();
                    endPreTimeline = new Date(Date.UTC(timePeriod[1] - 1, 11, 31, 23, 59, 59, 999)).toISOString();
                }
                else if (timePeriod[0] === common_1.TimelineEnum.QUARTER && timePeriod[1]) {
                    const selectedQuarter = quarters[timePeriod[1].toUpperCase().replace("Q", "")];
                    startTimeline = selectedQuarter.start;
                    endTimeline = selectedQuarter.end;
                    if (timePeriod[1] === "Q4") {
                        startPreTimeline = new Date(Date.UTC(currentYear, 9, 1)).toISOString(),
                            endPreTimeline = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59)).toISOString();
                    }
                    else if (timePeriod[1] === "Q1") {
                        startPreTimeline = new Date(Date.UTC(currentYear, 0, 1)).toISOString(),
                            endPreTimeline = new Date(Date.UTC(currentYear, 2, 31, 23, 59, 59)).toISOString();
                    }
                    else {
                        const selectedPreQuarter = quarters[timePeriod[1].toUpperCase().replace("Q", "") - 1];
                        startPreTimeline = selectedPreQuarter.start;
                        endPreTimeline = selectedPreQuarter.end;
                    }
                }
                const targetQueryBuilder = this.getTargetRepository.createQueryBuilder('target')
                    .select(['target.emp_id',
                    'SUM(target.store_target) AS total_store_target',
                    'SUM(target.amount_target) AS total_amount_target'
                ])
                    .andWhere('target.emp_id = :emp_id', { emp_id })
                    .andWhere('target.is_active = :isActive', { isActive: true })
                    .andWhere('target.is_deleted = :isDeleted', { isDeleted: false })
                    .groupBy("target.emp_id");
                if (timePeriod.length > 0 && startTimeline && endTimeline) {
                    targetQueryBuilder.andWhere('target.month >= :startDate', { startDate: startTimeline })
                        .andWhere('target.month <= :endDate', { endDate: endTimeline });
                }
                const currentMonthTarget = yield targetQueryBuilder.getRawOne();
                if (currentMonthTarget && currentMonthTarget.total_store_target !== null && currentMonthTarget.total_amount_target !== null) {
                    const storeTarget = +currentMonthTarget.total_store_target; // Convert to number
                    const valueTarget = +currentMonthTarget.total_amount_target; // Convert to number
                    yield this.getUserRepositry.createQueryBuilder()
                        .update({ storeTarget, valueTarget })
                        .where({ emp_id })
                        .execute();
                }
                else {
                    console.error("Invalid or missing data in currentMonthTarget.");
                }
                let fitlerQuery = [];
                const storesIds = yield this.beatRespositry.createQueryBuilder("beat")
                    .where("beat.empId = :empId", { empId: emp_id })
                    .select("beat.store")
                    .getMany();
                if (storesIds.length > 0) {
                    fitlerQuery = storesIds;
                }
                const storeIds = fitlerQuery.map((beat) => beat.store).flat();
                const ordersQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("SUM(orders.orderAmount)", "totalAmount")
                    .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                    .leftJoin("orders.user", "user")
                    .addSelect("user.valueTarget", "valueTarget")
                    .addSelect("user.storeTarget", "storeTarget")
                    .where("orders.storeId IN (:...storeIds)", { storeIds: storeIds })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] })
                    .groupBy("orders.empId")
                    .addGroupBy("user.valueTarget")
                    .addGroupBy('user.storeTarget');
                // Conditionally add date range filter for orders
                if (timePeriod.length > 0 && startTimeline && endTimeline) {
                    ordersQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startTimeline })
                        .andWhere('orders.createdAt <= :endDate', { endDate: endTimeline });
                }
                const orders = yield ordersQueryBuilder.getRawOne();
                //--------------------------------------------------------------------------------------------------
                const preOrdersQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("SUM(orders.orderAmount)", "totalAmount")
                    .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                    .where("orders.storeId IN (:...storeIds)", { storeIds: storeIds })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] })
                    .groupBy("orders.empId");
                // Conditionally add date range filter for orders
                if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                    preOrdersQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startPreTimeline })
                        .andWhere('orders.createdAt <= :endDate', { endDate: endPreTimeline });
                }
                const preSales = yield preOrdersQueryBuilder.getRawOne();
                // ============================================================================
                const storesQueryBuilder = this.getStoreRepositry.createQueryBuilder('stores')
                    .select("COUNT(stores.storeId)", "totalStoreCount") // Total count
                    .where("stores.storeId IN (:...storeIds)", { storeIds: storeIds });
                if (timePeriod.length > 0 && startTimeline && endTimeline) {
                    storesQueryBuilder.andWhere('stores.createdAt >= :startDate', { startDate: startTimeline })
                        .andWhere('stores.createdAt <= :endDate', { endDate: endTimeline });
                }
                const stores = yield storesQueryBuilder.getRawOne();
                // ===============================================================================================
                let orderCountQueryBuilder = yield this.getOrderRepositry.createQueryBuilder('orders')
                    .select("COUNT(orders.orderId)", "totalOrderCount")
                    .where("orders.storeId IN (:...storeIds)", { storeIds: storeIds })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] });
                if (timePeriod.length > 0 && startTimeline && endTimeline) {
                    orderCountQueryBuilder.andWhere("orders.createdAt >= :startDate", { startDate: startTimeline })
                        .andWhere("orders.createdAt <= :endDate", { endDate: endTimeline });
                }
                let currOrderCount = yield orderCountQueryBuilder.getCount();
                // ---------------------------------------------------------------------------------------------
                let preOrderCountQueryBuilder = yield this.getOrderRepositry.createQueryBuilder('orders')
                    .select("COUNT(orders.orderId)", "totalOrderCount")
                    .where("orders.storeId IN (:...storeIds)", { storeIds: storeIds })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] });
                if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                    preOrderCountQueryBuilder.andWhere("orders.createdAt >= :startDate", { startDate: startPreTimeline })
                        .andWhere("orders.createdAt <= :endDate", { endDate: endPreTimeline });
                }
                let preOrderCount = yield preOrderCountQueryBuilder.getCount();
                // ===========================================================================================
                let currStoreCount = (yield this.getStoreRepositry.find({ where: { storeId: (0, typeorm_1.In)(storeIds), createdAt: (0, typeorm_1.Between)(startTimeline, endTimeline) } })).length;
                let preStoreCount = (yield this.getStoreRepositry.find({ where: { storeId: (0, typeorm_1.In)(storeIds), createdAt: (0, typeorm_1.Between)(startPreTimeline, endPreTimeline) } })).length;
                const orderSubquery = this.getOrderRepositry.createQueryBuilder("orders")
                    .select("orders.storeId", "storeId")
                    // .where("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
                    .getQuery();
                let unBilledStoreCount = (yield this.getStoreRepositry.createQueryBuilder('stores')
                    .leftJoinAndSelect("stores.storeCat", "storeCat")
                    .where("stores.storeId IN (:...storeIds)", { storeIds: storeIds })
                    .andWhere(`stores.storeId NOT IN (${orderSubquery})`)
                    .getMany()).length;
                const todayVisitCount = yield this.getVisitRepository.count({
                    where: {
                        visitDate: (0, typeorm_1.Between)((0, date_fns_1.startOfDay)(new Date()), (0, date_fns_1.endOfDay)(new Date()))
                    }
                });
                const focusedProductCount = yield this.getProductRepository.count({
                    where: { isFocused: true }
                });
                const currTargetQueryBuilder = this.getTargetRepository.createQueryBuilder('target')
                    .select([
                    'target'
                ])
                    .where('target.empId = :empId', { empId: emp_id })
                    .andWhere('target.is_active = :isActive', { isActive: true })
                    .andWhere('target.createdAt >= :startDate', { startDate: startTimeline })
                    .andWhere('target.createdAt <= :endDate', { endDate: endTimeline });
                const currTarget = yield currTargetQueryBuilder.getMany();
                const targets = currTarget.map((data) => data.target);
                const allTargets = targets.flat(); // Assuming targets is an array of arrays
                const totalStoreTarget = allTargets.reduce((acc, item) => acc + Number((item === null || item === void 0 ? void 0 : item.storeTarget) || 0), 0);
                const totalCollectionTarget = allTargets.reduce((acc, item) => acc + Number((item === null || item === void 0 ? void 0 : item.collectionTarget) || 0), 0);
                const totalOrderTarget = allTargets.reduce((acc, item) => acc + Number((item === null || item === void 0 ? void 0 : item.orderTarget) || 0), 0);
                //  SKU
                let topSKUQueryBuilder = yield this.getOrderRepositry.createQueryBuilder("orders")
                    .select("unnested.product->>'productName' AS productName")
                    .addSelect("brand.name AS brandName")
                    .addSelect("SUM(CAST(unnested.product->>'rlp' AS NUMERIC) * (COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0)))) AS total_sales")
                    .leftJoin(qb => qb
                    .select("jsonb_array_elements(orders.products::jsonb) AS product")
                    .from("orders", "orders"), "unnested", "true")
                    .leftJoin("Brand", "brand", "CAST(unnested.product->>'brandId' AS INTEGER) = brand.brandId").where('orders.empId = :empId', { empId: emp_id })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED });
                // if (role === UserRole.RSM) {
                //     topSKUQueryBuilder = topSKUQueryBuilder.where("orders.empId IN (:...empIds)", { empIds })
                // }
                let topSKU = yield topSKUQueryBuilder.groupBy("unnested.product->>'productName'")
                    .addGroupBy("brand.name")
                    .orderBy("total_sales", "DESC")
                    .limit(5)
                    .getRawMany();
                // ---------------------------------------- Bottom SKU--------------------------------------------
                let bottomSKUQueryBuilder = yield this.getOrderRepositry.createQueryBuilder("orders")
                    .select("unnested.product->>'productName' AS productName")
                    .addSelect("brand.name AS brandName")
                    .addSelect("SUM(CAST(unnested.product->>'rlp' AS NUMERIC) * (COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0)))) AS total_sales")
                    .leftJoin(qb => qb
                    .select("jsonb_array_elements(orders.products::jsonb) AS product")
                    .from("orders", "orders"), "unnested", "true")
                    .leftJoin("Brand", "brand", "CAST(unnested.product->>'brandId' AS INTEGER) = brand.brandId").where('orders.empId = :empId', { empId: emp_id })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED });
                // if (role === UserRole.RSM) {
                //     bottomSKUQueryBuilder.where("orders.empId IN (:...empIds)", { empIds })
                // }
                let bottomSKU = yield bottomSKUQueryBuilder.groupBy("unnested.product->>'productName'")
                    .addGroupBy("brand.name")
                    .orderBy("total_sales", "ASC")
                    .limit(5)
                    .getRawMany();
                // order count with pending payment
                let orderCountWithPayment = yield this.getOrderRepositry.createQueryBuilder('orders')
                    .select("COUNT(orders.orderId)", "totalOrderCount")
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: common_1.PaymentStatus.PENDING })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED });
                if (timePeriod.length > 0 && startTimeline && endTimeline) {
                    orderCountWithPayment.andWhere("orders.createdAt >= :startDate", { startDate: startTimeline })
                        .andWhere("orders.createdAt <= :endDate", { endDate: endTimeline });
                }
                let currOrderCountWithPendingPayment = yield orderCountWithPayment.getCount();
                // ---------------------------------------------------------------------------------------------
                let preOrderCountWithPayment = yield this.getOrderRepositry.createQueryBuilder('orders')
                    .select("COUNT(orders.orderId)", "totalOrderCount")
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: common_1.PaymentStatus.PENDING })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED });
                if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                    preOrderCountWithPayment.andWhere("orders.createdAt >= :startDate", { startDate: startPreTimeline })
                        .andWhere("orders.createdAt <= :endDate", { endDate: endPreTimeline });
                }
                let preOrderCountWithPendingPayment = yield preOrderCountWithPayment.getCount();
                // Order Value Sales
                const ordersPaymentQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("SUM(orders.orderAmount)", "totalAmount")
                    .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                    .leftJoin("orders.user", "user")
                    .addSelect("user.valueTarget", "valueTarget")
                    .addSelect("user.storeTarget", "storeTarget")
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: common_1.PaymentStatus.PENDING })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED })
                    .groupBy("orders.empId")
                    .addGroupBy("user.valueTarget")
                    .addGroupBy('user.storeTarget');
                // Conditionally add date range filter for orders
                if (timePeriod.length > 0 && startTimeline && endTimeline) {
                    ordersPaymentQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startTimeline })
                        .andWhere('orders.createdAt <= :endDate', { endDate: endTimeline });
                }
                const ordersWithPendingPayment = yield ordersPaymentQueryBuilder.getRawOne();
                //--------------------------------------------------------------------------------------------------
                const preOrdersPaymentQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("SUM(orders.orderAmount)", "totalAmount")
                    .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: common_1.PaymentStatus.PENDING })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED })
                    .groupBy("orders.empId");
                // Conditionally add date range filter for orders
                if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                    preOrdersPaymentQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startPreTimeline })
                        .andWhere('orders.createdAt <= :endDate', { endDate: endPreTimeline });
                }
                const preSalesWithPendingPayment = yield preOrdersPaymentQueryBuilder.getRawOne();
                const reponse = {
                    valueTarget: {
                        target: totalOrderTarget ? +totalOrderTarget : 0,
                        achieved: orders ? +orders.totalAmount : 0
                    },
                    storeTarget: {
                        target: totalStoreTarget ? +totalStoreTarget : 0,
                        achieved: stores ? +stores.totalStoreCount : 0
                    },
                    collectionTarget: {
                        target: totalCollectionTarget ? +totalCollectionTarget : 0,
                        achieved: orders ? +orders.totalCollectedAmount : 0
                    },
                    orderVsCollection: {
                        ordered: orders ? +orders.totalAmount : 0,
                        collected: orders ? +orders.totalCollectedAmount : 0
                    },
                    sales: {
                        currSales: orders ? +orders.totalAmount : 0,
                        preSales: preSales ? +preSales.totalAmount : 0
                    },
                    collection: {
                        currCollection: orders ? +orders.totalCollectedAmount : 0,
                        preCollection: preSales ? +preSales.totalCollectedAmount : 0
                    },
                    orderCount: {
                        currOrderCount: currOrderCount !== null && currOrderCount !== void 0 ? currOrderCount : 0,
                        preOrderCount: preOrderCount !== null && preOrderCount !== void 0 ? preOrderCount : 0
                    },
                    storeCount: {
                        currStoreCount: currStoreCount !== null && currStoreCount !== void 0 ? currStoreCount : 0,
                        preStoreCount: preStoreCount !== null && preStoreCount !== void 0 ? preStoreCount : 0
                    },
                    // monthWiseStoreCount: formattedResults,
                    newStoreCount: currStoreCount ? currStoreCount : 0,
                    unBilledStoreCount: unBilledStoreCount ? unBilledStoreCount : 0,
                    todayVisitCount: todayVisitCount,
                    focusedProductCount: focusedProductCount !== null && focusedProductCount !== void 0 ? focusedProductCount : 0,
                    // bottomSKU,
                    // topSKU,
                    orderCountWithpayment: {
                        currOrderCountWithPendingPayment: currOrderCountWithPendingPayment !== null && currOrderCountWithPendingPayment !== void 0 ? currOrderCountWithPendingPayment : 0,
                        preOrderCountWithPendingPayment: preOrderCountWithPendingPayment !== null && preOrderCountWithPendingPayment !== void 0 ? preOrderCountWithPendingPayment : 0
                    },
                    orderValueWithPayment: {
                        ordersWithPendingPayment: ordersWithPendingPayment !== null && ordersWithPendingPayment !== void 0 ? ordersWithPendingPayment : 0,
                        preSalesWithPendingPayment: preSalesWithPendingPayment !== null && preSalesWithPendingPayment !== void 0 ? preSalesWithPendingPayment : 0
                    }
                    // orderCount: orderCount ?? 0
                };
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: reponse };
            }
            catch (error) {
                throw error;
            }
        });
    }
    retailorDashboard(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const today = new Date();
                const currentYear = today.getFullYear();
                const { timePeriod = [common_1.TimelineEnum.YEAR, currentYear] } = input;
                const quarters = {
                    1: {
                        start: new Date(Date.UTC(currentYear, 3, 1)).toISOString(),
                        end: new Date(Date.UTC(currentYear, 5, 30, 23, 59, 59)).toISOString()
                    },
                    2: {
                        start: new Date(Date.UTC(currentYear, 6, 1)).toISOString(),
                        end: new Date(Date.UTC(currentYear, 8, 30, 23, 59, 59)).toISOString()
                    },
                    3: {
                        start: new Date(Date.UTC(currentYear, 9, 1)).toISOString(),
                        end: new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59)).toISOString()
                    },
                    4: {
                        start: new Date(Date.UTC(currentYear + 1, 0, 1)).toISOString(),
                        end: new Date(Date.UTC(currentYear + 1, 2, 31, 23, 59, 59)).toISOString()
                    }
                };
                let startTimeline = null, endTimeline = null;
                let startPreTimeline = null, endPreTimeline = null;
                if (timePeriod[0] === common_1.TimelineEnum.MONTH && timePeriod[1]) {
                    const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
                    const monthIndex = monthNames.indexOf(timePeriod[1].toLowerCase());
                    startTimeline = new Date(Date.UTC(currentYear, monthIndex, 1)).toISOString();
                    endTimeline = new Date(Date.UTC(currentYear, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();
                    if (monthIndex === 0) {
                        startPreTimeline = new Date(Date.UTC(currentYear - 1, 11, 1)).toISOString();
                        endPreTimeline = new Date(Date.UTC(currentYear - 1, 12, 0, 23, 59, 59, 999)).toISOString();
                    }
                    else {
                        startPreTimeline = new Date(Date.UTC(currentYear, monthIndex - 1, 1)).toISOString();
                        endPreTimeline = new Date(Date.UTC(currentYear, monthIndex, 0, 23, 59, 59, 999)).toISOString();
                    }
                }
                else if (timePeriod[0] === common_1.TimelineEnum.YEAR && timePeriod[1]) {
                    startTimeline = new Date(Date.UTC(timePeriod[1], 0, 1)).toISOString();
                    endTimeline = new Date(Date.UTC(timePeriod[1], 11, 31, 23, 59, 59, 999)).toISOString();
                    startPreTimeline = new Date(Date.UTC(timePeriod[1] - 1, 0, 1)).toISOString();
                    endPreTimeline = new Date(Date.UTC(timePeriod[1] - 1, 11, 31, 23, 59, 59, 999)).toISOString();
                }
                else if (timePeriod[0] === common_1.TimelineEnum.QUARTER && timePeriod[1]) {
                    const selectedQuarter = quarters[timePeriod[1].toUpperCase().replace("Q", "")];
                    startTimeline = selectedQuarter.start;
                    endTimeline = selectedQuarter.end;
                    if (timePeriod[1] === "Q4") {
                        startPreTimeline = new Date(Date.UTC(currentYear, 9, 1)).toISOString(),
                            endPreTimeline = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59)).toISOString();
                    }
                    else if (timePeriod[1] === "Q1") {
                        startPreTimeline = new Date(Date.UTC(currentYear, 0, 1)).toISOString(),
                            endPreTimeline = new Date(Date.UTC(currentYear, 2, 31, 23, 59, 59)).toISOString();
                    }
                    else {
                        const selectedPreQuarter = quarters[timePeriod[1].toUpperCase().replace("Q", "") - 1];
                        startPreTimeline = selectedPreQuarter.start;
                        endPreTimeline = selectedPreQuarter.end;
                    }
                }
                const targetQueryBuilder = this.getTargetRepository.createQueryBuilder('target')
                    .select(['target.emp_id',
                    'SUM(target.store_target) AS total_store_target',
                    'SUM(target.amount_target) AS total_amount_target'
                ])
                    .andWhere('target.emp_id = :emp_id', { emp_id })
                    .andWhere('target.is_active = :isActive', { isActive: true })
                    .andWhere('target.is_deleted = :isDeleted', { isDeleted: false })
                    .groupBy("target.emp_id");
                if (timePeriod.length > 0 && startTimeline && endTimeline) {
                    targetQueryBuilder.andWhere('target.month >= :startDate', { startDate: startTimeline })
                        .andWhere('target.month <= :endDate', { endDate: endTimeline });
                }
                const currentMonthTarget = yield targetQueryBuilder.getRawOne();
                if (currentMonthTarget && currentMonthTarget.total_store_target !== null && currentMonthTarget.total_amount_target !== null) {
                    const storeTarget = +currentMonthTarget.total_store_target; // Convert to number
                    const valueTarget = +currentMonthTarget.total_amount_target; // Convert to number
                    yield this.getUserRepositry.createQueryBuilder()
                        .update({ storeTarget, valueTarget })
                        .where({ emp_id })
                        .execute();
                }
                else {
                    console.error("Invalid or missing data in currentMonthTarget.");
                }
                const ordersQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("SUM(orders.netAmount)", "totalAmount")
                    .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                    .leftJoin("orders.user", "user")
                    .addSelect("user.valueTarget", "valueTarget")
                    .addSelect("user.storeTarget", "storeTarget")
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED })
                    .groupBy("orders.empId")
                    .addGroupBy("user.valueTarget")
                    .addGroupBy('user.storeTarget');
                // Conditionally add date range filter for orders
                if (timePeriod.length > 0 && startTimeline && endTimeline) {
                    ordersQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startTimeline })
                        .andWhere('orders.createdAt <= :endDate', { endDate: endTimeline });
                }
                const orders = yield ordersQueryBuilder.getRawOne();
                //--------------------------------------------------------------------------------------------------
                const preOrdersQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("SUM(orders.netAmount)", "totalAmount")
                    .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED })
                    .groupBy("orders.empId");
                // Conditionally add date range filter for orders
                if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                    preOrdersQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startPreTimeline })
                        .andWhere('orders.createdAt <= :endDate', { endDate: endPreTimeline });
                }
                const preSales = yield preOrdersQueryBuilder.getRawOne();
                // ============================================================================
                // ===============================================================================================
                let orderCountQueryBuilder = yield this.getOrderRepositry.createQueryBuilder('orders')
                    .select("COUNT(orders.orderId)", "totalOrderCount")
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED });
                if (timePeriod.length > 0 && startTimeline && endTimeline) {
                    orderCountQueryBuilder.andWhere("orders.createdAt >= :startDate", { startDate: startTimeline })
                        .andWhere("orders.createdAt <= :endDate", { endDate: endTimeline });
                }
                let currOrderCount = yield orderCountQueryBuilder.getCount();
                // ---------------------------------------------------------------------------------------------
                let preOrderCountQueryBuilder = yield this.getOrderRepositry.createQueryBuilder('orders')
                    .select("COUNT(orders.orderId)", "totalOrderCount")
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED });
                if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                    preOrderCountQueryBuilder.andWhere("orders.createdAt >= :startDate", { startDate: startPreTimeline })
                        .andWhere("orders.createdAt <= :endDate", { endDate: endPreTimeline });
                }
                let preOrderCount = yield preOrderCountQueryBuilder.getCount();
                // ===========================================================================================
                const currTargetQueryBuilder = this.getTargetRepository.createQueryBuilder('target')
                    .select([
                    'target'
                ])
                    .where('target.empId = :empId', { empId: emp_id })
                    .andWhere('target.is_active = :isActive', { isActive: true })
                    .andWhere('target.createdAt >= :startDate', { startDate: startTimeline })
                    .andWhere('target.createdAt <= :endDate', { endDate: endTimeline });
                const currTarget = yield currTargetQueryBuilder.getMany();
                const targets = currTarget.map((data) => data.target);
                const allTargets = targets.flat(); // Assuming targets is an array of arrays
                // const totalStoreTarget = allTargets.reduce((acc: number, item: any) => acc + Number(item?.storeTarget || 0), 0);
                // const totalCollectionTarget = allTargets.reduce((acc: number, item: any) => acc + Number(item?.collectionTarget || 0), 0);
                const totalOrderTarget = allTargets.reduce((acc, item) => acc + Number((item === null || item === void 0 ? void 0 : item.orderTarget) || 0), 0);
                //  SKU
                let topSKUQueryBuilder = yield this.getOrderRepositry.createQueryBuilder("orders")
                    .select("unnested.product->>'productName' AS productName")
                    .addSelect("brand.name AS brandName")
                    .addSelect("SUM(CAST(unnested.product->>'rlp' AS NUMERIC) * (COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0)))) AS total_sales")
                    .leftJoin(qb => qb
                    .select("jsonb_array_elements(orders.products::jsonb) AS product")
                    .from("orders", "orders"), "unnested", "true")
                    .leftJoin("Brand", "brand", "CAST(unnested.product->>'brandId' AS INTEGER) = brand.brandId").where('orders.empId = :empId', { empId: emp_id })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED });
                let topSKU = yield topSKUQueryBuilder.groupBy("unnested.product->>'productName'")
                    .addGroupBy("brand.name")
                    .orderBy("total_sales", "DESC")
                    .limit(5)
                    .getRawMany();
                // ---------------------------------------- Bottom SKU--------------------------------------------
                let bottomSKUQueryBuilder = yield this.getOrderRepositry.createQueryBuilder("orders")
                    .select("unnested.product->>'productName' AS productName")
                    .addSelect("brand.name AS brandName")
                    .addSelect("SUM(CAST(unnested.product->>'rlp' AS NUMERIC) * (COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0)))) AS total_sales")
                    .leftJoin(qb => qb
                    .select("jsonb_array_elements(orders.products::jsonb) AS product")
                    .from("orders", "orders"), "unnested", "true")
                    .leftJoin("Brand", "brand", "CAST(unnested.product->>'brandId' AS INTEGER) = brand.brandId").where('orders.empId = :empId', { empId: emp_id })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED });
                let bottomSKU = yield bottomSKUQueryBuilder.groupBy("unnested.product->>'productName'")
                    .addGroupBy("brand.name")
                    .orderBy("total_sales", "ASC")
                    .limit(5)
                    .getRawMany();
                // order count with pending payment
                let orderCountWithPayment = yield this.getOrderRepositry.createQueryBuilder('orders')
                    .select("COUNT(orders.orderId)", "totalOrderCount")
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: common_1.PaymentStatus.PENDING })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED });
                if (timePeriod.length > 0 && startTimeline && endTimeline) {
                    orderCountWithPayment.andWhere("orders.createdAt >= :startDate", { startDate: startTimeline })
                        .andWhere("orders.createdAt <= :endDate", { endDate: endTimeline });
                }
                let currOrderCountWithPendingPayment = yield orderCountWithPayment.getCount();
                // ---------------------------------------------------------------------------------------------
                let preOrderCountWithPayment = yield this.getOrderRepositry.createQueryBuilder('orders')
                    .select("COUNT(orders.orderId)", "totalOrderCount")
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: common_1.PaymentStatus.PENDING })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED });
                if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                    preOrderCountWithPayment.andWhere("orders.createdAt >= :startDate", { startDate: startPreTimeline })
                        .andWhere("orders.createdAt <= :endDate", { endDate: endPreTimeline });
                }
                let preOrderCountWithPendingPayment = yield preOrderCountWithPayment.getCount();
                // Order Value Sales
                const ordersPaymentQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("SUM(orders.netAmount) - SUM(orders.collectedAmount)", "totalAmount")
                    .leftJoin("orders.user", "user")
                    .where("orders.empId = :empId", { empId: emp_id })
                    // .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: PaymentStatus.PENDING })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED })
                    .groupBy("orders.empId")
                    .addGroupBy("user.valueTarget")
                    .addGroupBy('user.storeTarget');
                // Conditionally add date range filter for orders
                if (timePeriod.length > 0 && startTimeline && endTimeline) {
                    ordersPaymentQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startTimeline })
                        .andWhere('orders.createdAt <= :endDate', { endDate: endTimeline });
                }
                const ordersWithPendingPayment = yield ordersPaymentQueryBuilder.getRawOne();
                //--------------------------------------------------------------------------------------------------
                const preOrdersPaymentQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("SUM(orders.netAmount)", "totalAmount")
                    .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.paymentStatus = :paymentStatus", { paymentStatus: common_1.PaymentStatus.PENDING })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED })
                    .groupBy("orders.empId");
                // Conditionally add date range filter for orders
                if (timePeriod.length > 0 && startPreTimeline && endPreTimeline) {
                    preOrdersPaymentQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startPreTimeline })
                        .andWhere('orders.createdAt <= :endDate', { endDate: endPreTimeline });
                }
                const preSalesWithPendingPayment = yield preOrdersPaymentQueryBuilder.getRawOne();
                const reponse = {
                    valueTarget: {
                        target: totalOrderTarget ? +totalOrderTarget : 0,
                        achieved: orders ? +orders.totalAmount : 0
                    },
                    sales: {
                        currSales: orders ? +orders.totalAmount : 0,
                        preSales: preSales ? +preSales.totalAmount : 0
                    },
                    orderCount: {
                        currOrderCount: currOrderCount !== null && currOrderCount !== void 0 ? currOrderCount : 0,
                        preOrderCount: preOrderCount !== null && preOrderCount !== void 0 ? preOrderCount : 0
                    },
                    sku: {
                        topSKU: topSKU !== null && topSKU !== void 0 ? topSKU : [],
                        bottomSKU: bottomSKU !== null && bottomSKU !== void 0 ? bottomSKU : []
                    },
                    orderCountWithPendingPayment: {
                        currOrder: currOrderCountWithPendingPayment !== null && currOrderCountWithPendingPayment !== void 0 ? currOrderCountWithPendingPayment : 0,
                        preOrder: preOrderCountWithPendingPayment !== null && preOrderCountWithPendingPayment !== void 0 ? preOrderCountWithPendingPayment : 0
                    },
                    orderValueWithPendingPayment: {
                        currSales: ordersWithPendingPayment !== null && ordersWithPendingPayment !== void 0 ? ordersWithPendingPayment : 0,
                        preSales: preSalesWithPendingPayment !== null && preSalesWithPendingPayment !== void 0 ? preSalesWithPendingPayment : 0
                    }
                };
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: reponse };
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminDashboard(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id, role } = payload;
                const currentYr = new Date().getFullYear();
                const { timePeriod = [common_1.TimelineEnum.YEAR, currentYr] } = input;
                // const today = new Date();
                const quarters = {
                    1: {
                        start: new Date(Date.UTC(currentYr, 3, 1)).toISOString(),
                        end: new Date(Date.UTC(currentYr, 5, 30, 23, 59, 59)).toISOString()
                    },
                    2: {
                        start: new Date(Date.UTC(currentYr, 6, 1)).toISOString(),
                        end: new Date(Date.UTC(currentYr, 8, 30, 23, 59, 59)).toISOString()
                    },
                    3: {
                        start: new Date(Date.UTC(currentYr, 9, 1)).toISOString(),
                        end: new Date(Date.UTC(currentYr, 11, 31, 23, 59, 59)).toISOString()
                    },
                    4: {
                        start: new Date(Date.UTC(currentYr + 1, 0, 1)).toISOString(),
                        end: new Date(Date.UTC(currentYr + 1, 2, 31, 23, 59, 59)).toISOString()
                    }
                };
                let startTimeline = null, endTimeline = null;
                let startPreTimeline = null, endPreTimeline = null;
                if (timePeriod[0] === common_1.TimelineEnum.MONTH && timePeriod[1]) {
                    const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
                    const monthIndex = monthNames.indexOf(timePeriod[1].toLowerCase());
                    startTimeline = new Date(Date.UTC(currentYr, monthIndex, 1)).toISOString();
                    endTimeline = new Date(Date.UTC(currentYr, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();
                    if (monthIndex === 0) {
                        startPreTimeline = new Date(Date.UTC(currentYr - 1, 11, 1)).toISOString();
                        endPreTimeline = new Date(Date.UTC(currentYr - 1, 12, 0, 23, 59, 59, 999)).toISOString();
                    }
                    else {
                        startPreTimeline = new Date(Date.UTC(currentYr, monthIndex - 1, 1)).toISOString();
                        endPreTimeline = new Date(Date.UTC(currentYr, monthIndex, 0, 23, 59, 59, 999)).toISOString();
                    }
                }
                else if (timePeriod[0] === common_1.TimelineEnum.YEAR && timePeriod[1]) {
                    startTimeline = new Date(Date.UTC(timePeriod[1], 0, 1)).toISOString();
                    endTimeline = new Date(Date.UTC(timePeriod[1], 11, 31, 23, 59, 59, 999)).toISOString();
                    startPreTimeline = new Date(Date.UTC(timePeriod[1] - 1, 0, 1)).toISOString();
                    endPreTimeline = new Date(Date.UTC(timePeriod[1] - 1, 11, 31, 23, 59, 59, 999)).toISOString();
                }
                else if (timePeriod[0] === common_1.TimelineEnum.QUARTER && timePeriod[1]) {
                    const selectedQuarter = quarters[timePeriod[1].toUpperCase().replace("Q", "")];
                    startTimeline = selectedQuarter.start;
                    endTimeline = selectedQuarter.end;
                    if (timePeriod[1] === "Q4") {
                        startPreTimeline = new Date(Date.UTC(currentYr, 9, 1)).toISOString(),
                            endPreTimeline = new Date(Date.UTC(currentYr, 11, 31, 23, 59, 59)).toISOString();
                    }
                    else if (timePeriod[1] === "Q1") {
                        startPreTimeline = new Date(Date.UTC(currentYr, 0, 1)).toISOString(),
                            endPreTimeline = new Date(Date.UTC(currentYr, 2, 31, 23, 59, 59)).toISOString();
                    }
                    else {
                        const selectedPreQuarter = quarters[timePeriod[1].toUpperCase().replace("Q", "") - 1];
                        startPreTimeline = selectedPreQuarter.start;
                        endPreTimeline = selectedPreQuarter.end;
                    }
                }
                let empIds = [];
                if (role === common_1.UserRole.RSM) {
                    const userLists = yield this.getUserRepositry.find({ where: { managerId: emp_id } });
                    empIds = userLists.map((data) => data.emp_id);
                }
                let fitlerQuery = [];
                const storesIds = yield this.beatRespositry.createQueryBuilder("beat")
                    .where("beat.empId = :empId", { empId: emp_id })
                    .select("beat.store")
                    .getMany();
                if (storesIds.length > 0) {
                    fitlerQuery = storesIds;
                }
                const storeIds = fitlerQuery.map((beat) => beat.store).flat();
                // const empName = userLists.map((data: any) => data.firstname).join(',')
                const orderSubquery = this.getOrderRepositry.createQueryBuilder("orders")
                    .select("orders.storeId", "storeId")
                    // .where("orders.orderStatus != :orderStatus", { orderStatus: OrderStatus.CANCELLED })
                    .getQuery();
                let unBilledQueryBuilder = yield this.getStoreRepositry.createQueryBuilder('stores')
                    .leftJoinAndSelect('stores.user', 'user') // Added this line assuming there is a relation between stores and user
                    .select([
                    'stores.storeId AS store_id',
                    'stores.storeName AS store_name',
                    'stores.createdAt AS created_at',
                    'user.firstname AS firstname',
                    'user.lastname AS lastname'
                ])
                    .where(`stores.storeId NOT IN (${orderSubquery})`);
                if (role === common_1.UserRole.RSM) {
                    unBilledQueryBuilder = unBilledQueryBuilder.where("stores.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                const unBilledStore = yield unBilledQueryBuilder.limit(6).getRawMany();
                let PendingApprovalQueryBuilder = yield this.getOrderRepositry.createQueryBuilder('orders')
                    .leftJoinAndSelect('orders.user', 'user')
                    .leftJoinAndSelect('orders.store', 'stores') // Added this line assuming there is a relation between stores and user
                    .select([
                    'stores.storeName AS store_name',
                    'user.firstname AS firstname',
                    'user.lastname AS lastname',
                    'orders.orderId AS order_id',
                    'orders.specialDiscountValue AS specialdiscountvalue',
                    'orders.specialDiscountStatus AS discount_status',
                    'orders.orderAmount As orderAmount'
                ])
                    .where('orders.specialDiscountValue IS NOT NULL')
                    .andWhere('orders.specialDiscountStatus IN (:...statuses)', { statuses: ['PENDING'] })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.ORDERSAVED });
                if (role === common_1.UserRole.RSM) {
                    PendingApprovalQueryBuilder = PendingApprovalQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                const PendingApprovalStores = yield PendingApprovalQueryBuilder.limit(6).getRawMany();
                const performer = [];
                let topPerformerQueryBuilder = yield this.getOrderRepositry.createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("user.firstname", "firstname")
                    .addSelect("user.lastname", "lastname")
                    .addSelect("user.role", "role")
                    .addSelect("SUM(orders.orderAmount) AS totalAmount")
                    .leftJoin("User", "user", "orders.empId = user.emp_id")
                    .where("user.role = :role", { role: "SSM" })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] });
                if (role === common_1.UserRole.RSM) {
                    topPerformerQueryBuilder = topPerformerQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                const topPerformer = yield topPerformerQueryBuilder.groupBy("orders.empId")
                    .addGroupBy("user.firstname")
                    .addGroupBy("user.lastname")
                    .addGroupBy("user.role")
                    .orderBy("SUM(orders.orderAmount)", "DESC")
                    .limit(5)
                    .getRawMany();
                let bottomPerformer = [];
                let employeeCountQueryBuilder = yield this.getOrderRepositry.createQueryBuilder("orders")
                    .select("COUNT(DISTINCT orders.empId)", "employeeCount")
                    .where("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED });
                if (role === common_1.UserRole.RSM) {
                    employeeCountQueryBuilder = employeeCountQueryBuilder.where("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                let employeeCount = yield employeeCountQueryBuilder.getRawOne();
                if (employeeCount && Number(employeeCount.employeeCount) > 5) {
                    let bottomPerformerQueryBuilder = yield this.getOrderRepositry.createQueryBuilder("orders")
                        .select("orders.empId", "empId")
                        .addSelect("user.firstname", "firstname")
                        .addSelect("user.lastname", "lastname")
                        .addSelect("user.role", "role")
                        .addSelect("SUM(orders.orderAmount) AS totalAmount")
                        .leftJoin("User", "user", "orders.empId = user.emp_id")
                        .where("user.role = :role", { role: "SSM" })
                        .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] });
                    if (role === common_1.UserRole.RSM) {
                        bottomPerformerQueryBuilder = bottomPerformerQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                    }
                    bottomPerformer = yield bottomPerformerQueryBuilder.groupBy("orders.empId")
                        .addGroupBy("user.firstname")
                        .addGroupBy("user.lastname")
                        .addGroupBy("user.role")
                        .orderBy("SUM(orders.orderAmount)", "ASC")
                        .limit(5)
                        .getRawMany();
                }
                performer.push({
                    topPerformer,
                    bottomPerformer
                });
                let topSKUQueryBuilder = yield this.getOrderRepositry.createQueryBuilder("orders")
                    .select("unnested.product->>'productName' AS productName")
                    .addSelect("brand.name AS brandName")
                    .addSelect("SUM(CAST(unnested.product->>'rlp' AS NUMERIC) * (COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0)))) AS total_sales")
                    .leftJoin(qb => qb
                    .select("jsonb_array_elements(orders.products::jsonb) AS product")
                    .from("orders", "orders")
                    .where("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED }), "unnested", "true")
                    .leftJoin("Brand", "brand", "CAST(unnested.product->>'brandId' AS INTEGER) = brand.brandId").where("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] });
                if (role === common_1.UserRole.RSM) {
                    topSKUQueryBuilder = topSKUQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                let topSKU = yield topSKUQueryBuilder.groupBy("unnested.product->>'productName'")
                    .addGroupBy("brand.name")
                    .orderBy("total_sales", "DESC")
                    .limit(5)
                    .getRawMany();
                // ---------------------------------------- Bottom SKU--------------------------------------------
                let bottomSKUQueryBuilder = yield this.getOrderRepositry.createQueryBuilder("orders")
                    .select("unnested.product->>'productName' AS productName")
                    .addSelect("brand.name AS brandName")
                    .addSelect("SUM(CAST(unnested.product->>'rlp' AS NUMERIC) * (COALESCE(CAST(unnested.product->>'noOfPiece' AS NUMERIC), 0) + (COALESCE(CAST(unnested.product->>'caseQty' AS NUMERIC), 0) * COALESCE(CAST(unnested.product->>'noOfCase' AS NUMERIC), 0)))) AS total_sales")
                    .leftJoin(qb => qb
                    .select("jsonb_array_elements(orders.products::jsonb) AS product")
                    .from("orders", "orders")
                    .where("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED }), "unnested", "true")
                    .leftJoin("Brand", "brand", "CAST(unnested.product->>'brandId' AS INTEGER) = brand.brandId").where("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] });
                if (role === common_1.UserRole.RSM) {
                    bottomSKUQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                let bottomSKU = yield bottomSKUQueryBuilder.groupBy("unnested.product->>'productName'")
                    .addGroupBy("brand.name")
                    .orderBy("total_sales", "ASC")
                    .limit(5)
                    .getRawMany();
                // =========================Stores Count================================-
                let currStoreCountQueryBuilder = yield this.getStoreRepositry.createQueryBuilder('stores')
                    .select("COUNT(stores.storeId)", "totalStoreCount")
                    .where("stores.createdAt >= :startDate", { startDate: startTimeline })
                    .andWhere("stores.createdAt <= :endDate", { endDate: endTimeline });
                if (role === common_1.UserRole.RSM) {
                    currStoreCountQueryBuilder.andWhere("stores.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                let currStoreCount = yield currStoreCountQueryBuilder.getCount();
                // --------------------------------------------------------------------------------------------
                let preStoreCountQueryBuilder = yield this.getStoreRepositry.createQueryBuilder('stores')
                    .select("COUNT(stores.storeId)", "totalStoreCount")
                    .where("stores.createdAt >= :startDate", { startDate: startPreTimeline })
                    .andWhere("stores.createdAt <= :endDate", { endDate: endPreTimeline });
                if (role === common_1.UserRole.RSM) {
                    preStoreCountQueryBuilder.andWhere("stores.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                let preStoreCount = yield preStoreCountQueryBuilder.getCount();
                //   ============================================================================================================
                let currOrderCountQueryBuilder = yield this.getOrderRepositry.createQueryBuilder('orders')
                    .select("COUNT(orders.orderId)", "totalOrderCount")
                    .where("orders.createdAt >= :startDate", { startDate: startTimeline })
                    .andWhere("orders.createdAt <= :endDate", { endDate: endTimeline })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] });
                if (role === common_1.UserRole.RSM) {
                    currOrderCountQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                let currOrderCount = yield currOrderCountQueryBuilder.getCount();
                // ------------------------------------------------------------------------------------------------------
                let preOrderCountQueryBuilder = yield this.getOrderRepositry.createQueryBuilder('orders')
                    .select("COUNT(orders.orderId)", "totalOrderCount")
                    .where("orders.createdAt >= :startDate", { startDate: startPreTimeline })
                    .andWhere("orders.createdAt <= :endDate", { endDate: endPreTimeline })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] });
                if (role === common_1.UserRole.RSM) {
                    preOrderCountQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                let preOrderCount = yield preOrderCountQueryBuilder.getCount();
                // ============================================= Sales ==================================================
                let currSalesQueryBuilder = yield this.getOrderRepositry.createQueryBuilder('orders')
                    .select("SUM(orders.orderAmount)", "totalOrderAmount")
                    .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                    .where("orders.createdAt >= :startDate", { startDate: startTimeline })
                    .andWhere("orders.createdAt <= :endDate", { endDate: endTimeline })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] });
                if (role === common_1.UserRole.RSM) {
                    currSalesQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                let currSales = yield currSalesQueryBuilder.getRawOne();
                // ----------------------------------------------------------------------------------------------------------
                let preSalesQueryBuilder = yield this.getOrderRepositry.createQueryBuilder('orders')
                    .select("SUM(orders.orderAmount)", "totalOrderAmount")
                    .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                    .where("orders.createdAt >= :startDate", { startDate: startPreTimeline })
                    .andWhere("orders.createdAt <= :endDate", { endDate: endPreTimeline })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] });
                if (role === common_1.UserRole.RSM) {
                    preSalesQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                let preSales = yield preSalesQueryBuilder.getRawOne();
                // ===============================================================================================
                const currTargetQueryBuilder = this.getTargetRepository.createQueryBuilder('target')
                    .select([
                    'target'
                ]);
                if (role === common_1.UserRole.RSM) {
                    currTargetQueryBuilder.where("target.empId IN (:...empIds)", { empIds });
                }
                currTargetQueryBuilder.andWhere('target.is_active = :isActive', { isActive: true })
                    .andWhere('target.createdAt >= :startDate', { startDate: startTimeline })
                    .andWhere('target.createdAt <= :endDate', { endDate: endTimeline });
                const currTarget = yield currTargetQueryBuilder.groupBy("target.targetId").getMany();
                const targets = currTarget.map((data) => data.target);
                const allTargets = targets.flat(); // Assuming targets is an array of arrays
                const totalStoreTarget = allTargets.reduce((acc, item) => acc + Number((item === null || item === void 0 ? void 0 : item.storeTarget) || 0), 0);
                const totalCollectionTarget = allTargets.reduce((acc, item) => acc + Number((item === null || item === void 0 ? void 0 : item.collectionTarget) || 0), 0);
                const totalOrderTarget = allTargets.reduce((acc, item) => acc + Number((item === null || item === void 0 ? void 0 : item.orderTarget) || 0), 0);
                // console.log({empIds, role, totalStoreTarget, totalCollectionTarget, totalOrderTarget });
                const response = {
                    unBilledStore,
                    PendingApprovalStores,
                    topPerformer,
                    bottomPerformer,
                    topSKU,
                    sku: {
                        topSKU: topSKU !== null && topSKU !== void 0 ? topSKU : [],
                        bottomSKU: bottomSKU !== null && bottomSKU !== void 0 ? bottomSKU : []
                    },
                    sales: {
                        currSales: currSales ? +currSales.totalOrderAmount : 0,
                        preSales: preSales ? +preSales.totalOrderAmount : 0
                    },
                    collection: {
                        currCollection: currSales ? +currSales.totalCollectedAmount : 0,
                        preCollection: preSales ? +preSales.totalCollectedAmount : 0
                    },
                    orderCount: {
                        currOrderCount: currOrderCount !== null && currOrderCount !== void 0 ? currOrderCount : 0,
                        preOrderCount: preOrderCount !== null && preOrderCount !== void 0 ? preOrderCount : 0
                    },
                    storeCount: {
                        currStoreCount: currStoreCount !== null && currStoreCount !== void 0 ? currStoreCount : 0,
                        preStoreCount: preStoreCount !== null && preStoreCount !== void 0 ? preStoreCount : 0
                    },
                    storeTarget: {
                        currStoreTarget: totalStoreTarget ? +totalStoreTarget : 0,
                    },
                    salesTarget: {
                        currSalesTarget: totalOrderTarget ? +totalOrderTarget : 0,
                    },
                    collectionTarget: {
                        currCollectionTarget: totalCollectionTarget ? +totalCollectionTarget : 0,
                    },
                };
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: response };
            }
            catch (error) {
                throw error;
            }
        });
    }
    revenueChart(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { emp_id, role } = payload;
            try {
                const queries = [];
                const currentDate = new Date();
                const userLists = yield this.getUserRepositry.find({ where: { managerId: emp_id } });
                const empIds = userLists.map((data) => data.emp_id);
                for (let i = 1; i < 8; i++) {
                    const dayStart = new Date(currentDate);
                    dayStart.setDate(currentDate.getDate() - i);
                    dayStart.setUTCHours(0, 0, 0, 0);
                    const dayEnd = new Date(dayStart);
                    dayEnd.setUTCHours(23, 59, 59, 999);
                    const previousDayStart = new Date(dayStart);
                    previousDayStart.setDate(dayStart.getDate() - 7);
                    previousDayStart.setUTCHours(0, 0, 0, 0);
                    const previousDayEnd = new Date(dayEnd);
                    previousDayEnd.setDate(dayEnd.getDate() - 7);
                    previousDayEnd.setUTCHours(23, 59, 59, 999);
                    // Create concurrent queries for current week and last week
                    let fitlerQuery = [];
                    const storesIds = yield this.beatRespositry.createQueryBuilder("beat")
                        .where("beat.empId = :empId", { empId: emp_id })
                        .select("beat.store")
                        .getMany();
                    console.log({ storesIds });
                    if (storesIds.length > 0) {
                        fitlerQuery = storesIds;
                    }
                    const storeIds = fitlerQuery.map((beat) => beat.store).flat();
                    let currentQueryBuilder = yield this.getOrderRepositry.createQueryBuilder("orders")
                        .select("SUM(orders.orderAmount)", "totalAmount")
                        .where("orders.createdAt BETWEEN :dayStart AND :dayEnd", { dayStart: dayStart.toISOString(), dayEnd: dayEnd.toISOString() })
                        .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] });
                    if (role === common_1.UserRole.RSM) {
                        currentQueryBuilder = currentQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                    }
                    queries.push(yield currentQueryBuilder.getRawOne()
                        .then(dailyAmount => ({
                        date: dayStart.toISOString().split('T')[0],
                        totalAmount: dailyAmount.totalAmount || 0
                    })));
                    let lastQueryBuilder = yield this.getOrderRepositry.createQueryBuilder("orders")
                        .select("SUM(orders.orderAmount)", "totalAmount")
                        .where("orders.createdAt BETWEEN :previousDayStart AND :previousDayEnd", { previousDayStart: previousDayStart.toISOString(), previousDayEnd: previousDayEnd.toISOString() })
                        .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] });
                    if (role === common_1.UserRole.RSM) {
                        lastQueryBuilder = lastQueryBuilder.andWhere("orders.storeId IN (:...storeIds)", { storeIds: storeIds });
                    }
                    queries.push(yield lastQueryBuilder.getRawOne()
                        .then(dailyAmount => ({
                        date: dayStart.toISOString().split('T')[0],
                        totalAmount: dailyAmount.totalAmount || 0
                    })));
                }
                const results = yield Promise.all(queries);
                const RevenueCurrentWeekResults = results.filter((_, index) => index % 2 === 0);
                const RevenueLastWeekResults = results.filter((_, index) => index % 2 !== 0);
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: { RevenueCurrentWeekResults, RevenueLastWeekResults } };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateApprovalStore(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const { specialDiscountStatus, orderId, specialDiscountComment } = input;
                yield this.getOrderRepositry.createQueryBuilder().update({ specialDiscountStatus, specialDiscountComment }).where({ orderId }).execute();
                const order = yield (0, orders_entity_1.OrdersRepository)().findOne({ where: { orderId } });
                if (!order) {
                    return { message: "Order Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                let specialDiscount = 0;
                if (order.specialDiscountStatus === common_1.SpecialDiscountStatus.APPROVED) {
                    specialDiscount = order.netAmount * Number(order.specialDiscountValue) / 100;
                    yield (0, orders_entity_1.OrdersRepository)().update(orderId, { specialDiscountAmount: specialDiscount, totalDiscountAmount: Number(order.totalDiscountAmount) + specialDiscount, netAmount: Number((order.netAmount - specialDiscount).toFixed(2)) });
                }
                return { message: "Updated.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    homeTodayAchievement(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const d = (0, typeorm_1.Between)((0, date_fns_1.startOfDay)(new Date()), (0, date_fns_1.endOfDay)(new Date()));
                const today = new Date();
                const currentYear = today.getUTCFullYear();
                const monthIndex = today.getUTCMonth(); // 0-based index (January = 0, December = 11)
                const dayIndex = today.getUTCDate();
                const startTimeline = new Date(Date.UTC(currentYear, monthIndex, dayIndex)).toISOString();
                const endTimeline = new Date(Date.UTC(currentYear, monthIndex, dayIndex, 23, 59, 59, 999)).toISOString();
                // const plannedStores = await this.getVisitRepository.count({
                //     where: {
                //         visitDate: Between(startOfDay(new Date()), endOfDay(new Date())),
                //         empId: emp_id
                //     }
                // })
                const plannedStores = yield this.getVisitRepository
                    .createQueryBuilder('visits')
                    .where('visits.visitDate BETWEEN :startTimeline AND :endTimeline', { startTimeline, endTimeline })
                    .andWhere('visits.empId = :empId', { empId: emp_id })
                    .getCount();
                const visitedStores = yield this.getVisitRepository.createQueryBuilder('visits')
                    .where('visits.status = :status', { status: common_1.VisitStatus.COMPLETE })
                    .andWhere('visits.visitDate BETWEEN :startTimeline AND :endTimeline', { startTimeline, endTimeline })
                    .andWhere('visits.empId = :empId', { empId: emp_id })
                    .getCount();
                const newStores = yield this.getStoreRepositry
                    .createQueryBuilder('stores')
                    .where('stores.createdAt BETWEEN :startTimeline AND :endTimeline', { startTimeline, endTimeline })
                    .andWhere('stores.empId = :empId', { empId: emp_id })
                    .getCount();
                // const totalOrder = await this.getOrderRepositry.count({
                //     where: {
                //         createdAt: Between(startOfDay(new Date()), endOfDay(new Date())),
                //         empId: emp_id
                //     }
                // })
                const totalOrder = yield this.getOrderRepositry
                    .createQueryBuilder('orders')
                    .where('orders.createdAt BETWEEN :startTimeline AND :endTimeline', { startTimeline, endTimeline })
                    .andWhere('orders.empId = :empId', { empId: emp_id })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] })
                    .getCount();
                const visitOrder = yield this.getOrderRepositry
                    .createQueryBuilder('orders')
                    .where('orders.isCallType = :callType', { callType: common_1.CallType.PHYSICAL })
                    .andWhere('orders.createdAt BETWEEN :startTimeline AND :endTimeline', { startTimeline, endTimeline })
                    .andWhere('orders.empId = :empId', { empId: emp_id })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] })
                    .getCount();
                const phoneOrder = yield this.getOrderRepositry
                    .createQueryBuilder('orders')
                    .where('orders.isCallType = :callType', { callType: common_1.CallType.TELEVISIT })
                    .andWhere('orders.createdAt BETWEEN :startTimeline AND :endTimeline', { startTimeline, endTimeline })
                    .andWhere('orders.empId = :empId', { empId: emp_id })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] })
                    .getCount();
                const data = {
                    plannedStores: +plannedStores,
                    visitedStores: +visitedStores,
                    newStores: +newStores,
                    totalOrder: +totalOrder,
                    visitOrder: +visitOrder,
                    phoneOrder: +phoneOrder
                };
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: data };
            }
            catch (error) {
                throw error;
            }
        });
    }
    homeTodayOrderValue(payload) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const today = new Date();
                const currentYear = today.getUTCFullYear();
                const monthIndex = today.getUTCMonth(); // 0-based index (January = 0, December = 11)
                const dayIndex = today.getUTCDate();
                const startTimeline = new Date(Date.UTC(currentYear, monthIndex, dayIndex)).toISOString();
                const endTimeline = new Date(Date.UTC(currentYear, monthIndex, dayIndex, 23, 59, 59, 999)).toISOString();
                let order = yield this.getOrderRepositry
                    .createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("COALESCE(SUM(orders.orderAmount), 0)", "totalAmount") // Use COALESCE to return 0 if NULL
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] });
                if (startTimeline && endTimeline) {
                    order.andWhere("orders.createdAt BETWEEN :startTimeline AND :endTimeline", { startTimeline, endTimeline });
                }
                const totalOrder = yield order.groupBy("orders.empId")
                    .getRawOne();
                // Build the query using QueryBuilder
                let vOrder = this.getOrderRepositry
                    .createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("COALESCE(SUM(orders.orderAmount), 0)", "totalAmount")
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.isCallType = :isCallType", { isCallType: common_1.CallType.PHYSICAL })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] });
                // Add a date range filter if both startTimeline and endTimeline are provided
                if (startTimeline && endTimeline) {
                    vOrder.andWhere("orders.createdAt BETWEEN :startTimeline AND :endTimeline", { startTimeline, endTimeline });
                }
                // Execute the query and group by empId
                const visitOrder = yield vOrder
                    .groupBy("orders.empId")
                    .getRawOne();
                let pOrder = this.getOrderRepositry
                    .createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("COALESCE(SUM(orders.orderAmount), 0)", "totalAmount") // Set to 0 if no data is found
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.isCallType = :isCallType", { isCallType: common_1.CallType.TELEVISIT })
                    .andWhere("orders.orderStatus != :orderStatus", { orderStatus: common_1.OrderStatus.CANCELLED });
                if (startTimeline && endTimeline) {
                    pOrder.andWhere("orders.createdAt BETWEEN :startTimeline AND :endTimeline", { startTimeline, endTimeline });
                }
                const phoneOrder = yield pOrder
                    .groupBy("orders.empId")
                    .getRawOne();
                const data = {
                    totalOrder: (_a = totalOrder === null || totalOrder === void 0 ? void 0 : totalOrder.totalAmount) !== null && _a !== void 0 ? _a : 0,
                    visitOrder: (_b = visitOrder === null || visitOrder === void 0 ? void 0 : visitOrder.totalAmount) !== null && _b !== void 0 ? _b : 0,
                    phoneOrder: (_c = phoneOrder === null || phoneOrder === void 0 ? void 0 : phoneOrder.totalAmount) !== null && _c !== void 0 ? _c : 0
                };
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: data };
            }
            catch (error) {
                throw error;
            }
        });
    }
    homeCurrentMonthAchievement(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const today = new Date();
                const currentYear = today.getFullYear();
                // const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
                const monthIndex = today.getMonth();
                let startTimeline = new Date(Date.UTC(currentYear, monthIndex, 1)).toISOString();
                let endTimeline = new Date(Date.UTC(currentYear, monthIndex + 1, 0, 23, 59, 59, 999)).toISOString();
                const currTargetQueryBuilder = this.getTargetRepository.createQueryBuilder('target')
                    .select([
                    'target'
                ])
                    .where('target.empId = :empId', { empId: emp_id })
                    .andWhere('target.is_active = :isActive', { isActive: true });
                // .andWhere('target.createdAt >= :startDate', { startDate: startTimeline })
                // .andWhere('target.createdAt <= :endDate', { endDate: endTimeline });
                const currTarget = yield currTargetQueryBuilder.getMany();
                const targets = currTarget.map((data) => data.target);
                const allTargets = targets.flat(); // Assuming targets is an array of arrays
                const totalStoreTarget = allTargets.reduce((acc, item) => acc + Number((item === null || item === void 0 ? void 0 : item.storeTarget) || 0), 0);
                const totalCollectionTarget = allTargets.reduce((acc, item) => acc + Number((item === null || item === void 0 ? void 0 : item.collectionTarget) || 0), 0);
                const totalOrderTarget = allTargets.reduce((acc, item) => acc + Number((item === null || item === void 0 ? void 0 : item.orderTarget) || 0), 0);
                const ordersQueryBuilder = this.getOrderRepositry.createQueryBuilder("orders")
                    .select("orders.empId", "empId")
                    .addSelect("SUM(orders.orderAmount)", "totalAmount")
                    .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                    .where("orders.empId = :empId", { empId: emp_id })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] })
                    .groupBy("orders.empId");
                // Conditionally add date range filter for orders
                if (startTimeline && endTimeline) {
                    ordersQueryBuilder.andWhere('orders.createdAt >= :startDate', { startDate: startTimeline })
                        .andWhere('orders.createdAt <= :endDate', { endDate: endTimeline });
                }
                const orders = yield ordersQueryBuilder.getRawOne();
                const storesQueryBuilder = this.getStoreRepositry.createQueryBuilder('stores')
                    .select("stores.empId", "empId")
                    .addSelect("COUNT(stores.storeId)", "totalStoreCount")
                    .where("stores.empId = :empId", { empId: emp_id })
                    .groupBy("stores.empId");
                if (startTimeline && endTimeline) {
                    storesQueryBuilder.andWhere('stores.createdAt >= :startDate', { startDate: startTimeline })
                        .andWhere('stores.createdAt <= :endDate', { endDate: endTimeline });
                }
                const stores = yield storesQueryBuilder.getRawOne();
                const response = {
                    valueTarget: {
                        target: totalOrderTarget ? +totalOrderTarget : 0,
                        achieved: orders ? +orders.totalAmount : 0
                    },
                    storeTarget: {
                        target: totalStoreTarget ? +totalStoreTarget : 0,
                        achieved: stores ? +stores.totalStoreCount : 0
                    },
                    collectionTarget: {
                        target: totalCollectionTarget ? +totalCollectionTarget : 0,
                        achieved: orders ? +orders.totalCollectedAmount : 0
                    },
                };
                return { message: "Success...", status: common_1.STATUSCODES.SUCCESS, data: response };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.profileService = ProfileController;
