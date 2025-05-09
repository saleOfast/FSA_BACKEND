import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { Activities, ActivitiesRepository } from "../../../../core/DB/Entities/activities.entity";
import { STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { IActivities, ActivitiesC, ActivitiesD, ActivitiesR, ActivitiesU } from "../../../../core/types/ActivitiesService/ActivitiesService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { Between, IsNull, Not } from "typeorm";
import { JointWorkRepository } from "../../../../core/DB/Entities/activities.jointWork.entity";

class ActivitiesService {
    private ActivitiesRepository = ActivitiesRepository();
    private JointWorkRepository = JointWorkRepository();
    private userRespositry = UserRepository()

    constructor() { }

    async createActivities(input: ActivitiesC, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            let userIds = input.jointWorks
            const user = await this.userRespositry.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }
            const inputData = {
                storeId: input.storeId,
                activityType: input.activityType,
                date: input.date,
                addedBy: input.addedBy,
                productId: input.productId,
                duration: input.duration,
                remarks: input.remarks,
            }
            const newActivity = await this.ActivitiesRepository.save(inputData);

            // Create joint work entries
            console.log(newActivity)
            const jointWorks = userIds.map(userId => ({ activity: newActivity, emp_id: userId }));
            await this.JointWorkRepository.save(jointWorks);
            return { status: STATUSCODES.SUCCESS, message: "Activity created successfully.", data: newActivity };
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async getActivities(input: ActivitiesR, payload: IUser): Promise<IApiResponse> {
        try {
            const activitiesList = await this.ActivitiesRepository.find({
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
            return { status: STATUSCODES.SUCCESS, message: "Activity list retrieved successfully.", data: activitiesList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getActivitiesById(payload: IUser, input: ActivitiesR): Promise<IApiResponse> {
        try {
            const { activityId } = input;
            const activity: any | null = await this.ActivitiesRepository.findOne({ where: { activityId: Number(activityId) } });
            if (!activity) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: activity }
        } catch (error) {
            throw error;
        }
    }

    async editActivities(input: ActivitiesU, payload: IUser): Promise<IApiResponse> {
        try {
            if (input.activityId) {
                const existingActivity = await this.ActivitiesRepository.findOne({
                    where: { activityId: input.activityId },
                });
                if (!existingActivity) {
                    return { status: STATUSCODES.CONFLICT, message: "Activity does not exists." };
                }
                await this.ActivitiesRepository.update({ activityId: input.activityId }, input);
            }

            return { status: STATUSCODES.SUCCESS, message: "Activity updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deleteActivities(input: ActivitiesD, payload: IUser): Promise<IApiResponse> {
        try {
            const Activities = await this.ActivitiesRepository.findOne({
                where: { activityId: input.activityId },
            });

            if (!Activities) {
                return { status: STATUSCODES.NOT_FOUND, message: "Activity does not exist." };
            }
            await this.ActivitiesRepository.softDelete({ activityId: Activities.activityId });
            return { status: STATUSCODES.SUCCESS, message: "Activity deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

}

export { ActivitiesService as Activities }