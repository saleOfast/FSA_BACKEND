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
exports.Feedback = void 0;
const feedback_entity_1 = require("../../../../core/DB/Entities/feedback.entity");
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
class FeedbackService {
    constructor() {
        this.FeedbackRepository = (0, feedback_entity_1.FeedBackRepository)();
        this.userRespositry = (0, User_entity_1.UserRepository)();
    }
    createFeedback(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const user = yield this.userRespositry.findOne({ where: { emp_id } });
                if (!user) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
                }
                let newFeedback = yield this.FeedbackRepository.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Feedback created successfully.", data: newFeedback };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getFeedback(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const FeedbackList = yield this.FeedbackRepository.find({
                    where: { storeId: input.storeId },
                    relations: { store: true, user: true, product: true },
                    order: { createdAt: "DESC" },
                });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Feedback list retrieved successfully.", data: FeedbackList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getFeedbackById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { feedbackId } = input;
                const feedback = yield this.FeedbackRepository.findOne({ where: { feedbackId: Number(feedbackId) } });
                if (!feedback) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: feedback };
            }
            catch (error) {
                throw error;
            }
        });
    }
    editFeedback(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (input.feedbackId) {
                    const existingFeedback = yield this.FeedbackRepository.findOne({
                        where: { feedbackId: input.feedbackId },
                    });
                    if (!existingFeedback) {
                        return { status: common_1.STATUSCODES.CONFLICT, message: "Feedback does not exists." };
                    }
                    yield this.FeedbackRepository.update({ feedbackId: input.feedbackId }, input);
                }
                return { status: common_1.STATUSCODES.SUCCESS, message: "Feedback updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deleteFeedback(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Feedback = yield this.FeedbackRepository.findOne({
                    where: { feedbackId: input.feedbackId },
                });
                if (!Feedback) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Feedback does not exist." };
                }
                yield this.FeedbackRepository.softDelete({ feedbackId: Feedback.feedbackId });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Feedback deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.Feedback = FeedbackService;
