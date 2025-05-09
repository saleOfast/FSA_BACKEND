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
exports.DistributorService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const stores_entity_1 = require("../../../../core/DB/Entities/stores.entity");
const date_fns_1 = require("date-fns");
const orders_entity_1 = require("../../../../core/DB/Entities/orders.entity");
const beat_entity_1 = require("../../../../core/DB/Entities/beat.entity");
class DistributorController {
    constructor() {
        this.storeRepositry = (0, stores_entity_1.StoreRepository)();
        this.orderRepositry = (0, orders_entity_1.OrdersRepository)();
        this.beatRespositry = (0, beat_entity_1.BeatRepository)();
    }
    createDistributor(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { storeName, addressLine1, addressLine2, townCity, state, email, pinCode, ownerName, mobileNumber, openingTime, closingTime, isPremiumStore, isActive, storeType, lat, long } = input;
                const { emp_id } = payload;
                const newStore = new stores_entity_1.Stores();
                newStore.empId = emp_id;
                newStore.storeName = storeName;
                newStore.lat = lat;
                newStore.long = long;
                newStore.storeType = storeType;
                newStore.addressLine1 = addressLine1;
                newStore.addressLine2 = addressLine2;
                newStore.townCity = townCity;
                newStore.state = state;
                newStore.email = email;
                newStore.pinCode = pinCode;
                newStore.ownerName = ownerName;
                newStore.mobileNumber = mobileNumber;
                newStore.openingTime = openingTime;
                newStore.closingTime = closingTime;
                newStore.isActive = isActive;
                newStore.isPremiumStore = isPremiumStore;
                yield this.storeRepositry.save(newStore);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Success." };
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { storeId, storeName, addressLine1, addressLine2, townCity, state, email, pinCode, ownerName, mobileNumber, openingTime, closingTime, isPremiumStore, isActive, storeType, lat, long, flatDiscount, visibilityDiscount, orderValueDiscount, isActiveOrderValueDiscount } = input;
                const { emp_id } = payload;
                const store = yield this.storeRepositry.findOne({ where: { storeId } });
                if (!store) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                yield this.storeRepositry.createQueryBuilder()
                    .update({ storeName, addressLine1, addressLine2, townCity, state, email, pinCode, ownerName, mobileNumber, openingTime, closingTime, isPremiumStore, isActive, storeType, lat, long, flatDiscount, visibilityDiscount, orderValueDiscount, isActiveOrderValueDiscount })
                    .where({ storeId }).execute();
                return { status: common_1.STATUSCODES.SUCCESS, message: 'Success.' };
            }
            catch (error) {
                throw error;
            }
        });
    }
    DistributorList(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { storeType, isUnbilled, storeCat, duration, beatId, pageNumber, pageSize } = input;
                const { emp_id, role } = payload;
                duration = duration ? duration : common_1.DurationEnum.ALL;
                let startDate;
                let endDate;
                if (storeType == common_1.StoreTypeFilter.NEW) {
                    const currentDate = new Date();
                    startDate = (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(currentDate, 30));
                    endDate = (0, date_fns_1.endOfDay)(currentDate);
                }
                if (duration == common_1.DurationEnum.WEEK) {
                    const today = new Date();
                    const sevenDaysAgo = (0, date_fns_1.subDays)(today, 6);
                    startDate = (0, date_fns_1.startOfDay)(sevenDaysAgo);
                    endDate = (0, date_fns_1.endOfDay)(today);
                }
                else if (duration == common_1.DurationEnum.TODAY) {
                    startDate = (0, date_fns_1.startOfDay)(new Date());
                    endDate = (0, date_fns_1.endOfDay)(new Date());
                }
                let fitlerQuery = {};
                if (role === common_1.UserRole.ADMIN) {
                    const storeIds = yield this.storeRepositry.createQueryBuilder("stores")
                        .leftJoin("stores.user", "user")
                        .where("user.managerId = :managerId", { managerId: emp_id })
                        .select("stores.storeId")
                        .getMany()
                        .then((stores) => stores.map(store => store.storeId));
                    if (storeIds.length > 0) {
                        fitlerQuery.storeId = storeIds;
                    }
                    else {
                        return { message: "No visitIds found for admin user.", status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
                else {
                    fitlerQuery = {
                        empId: emp_id
                    };
                }
                let buildQuery = this.storeRepositry.createQueryBuilder('stores')
                    .leftJoinAndSelect("stores.storeCat", "storeCat");
                if (role === common_1.UserRole.ADMIN) {
                    buildQuery.where("stores.storeId IN (:...storeId)", { storeId: fitlerQuery.storeId });
                }
                else {
                    buildQuery.where("stores.empId = :empId", { empId: emp_id });
                }
                if (startDate && endDate) {
                    buildQuery.andWhere("stores.createdAt BETWEEN :startDate AND :endDate", { startDate, endDate });
                }
                if (storeCat) {
                    const catIdsArray = storeCat.split(',').map(id => Number(id));
                    buildQuery.andWhere("stores.storeType IN (:...storeType)", { storeType: (catIdsArray) });
                }
                const orderSubquery = this.orderRepositry.createQueryBuilder("orders")
                    .select("orders.storeId", "storeId")
                    .getQuery();
                if (isUnbilled == common_1.StoreBilling.BILLED) {
                    buildQuery.andWhere(`stores.storeId IN (${orderSubquery})`);
                }
                else if (isUnbilled == common_1.StoreBilling.UNBILLED) {
                    buildQuery.andWhere(`stores.storeId NOT IN (${orderSubquery})`);
                }
                const beatIdsArray = beatId ? beatId.split(',').map(id => Number(id)) : [0];
                let beatSubQuery = yield this.beatRespositry.createQueryBuilder('beat')
                    .where('beat.beatId IN (:...beatId)', { beatId: (beatIdsArray) })
                    .getMany();
                if (beatSubQuery.length > 0) {
                    const newArr = beatSubQuery.map((item) => item.store).flat();
                    buildQuery.andWhere(`stores.storeId IN (${newArr})`);
                }
                buildQuery.orderBy("stores.createdAt", "DESC");
                buildQuery.skip((+pageNumber - 1) * +pageSize).take(+pageSize);
                const result = yield buildQuery.getManyAndCount();
                const beats = yield this.beatRespositry.find();
                for (let store of result[0]) {
                    store.beat = beats.find((element) => {
                        return element.store.includes(store.storeId);
                    });
                }
                const response = {
                    stores: result.length > 0 ? result[0] : [],
                    pagination: {
                        pageNumber: +pageNumber,
                        pageSize: +pageSize,
                        totalRecords: result.length > 0 ? result[1] : 0
                    }
                };
                return { status: common_1.STATUSCODES.SUCCESS, message: 'Success.', data: response };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDistributorById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { storeId } = input;
                const storeDetails = yield this.storeRepositry.findOne({ where: { storeId: Number(storeId) }, relations: ["storeCat"] });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: storeDetails };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.DistributorService = DistributorController;
