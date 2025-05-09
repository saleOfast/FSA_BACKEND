import { STATUSCODES, UserRole } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { DeleteUser, GetUsers, IUser, IUserProfile, UpdateUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { StoreRepository } from "../../../../core/DB/Entities/stores.entity";
import { IStore } from "../../../../core/types/StoreService/StoreService";
import { Not } from "typeorm";

class ReportController {
    private userListRepositry = UserRepository();
    private storeRepositry = StoreRepository();

    constructor() { }

    async getUsersList(payload: IUser): Promise<IApiResponse> {
        const { emp_id, role } = payload;
        try {
            const queryBuilder = this.userListRepositry.createQueryBuilder('user')
                .select(['user.emp_id', 'user.firstname', 'user.lastname', 'user.zone', 'user.role', 'user.managerId'])
                .orderBy('user.updatedAt', 'DESC')
                .addOrderBy('user.createdAt', 'DESC');
               

            if (role === UserRole.RSM) {
                queryBuilder.where('user.role = :role', { role: UserRole.SSM })
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
                    role: Not(UserRole.SSM)
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

            const mdata: any = { firstname: "", lastname: "" }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: { manager: `${manager?.firstname?? mdata.firstname} ${manager?.lastname?? mdata.lastname}`, ...userDetails } }
        } catch (error) {
            throw error;
        }
    }
 
   

    async updateUser(payload: IUser, input: UpdateUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { firstname, lastname, empId, role, zone, managerId, address, learningRole, phone, email, joining_date, age } = input;
        
            await this.userListRepositry.createQueryBuilder().update({ firstname: firstname, lastname: lastname, role: role, zone: zone, managerId: managerId, address: address, learningRole: learningRole, phone: phone, email: email, joining_date: joining_date, age: age }).where({ emp_id: empId }).execute();

            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(input: DeleteUser): Promise<IApiResponse> {
        try {
            // const { emp_id } = payload;
            const { empId } = input;
            await this.userListRepositry.createQueryBuilder().delete().where({ emp_id: empId }).execute();
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

    async getStoresByEmpId(input: GetUsers, payload: IUser): Promise<IApiResponse> {
        try {
            const { empId } = input;
            const { role } = payload;
        //    console.log({input,payload})
            const users: IStore[] | null = await this.storeRepositry.find({
                where: { empId: Number(empId) },
                order: {
                    updatedAt: 'DESC',
                    createdAt: 'DESC'
                }
            });
            const storeQueryBuilder = this.storeRepositry.createQueryBuilder("stores")
                .select("stores.storeId", "storeId")
                .addSelect("stores.storeName", "storeName");
    
            if (role === UserRole.RSM) {
                const userLists: IUser[] = await this.userListRepositry.find({ where: { managerId: empId } });
                const empIds = userLists.map((data: IUser) => data.emp_id);
                if (empIds.length > 0) {
                    storeQueryBuilder.where("stores.empId IN (:...empIds)", { empIds });
                }
            } else if (role === UserRole.SSM || role === UserRole.RETAILER) {
                storeQueryBuilder.andWhere("stores.empId = :empId", { empId:Number(empId) });
            }
    
            const storeData = await storeQueryBuilder.getRawMany();
            if (storeData.length === 0) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND };
            }
            
           
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: storeData }
        } catch (error) {
            throw error;
        }
    }
    
}

export { ReportController as ReportService }
