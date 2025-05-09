import { DurationEnum, OrderStatus, STATUSCODES, StoreBilling, StoreTypeFilter, UserRole } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { CreateStore, GetStoreById, IStore, StoreListFilter, UpdateStore } from "../../../../core/types/StoreService/StoreService";
import { StoreRepository, Stores } from "../../../../core/DB/Entities/stores.entity";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { SelectQueryBuilder } from "typeorm";
import { OrdersRepository } from "../../../../core/DB/Entities/orders.entity";
import { BeatRepository } from "../../../../core/DB/Entities/beat.entity";

class DistributorController {
    private storeRepositry = StoreRepository();
    private orderRepositry = OrdersRepository();
    private beatRespositry = BeatRepository();

    constructor() { }

    async createDistributor(input: CreateStore, payload: IUser): Promise<IApiResponse> {
        try {

            const { storeName, addressLine1, addressLine2, townCity, state, email, pinCode, ownerName, mobileNumber, openingTime, closingTime, isPremiumStore, isActive, storeType, lat, long } = input;
            const { emp_id } = payload;

            const newStore = new Stores();
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

            await this.storeRepositry.save(newStore);

            return { status: STATUSCODES.SUCCESS, message: "Success." }
        } catch (error) {
            throw error;
        }
    }

    async update(input: UpdateStore, payload: IUser): Promise<IApiResponse> {
        try {
            const { storeId, storeName, addressLine1, addressLine2, townCity, state, email, pinCode, ownerName, mobileNumber, openingTime, closingTime, isPremiumStore, isActive, storeType, lat, long, flatDiscount, visibilityDiscount, orderValueDiscount, isActiveOrderValueDiscount } = input;
            const { emp_id } = payload;
            const store: IStore | null = await this.storeRepositry.findOne({ where: { storeId } });

            if (!store) {
                return { message: "Not Found.", status: STATUSCODES.BAD_REQUEST }
            }
            await this.storeRepositry.createQueryBuilder()
                .update({ storeName, addressLine1, addressLine2, townCity, state, email, pinCode, ownerName, mobileNumber, openingTime, closingTime, isPremiumStore, isActive, storeType, lat, long, flatDiscount, visibilityDiscount, orderValueDiscount, isActiveOrderValueDiscount })
                .where({ storeId }).execute()

            return { status: STATUSCODES.SUCCESS, message: 'Success.' };
        } catch (error) {
            throw error;
        }
    }

    async DistributorList(input: StoreListFilter, payload: IUser): Promise<IApiResponse> {
        try {
            let { storeType, isUnbilled, storeCat, duration, beatId, pageNumber, pageSize } = input;
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

            let fitlerQuery: any = {};
            if (role === UserRole.ADMIN) {
                const storeIds: any = await this.storeRepositry.createQueryBuilder("stores")
                    .leftJoin("stores.user", "user")
                    .where("user.managerId = :managerId", { managerId: emp_id })
                    .select("stores.storeId")
                    .getMany()
                    .then((stores: IStore[]) => stores.map(store => store.storeId));
                if (storeIds.length > 0) {
                    fitlerQuery.storeId = storeIds;
                } else {
                    return { message: "No visitIds found for admin user.", status: STATUSCODES.NOT_FOUND };
                }
            } else {
                fitlerQuery = {
                    empId: emp_id
                };
            }

            let buildQuery: SelectQueryBuilder<IStore> = this.storeRepositry.createQueryBuilder('stores')
                .leftJoinAndSelect("stores.storeCat", "storeCat")
            if (role === UserRole.ADMIN) {
                buildQuery.where("stores.storeId IN (:...storeId)", { storeId: fitlerQuery.storeId });
            } else {
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

            buildQuery.orderBy("stores.createdAt", "DESC");
            buildQuery.skip((+pageNumber - 1) * +pageSize).take(+pageSize);
            const result = await buildQuery.getManyAndCount();

            const beats = await this.beatRespositry.find();

            for (let store of result[0]) {
                (store as any).beat = beats.find((element) => {
                    return element.store.includes(store.storeId)
                })
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
            throw error;
        }
    }

    async getDistributorById(input: GetStoreById): Promise<IApiResponse> {
        try {
            const { storeId } = input;

            const storeDetails: IStore | null = await this.storeRepositry.findOne({ where: { storeId: Number(storeId) }, relations: ["storeCat"] });

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: storeDetails }
        } catch (error) {
            throw error;
        }
    }

    // async createCategory(input: CreateCategory, payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { categoryName } = input;
    //         const { emp_id } = payload;

    //         const createCategory = new StoreCategory();
    //         createCategory.categoryName = categoryName;
    //         createCategory.empId = emp_id;
    //         const cat = await this.categoryRepositry.save(createCategory);
    //         return { status: STATUSCODES.SUCCESS, message: "Success." }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async categoryList(payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const categoryList: IStoreCategory[] | null = await this.categoryRepositry.find({ where: { isDeleted: false } });

    //         return { status: STATUSCODES.SUCCESS, message: "Success.", data: categoryList }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async getCatoryById(input: GetCategoryById): Promise<IApiResponse> {
    //     try {
    //         const { categoryId } = input;

    //         const categoryDetails: IStoreCategory | null = await this.categoryRepositry.findOne({ where: { storeCategoryId: Number(categoryId), isDeleted: false } });

    //         if (!categoryDetails) {
    //             return { message: "Store Category Not Found.", status: STATUSCODES.NOT_FOUND }
    //         }

    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: categoryDetails }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async udpateCategory(input: UpdateCategory): Promise<IApiResponse> {
    //     try {
    //         const { categoryId, categoryName } = input;

    //         const category: IStoreCategory | null = await this.categoryRepositry.findOne({ where: { storeCategoryId: Number(categoryId), isDeleted: false } });

    //         if (!category) {
    //             return { message: "Store Category Not Found.", status: STATUSCODES.NOT_FOUND }
    //         }

    //         await this.categoryRepositry.createQueryBuilder().update({ categoryName }).where({ storeCategoryId: Number(categoryId) }).execute();

    //         return { message: "Success.", status: STATUSCODES.SUCCESS }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async deleteCategory(input: DeleteCategoryById): Promise<IApiResponse> {
    //     try {
    //         const { categoryId } = input;

    //         await this.categoryRepositry.createQueryBuilder().update({ isDeleted: true }).where({ storeCategoryId: Number(categoryId) }).execute();

    //         return { message: "Category Deleted.", status: STATUSCODES.SUCCESS }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}

export { DistributorController as DistributorService }