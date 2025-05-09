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
exports.ActivityType = void 0;
const activityType_entity_1 = require("../../../../core/DB/Entities/activityType.entity");
const common_1 = require("../../../../core/types/Constent/common");
class ActivityTypeService {
    constructor() {
        this.ActivityTypeRepository = (0, activityType_entity_1.ActivityTypeRepository)();
    }
    createActivityType(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newActivityType = yield this.ActivityTypeRepository.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Activity Type created successfully.", data: newActivityType };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getActivityTypes(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activityTypeList = yield this.ActivityTypeRepository.find();
                return { status: common_1.STATUSCODES.SUCCESS, message: "Activity Type list retrieved successfully.", data: activityTypeList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getActivityTypeById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { activityTypeId } = input;
                const activityType = yield this.ActivityTypeRepository.findOne({ where: { activity_type_id: Number(activityTypeId) } });
                if (!activityType) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: activityType };
            }
            catch (error) {
                throw error;
            }
        });
    }
    editActivityType(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (input.activityTypeId) {
                    const existingActivityType = yield this.ActivityTypeRepository.findOne({
                        where: { activity_type_id: input.activityTypeId },
                    });
                    if (!existingActivityType) {
                        return { status: common_1.STATUSCODES.CONFLICT, message: "Activity Type does not exist." };
                    }
                    yield this.ActivityTypeRepository.update({ activity_type_id: input.activityTypeId }, input);
                }
                return { status: common_1.STATUSCODES.SUCCESS, message: "Activity Type updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deleteActivityType(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activityType = yield this.ActivityTypeRepository.findOne({
                    where: { activity_type_id: input.activity_type_id },
                });
                if (!activityType) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Activity Type does not exist." };
                }
                yield this.ActivityTypeRepository.softDelete({ activity_type_id: activityType.activity_type_id });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Activity Type deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.ActivityType = ActivityTypeService;
