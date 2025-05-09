import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateSize, DeleteSize, GetSize, ISize, UpdateSize } from "../../../../core/types/ReasonService/ReasonService";
import { Size, SizeRepository } from "../../../../core/DB/Entities/size.entity";

class SizeController {
    private size = SizeRepository();

    constructor() { }

    async add(input: CreateSize, payload: IUser): Promise<IApiResponse> {
        try {
            const { name } = input;
            const { emp_id } = payload;

            const newBrand = new Size();
            newBrand.name = name;
            newBrand.empId = emp_id;

            await this.size.save(newBrand);

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }


    async list(payload: IUser): Promise<IApiResponse> {
        try {

            const list: ISize[] | null = await this.size.find({
                where: { isDeleted: false },
                order: {
                    updatedAt: 'DESC',
                    createdAt: 'DESC'
                }
            });

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: list }
        } catch (error) {
            throw error;
        }
    }


    async getSizeById(payload: IUser, input: GetSize): Promise<IApiResponse> {
        try {
            const { sizeId } = input;
            const size: ISize | null = await this.size.findOne({ where: { sizeId: Number(sizeId) } });
            if (!size) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: size }
        } catch (error) {
            throw error;
        }
    }


    async update(payload: IUser, input: UpdateSize): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { name, sizeId } = input;
            if (!name) {
                return { message: "Name can't be empty.", status: STATUSCODES.BAD_REQUEST }
            }

            await this.size.createQueryBuilder().update({ name }).where({ sizeId }).execute();

            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async delete(payload: IUser, input: DeleteSize): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { sizeId } = input;
            await this.size.createQueryBuilder().update({ isDeleted: true }).where({ sizeId: sizeId }).execute();
            return { message: "Deleted Successfully.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async addMultiple(sizes: CreateSize[], payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const skippedSizes: string[] = []; // Store skipped size names
            const processedSizes: Set<string> = new Set(); // Store unique sizes to prevent duplicates
    
            console.log({ sizes });
    
            for (const size of sizes) {
                const { name } = size;
    
                // Create a unique key to identify each size by name
                const sizeKey = name;
    
                // In-memory duplicate check (skip if the size is already processed)
                if (processedSizes.has(sizeKey)) {
                    skippedSizes.push(`Size ${name} (Duplicate in input)`);
                    continue; // Skip the duplicate in the input
                }
    
                processedSizes.add(sizeKey); // Mark this size as processed
    
                // Check if the size already exists in the database
                const existingSize = await this.size.findOneBy({ name });
                if (existingSize) {
                    skippedSizes.push(`Size ${name} (Already exists in database)`);
                    continue; // Skip the size if it already exists
                }
    
                // Create a new size object
                const newSize = new Size();
                newSize.name = name;
                newSize.empId = emp_id;
    
                // Save the size
                await this.size.save(newSize);
            }
    
            // Return success message with information about skipped sizes
            const message = skippedSizes.length > 0
                ? `Sizes created successfully. Skipped sizes: ${skippedSizes.join(', ')}.`
                : "All sizes created successfully.";
    
            return { message, status: STATUSCODES.SUCCESS };
        } catch (error) {
            console.log({ error });
            throw error;
        }
    }
}

export { SizeController as SizeService }