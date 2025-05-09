"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColourService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const colour_entity_1 = require("../../../../core/DB/Entities/colour.entity");
class ColourController {
    constructor() {
        this.colour = (0, colour_entity_1.ColourRepository)();
    }
    add(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = input;
                const { emp_id } = payload;
                const newBrand = new colour_entity_1.Colour();
                newBrand.name = name;
                newBrand.empId = emp_id;
                yield this.colour.save(newBrand);
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    list(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const list = yield this.colour.find({
                    where: { isDeleted: false },
                    order: {
                        updatedAt: 'DESC',
                        createdAt: 'DESC'
                    }
                });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: list };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getColourById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { colourId } = input;
                const colour = yield this.colour.findOne({ where: { colourId: Number(colourId) } });
                if (!colour) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: colour };
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const { name, colourId } = input;
                if (!name) {
                    return { message: "Name can't be empty.", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                yield this.colour.createQueryBuilder().update({ name }).where({ colourId }).execute();
                return { message: "Updated.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const { colourId } = input;
                yield this.colour.createQueryBuilder().update({ isDeleted: true }).where({ colourId: colourId }).execute();
                return { message: "Deleted Successfully.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    addMultiple(inputs, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const skippedColours = []; // Store skipped color names
                const processedColours = new Set(); // Store unique colors to prevent duplicates
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
                    const existingColour = yield this.colour.findOneBy({ name });
                    if (existingColour) {
                        skippedColours.push(`${name} (Already exists in database)`);
                        continue; // Skip if already exists
                    }
                    // Create a new color object
                    const newColour = new colour_entity_1.Colour();
                    newColour.name = name;
                    newColour.empId = emp_id;
                    // Save the color
                    yield this.colour.save(newColour);
                }
                // Create a success message, including information about skipped colors
                const message = skippedColours.length > 0
                    ? `Colours added successfully. Skipped colours: ${skippedColours.join(', ')}.`
                    : "All colours added successfully.";
                return { message, status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                console.log({ error });
                throw error; // Handle errors as usual
            }
        });
    }
}
exports.ColourService = ColourController;
