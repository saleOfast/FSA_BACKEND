import { STATUSCODES, UserRole } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { DeleteUser, GetUsers, IUser, IUserProfile, SignUp, UpdateUser } from "../../../../core/types/AuthService/AuthService";
import { User, UserRepository } from "../../../../core/DB/Entities/User.entity";
import { StoreRepository } from "../../../../core/DB/Entities/stores.entity";
import { IStore } from "../../../../core/types/StoreService/StoreService";
import { Not } from "typeorm";
import { BeatRepository } from "../../../../core/DB/Entities/beat.entity";

class UsersController {
    private userListRepositry = UserRepository();
    private storeRepositry = StoreRepository();
    private beatRepository = BeatRepository();

    constructor() { }

    async getUsersList(payload: IUser): Promise<IApiResponse> {
        const { emp_id, role } = payload;
        try {
            const queryBuilder = this.userListRepositry.createQueryBuilder('user')
                .select(['user.emp_id', 'user.firstname', 'user.lastname', 'user.zone', 'user.role', 'user.managerId'])
                .orderBy('user.updatedAt', 'DESC')
                .addOrderBy('user.createdAt', 'DESC')
                .where('user.role != :role', {role: UserRole.SUPER_ADMIN})
                .andWhere('user.isDeleted = :isDeleted', {isDeleted: false});
               

            if (role === UserRole.RSM) {
                queryBuilder.andWhere('user.role = :role', { role: UserRole.SSM })
                .andWhere('user.managerId = :emp_id', { emp_id });
            }
            const users: IUser[] | null = await queryBuilder.getMany();
            const adminRole: any = users.find((data)=>data.role === UserRole.ADMIN)
            let usersList: IUser[] | null = [];
            for (const user of users) {
                const managerDetails: IUser | null = await this.userListRepositry.findOne({
                    select: ["emp_id"],
                    where: {
                        emp_id: user.managerId
                    },
                });
                const managerData = await this.userListRepositry.findOne({
                    select: ["firstname", "lastname"],
                    where: { emp_id: managerDetails ? user.managerId : adminRole.emp_id },
                    order: {
                        updatedAt: 'DESC',
                        createdAt: 'DESC'
                    }
                });
                let usersData: any = {
                    name: `${user.firstname} ${user.lastname}`,
                    emp_id: user.emp_id,
                    zone: user.zone,
                    role: user.role,
                    manager: `${managerData.firstname} ${managerData.lastname}`
                }
                usersList.push(usersData);
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: usersList }
        } catch (error) {
            throw error;
        }
    }

