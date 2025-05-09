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
exports.StatusController = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const status_entity_1 = require("../../../../core/DB/Entities/status.entity");
class StatusController {
    constructor() {
        this.statusRepository = (0, status_entity_1.StatusRepository)();
    }
    createStatus(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let { status_name } = input;
            try {
                if (!status_name || status_name == "") {
                    return { status: common_1.STATUSCODES.CONFLICT, message: "Please Enter Status" };
                }
                let check = yield this.statusRepository.findOne({ where: { status_name } });
                if (check) {
                    return { status: common_1.STATUSCODES.CONFLICT, message: "This Status Already Exists" };
                }
                let count = yield this.statusRepository.createQueryBuilder("status")
                    .withDeleted() // Ensures soft-deleted records are counted
                    .getCount();
                let nextId = count + 1;
                let newStatus = yield this.statusRepository.save({
                    status_code: `STATUS_${String(nextId).padStart(3, "0")}`,
                    status_name,
                    status: true
                });
                // const newStatus = await this.statusRepository.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Status created successfully.", data: newStatus };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getStatusList(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status } = input;
            try {
                const whereCondition = status ? { status } : {};
                const statusList = yield this.statusRepository.find({
                    where: whereCondition
                });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Status list retrieved successfully.", data: statusList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getStatusById(status_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = yield this.statusRepository.findOne({ where: { status_id } });
                if (!status) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    editStatus(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status_id } = input;
                const existingStatus = yield this.statusRepository.findOne({ where: { status_id } });
                if (!existingStatus) {
                    return { status: common_1.STATUSCODES.CONFLICT, message: "Status does not exist." };
                }
                yield this.statusRepository.update({ status_id }, input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Status updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deleteStatus(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status_id } = input;
            try {
                const status = yield this.statusRepository.findOne({ where: { status_id } });
                if (!status) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Status does not exist." };
                }
                yield this.statusRepository.softDelete({ status_id });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Status deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.StatusController = StatusController;
