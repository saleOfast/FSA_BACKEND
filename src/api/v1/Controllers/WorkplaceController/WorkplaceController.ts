import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { Workplace, WorkplaceRepository } from "../../../../core/DB/Entities/workplace.entity";
import { STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { IWorkplace, WorkplaceC, WorkplaceD, WorkplaceR, WorkplaceU } from "../../../../core/types/WorkplaceService/WorkplaceService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { Between, IsNull, Not } from "typeorm";

class WorkplaceService {
    private WorkplaceRepository = WorkplaceRepository();
    private userRespositry = UserRepository()

    constructor() { }

    async createWorkplace(input: WorkplaceC, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const user = await this.userRespositry.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }
            let newWorkplace = await this.WorkplaceRepository.save(input);
            return { status: STATUSCODES.SUCCESS, message: "Workplace created successfully.", data: newWorkplace };
        } catch (error) {
            throw error;
        }
    }

    async getWorkplace(input: WorkplaceR, payload: IUser): Promise<IApiResponse> {
        try {
            const WorkplaceList = await this.WorkplaceRepository.find({
                where: { storeId: input.storeId },
                relations: { store: true, user: true },
                order: { createdAt: "DESC" },
            });
            return { status: STATUSCODES.SUCCESS, message: "Workplace list retrieved successfully.", data: WorkplaceList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getWorkplaceById(payload: IUser, input: WorkplaceR): Promise<IApiResponse> {
        try {
            const { workplaceId } = input;
            const Workplace: any | null = await this.WorkplaceRepository.findOne({ where: { workplaceId: Number(workplaceId) } });
            if (!Workplace) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: Workplace }
        } catch (error) {
            throw error;
        }
    }

    async editWorkplace(input: WorkplaceU, payload: IUser): Promise<IApiResponse> {
        try {
            if (input.workplaceId) {
                const existingWorkplace = await this.WorkplaceRepository.findOne({
                    where: { workplaceId: input.workplaceId },
                });
                if (!existingWorkplace) {
                    return { status: STATUSCODES.CONFLICT, message: "Workplace does not exists." };
                }
                await this.WorkplaceRepository.update({ workplaceId: input.workplaceId }, input);
            }


            return { status: STATUSCODES.SUCCESS, message: "Workplace updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deleteWorkplace(input: WorkplaceD, payload: IUser): Promise<IApiResponse> {
        try {
            const Workplace = await this.WorkplaceRepository.findOne({
                where: { workplaceId: input.workplaceId },
            });

            if (!Workplace) {
                return { status: STATUSCODES.NOT_FOUND, message: "Workplace does not exist." };
            }
            await this.WorkplaceRepository.softDelete({ workplaceId: Workplace.workplaceId });
            return { status: STATUSCODES.SUCCESS, message: "Workplace deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

}

export { WorkplaceService as Workplace }