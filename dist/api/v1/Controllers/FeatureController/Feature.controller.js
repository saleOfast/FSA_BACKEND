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
exports.FeatureService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const feature_entity_1 = require("../../../../core/DB/Entities/feature.entity");
const role_entity_1 = require("../../../../core/DB/Entities/role.entity");
class FeatureController {
    constructor() {
        this.feature = (0, feature_entity_1.FeatureRepository)();
        this.role = (0, role_entity_1.RoleRepository)();
    }
    add(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, isActive } = input;
                const { emp_id } = payload;
                const newBrand = new feature_entity_1.Feature();
                newBrand.name = name;
                newBrand.empId = emp_id;
                newBrand.isActive = isActive;
                yield this.feature.save(newBrand);
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    list(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const list = yield this.feature.find({
                    where: { isDeleted: false },
                    order: { createdAt: 'ASC' }
                });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: list };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getFeatureById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { featureId } = input;
                const feature = yield this.feature.findOne({ where: { featureId: Number(featureId) } });
                if (!feature) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: feature };
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
                const { key, isActive } = input;
                // console.log({key})
                if (!key) {
                    return { message: "Opps! something Went Wrong", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                yield this.feature.createQueryBuilder()
                    .update()
                    .set({ isActive })
                    .where("key = :key", { key })
                    .execute();
                const roleMapping = {
                    "e18b2f1a": ["da693r2", "da693r3", "da693r4", "da693r5"],
                    "e18b2f2a": ["da693r7"],
                    "e18b2f3a": ["da693r6"],
                    "e18b2f4a": ["da693r8"]
                };
                if (roleMapping[key]) {
                    const roleIds = roleMapping[key];
                    // Update `role` table for the provided list of role IDs
                    yield this.role.createQueryBuilder()
                        .update()
                        .set({ isActive })
                        .where("key IN (:...roleIds)", { roleIds })
                        .execute();
                }
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
                const { featureId } = input;
                yield this.feature.createQueryBuilder().update({ isDeleted: true }).where({ featureId }).execute();
                return { message: "Deleted Successfully.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.FeatureService = FeatureController;
