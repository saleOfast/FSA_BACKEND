import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { ActivityTypeRepository } from "../../../../core/DB/Entities/activityType.entity";
import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";

class ActivityTypeController {
    private ActivityTypeRepository = ActivityTypeRepository();

    constructor() { }

    async createActivityType(input: any, payload: IUser): Promise<IApiResponse> {
        let { activity_type_name } = input
        try {
            if (!activity_type_name || activity_type_name == "") {
                return { status: STATUSCODES.CONFLICT, message: "Please Enter Activity Type" };
            }
            let check = await this.ActivityTypeRepository.findOne(
                { where: { activity_type_name: activity_type_name } },
            )
            if (check) {
                return { status: STATUSCODES.CONFLICT, message: "Activity Type Already Exists" };
            }
            let count = await this.ActivityTypeRepository.createQueryBuilder("activity")
                .withDeleted() // Ensures soft-deleted records are counted
                .getCount();

            let nextId = count + 1;
            let newActivityType = await this.ActivityTypeRepository.save({
                activity_type_code: `ACT_TYPE_${String(nextId).padStart(3, "0")}`,
                activity_type_name,
                status: true
            });

            return { status: STATUSCODES.SUCCESS, message: "Activity Type created successfully.", data: newActivityType };
        } catch (error) {
            throw error;
        }
    }

    async getActivityTypes(input: any, payload: IUser): Promise<IApiResponse> {
        const { status } = input;
        try {
            const whereCondition = status ? { status } : {};
            const activityTypeList = await this.ActivityTypeRepository.find({
                where: whereCondition
            });
            return { status: STATUSCODES.SUCCESS, message: "Activity Type list retrieved successfully.", data: activityTypeList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getActivityTypeById(input: any): Promise<IApiResponse> {
        try {
            const { activityTypeId } = input;
            const activityType = await this.ActivityTypeRepository.findOne({ where: { activity_type_id: Number(activityTypeId) } });
            if (!activityType) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND };
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: activityType };
        } catch (error) {
            throw error;
        }
    }

    async editActivityType(input: any): Promise<IApiResponse> {
        let { activity_type_id } = input
        try {
            if (activity_type_id) {
                const existingActivityType = await this.ActivityTypeRepository.findOne({
                    where: { activity_type_id },
                });
                if (!existingActivityType) {
                    return { status: STATUSCODES.CONFLICT, message: "Activity Type does not exist." };
                }
                await this.ActivityTypeRepository.update({ activity_type_id }, input);
            } else {
                return { status: STATUSCODES.CONFLICT, message: "Please Enter Activity Type" };
            }

            return { status: STATUSCODES.SUCCESS, message: "Activity Type updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deleteActivityType(input: any): Promise<IApiResponse> {
        try {
            const activityType = await this.ActivityTypeRepository.findOne({
                where: { activity_type_id: input.activity_type_id },
            });

            if (!activityType) {
                return { status: STATUSCODES.NOT_FOUND, message: "Activity Type does not exist." };
            }
            await this.ActivityTypeRepository.softDelete({ activity_type_id: activityType.activity_type_id });
            return { status: STATUSCODES.SUCCESS, message: "Activity Type deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }
}

export { ActivityTypeController };
