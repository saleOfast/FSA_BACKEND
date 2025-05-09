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
exports.ReasonService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const reason_entity_1 = require("../../../../core/DB/Entities/reason.entity");
// import { UpdateReason } from "aws-sdk/clients/iottwinmaker";
class ReasonController {
    constructor() {
        this.reason = (0, reason_entity_1.ReasonRepository)();
    }
    add(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { description } = input;
                const { emp_id } = payload;
                const newBrand = new reason_entity_1.Reason();
                newBrand.description = description;
                newBrand.empId = emp_id;
                yield this.reason.save(newBrand);
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
                const brandList = yield this.reason.find({
                    where: { isDeleted: false },
                    order: {
                        updatedAt: 'DESC',
                        createdAt: 'DESC'
                    }
                });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: brandList };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getReasonById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reasonId } = input;
                const reason = yield this.reason.findOne({ where: { reasonId: Number(reasonId) } });
                if (!reason) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: reason };
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
                const { description, reasonId } = input;
                if (!description) {
                    return { message: "Name can't be empty.", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                yield this.reason.createQueryBuilder().update({ description }).where({ reasonId }).execute();
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
                const { reasonId } = input;
                yield this.reason.createQueryBuilder().update({ isDeleted: true }).where({ reasonId: reasonId }).execute();
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
                const skippedReasons = []; // To store skipped reason descriptions
                const processedReasons = new Set(); // To avoid duplicates in input
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
                    const existingReason = yield this.reason.findOneBy({ description });
                    if (existingReason) {
                        skippedReasons.push(`${description} (Already exists in database)`);
                        continue; // Skip if it already exists
                    }
                    // Create a new reason object
                    const newReason = new reason_entity_1.Reason();
                    newReason.description = description;
                    newReason.empId = emp_id;
                    // Save the reason
                    yield this.reason.save(newReason);
                }
                // Create a success message, including information about skipped reasons
                const message = skippedReasons.length > 0
                    ? `Reasons added successfully. Skipped reasons: ${skippedReasons.join(', ')}.`
                    : "All reasons added successfully.";
                return { message, status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error; // Handle errors as usual
            }
        });
    }
}
exports.ReasonService = ReasonController;
