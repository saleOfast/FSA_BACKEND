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
exports.Taxes = void 0;
const tax_entity_1 = require("../../../../core/DB/Entities/tax.entity");
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
class TaxesService {
    constructor() {
        this.TaxesRepository = (0, tax_entity_1.TaxesRepository)();
        this.userRespositry = (0, User_entity_1.UserRepository)();
    }
    createTaxes(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const user = yield this.userRespositry.findOne({ where: { emp_id } });
                if (!user) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
                }
                let newTaxes = yield this.TaxesRepository.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Taxes created successfully.", data: newTaxes };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTaxes(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const TaxesList = yield this.TaxesRepository.find({
                    relations: { user: true },
                    order: { createdAt: "DESC" },
                });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Taxes list retrieved successfully.", data: TaxesList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getTaxesById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taxId } = input;
                const Taxes = yield this.TaxesRepository.findOne({ where: { taxId: Number(taxId) } });
                if (!Taxes) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: Taxes };
            }
            catch (error) {
                throw error;
            }
        });
    }
    editTaxes(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (input.taxId) {
                    const existingTaxes = yield this.TaxesRepository.findOne({
                        where: { taxId: input.taxId },
                    });
                    if (!existingTaxes) {
                        return { status: common_1.STATUSCODES.CONFLICT, message: "Taxes does not exists." };
                    }
                    yield this.TaxesRepository.update({ taxId: input.taxId }, input);
                }
                return { status: common_1.STATUSCODES.SUCCESS, message: "Taxes updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deleteTaxes(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Taxes = yield this.TaxesRepository.findOne({
                    where: { taxId: input.taxId },
                });
                if (!Taxes) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Taxes does not exist." };
                }
                yield this.TaxesRepository.softDelete({ taxId: Taxes.taxId });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Taxes deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.Taxes = TaxesService;
