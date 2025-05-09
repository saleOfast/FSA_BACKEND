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
exports.RCPA = void 0;
const rcpa_entity_1 = require("../../../../core/DB/Entities/rcpa.entity");
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
class RCPAService {
    constructor() {
        this.RCPARepository = (0, rcpa_entity_1.RCPARepository)();
        this.userRespositry = (0, User_entity_1.UserRepository)();
    }
    createRCPA(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const user = yield this.userRespositry.findOne({ where: { emp_id } });
                if (!user) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
                }
                let newRCPA = yield this.RCPARepository.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "RCPA created successfully.", data: newRCPA };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createHoliday(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const user = yield this.userRespositry.findOne({ where: { emp_id } });
                if (!user) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
                }
                let newRCPA = yield this.RCPARepository.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "RCPA created successfully.", data: newRCPA };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRCPA(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const RCPAList = yield this.RCPARepository.find({
                    where: { storeId: input.storeId },
                    relations: { store: true, user: true, product: true, competitorBrand: true },
                    order: { createdAt: "DESC" },
                });
                return { status: common_1.STATUSCODES.SUCCESS, message: "RCPA list retrieved successfully.", data: RCPAList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getRCPAById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rcpaId } = input;
                const RCPA = yield this.RCPARepository.findOne({ where: { rcpaId: Number(rcpaId) } });
                if (!RCPA) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: RCPA };
            }
            catch (error) {
                throw error;
            }
        });
    }
    editRCPA(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (input.rcpaId) {
                    const existingRCPA = yield this.RCPARepository.findOne({
                        where: { rcpaId: input.rcpaId },
                    });
                    if (!existingRCPA) {
                        return { status: common_1.STATUSCODES.CONFLICT, message: "RCPA does not exists." };
                    }
                    yield this.RCPARepository.update({ rcpaId: input.rcpaId }, input);
                }
                return { status: common_1.STATUSCODES.SUCCESS, message: "RCPA updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deleteRCPA(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const RCPA = yield this.RCPARepository.findOne({
                    where: { rcpaId: input.rcpaId },
                });
                if (!RCPA) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "RCPA does not exist." };
                }
                yield this.RCPARepository.softDelete({ rcpaId: RCPA.rcpaId });
                return { status: common_1.STATUSCODES.SUCCESS, message: "RCPA deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.RCPA = RCPAService;
