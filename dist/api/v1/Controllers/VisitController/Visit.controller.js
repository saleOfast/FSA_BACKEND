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
exports.VisitService = void 0;
const Visit_entity_1 = require("../../../../core/DB/Entities/Visit.entity");
const common_1 = require("../../../../core/types/Constent/common");
const date_fns_1 = require("date-fns");
const typeorm_1 = require("typeorm");
const stores_entity_1 = require("../../../../core/DB/Entities/stores.entity");
const beat_entity_1 = require("../../../../core/DB/Entities/beat.entity");
const attendance_entity_1 = require("../../../../core/DB/Entities/attendance.entity");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
class VisitController {
    constructor() {
        this.visitRepositry = (0, Visit_entity_1.VisitRepository)();
        this.storeRepositry = (0, stores_entity_1.StoreRepository)();
        this.beatRepositry = (0, beat_entity_1.BeatRepository)();
        this.attendance = (0, attendance_entity_1.AttendanceRepository)();
        this.userRepository = (0, User_entity_1.UserRepository)();
    }
    createVisit(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { store, visitDate, beat, emp_id } = input;
                // const { emp_id } = payload;
                for (const id of store) {
                    const newVisit = new Visit_entity_1.Visits();
                    newVisit.store = store;
                    newVisit.storeId = id;
                    newVisit.empId = emp_id;
                    newVisit.visitDate = visitDate;
                    newVisit.beat = beat;
                    yield this.visitRepositry.save(newVisit);
                }
                // const newVisit = new Visits();
                // newVisit.store = store;
                // newVisit.storeId = storeId;
                // newVisit.empId = emp_id;
                // newVisit.visitDate = visitDate;
                // newVisit.beat = beat;
                // await this.visitRepositry.save(newVisit);
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    visitList(payload, input) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id, role } = payload;
                let { duration, beatId, pageNumber, pageSize, status } = input;
                duration = duration ? duration : common_1.DurationEnum.TODAY;
                let fitlerQuery = {};
                if (role === common_1.UserRole.RSM) {
                    const visitIds = yield this.visitRepositry.createQueryBuilder("visits")
                        .leftJoin("visits.user", "user")
                        .where("user.managerId = :managerId", { managerId: emp_id })
                        .select("visits.visitId")
                        .getMany()
                        .then((visits) => visits.map(visit => visit.visitId));
                    if (visitIds.length > 0) {
                        fitlerQuery.visitId = (0, typeorm_1.In)(visitIds);
                    }
                    else {
                        return { message: "No visitIds found for admin user.", status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
                else if (role === common_1.UserRole.SSM || role === common_1.UserRole.RETAILER) {
                    fitlerQuery = {
                        empId: emp_id
                    };
                }
                if (duration == common_1.DurationEnum.WEEK) {
                    const today = new Date();
                    const sevenDaysAgo = (0, date_fns_1.subDays)(today, 6);
                    const startDate = (0, date_fns_1.startOfDay)(sevenDaysAgo);
                    const endDate = (0, date_fns_1.endOfDay)(today);
                    fitlerQuery.visitDate = (0, typeorm_1.Between)(startDate, endDate);
                }
                else if (duration == common_1.DurationEnum.TODAY) {
                    const startDate = (0, date_fns_1.startOfDay)(new Date());
                    const endDate = (0, date_fns_1.endOfDay)(new Date());
                    fitlerQuery.visitDate = (0, typeorm_1.Between)(startDate, endDate);
                }
                if (beatId) {
                    fitlerQuery.beat = +beatId;
                }
                if (status) {
                    fitlerQuery.status = common_1.VisitStatus.COMPLETE;
                }
                const visits = yield this.visitRepositry.findAndCount({
                    where: fitlerQuery,
                    order: {
                        status: 'ASC',
                        createdAt: 'DESC'
                    },
                    skip: (+pageNumber - 1) * +pageSize,
                    take: +pageSize
                });
                if (!visits.length) {
                    return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: visits };
                }
                fitlerQuery.status = common_1.VisitStatus.COMPLETE;
                const count = yield this.visitRepositry.count({
                    where: fitlerQuery,
                });
                let visitList = [];
                for (let visit of visits[0]) {
                    const storeDetails = yield this.storeRepositry.findOne({ where: { storeId: visit.storeId }, relations: ["storeCat"] });
                    if (!storeDetails) {
                        return { message: `Store not find for vist: ${visit.visitId} and StoreId: ${visit.storeId}`, status: common_1.STATUSCODES.NOT_FOUND };
                    }
                    const beatDetails = yield this.beatRepositry.findOne({ where: { beatId: visit.beat } });
                    // if (!beatDetails) {
                    //     return { message: `Beat not find for vist: ${visit.visitId} and StoreId: ${visit.storeId}`, status: STATUSCODES.NOT_FOUND }
                    // }
                    let visitData = {
                        visitId: visit.visitId,
                        empId: visit.empId,
                        visitDate: visit.visitDate,
                        visitStatus: visit.status,
                        noOrderReason: visit.noOrderReason,
                        beatDetails: {
                            beatId: (_a = visit.beat) !== null && _a !== void 0 ? _a : null,
                            beatName: (_b = beatDetails === null || beatDetails === void 0 ? void 0 : beatDetails.beatName) !== null && _b !== void 0 ? _b : ""
                        },
                        storeDetails: storeDetails,
                        checkIn: visit.checkIn,
                        checkOut: visit.checkOut,
                        status: visit.status,
                        callType: visit.isCallType,
                    };
                    visitList.push(visitData);
                }
                const response = {
                    visitList: visitList,
                    pagination: {
                        pageNumber: +pageNumber,
                        pageSize: +pageSize,
                        totalRecords: visits.length > 0 ? visits[1] : 0,
                        completedVisitCount: count
                    }
                };
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: response };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getVisitById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id, role } = payload;
                const { visitId } = input;
                let fitlerQuery;
                if (role === common_1.UserRole.SSM || role === common_1.UserRole.RETAILER) {
                    fitlerQuery = {
                        empId: emp_id,
                        visitId: Number(visitId)
                    };
                }
                else {
                    fitlerQuery = {
                        visitId: Number(visitId)
                    };
                }
                const visit = yield this.visitRepositry.findOne({ where: fitlerQuery });
                if (!visit) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                const storeDetails = yield this.storeRepositry.findOne({ where: { storeId: visit.storeId }, relations: ["storeCat"] });
                if (!storeDetails) {
                    return { message: `Store not find for vist: ${visit.visitId} and StoreId: ${visit.storeId}`, status: common_1.STATUSCODES.NOT_FOUND };
                }
                const beatDetails = yield this.beatRepositry.findOne({ where: { beatId: visit.beat } });
                if (!beatDetails) {
                    return { message: `Beat not find for vist: ${visit.visitId} and StoreId: ${visit.storeId}`, status: common_1.STATUSCODES.NOT_FOUND };
                }
                let visitData = {
                    visitId: visit.visitId,
                    empId: visit.empId,
                    visitDate: visit.visitDate,
                    visitStatus: visit.status,
                    beatDetails: {
                        beatId: visit.beat,
                        beatName: beatDetails.beatName
                    },
                    storeDetails: storeDetails,
                    checkOut: visit.checkOut,
                    checkIn: visit.checkIn,
                    status: visit.status,
                    callType: visit.isCallType,
                    image: visit.image,
                    noOrderReason: visit.noOrderReason
                };
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: visitData };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateImage(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { image, visitId } = input;
                const visit = yield this.visitRepositry.findOne({ where: { visitId } });
                if (!visit) {
                    return { message: "Visit not found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                yield this.visitRepositry.createQueryBuilder().update({ image }).where({ visitId }).execute();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    checkIn(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id, role } = payload;
                const { visitId, checkIn, checkInLat, checkInLong, action } = input;
                const visit = yield this.visitRepositry.findOne({ where: { visitId } });
                if (!visit) {
                    return { message: "Visit not found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                // const attendance: any | undefined = await this.attendance
                //     .createQueryBuilder("attendance")
                //     .where("attendance.empId = :empId", { empId: emp_id })
                //     .orderBy("attendance.createdAt", "DESC")
                //     .take(1)
                //     .getOne();
                // if (!attendance && role === UserRole.SSM) {
                //     return { message: "Please mark you attendance.", status: STATUSCODES.BAD_REQUEST }
                // }
                // const checkInDate = attendance.checkIn;
                // const checkOutDate = attendance.checkOut;
                const newDate = new Date();
                // if (checkInDate.getDate() != newDate.getDate() && role === UserRole.SSM) {
                //     return { message: "Please mark you attendance.", status: STATUSCODES.CONFLICT }
                // }
                // if(checkOutDate?.getDate() === newDate.getDate() && role === UserRole.SSM) {
                //     return { message: "You can't access because you had already checked out.", status: STATUSCODES.CONFLICT }
                // }
                const activity = {
                    action,
                    time: checkIn,
                    lat: checkInLat,
                    long: checkInLong
                };
                // console.log({visit, activity})
                const updatedActivity = [...visit.activity || [], activity];
                yield this.visitRepositry.createQueryBuilder()
                    .update()
                    .set({
                    checkIn,
                    checkInLat,
                    checkInLong,
                    activity: updatedActivity,
                    status: common_1.VisitStatus.COMPLETE,
                    //    visitStatus: VisitStatus.COMPLETE
                })
                    .where({ visitId })
                    .execute();
                return { message: "Success.dhfjfjd", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    checkOut(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const { visitId, checkOut, checkOutLat, checkOutLong, image } = input;
                const visit = yield this.visitRepositry.findOne({ where: { visitId } });
                if (!visit) {
                    return { message: "Visit not found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                const store = yield this.storeRepositry.findOne({ where: { storeId: visit.storeId } });
                if (!store) {
                    return { message: "Store Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                const storeLatLong = {
                    latitude: store.lat,
                    longitude: store.long
                };
                const visitLatLong = {
                    latitude: visit.checkInLat,
                    longitude: visit.checkInLong
                };
                const distanse = this.haversineDistance(storeLatLong, visitLatLong);
                console.log(distanse, 'distanse==========');
                let callType = common_1.CallType.TELEVISIT;
                if (distanse < 100) {
                    callType = common_1.CallType.PHYSICAL;
                }
                yield this.visitRepositry.createQueryBuilder().update({ checkOut, checkOutLat, checkOutLong, status: common_1.VisitStatus.COMPLETE, image, isCallType: callType }).where({ visitId, empId: emp_id }).execute();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    haversineDistance(coords1, coords2) {
        function toRad(x) {
            return x * Math.PI / 180;
        }
        var R = 6371e3; // Earth radius in meters
        var dLat = toRad(coords2.latitude - coords1.latitude);
        var dLon = toRad(coords2.longitude - coords1.longitude);
        var lat1 = toRad(coords1.latitude);
        var lat2 = toRad(coords2.latitude);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    dayTrackingReport(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { role, emp_id } = payload;
            const { timePeriod } = input;
            let startTimeline = null, endTimeline = null;
            const today = new Date();
            startTimeline = new Date(timePeriod);
            startTimeline.setUTCHours(0, 0, 0, 0);
            endTimeline = new Date(timePeriod);
            endTimeline.setUTCHours(23, 59, 59, 999);
            // console.log({startTimeline, endTimeline, timePeriod})
            try {
                const userLists = yield this.userRepository.find({ where: { managerId: emp_id } });
                const empIds = userLists.map((data) => data.emp_id);
                // const userLists: IUser[] | null = await this.usersRespositry.find({ select: ["emp_id"] });
                // let empIds = userLists.map((data: any) => data.emp_id);
                let queryBuilder = (yield this.visitRepositry
                    .createQueryBuilder('visits')
                    .leftJoin("visits.user", "user")
                    .select("user.firstname", "firstname")
                    .addSelect("user.lastname", "lastname")
                    .addSelect("visits.activity", "activity")
                    .addSelect("user.emp_id", "empId")
                    .where("visits.checkIn >= :startDate", { startDate: startTimeline.toISOString() })
                    .andWhere("visits.checkIn <= :endDate", { endDate: endTimeline.toISOString() }));
                // .orderBy('visits.checkIn', 'ASC')
                // .getRawMany();
                // console.log(dayTracking)
                if (role === common_1.UserRole.RSM) {
                    queryBuilder.andWhere("visits.empId IN (:...empIds)", { empIds });
                }
                if (role === common_1.UserRole.SSM || role === common_1.UserRole.RETAILER) {
                    queryBuilder.andWhere("visits.empId = :empId", { empId: emp_id });
                }
                const dayTracking = yield queryBuilder.orderBy('visits.checkIn', 'ASC')
                    .getRawMany();
                return { status: common_1.STATUSCODES.SUCCESS, message: "Success.", data: dayTracking };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateOrderBySpecialDiscount(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { visitId, noOrderReason = '' } = input;
                const visit = yield (0, Visit_entity_1.VisitRepository)().findOne({ where: { visitId } });
                if (!visit) {
                    return { message: "Visit Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                yield (0, Visit_entity_1.VisitRepository)().update(visitId, { noOrderReason });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPastNoOrder(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role, emp_id } = payload;
                const { empId, storeId } = input;
                let queryBuilder = (yield this.visitRepositry.createQueryBuilder('visits')
                    .select([
                    'visits.updated_at AS date',
                    'visits.noOrderReason AS reason',
                ])
                    .where('visits.noOrderReason IS NOT NULL')
                    .andWhere('visits.storeId =:storeId', { storeId: Number(storeId) })
                    .andWhere('visits.empId =:empId', { empId: Number(empId) }));
                const pastNoOrder = yield queryBuilder.getRawMany();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: pastNoOrder };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPictureByStoreId(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role, emp_id } = payload;
                const { storeId } = input;
                let queryBuilder = (yield this.visitRepositry.createQueryBuilder('visits')
                    .select([
                    'visits.image AS image',
                    'visits.updatedAt AS date',
                ])
                    .where('visits.storeId =:storeId', { storeId: Number(storeId) }));
                const pictures = yield queryBuilder.orderBy("visits.updatedAt", "DESC").getRawMany();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: pictures };
            }
            catch (error) {
                throw error;
            }
        });
    }
    // async updateActivity(input: UpdateActivityById): Promise<IApiResponse> {
    //     try {
    //         const { visitId, action, lat, long, time } = input;
    //         const visit: IVisit | null = await VisitRepository().findOne({ where: { visitId } });
    //         if (!visit) {
    //             return { message: "Order Not Found.", status: STATUSCODES.NOT_FOUND };
    //         }
    //         // const previousStatus: OrderStatus = order.orderStatus;
    //         // await VisitRepository().update(visitId, { orderStatus });
    //         const activity: any = {
    //             action,
    //             time,
    //             lat,
    //             long
    //         };
    //         const updatedActivity: any[] = [...visit.activity, activity];
    //         await VisitRepository().update(visitId, { activity: updatedActivity });
    //         return { message: "Success.", status: STATUSCODES.SUCCESS };
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    createMultipleVisits(inputs, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                // Iterate over each visit input
                for (const input of inputs) {
                    const { store, visitDate, beat, emp_id } = input;
                    // Process each store in the input
                    for (const id of store) {
                        const newVisit = new Visit_entity_1.Visits();
                        newVisit.store = store;
                        newVisit.storeId = id;
                        newVisit.empId = emp_id;
                        newVisit.visitDate = visitDate;
                        newVisit.beat = beat;
                        // Save the new visit record to the database
                        yield this.visitRepositry.save(newVisit);
                    }
                }
                return { message: "All visits created successfully.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    visitReport() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const visits = yield this.visitRepositry.find({
                    relations: { stores: { storeCat: true }, user: true },
                });
                if (!visits || visits.length === 0) {
                    return { message: "Not Found", status: common_1.STATUSCODES.NOT_FOUND };
                }
                const mrVisitMap = new Map();
                let grandDoctor = 0;
                let grandChemist = 0;
                let grandStockist = 0;
                let grandTotal = 0;
                for (const visit of visits) {
                    const mrId = String((_a = visit === null || visit === void 0 ? void 0 : visit.user) === null || _a === void 0 ? void 0 : _a.emp_id);
                    const mrName = ((_b = visit === null || visit === void 0 ? void 0 : visit.user) === null || _b === void 0 ? void 0 : _b.firstname) + ' ' + ((_c = visit === null || visit === void 0 ? void 0 : visit.user) === null || _c === void 0 ? void 0 : _c.lastname);
                    const categoryName = ((_f = (_e = (_d = visit.stores) === null || _d === void 0 ? void 0 : _d.storeCat) === null || _e === void 0 ? void 0 : _e.categoryName) === null || _f === void 0 ? void 0 : _f.toLowerCase()) || '';
                    if (!mrVisitMap.has(mrId)) {
                        mrVisitMap.set(mrId, {
                            name: mrName,
                            doctor: 0,
                            chemist: 0,
                            stockist: 0,
                            total: 0,
                        });
                    }
                    const mrData = mrVisitMap.get(mrId);
                    if (categoryName.startsWith('doctor')) {
                        mrData.doctor += 1;
                        grandDoctor += 1;
                    }
                    else if (categoryName.startsWith('chemist')) {
                        mrData.chemist += 1;
                        grandChemist += 1;
                    }
                    else if (categoryName.startsWith('stockist')) {
                        mrData.stockist += 1;
                        grandStockist += 1;
                    }
                    mrData.total += 1;
                    grandTotal += 1;
                }
                const data = Array.from(mrVisitMap.values());
                return {
                    message: "Success.",
                    status: common_1.STATUSCODES.SUCCESS,
                    data: {
                        mrWise: data,
                        grandTotal: {
                            doctor: grandDoctor,
                            chemist: grandChemist,
                            stockist: grandStockist,
                            total: grandTotal,
                        },
                    },
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.VisitService = VisitController;
