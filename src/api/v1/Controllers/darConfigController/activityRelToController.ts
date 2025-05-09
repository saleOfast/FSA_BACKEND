import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { ActivityRelToRepository } from "../../../../core/DB/Entities/activityRelatedTo.entity";
import { STATUSCODES } from "../../../../core/types/Constent/common";

class ActivityRelToController {
    private ActivityRelToRepository = ActivityRelToRepository();
    
    constructor() { }

    async createActivityRelTo(input: any): Promise<IApiResponse> {
        let { activity_rel_to_name } = input
        try {
            if (!activity_rel_to_name|| activity_rel_to_name == "") {
                return { status: STATUSCODES.CONFLICT, message: "Please Enter Activity Related To Name" };
            }
            let check = await this.ActivityRelToRepository.findOne(
                { where: { activity_rel_to_name: activity_rel_to_name } },
            )
            if (check) {
                return { status: STATUSCODES.CONFLICT, message: "Activity Related to Already Exists" };
            }
            
            let count = await this.ActivityRelToRepository.createQueryBuilder("activity_rel_to")
                .withDeleted() // Ensures soft-deleted records are counted
                .getCount();

            let nextId = count + 1;
            let newActivityType = await this.ActivityRelToRepository.save({
                activity_rel_to_code: `ACT_REL_TO_${String(nextId).padStart(3, "0")}`,
                activity_rel_to_name,
                status: true
            });
            return { status: STATUSCODES.SUCCESS, message: "Activity Related To created successfully.", data: newActivityType };
        } catch (error) {
            throw error;
        }
    }

    async getActivityRelToList(input:any): Promise<IApiResponse> {
        const { status } = input;
        try {
            const whereCondition = status ? { status } : {};
            const activityRelToList = await this.ActivityRelToRepository.find(
                {
                    where: whereCondition
                }
            );
            return { status: STATUSCODES.SUCCESS, message: "Activity Related To list retrieved successfully.", data: activityRelToList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getActivityRelToById(input: any): Promise<IApiResponse> {
        try {
            const { activity_rel_to_id } = input;
            const activityRelTo = await this.ActivityRelToRepository.findOne({ where: { activity_rel_to_id: Number(activity_rel_to_id) } });

            if (!activityRelTo) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND };
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: activityRelTo };
        } catch (error) {
            throw error;
        }
    }

    async editActivityRelTo(input: any): Promise<IApiResponse> {
        let {activity_rel_to_id} = input
        try {
            if (activity_rel_to_id) {
                const existingActivityRelTo = await this.ActivityRelToRepository.findOne({
                    where: { activity_rel_to_id },
                });

                if (!existingActivityRelTo) {
                    return { status: STATUSCODES.CONFLICT, message: "Activity Related To does not exist." };
                }

                await this.ActivityRelToRepository.update({ activity_rel_to_id}, input);
            }

            return { status: STATUSCODES.SUCCESS, message: "Activity Related To updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deleteActivityRelTo(input: any): Promise<IApiResponse> {
        try {
            const activityRelTo = await this.ActivityRelToRepository.findOne({
                where: { activity_rel_to_id: input.activity_rel_to_id },
            });

            if (!activityRelTo) {
                return { status: STATUSCODES.NOT_FOUND, message: "Activity Related To does not exist." };
            }

            await this.ActivityRelToRepository.softDelete({ activity_rel_to_id: activityRelTo.activity_rel_to_id });
            return { status: STATUSCODES.SUCCESS, message: "Activity Related To deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }
}

export { ActivityRelToController };
