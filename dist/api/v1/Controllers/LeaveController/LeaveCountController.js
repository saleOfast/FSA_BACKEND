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
exports.LeaveCountController = void 0;
const common_1 = require("../../../../core/types/Constent/common");
// import { HeadLeaveCountRepository } from "../../../../core/DB/Entities/LeaveCount.entity";
const Leave_entity_1 = require("../../../../core/DB/Entities/Leave.entity");
const LeaveCount_entity_1 = require("../../../../core/DB/Entities/LeaveCount.entity");
class LeaveCountController {
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    constructor() {
        this.leaveCountRepository = (0, LeaveCount_entity_1.HeadLeaveCountRepository)();
        this.leaveHeadRepository = (0, Leave_entity_1.HeadLeaveRepository)();
    }
    createLeaveCount(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { headLeaveId, financialStart, financialEnd } = input;
                const leaveCountExists = yield this.leaveCountRepository.findOne({
                    where: {
                        headLeaveId: headLeaveId,
                        financialStart: financialStart,
                        financialEnd: financialEnd,
                    }
                });
                if (leaveCountExists) {
                    return { status: common_1.STATUSCODES.CONFLICT, message: "Leave Head Count Name Already Exists." };
                }
                const newLeaveCount = yield this.leaveCountRepository.save(input);
                return { message: "Leave Head Count Saved Successfully", status: common_1.STATUSCODES.SUCCESS, data: newLeaveCount };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getLeaveCount(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { headLeaveCntId } = input;
                let data;
                if (headLeaveCntId) {
                    data = yield this.leaveCountRepository.findOne({
                        where: { headLeaveCntId: Number(headLeaveCntId) }
                    });
                }
                else {
                    data = yield this.leaveCountRepository.find();
                }
                return { message: "Success", status: common_1.STATUSCODES.SUCCESS, data: data };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getLeaveHeadOfCurrentYear(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { year, mode } = input;
                let currentYear = new Date().getFullYear();
                // Adjust the year if the current month is January to March
                let currentMonth = new Date().getMonth();
                if (currentMonth <= 2) {
                    currentYear -= 1;
                }
                // Use a specific year if provided in the query
                if (year) {
                    currentYear = parseInt(year);
                }
                // Calculate financial year dates
                const financialStart = new Date(currentYear, 3, 1);
                const financialEnd = new Date(currentYear + 1, 2, 31);
                let leaveHeadBody;
                let query;
                if (mode === "user") {
                    query = this.leaveCountRepository
                        .createQueryBuilder("leaveCount")
                        .leftJoinAndSelect("leaveCount.headLeave", "headLeave")
                        .where("leaveCount.financialStart = :financialStart", { financialStart })
                        .andWhere("leaveCount.financialEnd = :financialEnd", { financialEnd });
                }
                else {
                    query = this.leaveHeadRepository
                        .createQueryBuilder("leaveHead")
                        .leftJoinAndSelect("leaveHead.leave_head_count", "leaveHeadCounts", "leaveHeadCounts.financialStart = :financialStart AND leaveHeadCounts.financialEnd = :financialEnd AND leaveHeadCounts.deletedAt IS NULL", { financialStart, financialEnd })
                        .where("leaveHead.deleted_at IS NULL");
                }
                leaveHeadBody = yield query.getMany();
                return {
                    message: "Leave head list Fetched Successfully",
                    status: common_1.STATUSCODES.SUCCESS, data: leaveHeadBody
                };
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    updateLeaveCount(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { headLeaveCntId } = input;
                if (!headLeaveCntId)
                    return { status: common_1.STATUSCODES.BAD_REQUEST, message: "Leave Id is required." };
                const data = yield this.leaveCountRepository.findOne({ where: { headLeaveCntId: headLeaveCntId } });
                if (!data)
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "No data found with this leave id" };
                yield this.leaveCountRepository.update({ headLeaveCntId: headLeaveCntId }, input);
                return { message: "Leave Count Updated Successfully", status: common_1.STATUSCODES.SUCCESS, data: data };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteLeaveCount(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { headLeaveCntId } = input;
                if (!headLeaveCntId)
                    return { status: common_1.STATUSCODES.BAD_REQUEST, message: "Leave Id is required." };
                const data = yield this.leaveCountRepository.findOne({ where: { headLeaveCntId: headLeaveCntId } });
                if (!data)
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "No data found with this leave id" };
                yield this.leaveCountRepository.softDelete({ headLeaveCntId: headLeaveCntId });
                return { message: "Leave Count Deleted Successfully", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.LeaveCountController = LeaveCountController;
