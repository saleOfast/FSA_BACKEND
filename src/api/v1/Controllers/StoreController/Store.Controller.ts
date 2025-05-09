import { DurationEnum, OrderStatus, STATUSCODES, StoreBilling, StoreTypeFilter, UserRole, VisitStatus } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { CreateCategory, CreateStore, DeleteCategoryById, DeleteStoreById, GetCategoryById, GetStoreById, GetStoreByType, IStore, IStoreCategory, StoreListFilter, UpdateCategory, UpdateStore } from "../../../../core/types/StoreService/StoreService";
import { StoreRepository, Stores } from "../../../../core/DB/Entities/stores.entity";
import { StoreCategory, StoreCategoryRepository } from "../../../../core/DB/Entities/storeCategory.entity";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { In, SelectQueryBuilder } from "typeorm";
import { OrdersRepository } from "../../../../core/DB/Entities/orders.entity";
import { BeatRepository } from "../../../../core/DB/Entities/beat.entity";
import { VisitRepository } from "../../../../core/DB/Entities/Visit.entity";
import { IBeat } from "../../../../core/types/BeatService/Beat";

class StoreController {
    private storeRepositry = StoreRepository();
    private categoryRepositry = StoreCategoryRepository();
    private orderRepositry = OrdersRepository();
    private beatRespositry = BeatRepository();
    private visitRepository = VisitRepository();

    constructor() { }

    async createStore(input: CreateStore, payload: IUser): Promise<IApiResponse> {
        try {

            const { assignTo, assignToRetailor, storeName, uid, addressLine1, addressLine2, townCity, state, district, email, pinCode, ownerName, mobileNumber, alterMobile, openingTime, closingTime, openingTimeAmPm, closingTimeAmPm, paymentMode, isPremiumStore, isActive, storeType, lat, long, flatDiscount, visibilityDiscount, isActiveOrderValueDiscount, orderValueDiscount, qualification, doctorCode, speciality, language_known, DOB, dateOfWedding, clinicName, RegistrationNumber, territory, orgName, patientVolume, availability } = input;
            const { emp_id, role } = payload;
            let queryBuilder: any | null = this.storeRepositry.createQueryBuilder("store")
                .where("store.mobileNumber = :mobileNumber", { mobileNumber })

            if (alterMobile) {
                queryBuilder.orWhere("store.alterMobile = :alterMobile", { alterMobile })
            }

            const store = await queryBuilder.getOne();
            if (store) {
                return { message: "Store Already exist", status: STATUSCODES.BAD_REQUEST }
            }

            const newStore = new Stores();
            newStore.empId = (role === UserRole.SSM || role === UserRole.RETAILER) ? emp_id : assignTo;
            newStore.retailorId = assignToRetailor ?? null;
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
            newStore.orderValueDiscount = orderValueDiscount
            newStore.qualification = qualification
            newStore.doctorCode = doctorCode
            newStore.speciality = speciality
            newStore.language_known = language_known
            newStore.DOB = DOB
            newStore.dateOfWedding = dateOfWedding
            newStore.clinicName = clinicName
            newStore.RegistrationNumber = RegistrationNumber
            newStore.territory = territory
            newStore.orgName = orgName
            newStore.patientVolume = patientVolume
            newStore.availability = availability

            await this.storeRepositry.save(newStore);

            return { status: STATUSCODES.SUCCESS, message: "Success." }
        } catch (error) {
            throw error;
        }
    }

    async update(input: UpdateStore, payload: IUser): Promise<IApiResponse> {
        try {
            const { storeId, assignToRetailor, storeName, assignTo, addressLine1, addressLine2, townCity, district, state, email, pinCode, ownerName, mobileNumber, alterMobile, openingTime, closingTime, openingTimeAmPm, closingTimeAmPm, paymentMode, isPremiumStore, isActive, storeType, lat, long, flatDiscount, visibilityDiscount, orderValueDiscount, isActiveOrderValueDiscount, qualification, doctorCode, speciality, language_known, DOB, dateOfWedding, clinicName, RegistrationNumber, territory, orgName, patientVolume, availability } = input;
            const { emp_id, role } = payload;

            const store: IStore | null = await this.storeRepositry.findOne({ where: { storeId } });

            if (!store) {
                return { message: "Not Found.", status: STATUSCODES.BAD_REQUEST }
            }
            let empId: any = null;
            if (role === UserRole.SSM || role === UserRole.RETAILER) {
                empId = emp_id;
            } else {
                empId = assignTo
            }
            //   console.log({assignTo, empId})
            await this.storeRepositry.createQueryBuilder()
                .update({ empId: role === UserRole.SSM ? emp_id : assignTo, retailorId: assignToRetailor ?? null, storeName, addressLine1, addressLine2, townCity, district, state, email, pinCode, ownerName, mobileNumber, alterMobile, openingTime, closingTime, openingTimeAmPm, closingTimeAmPm, paymentMode, isPremiumStore, isActive, storeType, lat, long, flatDiscount, visibilityDiscount, orderValueDiscount, isActiveOrderValueDiscount, qualification, doctorCode, speciality, language_known, DOB, dateOfWedding, clinicName, RegistrationNumber, territory, orgName, patientVolume, availability })
                .where({ storeId }).execute()

            return { status: STATUSCODES.SUCCESS, message: 'Success.' };
        } catch (error) {
            throw error;
        }
    }

