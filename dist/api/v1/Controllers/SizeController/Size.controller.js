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
exports.SizeService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const size_entity_1 = require("../../../../core/DB/Entities/size.entity");
class SizeController {
    constructor() {
        this.size = (0, size_entity_1.SizeRepository)();
    }
    add(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = input;
                const { emp_id } = payload;
                const newBrand = new size_entity_1.Size();
                newBrand.name = name;
                newBrand.empId = emp_id;
                yield this.size.save(newBrand);
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
                const list = yield this.size.find({
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
    getSizeById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sizeId } = input;
                const size = yield this.size.findOne({ where: { sizeId: Number(sizeId) } });
                if (!size) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: size };
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
                const { name, sizeId } = input;
                if (!name) {
                    return { message: "Name can't be empty.", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                yield this.size.createQueryBuilder().update({ name }).where({ sizeId }).execute();
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
                const { sizeId } = input;
                yield this.size.createQueryBuilder().update({ isDeleted: true }).where({ sizeId: sizeId }).execute();
                return { message: "Deleted Successfully.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    addMultiple(sizes, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const skippedSizes = []; // Store skipped size names
                const processedSizes = new Set(); // Store unique sizes to prevent duplicates
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
                    const existingSize = yield this.size.findOneBy({ name });
                    if (existingSize) {
                        skippedSizes.push(`Size ${name} (Already exists in database)`);
                        continue; // Skip the size if it already exists
                    }
                    // Create a new size object
                    const newSize = new size_entity_1.Size();
                    newSize.name = name;
                    newSize.empId = emp_id;
                    // Save the size
                    yield this.size.save(newSize);
                }
                // Return success message with information about skipped sizes
                const message = skippedSizes.length > 0
                    ? `Sizes created successfully. Skipped sizes: ${skippedSizes.join(', ')}.`
                    : "All sizes created successfully.";
                return { message, status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
}
exports.SizeService = SizeController;
