import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { Reason, ReasonRepository } from "../../../../core/DB/Entities/reason.entity";
import { CreateReason, DeleteReason, GetReason, IReason, UpdateReason } from "../../../../core/types/ReasonService/ReasonService";
// import { UpdateReason } from "aws-sdk/clients/iottwinmaker";

class ReasonController {
    private reason = ReasonRepository();

    constructor() { }

    async add(input: CreateReason, payload: IUser): Promise<IApiResponse> {
        try {
            const { description } = input;
            const { emp_id } = payload;

            const newBrand = new Reason();
            newBrand.description = description;
            newBrand.empId = emp_id;

            await this.reason.save(newBrand);

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }


    async list(payload: IUser): Promise<IApiResponse> {
        try {

            const brandList: IReason[] | null = await this.reason.find({
                where: { isDeleted: false },
                order: {
                    updatedAt: 'DESC',
                    createdAt: 'DESC'
                }
            });

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: brandList }
        } catch (error) {
            throw error;
        }
    }


    async getReasonById(payload: IUser, input: GetReason): Promise<IApiResponse> {
        try {
            const { reasonId } = input;
            const reason: IReason | null = await this.reason.findOne({ where: { reasonId: Number(reasonId) } });
            if (!reason) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: reason }
        } catch (error) {
            throw error;
        }
    }


    async update(payload: IUser, input: UpdateReason): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { description, reasonId } = input;
            if (!description) {
                return { message: "Name can't be empty.", status: STATUSCODES.BAD_REQUEST }
            }

            await this.reason.createQueryBuilder().update({ description }).where({ reasonId }).execute();

            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async delete(payload: IUser, input: DeleteReason): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { reasonId } = input;
            await this.reason.createQueryBuilder().update({ isDeleted: true }).where({ reasonId: reasonId }).execute();
            return { message: "Deleted Successfully.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async addMultiple(inputs: CreateReason[], payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const skippedReasons: string[] = []; // To store skipped reason descriptions
            const processedReasons: Set<string> = new Set(); // To avoid duplicates in input
    
            // Loop through the input reasons
            for (const input of inputs) {
                const { description } = input;
    
                // Check for duplicates within the input
                if (processedReasons.has(description)) {
                    skippedReasons.push(`${description} (Duplicate in input)`);
                    continue; // Skip duplicate entries
                }
    
                processedReasons.add(description); // Mark the reason as processed
    
                // Check if the reason already exists in the database
                const existingReason = await this.reason.findOneBy({ description });
                if (existingReason) {
                    skippedReasons.push(`${description} (Already exists in database)`);
                    continue; // Skip if it already exists
                }
    
                // Create a new reason object
                const newReason = new Reason();
                newReason.description = description;
                newReason.empId = emp_id;
    
                // Save the reason
                await this.reason.save(newReason);
            }
    
            // Create a success message, including information about skipped reasons
            const message = skippedReasons.length > 0
                ? `Reasons added successfully. Skipped reasons: ${skippedReasons.join(', ')}.`
                : "All reasons added successfully.";
    
            return { message, status: STATUSCODES.SUCCESS };
        } catch (error) {
            throw error; // Handle errors as usual
        }
    }
}

export { ReasonController as ReasonService }