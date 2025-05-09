import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { STATUSCODES } from "../../../../core/types/Constent/common";
import { EdetailingRepository } from "../../../../core/DB/Entities/eDetailing.entity";

class EDetainingController {
    private eDetailingRepo = EdetailingRepository();

    constructor() {}

    async createEDetailing(input: any): Promise<IApiResponse> {
        try {
            let newStatus = await this.eDetailingRepo.save(input);
            return { status: STATUSCODES.SUCCESS, message: "E-Detailing created successfully.", data: newStatus };
        } catch (error) {
            throw error;
        }
    }

    async getEDetailing(input:any): Promise<IApiResponse> {
        const { status } = input;
        try {
            const whereCondition = status ? { status } : {};
            const statusList = await this.eDetailingRepo.find();
            return { status: STATUSCODES.SUCCESS, message: "E-Detailing list retrieved successfully.", data: statusList };
        } catch (error) {
            console.error({error}, ">>>>>>>>>");
            throw new Error("Something went wrong");
        }
    }

    async getEDetailingById(input: any): Promise<IApiResponse> {
        const {e_detailing_id} = input
        try {
            const status = await this.eDetailingRepo.findOne({ where: { e_detailing_id } });

            if (!status) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND };
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: status };
        } catch (error) {
            throw error;
        }
    }

    async editEDetailing(input: any): Promise<IApiResponse> {
        try {
            const { e_detailing_id } = input;
            const existingStatus = await this.eDetailingRepo.findOne({ where: { e_detailing_id } });

            if (!existingStatus) {
                return { status: STATUSCODES.CONFLICT, message: "E-Detailing does not exist." };
            }

            await this.eDetailingRepo.update({ e_detailing_id }, input);
            return { status: STATUSCODES.SUCCESS, message: "E-Detailing updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deleteEDetailing(input: any): Promise<IApiResponse> {
        const { e_detailing_id } = input
        try {
            const data = await this.eDetailingRepo.findOne({ where: { e_detailing_id } });

            if (!data) {
                return { status: STATUSCODES.NOT_FOUND, message: "E-Detailing does not exist." };
            }

            await this.eDetailingRepo.softDelete({ e_detailing_id });
            return { status: STATUSCODES.SUCCESS, message: "E-Detailing deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }
}

export { EDetainingController };

