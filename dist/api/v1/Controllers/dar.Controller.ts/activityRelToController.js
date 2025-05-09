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
exports.ActivityRelTo = void 0;
const activityRelatedTo_entity_1 = require("../../../../core/DB/Entities/activityRelatedTo.entity");
const common_1 = require("../../../../core/types/Constent/common");
class ActivityRelToService {
    constructor() {
        this.ActivityRelToRepository = (0, activityRelatedTo_entity_1.ActivityRelToRepository)();
    }
    createActivityRelTo(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newActivityRelTo = yield this.ActivityRelToRepository.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Activity Related To created successfully.", data: newActivityRelTo };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getActivityRelToList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activityRelToList = yield this.ActivityRelToRepository.find();
                return { status: common_1.STATUSCODES.SUCCESS, message: "Activity Related To list retrieved successfully.", data: activityRelToList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getActivityRelToById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { activity_rel_to_id } = input;
                const activityRelTo = yield this.ActivityRelToRepository.findOne({ where: { activity_rel_to_id: Number(activity_rel_to_id) } });
                if (!activityRelTo) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: activityRelTo };
            }
            catch (error) {
                throw error;
            }
        });
    }
    editActivityRelTo(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (input.activityRelToId) {
                    const existingActivityRelTo = yield this.ActivityRelToRepository.findOne({
                        where: { activity_rel_to_id: input.activity_rel_to_id },
                    });
                    if (!existingActivityRelTo) {
                        return { status: common_1.STATUSCODES.CONFLICT, message: "Activity Related To does not exist." };
                    }
                    yield this.ActivityRelToRepository.update({ activity_rel_to_id: input.activity_rel_to_id }, input);
                }
                return { status: common_1.STATUSCODES.SUCCESS, message: "Activity Related To updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deleteActivityRelTo(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activityRelTo = yield this.ActivityRelToRepository.findOne({
                    where: { activity_rel_to_id: input.activity_rel_to_id },
                });
                if (!activityRelTo) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Activity Related To does not exist." };
                }
                yield this.ActivityRelToRepository.softDelete({ activity_rel_to_id: activityRelTo.activity_rel_to_id });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Activity Related To deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.ActivityRelTo = ActivityRelToService;
