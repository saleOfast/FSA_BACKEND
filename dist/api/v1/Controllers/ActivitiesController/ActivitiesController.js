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
exports.Activities = void 0;
const activities_entity_1 = require("../../../../core/DB/Entities/activities.entity");
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
const activities_jointWork_entity_1 = require("../../../../core/DB/Entities/activities.jointWork.entity");
class ActivitiesService {
    constructor() {
        this.ActivitiesRepository = (0, activities_entity_1.ActivitiesRepository)();
        this.JointWorkRepository = (0, activities_jointWork_entity_1.JointWorkRepository)();
        this.userRespositry = (0, User_entity_1.UserRepository)();
    }
    createActivities(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                let userIds = input.jointWorks;
                const user = yield this.userRespositry.findOne({ where: { emp_id } });
                if (!user) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
                }
                const inputData = {
                    storeId: input.storeId,
                    activityType: input.activityType,
                    date: input.date,
                    addedBy: input.addedBy,
                    productId: input.productId,
                    duration: input.duration,
                    remarks: input.remarks,
                };
                const newActivity = yield this.ActivitiesRepository.save(inputData);
                // Create joint work entries
                console.log(newActivity);
                const jointWorks = userIds.map(userId => ({ activity: newActivity, emp_id: userId }));
                yield this.JointWorkRepository.save(jointWorks);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Activity created successfully.", data: newActivity };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getActivities(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activitiesList = yield this.ActivitiesRepository.find({
                    where: { storeId: input.storeId },
                    relations: {
                        user: true,
                        product: true,
                        jointWorks: {
                            user: true // Populate user inside jointWorks
                        }
                    },
                    order: { createdAt: "DESC" },
                });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Activity list retrieved successfully.", data: activitiesList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getActivitiesById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { activityId } = input;
                const activity = yield this.ActivitiesRepository.findOne({ where: { activityId: Number(activityId) } });
                if (!activity) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: activity };
            }
            catch (error) {
                throw error;
            }
        });
    }
    editActivities(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (input.activityId) {
                    const existingActivity = yield this.ActivitiesRepository.findOne({
                        where: { activityId: input.activityId },
                    });
                    if (!existingActivity) {
                        return { status: common_1.STATUSCODES.CONFLICT, message: "Activity does not exists." };
                    }
                    yield this.ActivitiesRepository.update({ activityId: input.activityId }, input);
                }
                return { status: common_1.STATUSCODES.SUCCESS, message: "Activity updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deleteActivities(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Activities = yield this.ActivitiesRepository.findOne({
                    where: { activityId: input.activityId },
                });
                if (!Activities) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Activity does not exist." };
                }
                yield this.ActivitiesRepository.softDelete({ activityId: Activities.activityId });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Activity deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.Activities = ActivitiesService;
