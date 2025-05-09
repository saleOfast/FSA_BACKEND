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
exports.TargetService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const target_entity_1 = require("../../../../core/DB/Entities/target.entity");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
const orders_entity_1 = require("../../../../core/DB/Entities/orders.entity");
const stores_entity_1 = require("../../../../core/DB/Entities/stores.entity");
class TargetController {
    constructor() {
        this.target = (0, target_entity_1.TargetRepository)();
        this.userRepositry = (0, User_entity_1.UserRepository)();
        this.getOrderRepositry = (0, orders_entity_1.OrdersRepository)();
        this.getStoreRepositry = (0, stores_entity_1.StoreRepository)();
    }
    // async add(input: CreateTarget, payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { storeTarget = 1, amountTarget = 1, month = "2024-04-01T00:00:00.000Z", year = "2024-04-01T00:00:00.000Z", target, SSMId } = input;
    //         const { emp_id } = payload;
    //         const targetData: ITarget | null = await this.target.findOne({ where: { empId: Number(SSMId) } })
    //         if (targetData) {
    //             return { message: "User target already exist", status: STATUSCODES.NOT_FOUND }
    //         }
    //         const newTarget = new Target();
    //         newTarget.amountTarget = amountTarget;
    //         newTarget.storeTarget = storeTarget;
    //         newTarget.amountTarget = amountTarget;
    //         newTarget.month = new Date(month);
    //         newTarget.year = new Date(year);
    //         newTarget.empId = SSMId;
    //         newTarget.target = target;
    //         newTarget.managerId = emp_id
    //         await this.target.save(newTarget);
    //         // await this.userRepositry.createQueryBuilder().update({storeTarget, valueTarget:amountTarget}).where({ emp_id }).execute();
    //         return { message: "Success.", status: STATUSCODES.SUCCESS }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // async add(inputs: CreateTarget[], payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { emp_id } = payload;
    //         console.log({inputs})
    //         const targetsToInsert = inputs.map(input => {
    //             const { storeTarget=2, amountTarget=100, collectionTarget=100, month="2024-04-01T00:00:00.000Z", year="2024-04-01T00:00:00.000Z", SSMId, target } = input;
    //             const convertToISOString = (month: any, year: any): any => {
    //                 // Construct a date with the provided month and year
    //                 const date = new Date(`${month} ${year}`);
    //                 // Return the ISO string representation of the date
    //                 return date.toISOString();
    //             };
    //             const newTarget = new Target();
    //             newTarget.amountTarget = +amountTarget;
    //             newTarget.storeTarget = +storeTarget;
    //             newTarget.collectionTarget = +collectionTarget;
    //             newTarget.target = target;
    //             newTarget.month = convertToISOString(month as Date, year as Date);
    //             newTarget.year = convertToISOString(month as Date, year as Date);;
    //             newTarget.empId = SSMId;
    //             newTarget.managerId = emp_id
    //             return newTarget;
    //         });
    //         await Promise.all(targetsToInsert.map(target => this.target.save(target)));
    //         return { message: "Success.", status: STATUSCODES.SUCCESS }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    list(payload, input) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            const { emp_id, role } = payload;
            // const currentYear = new Date().getFullYear();
            const today = new Date();
            let currentYear = today.getFullYear();
            currentYear = today.getMonth() < 3 ? currentYear - 1 : currentYear;
            const { timePeriod = [common_1.TimelineEnum.YEAR, currentYear] } = input;
            console.log({ timePeriod }, "????");
            let empIds = [];
            if (role === common_1.UserRole.RSM) {
                const userLists = yield this.userRepositry.find({ where: { managerId: emp_id } });
                empIds = userLists.map((data) => data.emp_id);
            }
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
            if (timePeriod[0] === common_1.TimelineEnum.YEAR && timePeriod[1]) {
                startTimeline = new Date(Date.UTC(timePeriod[1], 0, 1)).toISOString();
                endTimeline = new Date(Date.UTC(timePeriod[1], 11, 31, 23, 59, 59, 999)).toISOString();
            }
            else if (timePeriod[0] === common_1.TimelineEnum.QUARTER && timePeriod[1]) {
                const selectedQuarter = quarters[timePeriod[1].toUpperCase().replace("Q", "")];
                startTimeline = selectedQuarter.start;
                endTimeline = selectedQuarter.end;
            }
            const targetData = [];
            const formatDate = (date) => {
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const month = months[date.getUTCMonth()];
                const year = date.getUTCFullYear().toString().slice(-2); // Get last two digits of the year
                return `${month}-${year}`;
            };
            let formattedStart = null, formattedEnd = null;
            if (timePeriod[0] === common_1.TimelineEnum.QUARTER) {
                const startDate = new Date(startTimeline);
                const endDate = new Date(endTimeline);
                formattedStart = formatDate(startDate);
                formattedEnd = formatDate(endDate);
            }
            else {
                if (timePeriod[0] === common_1.TimelineEnum.YEAR) {
                    formattedStart = formatDate(new Date(Date.UTC(+timePeriod[1], 3, 1)));
                    formattedEnd = formatDate(new Date(Date.UTC(+timePeriod[1] + 1, 2, 31, 23, 59, 59, 999)));
                }
                else {
                    formattedStart = formatDate(new Date(Date.UTC(+currentYear, 3, 1)));
                    formattedEnd = formatDate(new Date(Date.UTC(+currentYear + 1, 2, 31, 23, 59, 59, 999)));
                }
            }
            // console.log({ formattedStart, formattedEnd })
            try {
                let queryBuilder = this.target.createQueryBuilder('target')
                    .where('target.isDeleted = :isDeleted', { isDeleted: false });
                if (timePeriod[0] === common_1.TimelineEnum.YEAR) {
                    queryBuilder.andWhere("target.createdAt >= :startDate", { startDate: startTimeline })
                        .andWhere("target.createdAt <= :endDate", { endDate: endTimeline });
                }
                queryBuilder.orderBy('target.updatedAt', 'DESC')
                    .addOrderBy('target.createdAt', 'DESC');
                if (role === common_1.UserRole.RSM) {
                    queryBuilder = queryBuilder.andWhere('target.empId IN (:...empIds)', { empIds });
                }
                if (role === common_1.UserRole.RETAILER || role === common_1.UserRole.SSM) {
                    queryBuilder = queryBuilder.andWhere('target.empId =:empId', { empId: emp_id });
                }
                const targetList = yield queryBuilder.getMany();
                for (const targetLists of targetList) {
                    const orderTargetAchieved = yield this.getOrderRepositry.createQueryBuilder("orders")
                        .select("orders.empId", "empId")
                        .addSelect("SUM(orders.orderAmount)", "totalAmount")
                        .addSelect("SUM(orders.collectedAmount)", "totalCollectedAmount")
                        .leftJoin("orders.user", "user")
                        .addSelect("user.valueTarget", "valueTarget")
                        .addSelect("user.firstname", "firstname")
                        .addSelect("user.lastname", "lastname")
                        .addSelect("user.storeTarget", "storeTarget")
                        .where("orders.empId = :empId", { empId: targetLists.empId })
                        .andWhere("orders.createdAt >= :startDate", { startDate: startTimeline })
                        .andWhere("orders.createdAt <= :endDate", { endDate: endTimeline })
                        .andWhere("orders.orderStatus NOT IN (:...statuses)", { statuses: [common_1.OrderStatus.CANCELLED, common_1.OrderStatus.ORDERSAVED] })
                        .groupBy("orders.empId")
                        .addGroupBy("user.firstname")
                        .addGroupBy("user.lastname")
                        .addGroupBy("user.valueTarget")
                        .addGroupBy("user.storeTarget")
                        .getRawOne();
                    const storesTargetAchieved = yield this.getStoreRepositry.createQueryBuilder('stores')
                        .select("stores.empId", "empId")
                        .addSelect("COALESCE(COUNT(stores.storeId), 0)", "totalStoreCount")
                        .where("stores.empId = :empId", { empId: targetLists.empId })
                        .andWhere("stores.createdAt >= :startDate", { startDate: startTimeline })
                        .andWhere("stores.createdAt <= :endDate", { endDate: endTimeline })
                        .groupBy("stores.empId")
                        .getRawOne();
                    let targetUser;
                    // if (!orderTargetAchieved && !storesTargetAchieved) {
                    targetUser = yield this.userRepositry.findOne({
                        select: ["firstname", "lastname"],
                        where: { emp_id: targetLists.empId },
                    });
                    // }
                    targetData.push({
                        month: targetLists.month,
                        timeline: `${formattedStart} To ${formattedEnd}`,
                        target: {
                            targetId: targetLists.targetId,
                            empId: (_b = (_a = orderTargetAchieved === null || orderTargetAchieved === void 0 ? void 0 : orderTargetAchieved.empId) !== null && _a !== void 0 ? _a : targetUser === null || targetUser === void 0 ? void 0 : targetUser.empId) !== null && _b !== void 0 ? _b : targetLists.empId,
                            firstname: (_d = (_c = targetUser === null || targetUser === void 0 ? void 0 : targetUser.firstname) !== null && _c !== void 0 ? _c : orderTargetAchieved === null || orderTargetAchieved === void 0 ? void 0 : orderTargetAchieved.firstname) !== null && _d !== void 0 ? _d : '',
                            lastname: (_f = (_e = targetUser === null || targetUser === void 0 ? void 0 : targetUser.lastname) !== null && _e !== void 0 ? _e : orderTargetAchieved === null || orderTargetAchieved === void 0 ? void 0 : orderTargetAchieved.lastname) !== null && _f !== void 0 ? _f : '',
                            totalAmount: (_g = orderTargetAchieved === null || orderTargetAchieved === void 0 ? void 0 : orderTargetAchieved.totalAmount) !== null && _g !== void 0 ? _g : 0,
                            totalCollectedAmount: (_h = orderTargetAchieved === null || orderTargetAchieved === void 0 ? void 0 : orderTargetAchieved.totalCollectedAmount) !== null && _h !== void 0 ? _h : 0,
                            allTarget: (_j = targetLists === null || targetLists === void 0 ? void 0 : targetLists.target) !== null && _j !== void 0 ? _j : [],
                        },
                        achievedStores: storesTargetAchieved ? +storesTargetAchieved.totalStoreCount : 0
                    });
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: targetData };
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
    update(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { storeTarget = 1, amountTarget = 100, collectionTarget = 100, targetId, SSMId, month = "july", year = 2024, target } = input;
                const convertToISOString = (month, year) => {
                    // Construct a date with the provided month and year
                    const date = new Date(`${month} ${year}`);
                    // Return the ISO string representation of the date
                    return date.toISOString();
                };
                const months = convertToISOString(month, year);
                yield this.target.createQueryBuilder().update({
                    storeTarget: storeTarget,
                    amountTarget: amountTarget,
                    collectionTarget: Number(collectionTarget),
                    empId: SSMId,
                    month: months,
                    target: target,
                    year: months
                }).where({ targetId }).execute();
                return { message: "Updated.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const { targetId } = input;
                yield this.target.createQueryBuilder().update({ isDeleted: true }).where({ targetId: targetId }).execute();
                return { message: "Deleted Successfully.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getYearlyTargetById(payload, input) {
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
                    targets = (yield this.target.createQueryBuilder('target')
                        .select("COALESCE(SUM(target.amountTarget), 0)", "amountTarget")
                        .addSelect("COALESCE(SUM(target.storeTarget), 0)", "storeTarget")
                        .where("target.empId = :empId", { empId: Number(empId) })
                        .andWhere("target.createdAt >= :startDate", { startDate: startDateOfYear })
                        .andWhere("target.createdAt <= :endDate", { endDate: endDateOfYear })
                        .groupBy("target.empId")
                        .getRawOne()) || { amountTarget: 0, storeTarget: 0 };
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
    getAllTargetById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = input;
                // const { targetId } = input;
                const target = yield this.target.createQueryBuilder("target")
                    .select('target.target', 'targetData')
                    .addSelect('target.targetId', 'targetId')
                    .addSelect('target.empId', 'empId')
                    .where("target.emp_id = :emp_id", { emp_id })
                    .getRawOne();
                return { message: "Success", status: common_1.STATUSCODES.SUCCESS, data: target };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.TargetService = TargetController;
