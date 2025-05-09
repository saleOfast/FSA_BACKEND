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
exports.LeaveHeadController = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const Leave_entity_1 = require("../../../../core/DB/Entities/Leave.entity");
class LeaveHeadController {
    constructor() {
        this.leaveHeadRepository = (0, Leave_entity_1.HeadLeaveRepository)();
    }
    createLeadHead(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { head_leave_name } = input;
                const leaveHeadExists = yield this.leaveHeadRepository.findOne({
                    where: { head_leave_name: head_leave_name }
                });
                if (leaveHeadExists) {
                    return { status: common_1.STATUSCODES.CONFLICT, message: "Leave Head Name Alredy Exist." };
                }
                let count = yield this.leaveHeadRepository.count();
                const head_leave_code = `LH${(count + 1).toString().padStart(7, '0')}`;
                const newLeaveHead = yield this.leaveHeadRepository.save(Object.assign(Object.assign({}, input), { head_leave_code: head_leave_code }));
                return { message: "Success", status: common_1.STATUSCODES.SUCCESS, data: newLeaveHead };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getLeadHead(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { head_leave_id } = input;
                let data;
                if (head_leave_id) {
                    data = yield this.leaveHeadRepository.findOne({
                        where: { head_leave_id: Number(head_leave_id) }
                    });
                }
                else {
                    data = yield this.leaveHeadRepository.find();
                }
                return { message: "Success", status: common_1.STATUSCODES.SUCCESS, data: data };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getLeaveHeadById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { head_leave_id } = input;
                const policy = yield this.leaveHeadRepository.findOne({ where: { head_leave_id: Number(head_leave_id) } });
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
    updateLeadHead(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { head_leave_id } = input;
                if (!head_leave_id)
                    return { status: common_1.STATUSCODES.BAD_REQUEST, message: "Leave Id is required." };
                const data = yield this.leaveHeadRepository.findOne({ where: { head_leave_id: head_leave_id } });
                if (!data)
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "No data found with this leave id" };
                yield this.leaveHeadRepository.update({ head_leave_id: head_leave_id }, input);
                return { message: "Leave Updated Successfully", status: common_1.STATUSCODES.SUCCESS, data: data };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteLeadHead(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { head_leave_id } = input;
                if (!head_leave_id)
                    return { status: common_1.STATUSCODES.BAD_REQUEST, message: "Leave Id is required." };
                const data = yield this.leaveHeadRepository.findOne({ where: { head_leave_id: Number(head_leave_id) } });
                if (!data)
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "No data found with this leave id" };
                yield this.leaveHeadRepository.softDelete({ head_leave_id: Number(head_leave_id) });
                return { message: "Leave Deleted Successfully", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.LeaveHeadController = LeaveHeadController;
