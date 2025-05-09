import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateColour, DeleteColour, GetColour, IColour, UpdateColour } from "../../../../core/types/ReasonService/ReasonService";
import { Colour, ColourRepository } from "../../../../core/DB/Entities/colour.entity";

class ColourController {
    private colour = ColourRepository();

    constructor() { }

    async add(input: CreateColour, payload: IUser): Promise<IApiResponse> {
        try {
            const { name } = input;
            const { emp_id } = payload;

            const newBrand = new Colour();
            newBrand.name = name;
            newBrand.empId = emp_id;

            await this.colour.save(newBrand);

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }


    async list(payload: IUser): Promise<IApiResponse> {
        try {

            const list: IColour[] | null = await this.colour.find({
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


    async getColourById(payload: IUser, input: GetColour): Promise<IApiResponse> {
        try {
            const { colourId } = input;
            const colour: IColour | null = await this.colour.findOne({ where: { colourId: Number(colourId) } });
            if (!colour) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: colour }
        } catch (error) {
            throw error;
        }
    }


    async update(payload: IUser, input: UpdateColour): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { name, colourId } = input;
            if (!name) {
                return { message: "Name can't be empty.", status: STATUSCODES.BAD_REQUEST }
            }

            await this.colour.createQueryBuilder().update({ name }).where({ colourId }).execute();

            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async delete(payload: IUser, input: DeleteColour): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { colourId } = input;
            await this.colour.createQueryBuilder().update({ isDeleted: true }).where({ colourId: colourId }).execute();
            return { message: "Deleted Successfully.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async addMultiple(inputs: CreateColour[], payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const skippedColours: string[] = []; // Store skipped color names
            const processedColours: Set<string> = new Set(); // Store unique colors to prevent duplicates
    
            // Loop through the input colors
            for (const input of inputs) {
                const { name } = input;
    
                // Create a unique key to identify each color
                const colourKey = name;
    
                // In-memory duplicate check (skip if the color is already processed)
                if (processedColours.has(colourKey)) {
                    skippedColours.push(`${name} (Duplicate in input)`);
                    continue; // Skip the duplicate in the input
                }
    
                processedColours.add(colourKey); // Mark this color as processed
    
                // Check if the color already exists in the database
                const existingColour = await this.colour.findOneBy({ name });
                if (existingColour) {
                    skippedColours.push(`${name} (Already exists in database)`);
                    continue; // Skip if already exists
                }
    
                // Create a new color object
                const newColour = new Colour();
                newColour.name = name;
                newColour.empId = emp_id;
    
                // Save the color
                await this.colour.save(newColour);
            }
    
            // Create a success message, including information about skipped colors
            const message = skippedColours.length > 0
                ? `Colours added successfully. Skipped colours: ${skippedColours.join(', ')}.`
                : "All colours added successfully.";
    
            return { message, status: STATUSCODES.SUCCESS };
        } catch (error) {
            console.log({ error });
            throw error; // Handle errors as usual
        }
    }
}

export { ColourController as ColourService }