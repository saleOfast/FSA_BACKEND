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
exports.ReportService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
const stores_entity_1 = require("../../../../core/DB/Entities/stores.entity");
const typeorm_1 = require("typeorm");
class ReportController {
    constructor() {
        this.userListRepositry = (0, User_entity_1.UserRepository)();
        this.storeRepositry = (0, stores_entity_1.StoreRepository)();
    }
    getUsersList(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { emp_id, role } = payload;
            try {
                const queryBuilder = this.userListRepositry.createQueryBuilder('user')
                    .select(['user.emp_id', 'user.firstname', 'user.lastname', 'user.zone', 'user.role', 'user.managerId'])
                    .orderBy('user.updatedAt', 'DESC')
                    .addOrderBy('user.createdAt', 'DESC');
                if (role === common_1.UserRole.RSM) {
                    queryBuilder.where('user.role = :role', { role: common_1.UserRole.SSM })
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
                        role: (0, typeorm_1.Not)(common_1.UserRole.SSM)
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
                const mdata = { firstname: "", lastname: "" };
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: Object.assign({ manager: `${(_a = manager === null || manager === void 0 ? void 0 : manager.firstname) !== null && _a !== void 0 ? _a : mdata.firstname} ${(_b = manager === null || manager === void 0 ? void 0 : manager.lastname) !== null && _b !== void 0 ? _b : mdata.lastname}` }, userDetails) };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateUser(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const { firstname, lastname, empId, role, zone, managerId, address, learningRole, phone, email, joining_date, age } = input;
                yield this.userListRepositry.createQueryBuilder().update({ firstname: firstname, lastname: lastname, role: role, zone: zone, managerId: managerId, address: address, learningRole: learningRole, phone: phone, email: email, joining_date: joining_date, age: age }).where({ emp_id: empId }).execute();
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
                yield this.userListRepositry.createQueryBuilder().delete().where({ emp_id: empId }).execute();
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
    getStoresByEmpId(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { empId } = input;
                const { role } = payload;
                //    console.log({input,payload})
                const users = yield this.storeRepositry.find({
                    where: { empId: Number(empId) },
                    order: {
                        updatedAt: 'DESC',
                        createdAt: 'DESC'
                    }
                });
                const storeQueryBuilder = this.storeRepositry.createQueryBuilder("stores")
                    .select("stores.storeId", "storeId")
                    .addSelect("stores.storeName", "storeName");
                if (role === common_1.UserRole.RSM) {
                    const userLists = yield this.userListRepositry.find({ where: { managerId: empId } });
                    const empIds = userLists.map((data) => data.emp_id);
                    if (empIds.length > 0) {
                        storeQueryBuilder.where("stores.empId IN (:...empIds)", { empIds });
                    }
                }
                else if (role === common_1.UserRole.SSM || role === common_1.UserRole.RETAILER) {
                    storeQueryBuilder.andWhere("stores.empId = :empId", { empId: Number(empId) });
                }
                const storeData = yield storeQueryBuilder.getRawMany();
                if (storeData.length === 0) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: storeData };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.ReportService = ReportController;
