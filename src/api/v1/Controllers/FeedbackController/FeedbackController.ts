import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { FeedBack, FeedBackRepository } from "../../../../core/DB/Entities/feedback.entity";
import { STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { IFeedback, FeedbackC, FeedbackD, FeedbackR, FeedbackU } from "../../../../core/types/FeedbackService/FeedbackService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { Between, IsNull, Not } from "typeorm";

class FeedbackService {
    private FeedbackRepository = FeedBackRepository();
    private userRespositry = UserRepository()

    constructor() { }

    async createFeedback(input: FeedbackC, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const user = await this.userRespositry.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }
            let newFeedback = await this.FeedbackRepository.save(input);
            return { status: STATUSCODES.SUCCESS, message: "Feedback created successfully.", data: newFeedback };
        } catch (error) {
            throw error;
        }
    }

    async getFeedback(input: FeedbackR, payload: IUser): Promise<IApiResponse> {
        try {
            const FeedbackList = await this.FeedbackRepository.find({
                where: { storeId: input.storeId },
                relations: { store: true, user: true, product: true },
                order: { createdAt: "DESC" },
            });
            return { status: STATUSCODES.SUCCESS, message: "Feedback list retrieved successfully.", data: FeedbackList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getFeedbackById(payload: IUser, input: FeedbackR): Promise<IApiResponse> {
        try {
            const { feedbackId } = input;
            const feedback: any | null = await this.FeedbackRepository.findOne({ where: { feedbackId: Number(feedbackId) } });
            if (!feedback) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: feedback }
        } catch (error) {
            throw error;
        }
    }

    async editFeedback(input: FeedbackU, payload: IUser): Promise<IApiResponse> {
        try {
            if (input.feedbackId) {
                const existingFeedback = await this.FeedbackRepository.findOne({
                    where: { feedbackId: input.feedbackId },
                });
                if (!existingFeedback) {
                    return { status: STATUSCODES.CONFLICT, message: "Feedback does not exists." };
                }
                await this.FeedbackRepository.update({ feedbackId: input.feedbackId }, input);
            }


            return { status: STATUSCODES.SUCCESS, message: "Feedback updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deleteFeedback(input: FeedbackD, payload: IUser): Promise<IApiResponse> {
        try {
            const Feedback = await this.FeedbackRepository.findOne({
                where: { feedbackId: input.feedbackId },
            });

            if (!Feedback) {
                return { status: STATUSCODES.NOT_FOUND, message: "Feedback does not exist." };
            }
            await this.FeedbackRepository.softDelete({ feedbackId: Feedback.feedbackId });
            return { status: STATUSCODES.SUCCESS, message: "Feedback deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }
}

export { FeedbackService as Feedback }