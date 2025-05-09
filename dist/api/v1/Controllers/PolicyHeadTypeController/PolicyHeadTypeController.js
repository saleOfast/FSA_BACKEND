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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyHeadType = void 0;
const policyHeadType_entity_1 = require("../../../../core/DB/Entities/policyHeadType.entity");
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
class PolicyHeadTypeService {
    constructor() {
        this.policyHeadTypeRepository = (0, policyHeadType_entity_1.PolicyTypeHeadRepository)();
        this.userRespositry = (0, User_entity_1.UserRepository)();
    }
    addPolicyType(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingPolicyType = yield this.policyHeadTypeRepository.findOne({
                    where: {
                        policy_id: input.policy_id,
                        from_date: input.from_date,
                        policy_type_name: input.policy_type_name,
                        claim_type: input.claim_type,
                    },
                });
                if (existingPolicyType) {
                    return { status: common_1.STATUSCODES.CONFLICT, message: "Policy Head Type Already Exist." };
                }
                // Create new policy type
                const newPolicyType = this.policyHeadTypeRepository.create(input);
                const savedPolicyType = yield this.policyHeadTypeRepository.save(newPolicyType);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Policy type created successfully.", data: savedPolicyType };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPolicyHeadTypeIDWise(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const policyTypeData = yield this.policyHeadTypeRepository.find({
                    where: { policy_id: Number(input.policy_id) },
                    relations: ['policy'],
                    order: { from_date: 'DESC' },
                    select: {
                        policy: {
                            policy_id: true,
                            policy_name: true,
                            policy_code: true
                        }
                    }
                });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Policy type list retrieved successfully.", data: policyTypeData };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getPolicyTypeById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { policy_type_id } = input;
                const policyType = yield this.policyHeadTypeRepository.findOne({ where: { policy_type_id: Number(policy_type_id) } });
                if (!policyType) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: policyType };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPolicyHeadTypeUserWise(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const policyTypeData = yield this.policyHeadTypeRepository.createQueryBuilder('policyType')
                    .select([
                    'policyType.policy_id',
                    'policyType.from_date',
                    'policyType.to_date',
                    'policyType.claim_type',
                    'policyType.cost_per_km',
                    'DISTINCT(policyType.policy_type_name) as policy_type_name'
                ])
                    .where('policyType.policy_id = :ph_id', { ph_id: input.policy_id })
                    .orderBy('policyType.from_date', 'DESC')
                    .getRawMany();
                return { status: common_1.STATUSCODES.SUCCESS, message: "Policy type retrieved successfully.", data: policyTypeData };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getPolicyForUser(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const whereClause = {
                    policy_type_id: input.policy_type_id,
                    from_date: { $lte: input.from_date } // TypeORM equivalent for less than or equal
                };
                if (input.policy_type_name && input.policy_type_name !== 'null' && input.policy_type_name !== 'undefined') {
                    whereClause.policy_type_name = input.policy_type_name;
                }
                const policyData = yield this.policyHeadTypeRepository.find({
                    where: whereClause,
                    relations: ['policy'],
                    order: { from_date: 'DESC' },
                    take: 1,
                    withDeleted: true // `paranoid: false` equivalent in Sequelize to include soft-deleted records
                });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Lead policy list retrieved successfully.", data: policyData };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    editPolicyHeadType(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { policy_type_id } = input, updateData = __rest(input, ["policy_type_id"]);
                const updateResult = yield this.policyHeadTypeRepository.update(policy_type_id, updateData);
                if (updateResult.affected === 0) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Policy type not found." };
                }
                return { status: common_1.STATUSCODES.SUCCESS, message: "Policy type updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deletePolicyHeadType(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const policyHeadType = yield this.policyHeadTypeRepository.findOne({
                    where: { policy_type_id: input.policy_type_id },
                });
                if (!policyHeadType) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Policy Head Type does not exist." };
                }
                yield this.policyHeadTypeRepository.softDelete({ policy_type_id: policyHeadType.policy_type_id });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Policy head Type deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.PolicyHeadType = PolicyHeadTypeService;
