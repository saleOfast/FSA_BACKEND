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
exports.Workplace = void 0;
const workplace_entity_1 = require("../../../../core/DB/Entities/workplace.entity");
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
class WorkplaceService {
    constructor() {
        this.WorkplaceRepository = (0, workplace_entity_1.WorkplaceRepository)();
        this.userRespositry = (0, User_entity_1.UserRepository)();
    }
    createWorkplace(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const user = yield this.userRespositry.findOne({ where: { emp_id } });
                if (!user) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
                }
                let newWorkplace = yield this.WorkplaceRepository.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Workplace created successfully.", data: newWorkplace };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getWorkplace(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const WorkplaceList = yield this.WorkplaceRepository.find({
                    where: { storeId: input.storeId },
                    relations: { store: true, user: true },
                    order: { createdAt: "DESC" },
                });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Workplace list retrieved successfully.", data: WorkplaceList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getWorkplaceById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { workplaceId } = input;
                const Workplace = yield this.WorkplaceRepository.findOne({ where: { workplaceId: Number(workplaceId) } });
                if (!Workplace) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: Workplace };
            }
            catch (error) {
                throw error;
            }
        });
    }
    editWorkplace(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (input.workplaceId) {
                    const existingWorkplace = yield this.WorkplaceRepository.findOne({
                        where: { workplaceId: input.workplaceId },
                    });
                    if (!existingWorkplace) {
                        return { status: common_1.STATUSCODES.CONFLICT, message: "Workplace does not exists." };
                    }
                    yield this.WorkplaceRepository.update({ workplaceId: input.workplaceId }, input);
                }
                return { status: common_1.STATUSCODES.SUCCESS, message: "Workplace updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deleteWorkplace(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Workplace = yield this.WorkplaceRepository.findOne({
                    where: { workplaceId: input.workplaceId },
                });
                if (!Workplace) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Workplace does not exist." };
                }
                yield this.WorkplaceRepository.softDelete({ workplaceId: Workplace.workplaceId });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Workplace deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.Workplace = WorkplaceService;
