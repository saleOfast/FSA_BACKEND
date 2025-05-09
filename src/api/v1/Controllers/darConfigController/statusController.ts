import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { STATUSCODES } from "../../../../core/types/Constent/common";
import { StatusRepository } from "../../../../core/DB/Entities/status.entity";

class StatusController {
    private statusRepository = StatusRepository();

    constructor() {}

    async createStatus(input: any): Promise<IApiResponse> {
        let { status_name } = input
        try {
            if (!status_name || status_name == "") {
                return { status: STATUSCODES.CONFLICT, message: "Please Enter Status" };
            }
            let check = await this.statusRepository.findOne(
                { where: { status_name } },
            )
            if (check) {
                return { status: STATUSCODES.CONFLICT, message: "This Status Already Exists" };
            }
            
            let count =  await this.statusRepository.createQueryBuilder("status")
                .withDeleted() // Ensures soft-deleted records are counted
                .getCount();

            let nextId = count + 1;

            let newStatus = await this.statusRepository.save({
                status_code: `STATUS_${String(nextId).padStart(3, "0")}`,
                status_name,
                status: true
            });
            // const newStatus = await this.statusRepository.save(input);
            return { status: STATUSCODES.SUCCESS, message: "Status created successfully.", data: newStatus };
        } catch (error) {
            throw error;
        }
    }

    async getStatusList(input:any): Promise<IApiResponse> {
        const { status } = input;
        try {
            const whereCondition = status ? { status } : {};
            const statusList = await this.statusRepository.find({
                where: whereCondition
            });
            return { status: STATUSCODES.SUCCESS, message: "Status list retrieved successfully.", data: statusList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getStatusById(status_id: number): Promise<IApiResponse> {
        try {
            const status = await this.statusRepository.findOne({ where: { status_id } });

            if (!status) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND };
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: status };
        } catch (error) {
            throw error;
        }
    }

    async editStatus(input: any): Promise<IApiResponse> {
        try {
            const { status_id } = input;
            const existingStatus = await this.statusRepository.findOne({ where: { status_id } });

            if (!existingStatus) {
                return { status: STATUSCODES.CONFLICT, message: "Status does not exist." };
            }

            await this.statusRepository.update({ status_id }, input);
            return { status: STATUSCODES.SUCCESS, message: "Status updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deleteStatus(input: any): Promise<IApiResponse> {
        const { status_id } = input
        try {
            const status = await this.statusRepository.findOne({ where: { status_id } });

            if (!status) {
                return { status: STATUSCODES.NOT_FOUND, message: "Status does not exist." };
            }

            await this.statusRepository.softDelete({ status_id });
            return { status: STATUSCODES.SUCCESS, message: "Status deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }
}

export { StatusController };

