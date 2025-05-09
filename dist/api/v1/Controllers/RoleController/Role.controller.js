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
exports.RoleService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const role_entity_1 = require("../../../../core/DB/Entities/role.entity");
class RoleController {
    constructor() {
        this.role = (0, role_entity_1.RoleRepository)();
    }
    add(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = input;
                const { emp_id } = payload;
                const newBrand = new role_entity_1.Role();
                newBrand.name = name;
                newBrand.empId = emp_id;
                yield this.role.save(newBrand);
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    list(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log({ input });
            try {
                let filter = {};
                if (input === null || input === void 0 ? void 0 : input.isActive) {
                    filter = { isActive: input === null || input === void 0 ? void 0 : input.isActive };
                }
                const list = yield this.role.find({
                    where: Object.assign({ isDeleted: false }, filter),
                    order: { createdAt: 'ASC' }
                });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: list };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRoleById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roleId } = input;
                const role = yield this.role.findOne({ where: { roleId: Number(roleId) } });
                if (!role) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: role };
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const { name, roleId } = input;
                if (!name) {
                    return { message: "Name can't be empty.", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                yield this.role.createQueryBuilder().update({ name }).where({ roleId }).execute();
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
                const { roleId } = input;
                yield this.role.createQueryBuilder().update({ isDeleted: true }).where({ roleId }).execute();
                return { message: "Deleted Successfully.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.RoleService = RoleController;
