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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const new_target_entity_1 = require("../../../../core/DB/Entities/new.target.entity");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
const orders_entity_1 = require("../../../../core/DB/Entities/orders.entity");
const stores_entity_1 = require("../../../../core/DB/Entities/stores.entity");
const moment_1 = __importDefault(require("moment"));
const typeorm_1 = require("typeorm");
class TargetController {
    constructor() {
        this.target = (0, new_target_entity_1.TargetRepository)();
        this.userRepositry = (0, User_entity_1.UserRepository)();
        this.getOrderRepositry = (0, orders_entity_1.OrdersRepository)();
        this.getStoreRepositry = (0, stores_entity_1.StoreRepository)();
    }
    add(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id, month, year } = input;
                const monthDate = new Date(year, month - 1, 1);
                const yearDate = new Date(year, 0, 1);
                const targetData = yield this.target.findOne({ where: { empId: Number(emp_id), month: new Date(monthDate), year: new Date(yearDate) } });
                if (targetData) {
                    return { message: "User target already exist", status: common_1.STATUSCODES.NOT_FOUND };
                }
                yield this.target.save(Object.assign(Object.assign({}, input), { date: monthDate }));
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTargetByEmpId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id, year } = input;
                const parsedYear = parseInt(year, 10);
                const financialYear = !isNaN(parsedYear) ? parsedYear : new Date().getFullYear();
                const startOfYear = (0, moment_1.default)(`${financialYear}-04-01`).startOf('day').toDate();
                const endOfYear = (0, moment_1.default)(`${financialYear + 1}-03-31`).endOf('day').toDate();
                const Target = yield this.target.find({ where: { empId: Number(emp_id), year: (0, typeorm_1.Between)(startOfYear, endOfYear) } });
                const startMonth = 4;
                const monthsOfYear = Array.from({ length: 12 }, (_, i) => ({
                    month: (0, moment_1.default)().month((startMonth + i - 1) % 12).format("MMM"),
                    year: (i + startMonth - 1 < 12) ? financialYear : financialYear + 1,
                    storeTarget: 0,
                    amountTarget: 0,
                    collectionTarget: 0,
                }));
                Target.forEach(record => {
                    const month = (0, moment_1.default)(record.month).month();
                    const monthIndex = (month - startMonth + 12) % 12;
                    monthsOfYear[monthIndex].storeTarget = record.storeTarget;
                    monthsOfYear[monthIndex].amountTarget = record.amountTarget;
                    monthsOfYear[monthIndex].collectionTarget = record.collectionTarget;
                });
                return { message: "Success", status: common_1.STATUSCODES.SUCCESS, data: monthsOfYear };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTargetById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { targetId } = input;
                const target = yield this.target.findOne({ where: { targetId: Number(targetId) } });
                if (!target) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: target };
            }
            catch (error) {
                throw error;
            }
        });
    }
    upsertTarget(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id, month, year, amountTarget, storeTarget, collectionTarget } = input;
                const empId = Number(emp_id);
                const monthDate = new Date(year, month, 1);
                const yearDate = new Date(year, 0, 1);
                const existingTarget = yield this.target.findOne({
                    where: { empId: empId, month: monthDate, year: yearDate },
                });
                const currentDate = new Date();
                const inputDate = new Date(year, month);
                if (existingTarget) {
                    // Update existing
                    if (existingTarget.month != null && existingTarget.year != null) {
                        const currentDate = new Date();
                        const existingTargetYear = existingTarget.year.getFullYear();
                        const existingTargetMonth = existingTarget.month.getMonth();
                        const targetDate = new Date(existingTargetYear, existingTargetMonth); // JS months are 0-indexed
                        if (targetDate.getFullYear() < currentDate.getFullYear() ||
                            (targetDate.getFullYear() === currentDate.getFullYear() && targetDate.getMonth() < currentDate.getMonth())) {
                            return { status: common_1.STATUSCODES.CONFLICT, message: "Cannot edit target of past date." };
                        }
                    }
                    if (inputDate.getFullYear() < currentDate.getFullYear() ||
                        (inputDate.getFullYear() === currentDate.getFullYear() && inputDate.getMonth() < currentDate.getMonth())) {
                        return { status: common_1.STATUSCODES.CONFLICT, message: "Cannot modify target of past date." };
                    }
                    yield this.target.update({ empId: empId, month: monthDate, year: yearDate }, { storeTarget: storeTarget, amountTarget: amountTarget, collectionTarget: collectionTarget });
                    return { message: "Target updated.", status: common_1.STATUSCODES.SUCCESS };
                }
                else {
                    // Create new
                    yield this.target.save(Object.assign(Object.assign({}, input), { date: monthDate }));
                    return { message: "Target created.", status: common_1.STATUSCODES.SUCCESS };
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { targetId } = input;
                const existingTarget = yield this.target.findOne({
                    where: { targetId: targetId },
                });
                if (!existingTarget) {
                    return { status: common_1.STATUSCODES.CONFLICT, message: "Target does not exist." };
                }
                yield this.target.softDelete({ targetId: targetId });
                return { message: "Updated.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getYearlyTargetByEmployee(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id, year } = input;
                const parsedYear = parseInt(year, 10);
                const financialYear = !isNaN(parsedYear) ? parsedYear : new Date().getFullYear();
                const startOfYear = (0, moment_1.default)(`${financialYear}-04-01`).startOf('day').toDate();
                const endOfYear = (0, moment_1.default)(`${financialYear + 1}-03-31`).endOf('day').toDate();
                const query = this.target.createQueryBuilder('target')
                    .leftJoinAndSelect('target.user', 'user')
                    .select('target.empId', 'empId')
                    .addSelect('user.firstname', 'firstname')
                    .addSelect('user.lastname', 'lastname')
                    .addSelect(`CONCAT(user.firstname, ' ', user.lastname)`, 'name')
                    .addSelect('COALESCE(SUM(target.storeTarget), 0)', 'totalStoreTarget')
                    .addSelect('COALESCE(SUM(target.amountTarget), 0)', 'totalAmountTarget')
                    .addSelect('COALESCE(SUM(target.collectionTarget), 0)', 'totalCollectionTarget')
                    .where('target.month BETWEEN :start AND :end', { start: startOfYear, end: endOfYear })
                    .groupBy('target.empId')
                    .addGroupBy('user.firstname')
                    .addGroupBy('user.lastname')
                    .orderBy('user.firstname');
                if (emp_id) {
                    query.andWhere('target.empId = :empId', { empId: emp_id });
                }
                const data = yield query.getRawMany();
                return { message: "Success", status: common_1.STATUSCODES.SUCCESS, data: data, };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getYearlyTargetById(input) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { year, empId } = input;
                const startDateOfYear = new Date(Date.UTC(year, 0, 1)); // January 1st of the input year at 00:00:00.000 UTC
                const endDateOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)); // December 31st of the input year at 23:59:59.999 UTC
                let storeTargetAchieved = {}, targets = {}, amountTargetAchieved = {};
                try {
                    // Fetch order data
                    amountTargetAchieved = (yield this.getOrderRepositry.createQueryBuilder("orders")
                        .select("COALESCE(SUM(orders.orderAmount), 0)", "totalAmount")
                        .leftJoin("orders.user", "user")
                        .where("orders.empId = :empId", { empId: Number(empId) })
                        .andWhere("orders.createdAt >= :startDate", { startDate: startDateOfYear })
                        .andWhere("orders.createdAt <= :endDate", { endDate: endDateOfYear })
                        .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] })
                        .groupBy("orders.empId")
                        .getRawOne()) || { totalAmount: 0 };
                }
                catch (error) {
                    console.error("Error fetching order data:", error);
                    amountTargetAchieved = { totalAmount: 0 }; // Default value
                }
                try {
                    // Fetch store target data
                    storeTargetAchieved = (yield this.getStoreRepositry.createQueryBuilder('stores')
                        .select("COALESCE(COUNT(stores.storeId), 0)", "totalStoreCount")
                        .where("stores.empId = :empId", { empId: Number(empId) })
                        .andWhere("stores.createdAt >= :startDate", { startDate: startDateOfYear })
                        .andWhere("stores.createdAt <= :endDate", { endDate: endDateOfYear })
                        .groupBy("stores.empId")
                        .getRawOne()) || { totalStoreCount: 0 };
                }
                catch (error) {
                    console.error("Error fetching store target data:", error);
                    storeTargetAchieved = { totalStoreCount: 0 }; // Default value
                }
                try {
                    // Fetch target data for the specific target ID
                    const financialYear = year || new Date().getFullYear();
                    const startOfYear = (0, moment_1.default)(`${financialYear}-04-01`).startOf('day').toDate();
                    const endOfYear = (0, moment_1.default)(`${financialYear + 1}-03-31`).endOf('day').toDate();
                    targets = this.target.createQueryBuilder('target')
                        .leftJoinAndSelect('target.user', 'user')
                        .select('target.empId', 'empId')
                        .addSelect('user.firstname', 'firstname')
                        .addSelect('user.lastname', 'lastname')
                        .addSelect(`CONCAT(user.firstname, ' ', user.lastname)`, 'name')
                        .addSelect('COALESCE(SUM(target.storeTarget), 0)', 'storeTarget')
                        .addSelect('COALESCE(SUM(target.amountTarget), 0)', 'amountTarget')
                        .addSelect('COALESCE(SUM(target.collectionTarget), 0)', 'totalCollectionTarget')
                        .where('target.month BETWEEN :start AND :end', { start: startOfYear, end: endOfYear })
                        .groupBy('target.empId')
                        .addGroupBy('user.firstname')
                        .addGroupBy('user.lastname')
                        .orderBy('user.firstname')
                        .getRawOne() || { amountTarget: 0, storeTarget: 0 };
                    // targets = await this.target.createQueryBuilder('target')
                    //     .select("COALESCE(SUM(target.amountTarget), 0)", "amountTarget")
                    //     .addSelect("COALESCE(SUM(target.storeTarget), 0)", "storeTarget")
                    //     .where("target.empId = :empId", { empId: Number(empId) })
                    //     .andWhere("target.createdAt >= :startDate", { startDate: startDateOfYear })
                    //     .andWhere("target.createdAt <= :endDate", { endDate: endDateOfYear })
                    //     .groupBy("target.empId")
                    //     .getRawOne() || { amountTarget: 0, storeTarget: 0 };
                }
                catch (error) {
                    console.error("Error fetching target data:", error);
                    targets = { amountTarget: 0, storeTarget: 0 }; // Default values
                }
                const amountData = (Number(amountTargetAchieved === null || amountTargetAchieved === void 0 ? void 0 : amountTargetAchieved.totalAmount) / Number(targets.amountTarget)) * 100;
                const storeData = (Number(storeTargetAchieved === null || storeTargetAchieved === void 0 ? void 0 : storeTargetAchieved.totalStoreCount) / Number(targets.storeTarget)) * 100;
                const targetData = {
                    amountData: !isNaN(amountData) ? (_a = amountData === null || amountData === void 0 ? void 0 : amountData.toFixed(2)) !== null && _a !== void 0 ? _a : "" : 0,
                    storeData: !isNaN(storeData) ? (_b = storeData === null || storeData === void 0 ? void 0 : storeData.toFixed(2)) !== null && _b !== void 0 ? _b : "" : 0,
                    achievedAmount: (_c = amountTargetAchieved.totalAmount) !== null && _c !== void 0 ? _c : 0,
                    targetAmount: (_d = targets.amountTarget) !== null && _d !== void 0 ? _d : 0,
                    achievedStore: (_e = storeTargetAchieved.totalStoreCount) !== null && _e !== void 0 ? _e : 0,
                    targetStore: (_f = targets.storeTarget) !== null && _f !== void 0 ? _f : 0
                };
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: targetData };
            }
            catch (error) {
                throw error;
            }
        });
    }
    list(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { year, roles } = input;
            const parsedYear = parseInt(year, 10);
            const financialYear = !isNaN(parsedYear) ? parsedYear : new Date().getFullYear();
            const startDate = (0, moment_1.default)(`${financialYear}-04-01`).startOf('day').toDate();
            const endDate = (0, moment_1.default)(`${financialYear + 1}-03-31`).endOf('day').toDate();
            const formatTimeline = (start, end) => {
                const format = (d) => (0, moment_1.default)(d).format('MMM-YY');
                return `${format(start)} To ${format(end)}`;
            };
            const formattedTimeline = formatTimeline(startDate, endDate);
            let whereCondition = {};
            // Step 1: Fetch users with applicable roles
            if (roles && roles.length > 0) {
                whereCondition.role = roles;
            }
            const users = yield this.userRepositry.find({ where: whereCondition });
            const resultData = [];
            for (const user of users) {
                const empId = user.emp_id;
                // Step 2: Fetch target totals for the user
                const targetStats = yield this.target.createQueryBuilder('target')
                    .select('COALESCE(SUM(target.storeTarget), 0)', 'storeTarget')
                    .addSelect('COALESCE(SUM(target.amountTarget), 0)', 'amountTarget')
                    .addSelect('COALESCE(SUM(target.collectionTarget), 0)', 'collectionTarget')
                    .where('target.empId = :empId', { empId: empId })
                    .andWhere('target.date BETWEEN :start AND :end', { start: startDate, end: endDate })
                    .getRawOne();
                // Step 3: Aggregate order data
                const orderStats = yield this.getOrderRepositry.createQueryBuilder("orders")
                    .select("COALESCE(SUM(orders.orderAmount), 0)", "achievedAmount")
                    .addSelect("COALESCE(SUM(orders.collectedAmount), 0)", "achievedCollection")
                    .where("orders.empId = :empId", { empId: empId })
                    .andWhere("orders.createdAt BETWEEN :start AND :end", { start: startDate, end: endDate })
                    .andWhere("orders.orderStatus NOT IN (:...statuses)", {
                    statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED]
                })
                    .getRawOne();
                // Step 4: Count stores
                const storeStats = yield this.getStoreRepositry.createQueryBuilder("stores")
                    .select("stores.empId", "empId")
                    .select("COUNT(stores.storeId)", "achievedStore")
                    .where("stores.empId = :empId", { empId: empId })
                    // .andWhere("stores.createdAt BETWEEN :start AND :end", { start: startDate, end: endDate })
                    .getRawOne();
                resultData.push({
                    empId: empId,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    role: user.role,
                    timeline: formattedTimeline,
                    storeTarget: +targetStats.storeTarget,
                    amountTarget: +targetStats.amountTarget,
                    collectionTarget: +targetStats.collectionTarget,
                    achievedAmount: +orderStats.achievedAmount,
                    achievedCollection: +orderStats.achievedCollection,
                    achievedStore: +storeStats.achievedStore
                });
            }
            return { message: "Success", status: common_1.STATUSCODES.SUCCESS, data: resultData };
        });
    }
}
exports.TargetService = TargetController;
