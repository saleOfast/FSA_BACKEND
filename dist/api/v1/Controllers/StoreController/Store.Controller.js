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
exports.StoreService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const stores_entity_1 = require("../../../../core/DB/Entities/stores.entity");
const storeCategory_entity_1 = require("../../../../core/DB/Entities/storeCategory.entity");
const date_fns_1 = require("date-fns");
const orders_entity_1 = require("../../../../core/DB/Entities/orders.entity");
const beat_entity_1 = require("../../../../core/DB/Entities/beat.entity");
const Visit_entity_1 = require("../../../../core/DB/Entities/Visit.entity");
class StoreController {
    constructor() {
        this.storeRepositry = (0, stores_entity_1.StoreRepository)();
        this.categoryRepositry = (0, storeCategory_entity_1.StoreCategoryRepository)();
        this.orderRepositry = (0, orders_entity_1.OrdersRepository)();
        this.beatRespositry = (0, beat_entity_1.BeatRepository)();
        this.visitRepository = (0, Visit_entity_1.VisitRepository)();
    }
    createStore(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { assignTo, assignToRetailor, storeName, uid, addressLine1, addressLine2, townCity, state, district, email, pinCode, ownerName, mobileNumber, alterMobile, openingTime, closingTime, openingTimeAmPm, closingTimeAmPm, paymentMode, isPremiumStore, isActive, storeType, lat, long, flatDiscount, visibilityDiscount, isActiveOrderValueDiscount, orderValueDiscount, qualification, doctorCode, speciality, language_known, DOB, dateOfWedding, clinicName, RegistrationNumber, territory, orgName, patientVolume, availability } = input;
                const { emp_id, role } = payload;
                let queryBuilder = this.storeRepositry.createQueryBuilder("store")
                    .where("store.mobileNumber = :mobileNumber", { mobileNumber });
                if (alterMobile) {
                    queryBuilder.orWhere("store.alterMobile = :alterMobile", { alterMobile });
                }
                const store = yield queryBuilder.getOne();
                if (store) {
                    return { message: "Store Already exist", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                const newStore = new stores_entity_1.Stores();
                newStore.empId = (role === common_1.UserRole.SSM || role === common_1.UserRole.RETAILER) ? emp_id : assignTo;
                newStore.retailorId = assignToRetailor !== null && assignToRetailor !== void 0 ? assignToRetailor : null;
                newStore.storeName = storeName;
                newStore.uid = uid;
                newStore.lat = lat;
                newStore.long = long;
                newStore.storeType = storeType;
                newStore.addressLine1 = addressLine1;
                newStore.addressLine2 = addressLine2;
                newStore.townCity = townCity;
                newStore.state = state;
                newStore.district = district;
                newStore.email = email;
                newStore.pinCode = pinCode;
                newStore.ownerName = ownerName;
                newStore.mobileNumber = mobileNumber;
                newStore.alterMobile = alterMobile;
                newStore.openingTime = openingTime;
                newStore.closingTime = closingTime;
                newStore.openingTimeAmPm = openingTimeAmPm;
                newStore.closingTimeAmPm = closingTimeAmPm;
                newStore.paymentMode = paymentMode;
                newStore.isActive = isActive;
                newStore.isPremiumStore = isPremiumStore;
                newStore.flatDiscount = flatDiscount;
                newStore.visibilityDiscount = visibilityDiscount;
                newStore.isActiveOrderValueDiscount = isActiveOrderValueDiscount;
                newStore.orderValueDiscount = orderValueDiscount;
                newStore.qualification = qualification;
                newStore.doctorCode = doctorCode;
                newStore.speciality = speciality;
                newStore.language_known = language_known;
                newStore.DOB = DOB;
                newStore.dateOfWedding = dateOfWedding;
                newStore.clinicName = clinicName;
                newStore.RegistrationNumber = RegistrationNumber;
                newStore.territory = territory;
                newStore.orgName = orgName;
                newStore.patientVolume = patientVolume;
                newStore.availability = availability;
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
                const { storeId, assignToRetailor, storeName, assignTo, addressLine1, addressLine2, townCity, district, state, email, pinCode, ownerName, mobileNumber, alterMobile, openingTime, closingTime, openingTimeAmPm, closingTimeAmPm, paymentMode, isPremiumStore, isActive, storeType, lat, long, flatDiscount, visibilityDiscount, orderValueDiscount, isActiveOrderValueDiscount, qualification, doctorCode, speciality, language_known, DOB, dateOfWedding, clinicName, RegistrationNumber, territory, orgName, patientVolume, availability } = input;
                const { emp_id, role } = payload;
                const store = yield this.storeRepositry.findOne({ where: { storeId } });
                if (!store) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                let empId = null;
                if (role === common_1.UserRole.SSM || role === common_1.UserRole.RETAILER) {
                    empId = emp_id;
                }
                else {
                    empId = assignTo;
                }
                //   console.log({assignTo, empId})
                yield this.storeRepositry.createQueryBuilder()
                    .update({ empId: role === common_1.UserRole.SSM ? emp_id : assignTo, retailorId: assignToRetailor !== null && assignToRetailor !== void 0 ? assignToRetailor : null, storeName, addressLine1, addressLine2, townCity, district, state, email, pinCode, ownerName, mobileNumber, alterMobile, openingTime, closingTime, openingTimeAmPm, closingTimeAmPm, paymentMode, isPremiumStore, isActive, storeType, lat, long, flatDiscount, visibilityDiscount, orderValueDiscount, isActiveOrderValueDiscount, qualification, doctorCode, speciality, language_known, DOB, dateOfWedding, clinicName, RegistrationNumber, territory, orgName, patientVolume, availability })
                    .where({ storeId }).execute();
                return { status: common_1.STATUSCODES.SUCCESS, message: 'Success.' };
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { storeId } = input;
                yield this.storeRepositry.createQueryBuilder().update({ isDeleted: true }).where({ storeId: Number(storeId) }).execute();
                return { message: "Category Deleted.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    storeList(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { storeSearch, storeType, isUnbilled, storeCat, duration, beatId, pageNumber, pageSize } = input;
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
                let fitlerQuery = [];
                if (role === common_1.UserRole.RSM) {
                    const storeIds = yield this.beatRespositry.createQueryBuilder("beat")
                        .leftJoin("beat.user", "user")
                        .where("user.managerId = :managerId", { managerId: emp_id })
                        .select("beat.store")
                        .getMany()
                        .then((beats) => beats.map(beat => beat.store));
                    // console.log({storeIds})
                    if (storeIds.length > 0) {
                        fitlerQuery = storeIds;
                    }
                    else {
                        return { message: "No Store found for user.", status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
                else if (role === common_1.UserRole.SSM || role === common_1.UserRole.RETAILER) {
                    const stores = yield this.beatRespositry.createQueryBuilder("beat")
                        .where("beat.empId = :empId", { empId: emp_id })
                        .select("beat.store")
                        .getMany();
                    if (stores.length > 0) {
                        fitlerQuery = stores;
                    }
                }
                // console.log({fitlerQuery})
                let buildQuery = this.storeRepositry.createQueryBuilder('stores')
                    .leftJoinAndSelect("stores.storeCat", "storeCat");
                if (role === common_1.UserRole.SSM || role === common_1.UserRole.RETAILER || role === common_1.UserRole.CHANNEL || role === common_1.UserRole.RSM) {
                    const storeIds = fitlerQuery.map((beat) => beat.store).flat();
                    buildQuery.where("stores.storeId IN (:...storeIds)", { storeIds: storeIds });
                }
                if (storeSearch) {
                    buildQuery.andWhere(`(
                        LOWER(stores.store_name) LIKE LOWER(:searchTerm) OR
                          LOWER(storeCat.category_name) LIKE LOWER(:searchTerm) OR
                           CAST(stores.storeId AS TEXT) LIKE :searchTerm
                     )`, { searchTerm: `%${storeSearch.toLowerCase()}%` });
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
                buildQuery.orderBy("stores.updatedAt", "DESC");
                buildQuery.skip((+pageNumber - 1) * +pageSize).take(+pageSize);
                const result = yield buildQuery.getManyAndCount();
                const beats = yield this.beatRespositry.find();
                for (let store of result[0]) {
                    store.beat = beats.find((element) => {
                        return Array.isArray(element.store) && element.store.includes(store.storeId);
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
                console.error("storeList Error:", { error });
                throw error;
            }
        });
    }
    getStoreById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { storeId } = input;
                const currentYear = new Date().getFullYear();
                // const storeDetails: IStore | null = await this.storeRepositry.findOne({ where: { storeId: Number(storeId) }, relations: ["storeCat"] });
                const storeDetails = yield this.storeRepositry.createQueryBuilder('stores')
                    .leftJoinAndSelect('stores.user', 'user')
                    .leftJoinAndSelect('stores.storeCat', 'storeCat')
                    .where('stores.storeId = :storeId', { storeId: Number(storeId) })
                    .getOne();
                const storeVisitDetails = yield this.visitRepository.createQueryBuilder('visits')
                    .select([
                    "EXTRACT(MONTH FROM visits.createdAt) AS \"monthNumber\"",
                    "TO_CHAR(visits.createdAt, 'Mon') AS \"month\"",
                    "COUNT(visits.visit_id) AS \"visitCount\""
                ])
                    .where('visits.storeId = :storeId', { storeId: Number(storeId) })
                    .andWhere('visits.status = :status', { status: common_1.VisitStatus.COMPLETE })
                    .andWhere('EXTRACT(YEAR FROM visits.createdAt) = :currentYear', { currentYear })
                    .groupBy('"monthNumber", "month"')
                    .orderBy('"monthNumber"', "ASC")
                    .getRawMany();
                // Ensure correct key access
                const visitMap = new Map(storeVisitDetails.map(v => [Number(v.monthNumber), Number(v.visitCount)]));
                // Generate the final result
                const result = Array.from({ length: 12 }, (_, i) => ({
                    month: new Date(currentYear, i).toLocaleString('en', { month: 'short' }) + `-${currentYear}`,
                    visitCount: visitMap.get(i + 1) || 0
                }));
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: Object.assign(Object.assign({}, storeDetails), { visitAnalysis: result }), };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getStoreByType(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { storeType } = input;
                const query = this.storeRepositry.createQueryBuilder('stores')
                    .select(['stores.storeId', 'stores.storeName'])
                    .leftJoin('stores.storeCat', 'storeCat');
                if (storeType === "doctor") {
                    const doctorQuery = yield this.storeRepositry.createQueryBuilder('stores')
                        .select(['stores.storeId'])
                        .leftJoin('stores.storeCat', 'storeCat')
                        .where(`LOWER(storeCat.category_name) LIKE LOWER(:category_name)`, { category_name: 'doctor%' })
                        .getMany();
                    const storeTypeIds = doctorQuery.map(store => store.storeId);
                    if (storeTypeIds.length > 0) {
                        query.where('stores.storeId IN (:...storeTypeIds)', { storeTypeIds });
                    }
                    else {
                        query.where('1=0'); // Ensures no records are returned if no matching store IDs exist
                    }
                }
                else {
                    query.where('stores.storeType = :storeType', { storeType });
                }
                const storeDetails = yield query.getMany();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: storeDetails };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createCategory(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryName } = input;
                const { emp_id } = payload;
                const createCategory = new storeCategory_entity_1.StoreCategory();
                createCategory.categoryName = categoryName;
                createCategory.empId = emp_id;
                const cat = yield this.categoryRepositry.save(createCategory);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Success." };
            }
            catch (error) {
                throw error;
            }
        });
    }
    categoryList(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryList = yield this.categoryRepositry.find({ where: { isDeleted: false } });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Success.", data: categoryList };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCatoryById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = input;
                const categoryDetails = yield this.categoryRepositry.findOne({ where: { storeCategoryId: Number(categoryId), isDeleted: false } });
                if (!categoryDetails) {
                    return { message: "Store Category Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: categoryDetails };
            }
            catch (error) {
                throw error;
            }
        });
    }
    udpateCategory(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, categoryName } = input;
                const category = yield this.categoryRepositry.findOne({ where: { storeCategoryId: Number(categoryId), isDeleted: false } });
                if (!category) {
                    return { message: "Store Category Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                yield this.categoryRepositry.createQueryBuilder().update({ categoryName }).where({ storeCategoryId: Number(categoryId) }).execute();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteCategory(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = input;
                yield this.categoryRepositry.createQueryBuilder().update({ isDeleted: true }).where({ storeCategoryId: Number(categoryId) }).execute();
                return { message: "Category Deleted.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createImportStores(inputs, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { emp_id, role } = payload;
            const skippedStores = []; // Track skipped stores
            const processedStores = new Set(); // Track unique stores by combination of storeName, uid, and empId
            // Validate input data
            if (inputs.length === 0) {
                return { message: "No stores to create.", status: common_1.STATUSCODES.BAD_REQUEST };
            }
            // Filter and prepare stores to save
            const storeEntities = [];
            for (const input of inputs) {
                const { assignTo, storeName, uid, addressLine1, addressLine2, townCity, state, email, pinCode, ownerName, mobileNumber, openingTime, closingTime, isPremiumStore, isActive, storeType, lat, long, flatDiscount, visibilityDiscount, isActiveOrderValueDiscount, orderValueDiscount, empId, assignToRetailor } = input;
                const actualEmpId = (role === common_1.UserRole.SSM || role === common_1.UserRole.RETAILER) ? emp_id : assignTo;
                // Create a unique identifier for in-memory duplicate detection
                const uniqueStoreKey = `${storeName}-${uid}-${actualEmpId}`;
                // In-memory duplicate check
                if (processedStores.has(uniqueStoreKey)) {
                    skippedStores.push(`${storeName} (Duplicate in input)`);
                    continue; // Skip duplicate store in input
                }
                // Mark this store as processed
                processedStores.add(uniqueStoreKey);
                // Check if the store already exists in the database
                const existingStore = yield this.storeRepositry.findOneBy({ storeName, empId: actualEmpId });
                if (existingStore) {
                    skippedStores.push(`${storeName} (Already exists in database)`);
                    continue; // Skip the store if it already exists in the database
                }
                // Create new store object
                const newStore = new stores_entity_1.Stores();
                newStore.empId = actualEmpId;
                newStore.retailorId = assignToRetailor !== null && assignToRetailor !== void 0 ? assignToRetailor : null;
                newStore.storeName = storeName;
                newStore.uid = uid;
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
                newStore.flatDiscount = flatDiscount;
                newStore.visibilityDiscount = visibilityDiscount;
                newStore.isActiveOrderValueDiscount = isActiveOrderValueDiscount;
                newStore.orderValueDiscount = orderValueDiscount;
                storeEntities.push(newStore);
            }
            try {
                // Save all valid new stores at once
                if (storeEntities.length > 0) {
                    yield this.storeRepositry.save(storeEntities);
                }
                // Construct the response message
                const message = skippedStores.length > 0
                    ? `Stores created successfully. Skipped stores: ${skippedStores.join(', ')}.`
                    : "All stores created successfully.";
                return { status: common_1.STATUSCODES.SUCCESS, message };
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    createCategories(inputs, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { emp_id } = payload;
            const skippedCategories = []; // Track skipped categories
            const processedCategories = new Set(); // Track unique categories by combination of categoryName and empId
            // Validate input data
            if (inputs.length === 0) {
                return { message: "No categories to create.", status: common_1.STATUSCODES.BAD_REQUEST };
            }
            const categoryEntities = [];
            for (const input of inputs) {
                const { categoryName } = input;
                // Create a unique identifier for in-memory duplicate detection
                const uniqueCategoryKey = `${categoryName}-${emp_id}`;
                // In-memory duplicate check
                if (processedCategories.has(uniqueCategoryKey)) {
                    skippedCategories.push(`${categoryName} (Duplicate in input)`);
                    continue; // Skip duplicate category in input
                }
                // Mark this category as processed
                processedCategories.add(uniqueCategoryKey);
                // Check if the category already exists in the database
                const existingCategory = yield this.categoryRepositry.findOneBy({ categoryName, empId: emp_id });
                if (existingCategory) {
                    skippedCategories.push(`${categoryName} (Already exists in database)`);
                    continue; // Skip the category if it already exists in the database
                }
                // Create new category object
                const category = new storeCategory_entity_1.StoreCategory();
                category.categoryName = categoryName;
                category.empId = emp_id;
                categoryEntities.push(category); // Add to the list of new categories to be saved
            }
            try {
                // Save all valid new categories at once
                if (categoryEntities.length > 0) {
                    yield this.categoryRepositry.save(categoryEntities);
                }
                // Construct the response message
                const message = skippedCategories.length > 0
                    ? `Categories created successfully. Skipped categories: ${skippedCategories.join(', ')}.`
                    : "All categories created successfully.";
                return { status: common_1.STATUSCODES.SUCCESS, message };
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.StoreService = StoreController;
