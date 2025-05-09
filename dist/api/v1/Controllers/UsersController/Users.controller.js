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
exports.UsersListService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
const stores_entity_1 = require("../../../../core/DB/Entities/stores.entity");
const typeorm_1 = require("typeorm");
const beat_entity_1 = require("../../../../core/DB/Entities/beat.entity");
class UsersController {
    constructor() {
        this.userListRepositry = (0, User_entity_1.UserRepository)();
        this.storeRepositry = (0, stores_entity_1.StoreRepository)();
        this.beatRepository = (0, beat_entity_1.BeatRepository)();
    }
    getUsersList(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { emp_id, role } = payload;
            try {
                const queryBuilder = this.userListRepositry.createQueryBuilder('user')
                    .select(['user.emp_id', 'user.firstname', 'user.lastname', 'user.zone', 'user.role', 'user.managerId'])
                    .orderBy('user.updatedAt', 'DESC')
                    .addOrderBy('user.createdAt', 'DESC')
                    .where('user.role != :role', { role: common_1.UserRole.SUPER_ADMIN })
                    .andWhere('user.isDeleted = :isDeleted', { isDeleted: false });
                if (role === common_1.UserRole.RSM) {
                    queryBuilder.andWhere('user.role = :role', { role: common_1.UserRole.SSM })
                        .andWhere('user.managerId = :emp_id', { emp_id });
                }
                const users = yield queryBuilder.getMany();
                const adminRole = users.find((data) => data.role === common_1.UserRole.ADMIN);
                let usersList = [];
                for (const user of users) {
                    const managerDetails = yield this.userListRepositry.findOne({
                        select: ["emp_id"],
                        where: {
                            emp_id: user.managerId
                        },
                    });
                    const managerData = yield this.userListRepositry.findOne({
                        select: ["firstname", "lastname"],
                        where: { emp_id: managerDetails ? user.managerId : adminRole.emp_id },
                        order: {
                            updatedAt: 'DESC',
                            createdAt: 'DESC'
                        }
                    });
                    let usersData = {
                        name: `${user.firstname} ${user.lastname}`,
                        emp_id: user.emp_id,
                        zone: user.zone,
                        role: user.role,
                        manager: `${managerData.firstname} ${managerData.lastname}`
                    };
                    usersList.push(usersData);
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: usersList };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getManagersList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const managersList = yield this.userListRepositry.find({
                    select: ["emp_id", "firstname", "lastname", "zone", "role", "managerId"],
                    where: {
                        role: (0, typeorm_1.Not)(common_1.UserRole.SSM),
                        isDeleted: false,
                    },
                    order: {
                        updatedAt: 'DESC',
                        createdAt: 'DESC'
                    }
                });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: managersList };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserDetails(input) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { empId } = input;
            try {
                const userDetails = yield this.userListRepositry.findOne({
                    where: {
                        emp_id: empId
                    },
                });
                let manager = null;
                if (userDetails === null || userDetails === void 0 ? void 0 : userDetails.managerId) {
                    manager = yield this.userListRepositry.findOne({
                        select: ["firstname", "lastname"],
                        where: { emp_id: userDetails.managerId }
                    });
                }
                // if (!manager) {
                //     return { status: STATUSCODES.NOT_FOUND, message: "Manager Data Not Found." };
                // }
                const mdata = { firstname: "", lastname: "" };
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: Object.assign({ manager: `${(_a = manager === null || manager === void 0 ? void 0 : manager.firstname) !== null && _a !== void 0 ? _a : mdata.firstname} ${(_b = manager === null || manager === void 0 ? void 0 : manager.lastname) !== null && _b !== void 0 ? _b : mdata.lastname}` }, userDetails) };
            }
            catch (error) {
                throw error;
            }
        });
    }
    // async getUserById(payload: IUser, input: GetBrand): Promise<IApiResponse> {
    //     try {
    //         const { brandId } = input;
    //         const brand: IBrand | null = await this.brand.findOne({ where: { brandId: Number(brandId) } });
    //         if (!brand) {
    //             return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
    //         }
    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: brand }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    updateUser(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const { firstname, lastname, empId, role, dob, zone, managerId, address, city, state, pincode, learningRole, phone, email, joining_date, age } = input;
                // if (!name) {
                //     return { message: "Name can't be empty.", status: STATUSCODES.BAD_REQUEST }
                // }
                yield this.userListRepositry.createQueryBuilder().update({ firstname: firstname, lastname: lastname, role: role, zone: zone, managerId: managerId, address: address, city, state, pincode, learningRole: learningRole, phone: phone, email: email, joining_date: joining_date, age: age, dob }).where({ emp_id: empId }).execute();
                return { message: "Updated.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const { emp_id } = payload;
                const { empId } = input;
                yield this.userListRepositry.createQueryBuilder().update({ isDeleted: true }).where({ emp_id: empId }).execute();
                return { message: "Deleted Successfully.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getLearningRoleList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const learningRoleList = yield this.userListRepositry.find({
                    select: ["learningRole"],
                    where: {
                        role: common_1.UserRole.SSM,
                        order: {
                            updatedAt: 'DESC',
                            createdAt: 'DESC'
                        }
                    }
                });
                const uniqueLearningRoles = new Set();
                learningRoleList.forEach((user) => uniqueLearningRoles.add(user.learningRole));
                const data = Array.from(uniqueLearningRoles).map(learningRole => {
                    return {
                        learningRole: learningRole
                    };
                });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: data };
            }
            catch (error) {
                throw error;
            }
        });
    }
    // async getStoresByEmpId(input: GetUsers, payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { empId } = input;
    //         const { role } = payload;
    //        console.log({input, payload})
    //         const users: IStore[] | null = await this.storeRepositry.find({
    //             where: { empId: Number(empId) },
    //             order: {
    //                 updatedAt: 'DESC',
    //                 createdAt: 'DESC'
    //             }
    //         });
    //         let storeQueryBuilder = this.storeRepositry.createQueryBuilder("stores")
    //             .select("stores.storeId", "storeId")
    //             .addSelect("stores.storeName", "storeName")
    //         if (role === UserRole.RSM) {
    //             const userLists: IUser[] = await this.userListRepositry.find({ where: { managerId: empId } });
    //             const empIds = userLists.map((data: IUser) => data.emp_id);
    //             if (empIds.length > 0) {
    //                 storeQueryBuilder.where("stores.empId IN (:...empIds)", { empIds });
    //             }
    //         } else if(role === UserRole.RETAILER || role === UserRole.SSM || role === UserRole.CHANNEL){
    //             storeQueryBuilder.where("stores.empId = :empId OR stores.retailorId = :retailorId", { empId:Number(empId), retailorId: Number(empId)  });
    //         }
    //         const storeData = await storeQueryBuilder.getRawMany();
    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: storeData }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // async getStoresByEmpId(input: GetUsers, payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { empId } = input;
    //         const { role } = payload;
    //         console.log({ input, payload });
    //         // Query Builder for fetching stores
    //         const storeQueryBuilder = this.beatRepository.createQueryBuilder("beat")
    //             .leftJoin("beat.stores", "stores")
    //             .select([
    //                 "stores.storeId AS storeId",
    //                 "stores.storeName AS storeName",
    //                 "stores.updatedAt AS updatedAt",
    //                 "stores.createdAt AS createdAt"
    //             ])
    //             .orderBy("stores.updatedAt", "DESC")
    //             .addOrderBy("stores.createdAt", "DESC");
    //         if (role === UserRole.RSM) {
    //             // Fetch employees under the RSM
    //             const userLists: IUser[] = await this.userListRepositry.find({ where: { managerId: empId } });
    //             const empIds = userLists.map((data: IUser) => data.emp_id);
    //             if (empIds.length > 0) {
    //                 storeQueryBuilder.where("stores.empId IN (:...empIds)", { empIds });
    //             } else {
    //                 // If no employees under RSM, prevent unnecessary query
    //                 return { message: "No stores found.", status: STATUSCODES.NOT_FOUND, data: [] };
    //             }
    //         } else if ([UserRole.RETAILER, UserRole.SSM, UserRole.CHANNEL].includes(role)) {
    //             // For Retailer, SSM, or Channel roles
    //             storeQueryBuilder.where(
    //                 "stores.empId = :empId OR stores.retailorId = :retailorId",
    //                 { empId: Number(empId), retailorId: Number(empId) }
    //             );
    //         } else {
    //             // Handle unknown roles (optional)
    //             return { message: "Unauthorized role.", status: 204, data: [] };
    //         }
    //         // Execute the query
    //         const storeData = await storeQueryBuilder.getRawMany();
    //         // Return the response
    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: storeData };
    //     } catch (error) {
    //         console.error("Error in getStoresByEmpId:", error);
    //         throw error;
    //     }
    // }
    // async getStoresByEmpId(input: GetUsers, payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { empId } = input;
    //         const { role } = payload;
    //         console.log({ input, payload });
    //         // Query Builder for fetching stores
    //         let storeQueryBuilder:any = null;
    //         let uniqueStoreIds: any = [];
    //         if(role === UserRole.SSM ){
    //             storeQueryBuilder = this.storeRepositry.createQueryBuilder("stores")
    //             .select([
    //                 "stores.storeId AS storeId",
    //                 "stores.storeName AS storeName",
    //                 "stores.updatedAt AS updatedAt",
    //                 "stores.createdAt AS createdAt",
    //             ])
    //             .orderBy("stores.updatedAt", "DESC")
    //             .addOrderBy("stores.createdAt", "DESC");
    //         }else{
    //             const storeIdByBeat = await this.beatRepository
    //             .createQueryBuilder("beat")
    //             .select("beat.store")
    //             .where("beat.empId = :empId", { empId: Number(empId) })
    //             .getMany();
    //         console.log({ storeIdByBeat });
    //             const storeIds = storeIdByBeat.flatMap((beat: any) => {
    //                 // Parse the `store` field if it's in JSON format
    //                 if (!beat.store || beat.store === "NaN") {
    //                     // console.warn("Invalid store field encountered:", beat.store);
    //                     return []; // Skip invalid or empty values
    //                 }
    //                 try {
    //                     return beat.store
    //                 } catch (error) {
    //                     console.error("Error parsing store field:", error);
    //                     return [];
    //                 }
    //             });
    //             uniqueStoreIds = [...new Set(storeIds)];
    //             console.log({ storeIds, uniqueStoreIds, storeIdByBeat });
    //         }
    //         if ([UserRole.SSM].includes(role)) {
    //             storeQueryBuilder.andWhere(
    //                 "beat.empId = :empId OR stores.retailorId = :retailorId",
    //                 { empId: Number(empId), retailorId: Number(empId) }
    //             );
    //             // Fetch employees under the RSM
    //         } else if ([UserRole.MANAGER].includes(role)) {
    //             // For Retailer, SSM, or Channel roles
    //             const userLists: IUser[] = await this.userListRepositry.find({ where: { managerId: empId } });
    //             const empIds = userLists.map((data: IUser) => data.emp_id);
    //             if (empIds.length > 0) {
    //                 storeQueryBuilder.andWhere("beat.empId IN (:...empIds)", { empIds });
    //             } else {
    //                 return { message: "No stores found.", status: STATUSCODES.NOT_FOUND, data: [] };
    //             }
    //         } 
    //         // Execute the query
    //         const storeData = await storeQueryBuilder.getRawMany();
    //         // Return the response
    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: storeData?? [] };
    //     } catch (error) {
    //         console.error("Error in getStoresByEmpId:", error);
    //         throw error;
    //     }
    // }
    getStoresByEmpId(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { empId } = input;
                const { role } = payload;
                console.log({ input, payload });
                let storeQueryBuilder = this.storeRepositry.createQueryBuilder("stores")
                    .select([
                    "stores.storeId AS storeId",
                    "stores.storeName AS storeName",
                    "stores.updatedAt AS updatedAt",
                    "stores.createdAt AS createdAt",
                ])
                    .orderBy("stores.updatedAt", "DESC")
                    .addOrderBy("stores.createdAt", "DESC");
                if (role === common_1.UserRole.ADMIN) {
                    // ADMIN can access all stores
                    console.log("Admin accessing all stores.");
                }
                else {
                    let storeIds = [];
                    if (role === common_1.UserRole.SSM || role === common_1.UserRole.MANAGER) {
                        // Fetch stores from beats assigned to the user
                        const storeIdByBeat = yield this.beatRepository
                            .createQueryBuilder("beat")
                            .select("beat.store")
                            .where("beat.empId = :empId", { empId: Number(empId) })
                            .getMany();
                        console.log({ storeIdByBeat });
                        storeIds = storeIdByBeat.flatMap((beat) => {
                            if (!beat.store || beat.store === "NaN")
                                return [];
                            return Array.isArray(beat.store) ? beat.store : [beat.store];
                        });
                        storeIds = [...new Set(storeIds)]; // Remove duplicates
                        console.log({ storeIds });
                        if (storeIds.length > 0) {
                            storeQueryBuilder.andWhere("stores.storeId IN (:...storeIds)", { storeIds });
                        }
                    }
                    if (role === common_1.UserRole.MANAGER) {
                        // Fetch employees under the manager
                        const userLists = yield this.userListRepositry.find({ where: { managerId: empId } });
                        const empIds = userLists.map((data) => data.emp_id);
                        if (empIds.length > 0) {
                            storeQueryBuilder.andWhere("stores.empId IN (:...empIds)", { empIds });
                        }
                        else {
                            return { message: "No stores found.", status: common_1.STATUSCODES.NOT_FOUND, data: [] };
                        }
                    }
                }
                // Execute the query
                const storeData = yield storeQueryBuilder.getRawMany();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: storeData !== null && storeData !== void 0 ? storeData : [] };
            }
            catch (error) {
                console.error("Error in getStoresByEmpId:", error);
                throw error;
            }
        });
    }
    getStoresByBeatId(input, payload) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { beatId } = input;
                // const { role, emp_id } = payload;
                // Query to get the stores linked to the beat
                const storeQueryBuilder = this.beatRepository.createQueryBuilder("beat")
                    .select("beat.store", "store")
                    .where("beat.beatId = :beatId", { beatId: Number(beatId) });
                // Get the store data from the beat query
                const store = yield storeQueryBuilder.getRawMany();
                // Extract store IDs (assuming it's an array of store objects)
                const storeIds = (_a = store.map((s) => s.store)) !== null && _a !== void 0 ? _a : [];
                if (storeIds[0].length === 0) {
                    return { message: "No stores found.", status: common_1.STATUSCODES.SUCCESS, data: [] };
                }
                // Query to get store details based on store IDs
                const storeData = yield this.storeRepositry.createQueryBuilder("stores")
                    .select("stores.storeId", "storeId")
                    .addSelect("stores.storeName", "storeName")
                    .where("stores.storeId IN (:...storeId)", { storeId: storeIds[0] })
                    .getRawMany();
                console.log({ storeData, storeIds });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: storeData };
            }
            catch (error) {
                console.error(error);
                throw new Error("An error occurred while fetching store data.");
            }
        });
    }
}
exports.UsersListService = UsersController;
