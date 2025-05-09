import { DarC, DarD, DarR, DarU, IDar } from '../../../../core/types/DarService/DarService';
import { Dar, DARRepository } from "../../../../core/DB/Entities/dar.entity";
import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { In, IsNull } from "typeorm";

class DarController {
    private darRepo = DARRepository();

    constructor() { }

    async createDar(input: any, payload: IUser): Promise<IApiResponse> {
        try {
            let darBodies: any = Array.isArray(input) ? input : [input];
            const { emp_id, managerId } = payload;
           
            darBodies = darBodies.flatMap((dar: any) =>
                (Array.isArray(dar.data) ? dar.data : [dar])
                    .map((entry: any) => ({
                        ...entry,
                        emp_id,
                        managerId
                    }))
            );

            const existingDarData = await this.darRepo
                .createQueryBuilder("dar")
                .where(
                    darBodies.map((dar: any, index: any) =>
                        `(dar.emp_id = :emp_id${index} AND dar.date = :date${index})`
                    ).join(" OR "),
                    Object.assign({}, ...darBodies.map((dar: any, index: any) => ({
                        [`emp_id${index}`]: dar.emp_id,
                        [`date${index}`]: dar.date
                    })))
                )
                .getMany();

            if (existingDarData.length > 0) {
                return {
                    message: `DAR already assigned for Selected date(s) ${existingDarData.map((dar) => dar.date).join(", ")}`,
                    status: STATUSCODES.CONFLICT,
                };
            }

            // Insert DAR records
            for (const dar of darBodies) {
                const newDar = new Dar();
                    newDar.activity_type = dar.activity_type,
                    newDar.activity_related = dar.activity_related,
                    newDar.related_to = dar.related_to,
                    newDar.date = dar.date,
                    newDar.subject = dar.subject,
                    newDar.next_action_on = dar.next_action_on,
                    newDar.remarks = dar.remarks,
                    newDar.status = dar.status,
                    newDar.emp_id = dar.emp_id,
                    newDar.manager_id = dar.managerId
                await this.darRepo.save(newDar);
            }

            return { message: "Success", status: STATUSCODES.SUCCESS };
        } catch (error) {
            console.error("Error in createDar:", error);
            return {
                message: "Something went wrong",
                status: STATUSCODES.ERROR_CANNOT_FULLFILL_REQUEST,
                data: error
            };
        }
    }

    async listDar(input: any): Promise<IApiResponse> {
        try {
            const { status, from_date, to_date } = input;
    
            let query = this.darRepo.createQueryBuilder("dar");
    
            if (status) {
                query.where("dar.status = :status", { status });
            }
    
            // Filter by date range if both `from_date` and `to_date` are provided
            if (from_date && to_date) {
                query.where("dar.date BETWEEN :from_date AND :to_date", { from_date, to_date });
            } 
    
            const list = await query.getMany();
    
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: list };
        } catch (error) {
            console.error("Error in listDar:", error);
            throw error;
        }
    }
    

    async getDarById(input: DarR): Promise<IApiResponse> {
        try {
            const { dar_id } = input;
            const dar: any | null = await this.darRepo.findOne({ where: { dar_id } });
            if (!dar) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND };
            }
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: dar };
        } catch (error) {
            throw error;
        }
    }

    async updateDar(input: any, payload:any): Promise<IApiResponse> {
        try {
            const { data } = input;
            const { emp_id, managerId } = payload;
    
            if (!data || !Array.isArray(data) || data.length === 0) {
                return { message: "Nothing to update.", status: STATUSCODES.BAD_REQUEST };
            }
    
            for (const darBody of data) {
                if (!darBody.dar_id) {
                    await this.darRepo.save({emp_id, manager_id: managerId, ...darBody});
                    continue;
                }
                 console.log({darBody})
                const darData = await this.darRepo.findOne({
                    where: { dar_id: darBody.dar_id }
                });
    
                if (darData) {
                    await this.darRepo.update({ dar_id: darData.dar_id }, {...darBody});
                }
            }
    
            return { message: "Updated successfully.", status: STATUSCODES.SUCCESS };
        } catch (error) {
            console.error("Error in updateDar:", error);
            throw error;
        }
    }
    
    async deleteDar(input: DarD): Promise<IApiResponse> {
        try {
            const { dar_id } = input;
            await this.darRepo.update({ dar_id }, { deletedAt: new Date() });
            return { message: "Deleted Successfully.", status: STATUSCODES.SUCCESS };
        } catch (error) {
            throw error;
        }
    }
}

export { DarController };
