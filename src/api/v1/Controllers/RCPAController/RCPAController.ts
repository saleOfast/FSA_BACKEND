import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { RCPA, RCPARepository } from "../../../../core/DB/Entities/rcpa.entity";
import { STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { IRCPA, RCPAC, RCPAD, RCPAR, RCPAU } from "../../../../core/types/RCPAService/RCPAService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { Between, IsNull, Not } from "typeorm";

class RCPAService {
    private RCPARepository = RCPARepository();
    private userRespositry = UserRepository()

    constructor() { }

    async createRCPA(input: RCPAC, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const user = await this.userRespositry.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }
            let newRCPA = await this.RCPARepository.save(input);
            return { status: STATUSCODES.SUCCESS, message: "RCPA created successfully.", data: newRCPA };
        } catch (error) {
            throw error;
        }
    }

    async createHoliday(input: RCPAC, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const user = await this.userRespositry.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }
            let newRCPA = await this.RCPARepository.save(input);
            return { status: STATUSCODES.SUCCESS, message: "RCPA created successfully.", data: newRCPA };
        } catch (error) {
            throw error;
        }
    }

    async getRCPA(input: RCPAR, payload: IUser): Promise<IApiResponse> {
        try {
            const RCPAList = await this.RCPARepository.find({
                where: { storeId: input.storeId },
                relations: { store: true, user: true, product: true, competitorBrand: true },
                order: { createdAt: "DESC" },
            });
            return { status: STATUSCODES.SUCCESS, message: "RCPA list retrieved successfully.", data: RCPAList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getRCPAById(payload: IUser, input: RCPAR): Promise<IApiResponse> {
        try {
            const { rcpaId } = input;
            const RCPA: any | null = await this.RCPARepository.findOne({ where: { rcpaId: Number(rcpaId) } });
            if (!RCPA) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: RCPA }
        } catch (error) {
            throw error;
        }
    }

    async editRCPA(input: RCPAU, payload: IUser): Promise<IApiResponse> {
        try {
            if (input.rcpaId) {
                const existingRCPA = await this.RCPARepository.findOne({
                    where: { rcpaId: input.rcpaId },
                });
                if (!existingRCPA) {
                    return { status: STATUSCODES.CONFLICT, message: "RCPA does not exists." };
                }
                await this.RCPARepository.update({ rcpaId: input.rcpaId }, input);
            }
            return { status: STATUSCODES.SUCCESS, message: "RCPA updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deleteRCPA(input: RCPAD, payload: IUser): Promise<IApiResponse> {
        try {
            const RCPA = await this.RCPARepository.findOne({
                where: { rcpaId: input.rcpaId },
            });

            if (!RCPA) {
                return { status: STATUSCODES.NOT_FOUND, message: "RCPA does not exist." };
            }
            await this.RCPARepository.softDelete({ rcpaId: RCPA.rcpaId });
            return { status: STATUSCODES.SUCCESS, message: "RCPA deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

}

export { RCPAService as RCPA }