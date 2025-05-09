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
exports.PolicyHead = void 0;
const policyHead_entity_1 = require("../../../../core/DB/Entities/policyHead.entity");
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
const typeorm_1 = require("typeorm");
class PolicyHeadService {
    constructor() {
        this.policyHeadRepository = (0, policyHead_entity_1.PolicyHeadRepository)();
        this.userRespositry = (0, User_entity_1.UserRepository)();
    }
    createPolicyHead(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const user = yield this.userRespositry.findOne({ where: { emp_id } });
                if (!user) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
                }
                const existingPolicy = yield this.policyHeadRepository.findOne({
                    where: {
                        policy_name: input.policy_name,
                    }
                });
                if (existingPolicy) {
                    return { status: common_1.STATUSCODES.CONFLICT, message: "Policy head type already exists." };
                }
                let count = yield this.policyHeadRepository.count();
                input.policy_code = `PH_${count + 1}`;
                let newPolicy = yield this.policyHeadRepository.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Policy type created successfully.", data: newPolicy };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPolicyHead(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const policyHeadList = yield this.policyHeadRepository.find();
                return { status: common_1.STATUSCODES.SUCCESS, message: "Policy list retrieved successfully.", data: policyHeadList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getPolicyHeadById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { policy_id } = input;
                const policy = yield this.policyHeadRepository.findOne({ where: { policy_id: Number(policy_id) } });
                if (!policy) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: policy };
            }
            catch (error) {
                throw error;
            }
        });
    }
    editPolicyHead(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (input.policy_id) {
                    const existingPolicy = yield this.policyHeadRepository.findOne({
                        where: { policy_id: input.policy_id },
                    });
                    if (!existingPolicy) {
                        return { status: common_1.STATUSCODES.CONFLICT, message: "Policy head does not exists." };
                    }
                    const existingPolicyName = yield this.policyHeadRepository.findOne({
                        where: {
                            policy_id: (0, typeorm_1.Not)(input.policy_id),
                            policy_name: input.policy_name,
                        },
                    });
                    if (existingPolicyName) {
                        return { status: common_1.STATUSCODES.CONFLICT, message: "Policy head name already exists." };
                    }
                    yield this.policyHeadRepository.update({ policy_id: input.policy_id }, input);
                }
                return { status: common_1.STATUSCODES.SUCCESS, message: "Policy head updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deletePolicyHead(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const policyHead = yield this.policyHeadRepository.findOne({
                    where: { policy_id: input.policy_id },
                });
                if (!policyHead) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Policy head does not exist." };
                }
                yield this.policyHeadRepository.softDelete({ policy_id: policyHead.policy_id });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Policy head deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.PolicyHead = PolicyHeadService;