    async delete(input: DeleteStoreById): Promise<IApiResponse> {
        try {
            const { storeId } = input;

            await this.storeRepositry.createQueryBuilder().update({ isDeleted: true }).where({ storeId: Number(storeId) }).execute();

            return { message: "Category Deleted.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async storeList(input: StoreListFilter, payload: IUser): Promise<IApiResponse> {
        try {
            let { storeSearch, storeType, isUnbilled, storeCat, duration, beatId, pageNumber, pageSize } = input;
            const { emp_id, role } = payload;
            duration = duration ? duration : DurationEnum.ALL;

            let startDate: Date | undefined;
            let endDate: Date | undefined;

            if (storeType == StoreTypeFilter.NEW) {
                const currentDate = new Date();
                startDate = startOfDay(subDays(currentDate, 30));
                endDate = endOfDay(currentDate);
            }

            if (duration == DurationEnum.WEEK) {
                const today = new Date();
                const sevenDaysAgo = subDays(today, 6);
                startDate = startOfDay(sevenDaysAgo);
                endDate = endOfDay(today);

            } else if (duration == DurationEnum.TODAY) {
                startDate = startOfDay(new Date());
                endDate = endOfDay(new Date());
            }

            let fitlerQuery: any = [];
            if (role === UserRole.RSM) {
                const storeIds: any = await this.beatRespositry.createQueryBuilder("beat")
                    .leftJoin("beat.user", "user")
                    .where("user.managerId = :managerId", { managerId: emp_id })
                    .select("beat.store")
                    .getMany()
                    .then((beats: IBeat[]) => beats.map(beat => beat.store));
                // console.log({storeIds})
                if (storeIds.length > 0) {
                    fitlerQuery = storeIds;
                } else {
                    return { message: "No Store found for user.", status: STATUSCODES.NOT_FOUND };
                }
            } else if (role === UserRole.SSM || role === UserRole.RETAILER) {
                const stores: any = await this.beatRespositry.createQueryBuilder("beat")
                    .where("beat.empId = :empId", { empId: emp_id })
                    .select("beat.store")
                    .getMany();
                if (stores.length > 0) {
                    fitlerQuery = stores;
                }

            }
            // console.log({fitlerQuery})

            let buildQuery: SelectQueryBuilder<IStore> = this.storeRepositry.createQueryBuilder('stores')
                .leftJoinAndSelect("stores.storeCat", "storeCat")


            if (role === UserRole.SSM || role === UserRole.RETAILER || role === UserRole.CHANNEL || role === UserRole.RSM) {
                const storeIds = fitlerQuery.map((beat: any) => beat.store).flat();
                buildQuery.where("stores.storeId IN (:...storeIds)", { storeIds: storeIds });
            }

            if (storeSearch) {
                buildQuery.andWhere(
                    `(
                        LOWER(stores.store_name) LIKE LOWER(:searchTerm) OR
                          LOWER(storeCat.category_name) LIKE LOWER(:searchTerm) OR
                           CAST(stores.storeId AS TEXT) LIKE :searchTerm
                     )`,
                    { searchTerm: `%${storeSearch.toLowerCase()}%` }
                );
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

            if (isUnbilled == StoreBilling.BILLED) {
                buildQuery.andWhere(`stores.storeId IN (${orderSubquery})`);
            } else if (isUnbilled == StoreBilling.UNBILLED) {
                buildQuery.andWhere(`stores.storeId NOT IN (${orderSubquery})`);
            }
            const beatIdsArray = beatId ? beatId.split(',').map(id => Number(id)) : [0];
            let beatSubQuery = await this.beatRespositry.createQueryBuilder('beat')
                .where('beat.beatId IN (:...beatId)', { beatId: (beatIdsArray) })
                .getMany();
            if (beatSubQuery.length > 0) {
                const newArr = beatSubQuery.map((item) => item.store).flat();
                buildQuery.andWhere(`stores.storeId IN (${newArr})`);
            }

            buildQuery.orderBy("stores.updatedAt", "DESC")
            buildQuery.skip((+pageNumber - 1) * +pageSize).take(+pageSize);
            const result: any = await buildQuery.getManyAndCount();

            const beats: any = await this.beatRespositry.find();

            for (let store of result[0]) {
                (store as any).beat = beats.find((element: any) => {
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
            }

            return { status: STATUSCODES.SUCCESS, message: 'Success.', data: response };
        } catch (error) {
            console.error("storeList Error:", { error });
            throw error;
        }
    }

    async getStoreById(input: GetStoreById): Promise<IApiResponse> {
        try {
            const { storeId } = input;
            const currentYear = new Date().getFullYear();
            // const storeDetails: IStore | null = await this.storeRepositry.findOne({ where: { storeId: Number(storeId) }, relations: ["storeCat"] });

            const storeDetails = await this.storeRepositry.createQueryBuilder('stores')
                .leftJoinAndSelect('stores.user', 'user')
                .leftJoinAndSelect('stores.storeCat', 'storeCat')
                .where('stores.storeId = :storeId', { storeId: Number(storeId) })
                .getOne();

            const storeVisitDetails = await this.visitRepository.createQueryBuilder('visits')
                .select([
                    "EXTRACT(MONTH FROM visits.createdAt) AS \"monthNumber\"",
                    "TO_CHAR(visits.createdAt, 'Mon') AS \"month\"",
                    "COUNT(visits.visit_id) AS \"visitCount\""
                ])
                .where('visits.storeId = :storeId', { storeId: Number(storeId) })
                .andWhere('visits.status = :status', { status: VisitStatus.COMPLETE })
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
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: { ...storeDetails, visitAnalysis: result }, }
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async getStoreByType(input: GetStoreByType): Promise<IApiResponse> {
        try {
            const { storeType } = input;

            const query = this.storeRepositry.createQueryBuilder('stores')
                .select(['stores.storeId', 'stores.storeName'])
                .leftJoin('stores.storeCat', 'storeCat');

            if (storeType === "doctor") {
                const doctorQuery = await this.storeRepositry.createQueryBuilder('stores')
                    .select(['stores.storeId'])
                    .leftJoin('stores.storeCat', 'storeCat')
                    .where(`LOWER(storeCat.category_name) LIKE LOWER(:category_name)`, { category_name: 'doctor%' })
                    .getMany();

                const storeTypeIds = doctorQuery.map(store => store.storeId);

                if (storeTypeIds.length > 0) {
                    query.where('stores.storeId IN (:...storeTypeIds)', { storeTypeIds });
                } else {
                    query.where('1=0'); // Ensures no records are returned if no matching store IDs exist
                }
            } else {
                query.where('stores.storeType = :storeType', { storeType });
            }

            const storeDetails = await query.getMany();

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: storeDetails };
        } catch (error) {
            throw error;
        }
    }


    async createCategory(input: CreateCategory, payload: IUser): Promise<IApiResponse> {
        try {
            const { categoryName } = input;
            const { emp_id } = payload;

            const createCategory = new StoreCategory();
            createCategory.categoryName = categoryName;
            createCategory.empId = emp_id;
            const cat = await this.categoryRepositry.save(createCategory);
            return { status: STATUSCODES.SUCCESS, message: "Success." }
        } catch (error) {
            throw error;
        }
    }

    async categoryList(payload: IUser): Promise<IApiResponse> {
        try {
            const categoryList: IStoreCategory[] | null = await this.categoryRepositry.find({ where: { isDeleted: false } });

            return { status: STATUSCODES.SUCCESS, message: "Success.", data: categoryList }
        } catch (error) {
            throw error;
        }
    }

    async getCatoryById(input: GetCategoryById): Promise<IApiResponse> {
        try {
            const { categoryId } = input;

            const categoryDetails: IStoreCategory | null = await this.categoryRepositry.findOne({ where: { storeCategoryId: Number(categoryId), isDeleted: false } });

            if (!categoryDetails) {
                return { message: "Store Category Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: categoryDetails }
        } catch (error) {
            throw error;
        }
    }

    async udpateCategory(input: UpdateCategory): Promise<IApiResponse> {
        try {
            const { categoryId, categoryName } = input;

            const category: IStoreCategory | null = await this.categoryRepositry.findOne({ where: { storeCategoryId: Number(categoryId), isDeleted: false } });

            if (!category) {
                return { message: "Store Category Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            await this.categoryRepositry.createQueryBuilder().update({ categoryName }).where({ storeCategoryId: Number(categoryId) }).execute();

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async deleteCategory(input: DeleteCategoryById): Promise<IApiResponse> {
        try {
            const { categoryId } = input;

            await this.categoryRepositry.createQueryBuilder().update({ isDeleted: true }).where({ storeCategoryId: Number(categoryId) }).execute();

            return { message: "Category Deleted.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async createImportStores(inputs: any[], payload: IUser): Promise<IApiResponse> {
        const { emp_id, role } = payload;
        const skippedStores: string[] = [];  // Track skipped stores
        const processedStores: Set<string> = new Set();  // Track unique stores by combination of storeName, uid, and empId

        // Validate input data
        if (inputs.length === 0) {
            return { message: "No stores to create.", status: STATUSCODES.BAD_REQUEST };
        }

        // Filter and prepare stores to save
        const storeEntities = [];

        for (const input of inputs) {
            const {
                assignTo, storeName, uid, addressLine1, addressLine2, townCity, state, email, pinCode, ownerName,
                mobileNumber, openingTime, closingTime, isPremiumStore, isActive, storeType, lat, long,
                flatDiscount, visibilityDiscount, isActiveOrderValueDiscount, orderValueDiscount,
                empId, assignToRetailor
            } = input;

            const actualEmpId = (role === UserRole.SSM || role === UserRole.RETAILER) ? emp_id : assignTo;

            // Create a unique identifier for in-memory duplicate detection
            const uniqueStoreKey = `${storeName}-${uid}-${actualEmpId}`;

            // In-memory duplicate check
            if (processedStores.has(uniqueStoreKey)) {
                skippedStores.push(`${storeName} (Duplicate in input)`);
                continue;  // Skip duplicate store in input
            }

            // Mark this store as processed
            processedStores.add(uniqueStoreKey);

            // Check if the store already exists in the database
            const existingStore = await this.storeRepositry.findOneBy({ storeName, empId: actualEmpId });
            if (existingStore) {
                skippedStores.push(`${storeName} (Already exists in database)`);
                continue;  // Skip the store if it already exists in the database
            }

            // Create new store object
            const newStore = new Stores();
            newStore.empId = actualEmpId;
            newStore.retailorId = assignToRetailor ?? null;
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
                await this.storeRepositry.save(storeEntities);
            }

            // Construct the response message
            const message = skippedStores.length > 0
                ? `Stores created successfully. Skipped stores: ${skippedStores.join(', ')}.`
                : "All stores created successfully.";

            return { status: STATUSCODES.SUCCESS, message };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async createCategories(inputs: CreateCategory[], payload: IUser): Promise<IApiResponse> {
        const { emp_id } = payload;
        const skippedCategories: string[] = [];  // Track skipped categories
        const processedCategories: Set<string> = new Set();  // Track unique categories by combination of categoryName and empId

        // Validate input data
        if (inputs.length === 0) {
            return { message: "No categories to create.", status: STATUSCODES.BAD_REQUEST };
        }

        const categoryEntities = [];

        for (const input of inputs) {
            const { categoryName } = input;

            // Create a unique identifier for in-memory duplicate detection
            const uniqueCategoryKey = `${categoryName}-${emp_id}`;

            // In-memory duplicate check
            if (processedCategories.has(uniqueCategoryKey)) {
                skippedCategories.push(`${categoryName} (Duplicate in input)`);
                continue;  // Skip duplicate category in input
            }

            // Mark this category as processed
            processedCategories.add(uniqueCategoryKey);

            // Check if the category already exists in the database
            const existingCategory = await this.categoryRepositry.findOneBy({ categoryName, empId: emp_id });
            if (existingCategory) {
                skippedCategories.push(`${categoryName} (Already exists in database)`);
                continue;  // Skip the category if it already exists in the database
            }

            // Create new category object
            const category = new StoreCategory();
            category.categoryName = categoryName;
            category.empId = emp_id;

            categoryEntities.push(category);  // Add to the list of new categories to be saved
        }

        try {
            // Save all valid new categories at once
            if (categoryEntities.length > 0) {
                await this.categoryRepositry.save(categoryEntities);
            }

            // Construct the response message
            const message = skippedCategories.length > 0
                ? `Categories created successfully. Skipped categories: ${skippedCategories.join(', ')}.`
                : "All categories created successfully.";

            return { status: STATUSCODES.SUCCESS, message };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { StoreController as StoreService }