    async getManagersList(): Promise<IApiResponse> {
        try {
            const managersList: IUser[] | null = await this.userListRepositry.find({
                select: ["emp_id", "firstname", "lastname", "zone", "role", "managerId"],
                where: {
                    role: Not(UserRole.SSM),
                    isDeleted: false,
                },
                order: {
                    updatedAt: 'DESC',
                    createdAt: 'DESC'
                }
            });
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: managersList }
        } catch (error) {
            throw error;
        }
    }

    async getUserDetails(input: GetUsers): Promise<IApiResponse> {
        const { empId } = input
        try {
            const userDetails: IUser | null = await this.userListRepositry.findOne({
                where: {
                    emp_id: empId
                },
            });
            let manager: any | null = null;
            if (userDetails?.managerId) {
                manager = await this.userListRepositry.findOne({
                    select: ["firstname", "lastname"],
                    where: { emp_id: userDetails.managerId }
                });
            }

            // if (!manager) {
            //     return { status: STATUSCODES.NOT_FOUND, message: "Manager Data Not Found." };
            // }
            const mdata: any = { firstname: "", lastname: "" }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: { manager: `${manager?.firstname?? mdata.firstname} ${manager?.lastname?? mdata.lastname}`, ...userDetails } }
        } catch (error) {
            throw error;
        }
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


    async updateUser(payload: IUser, input: UpdateUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { firstname, lastname, empId, role, dob, zone, managerId, address, city, state, pincode, learningRole, phone, email, joining_date, age } = input;
            // if (!name) {
            //     return { message: "Name can't be empty.", status: STATUSCODES.BAD_REQUEST }
            // }

            await this.userListRepositry.createQueryBuilder().update({ firstname: firstname, lastname: lastname, role: role, zone: zone, managerId: managerId, address: address, city, state, pincode, learningRole: learningRole, phone: phone, email: email, joining_date: joining_date, age: age, dob }).where({ emp_id: empId }).execute();

            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(input: DeleteUser): Promise<IApiResponse> {
        try {
            // const { emp_id } = payload;
            const { empId } = input;
            await this.userListRepositry.createQueryBuilder().update({ isDeleted: true }).where({ emp_id: empId }).execute();
            return { message: "Deleted Successfully.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async getLearningRoleList(): Promise<IApiResponse> {
        try {
            const learningRoleList: IUser[] | null = await this.userListRepositry.find({
                select: ["learningRole"],
                where: {
                    role: UserRole.SSM,
                    order: {
                        updatedAt: 'DESC',
                        createdAt: 'DESC'
                    }
                }
            });
            const uniqueLearningRoles = new Set<string>();

            learningRoleList.forEach((user: any) => uniqueLearningRoles.add(user.learningRole));

            const data = Array.from(uniqueLearningRoles).map(learningRole => {
                return {
                    learningRole: learningRole
                };
            });
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: data }
        } catch (error) {
            throw error;
        }
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
    async getStoresByEmpId(input: GetUsers, payload: IUser): Promise<IApiResponse> {
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
    
            if (role === UserRole.ADMIN) {
                // ADMIN can access all stores
                console.log("Admin accessing all stores.");
            } else {
                let storeIds: number[] = [];
    
                if (role === UserRole.SSM || role === UserRole.MANAGER) {
                    // Fetch stores from beats assigned to the user
                    const storeIdByBeat = await this.beatRepository
                        .createQueryBuilder("beat")
                        .select("beat.store")
                        .where("beat.empId = :empId", { empId: Number(empId) })
                        .getMany();
    
                    console.log({ storeIdByBeat });
    
                    storeIds = storeIdByBeat.flatMap((beat: any) => {
                        if (!beat.store || beat.store === "NaN") return [];
                        return Array.isArray(beat.store) ? beat.store : [beat.store];
                    });
    
                    storeIds = [...new Set(storeIds)]; // Remove duplicates
                    console.log({ storeIds });
    
                    if (storeIds.length > 0) {
                        storeQueryBuilder.andWhere("stores.storeId IN (:...storeIds)", { storeIds });
                    }
                }
    
                if (role === UserRole.MANAGER) {
                    // Fetch employees under the manager
                    const userLists: IUser[] = await this.userListRepositry.find({ where: { managerId: empId } });
                    const empIds = userLists.map((data: IUser) => data.emp_id);
    
                    if (empIds.length > 0) {
                        storeQueryBuilder.andWhere("stores.empId IN (:...empIds)", { empIds });
                    } else {
                        return { message: "No stores found.", status: STATUSCODES.NOT_FOUND, data: [] };
                    }
                }
            }
    
            // Execute the query
            const storeData = await storeQueryBuilder.getRawMany();
    
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: storeData ?? [] };
    
        } catch (error) {
            console.error("Error in getStoresByEmpId:", error);
            throw error;
        }
    }
    
    
    async getStoresByBeatId(input: any, payload: IUser): Promise<IApiResponse> {
        try {
            const { beatId } = input;
            // const { role, emp_id } = payload;
    
            // Query to get the stores linked to the beat
            const storeQueryBuilder = this.beatRepository.createQueryBuilder("beat")
                .select("beat.store", "store")
                .where("beat.beatId = :beatId", { beatId: Number(beatId) });
    
            // Get the store data from the beat query
            const store: any = await storeQueryBuilder.getRawMany();
            
            // Extract store IDs (assuming it's an array of store objects)
            const storeIds = store.map((s: any) => s.store) ?? [];
    
            if (storeIds[0].length === 0) {
                return { message: "No stores found.", status: STATUSCODES.SUCCESS, data: [] };
            }
    
            // Query to get store details based on store IDs
            const storeData = await this.storeRepositry.createQueryBuilder("stores")
                .select("stores.storeId", "storeId")
                .addSelect("stores.storeName", "storeName")
                .where("stores.storeId IN (:...storeId)", { storeId: storeIds[0] })
                .getRawMany();
    
            console.log({ storeData, storeIds });
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: storeData };
        } catch (error) {
            console.error(error);
            throw new Error("An error occurred while fetching store data.");
        }
    }
    
    // async getStoresByEmpId(input: GetUsers, payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const { empId } = input;
    //         const { role } = payload;
    //        console.log({input,payload})
               
    //         const storeQueryBuilder = this.storeRepositry.createQueryBuilder("stores")
    //             .select("stores.storeId", "storeId")
    //             .addSelect("stores.storeName", "storeName");
    
    //         if (role === UserRole.RSM) {
    //             const userLists: IUser[] = await this.userListRepositry.find({ where: { managerId: empId } });
    //             const empIds = userLists.map((data: IUser) => data.emp_id);
    //             if (empIds.length > 0) {
    //                 storeQueryBuilder.where("stores.empId IN (:...empIds)", { empIds });
    //             } else {
    //                 return { message: "No employees found for the given manager.", status: STATUSCODES.NOT_FOUND };
    //             }
    //         } else if (role === UserRole.SSM) {
    //             storeQueryBuilder.andWhere("stores.empId = :empId", { empId:Number(empId) });
    //         }
    
    //         const storeData = await storeQueryBuilder.getRawMany();
    //        console.log({storeData})
    //         if (storeData.length === 0) {
    //             return { message: "Not Found.", status: STATUSCODES.NOT_FOUND };
    //         }
    
    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: storeData };
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    
    
}

export { UsersController as UsersListService }
