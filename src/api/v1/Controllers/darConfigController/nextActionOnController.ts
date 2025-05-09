import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { STATUSCODES } from "../../../../core/types/Constent/common";
import { NextActionOnRepository } from "../../../../core/DB/Entities/nextActionOn.entity";

class NextActionOnController {
    private nextActionOnRepository = NextActionOnRepository();

    constructor() {}

    async createNextActionOn(input: any): Promise<IApiResponse> {
        let { next_action_on_name } = input
        try {
            if (!next_action_on_name || next_action_on_name == "") {
                return { status: STATUSCODES.CONFLICT, message: "Please Enter Next Action On" };
            }
            let check = await this.nextActionOnRepository.findOne(
                { where: { next_action_on_name } },
            )
            if (check) {
                return { status: STATUSCODES.CONFLICT, message: "Next Action On Already Exists" };
            }

            let count = await this.nextActionOnRepository.createQueryBuilder("next_action_on")
                .withDeleted() // Ensures soft-deleted records are counted
                .getCount();

            let nextId = count + 1;

            let nextActionOn = await this.nextActionOnRepository.save({
                next_action_on_code: `NXT_ACTION_${String(nextId).padStart(3, "0")}`,
                next_action_on_name,
                status: true
            });
            // const newNextActionOn = await this.nextActionOnRepository.save(input);
            return { status: STATUSCODES.SUCCESS, message: "Next Action On created successfully.", data: nextActionOn };
        } catch (error) {
            throw error;
        }
    }

    async getNextActionOnList(input:any): Promise<IApiResponse> {
        const { status } = input;
        try {
            const whereCondition = status ? { status } : {};
            const nextActionOnList = await this.nextActionOnRepository.find({
                where: whereCondition
            });
            return { status: STATUSCODES.SUCCESS, message: "Next Action On list retrieved successfully.", data: nextActionOnList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getNextActionOnById(next_action_on_id: number): Promise<IApiResponse> {
        try {
            const nextActionOn = await this.nextActionOnRepository.findOne({ where: { next_action_on_id } });

            if (!nextActionOn) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND };
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: nextActionOn };
        } catch (error) {
            throw error;
        }
    }

    async editNextActionOn(input: any): Promise<IApiResponse> {
        try {
            const { next_action_on_id } = input;
            const existingNextActionOn = await this.nextActionOnRepository.findOne({ where: { next_action_on_id } });

            if (!existingNextActionOn) {
                return { status: STATUSCODES.CONFLICT, message: "Next Action On does not exist." };
            }

            await this.nextActionOnRepository.update({ next_action_on_id }, input);
            return { status: STATUSCODES.SUCCESS, message: "Next Action On updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deleteNextActionOn(input: any): Promise<IApiResponse> {
        const { next_action_on_id } = input
        try {
            const nextActionOn = await this.nextActionOnRepository.findOne({ where: { next_action_on_id } });

            if (!nextActionOn) {
                return { status: STATUSCODES.NOT_FOUND, message: "Next Action On does not exist." };
            }

            await this.nextActionOnRepository.softDelete({ next_action_on_id });
            return { status: STATUSCODES.SUCCESS, message: "Next Action On deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }
}

export { NextActionOnController };
