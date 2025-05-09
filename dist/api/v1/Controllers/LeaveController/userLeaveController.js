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
exports.UserLeaveController = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const userLeave_entity_1 = require("../../../../core/DB/Entities/userLeave.entity");
class UserLeaveController {
    constructor() {
        this.userLeaveRepository = (0, userLeave_entity_1.UserLeaveRepository)();
    }
    getUserPendingLeavesCount(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { head_leave_cnt_id, left_leave } = input;
                const { emp_id } = payload;
                let data;
                if (head_leave_cnt_id) {
                    data = yield this.userLeaveRepository.findOne({
                        where: { head_leave_cnt_id: Number(head_leave_cnt_id), user_id: emp_id }
                    });
                }
                if (!data) {
                    return { message: "Success", status: common_1.STATUSCODES.SUCCESS, data: { left_leave } };
                }
                return { message: "Success", status: common_1.STATUSCODES.SUCCESS, data: data };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserLeaveController = UserLeaveController;
