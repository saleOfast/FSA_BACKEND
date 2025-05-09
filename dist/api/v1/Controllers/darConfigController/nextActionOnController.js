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
exports.NextActionOnController = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const nextActionOn_entity_1 = require("../../../../core/DB/Entities/nextActionOn.entity");
class NextActionOnController {
    constructor() {
        this.nextActionOnRepository = (0, nextActionOn_entity_1.NextActionOnRepository)();
    }
    createNextActionOn(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let { next_action_on_name } = input;
            try {
                if (!next_action_on_name || next_action_on_name == "") {
                    return { status: common_1.STATUSCODES.CONFLICT, message: "Please Enter Next Action On" };
                }
                let check = yield this.nextActionOnRepository.findOne({ where: { next_action_on_name } });
                if (check) {
                    return { status: common_1.STATUSCODES.CONFLICT, message: "Next Action On Already Exists" };
                }
                let count = yield this.nextActionOnRepository.createQueryBuilder("next_action_on")
                    .withDeleted() // Ensures soft-deleted records are counted
                    .getCount();
                let nextId = count + 1;
                let nextActionOn = yield this.nextActionOnRepository.save({
                    next_action_on_code: `NXT_ACTION_${String(nextId).padStart(3, "0")}`,
                    next_action_on_name,
                    status: true
                });
                // const newNextActionOn = await this.nextActionOnRepository.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Next Action On created successfully.", data: nextActionOn };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getNextActionOnList(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status } = input;
            try {
                const whereCondition = status ? { status } : {};
                const nextActionOnList = yield this.nextActionOnRepository.find({
                    where: whereCondition
                });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Next Action On list retrieved successfully.", data: nextActionOnList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getNextActionOnById(next_action_on_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nextActionOn = yield this.nextActionOnRepository.findOne({ where: { next_action_on_id } });
                if (!nextActionOn) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: nextActionOn };
            }
            catch (error) {
                throw error;
            }
        });
    }
    editNextActionOn(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { next_action_on_id } = input;
                const existingNextActionOn = yield this.nextActionOnRepository.findOne({ where: { next_action_on_id } });
                if (!existingNextActionOn) {
                    return { status: common_1.STATUSCODES.CONFLICT, message: "Next Action On does not exist." };
                }
                yield this.nextActionOnRepository.update({ next_action_on_id }, input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Next Action On updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deleteNextActionOn(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { next_action_on_id } = input;
            try {
                const nextActionOn = yield this.nextActionOnRepository.findOne({ where: { next_action_on_id } });
                if (!nextActionOn) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Next Action On does not exist." };
                }
                yield this.nextActionOnRepository.softDelete({ next_action_on_id });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Next Action On deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.NextActionOnController = NextActionOnController;
