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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Taxes = void 0;
const tax_entity_1 = require("../../../../core/DB/Entities/tax.entity");
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
const country_entity_1 = require("../../../../core/DB/Entities/country.entity");
const state_entity_1 = require("../../../../core/DB/Entities/state.entity");
const common_2 = require("../../../../core/types/Constent/common");
class TaxesService {
    constructor() {
        this.TaxesRepository = (0, tax_entity_1.TaxesRepository)();
        this.userRespositry = (0, User_entity_1.UserRepository)();
        this.Country = (0, country_entity_1.CountryRepository)();
        this.state = (0, state_entity_1.StateRepository)();
    }
    createTaxes(input, payload) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // ================= 1. REQUIRED COUNTRY & STATE =================
                if (!input.countryId) {
                    return {
                        status: common_1.STATUSCODES.BAD_REQUEST,
                        message: "countryId is required",
                        data: null,
                    };
                }
                if (!input.stateId) {
                    return {
                        status: common_1.STATUSCODES.BAD_REQUEST,
                        message: "stateId is required",
                        data: null,
                    };
                }
                const countryId = Number(input.countryId);
                const stateId = Number(input.stateId);
                if (isNaN(countryId)) {
                    return {
                        status: common_1.STATUSCODES.BAD_REQUEST,
                        message: "countryId must be a number",
                        data: null,
                    };
                }
                if (isNaN(stateId)) {
                    return {
                        status: common_1.STATUSCODES.BAD_REQUEST,
                        message: "stateId must be a number",
                        data: null,
                    };
                }
                // ================= 2. COUNTRY EXISTS =================
                const countryExists = yield this.Country.exists({
                    where: { countryId },
                });
                if (!countryExists) {
                    return {
                        status: common_1.STATUSCODES.BAD_REQUEST,
                        message: "Country does not exist",
                        data: null,
                    };
                }
                // ================= 3. STATE BELONGS TO COUNTRY =================
                const stateExists = yield this.state.exists({
                    where: {
                        stateId,
                        country: { countryId },
                    },
                });
                if (!stateExists) {
                    return {
                        status: common_1.STATUSCODES.BAD_REQUEST,
                        message: "State does not belong to the given country",
                        data: null,
                    };
                }
                // ================= 4. EFFECTIVE DATE VALIDATION =================
                if (input.effectiveTo && input.effectiveTo < input.effectiveFrom) {
                    return {
                        status: common_1.STATUSCODES.BAD_REQUEST,
                        message: "effectiveTo cannot be earlier than effectiveFrom",
                        data: null,
                    };
                }
                // ================= 5. DUPLICATE TAX RULE CHECK =================
                const existingRule = yield this.TaxesRepository.findOne({
                    where: {
                        taxClassification: input.taxClassification,
                        taxComponent: input.taxComponent,
                        supplyType: input.supplyType,
                        isSez: (_a = input.isSez) !== null && _a !== void 0 ? _a : common_2.YesNo.NO,
                        isExport: (_b = input.isExport) !== null && _b !== void 0 ? _b : common_2.YesNo.NO,
                        isRcm: (_c = input.isRcm) !== null && _c !== void 0 ? _c : common_2.YesNo.NO,
                        isActive: common_2.YesNo.YES,
                        country: { countryId },
                        state: { stateId },
                    },
                });
                if (existingRule) {
                    return {
                        status: common_1.STATUSCODES.CONFLICT,
                        message: "Tax rule already exists for this country and state",
                        data: null,
                    };
                }
                // ================= 6. CREATE ENTITY =================
                const taxRule = new tax_entity_1.Taxes();
                taxRule.taxClassification = input.taxClassification;
                taxRule.hsnCode = (_d = input.hsnCode) !== null && _d !== void 0 ? _d : "";
                taxRule.sacCode = (_e = input.sacCode) !== null && _e !== void 0 ? _e : "";
                taxRule.taxComponent = input.taxComponent;
                taxRule.taxPercentage = input.taxPercentage;
                taxRule.supplyType = input.supplyType;
                taxRule.isSez = (_f = input.isSez) !== null && _f !== void 0 ? _f : common_2.YesNo.NO;
                taxRule.isExport = (_g = input.isExport) !== null && _g !== void 0 ? _g : common_2.YesNo.NO;
                taxRule.isRcm = (_h = input.isRcm) !== null && _h !== void 0 ? _h : common_2.YesNo.NO;
                taxRule.isTaxable = (_j = input.isTaxable) !== null && _j !== void 0 ? _j : common_2.YesNo.YES;
                taxRule.effectiveFrom = input.effectiveFrom;
                taxRule.effectiveTo = (_k = input.effectiveTo) !== null && _k !== void 0 ? _k : null;
                taxRule.priority = (_l = input.priority) !== null && _l !== void 0 ? _l : 1;
                taxRule.isActive = (_m = input.isActive) !== null && _m !== void 0 ? _m : common_2.YesNo.YES;
                // ================= 7. ASSIGN RELATIONS =================
                taxRule.country = { countryId };
                taxRule.state = { stateId };
                // ================= 8. SAVE =================
                const savedTaxRule = yield this.TaxesRepository.save(taxRule);
                return {
                    status: common_1.STATUSCODES.SUCCESS,
                    message: "Tax rule created successfully",
                    data: savedTaxRule,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTaxes(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const TaxesList = yield this.TaxesRepository.createQueryBuilder("tax")
                    .select([
                    "tax.taxId",
                    "tax.taxClassification",
                    "tax.hsnCode",
                    "tax.sacCode",
                    "tax.taxComponent",
                    "tax.taxPercentage",
                    "tax.supplyType",
                    "tax.isSez",
                    "tax.isExport",
                    "tax.isRcm",
                    "tax.isTaxable",
                    "tax.effectiveFrom",
                    "tax.effectiveTo",
                    "tax.priority",
                    "tax.isActive",
                    "tax.createdAt",
                    "tax.updatedAt",
                    "country.countryId",
                    "state.stateId"
                ])
                    .leftJoin("tax.country", "country")
                    .leftJoin("tax.state", "state")
                    .where("tax.isDeleted = :isDeleted", { isDeleted: false })
                    .orderBy("tax.createdAt", "DESC")
                    .getMany();
                if (!TaxesList || TaxesList.length === 0) {
                    return {
                        status: common_1.STATUSCODES.NOT_FOUND,
                        message: "Taxes data not found",
                        data: [],
                    };
                }
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
                const Taxes = yield this.TaxesRepository.createQueryBuilder("tax")
                    .select([
                    "tax.taxId",
                    "tax.taxClassification",
                    "tax.hsnCode",
                    "tax.sacCode",
                    "tax.taxComponent",
                    "tax.taxPercentage",
                    "tax.supplyType",
                    "tax.isSez",
                    "tax.isExport",
                    "tax.isRcm",
                    "tax.isTaxable",
                    "tax.effectiveFrom",
                    "tax.effectiveTo",
                    "tax.priority",
                    "tax.isActive",
                    "country.countryId",
                    "state.stateId",
                    "tax.createdAt",
                    "tax.updatedAt",
                ])
                    .leftJoin("tax.country", "country")
                    .leftJoin("tax.state", "state")
                    .where("tax.taxId = :taxId", { taxId: Number(taxId) })
                    .andWhere("tax.isDeleted = :isDeleted", { isDeleted: false })
                    .getOne();
                if (!Taxes) {
                    return {
                        status: common_1.STATUSCODES.NOT_FOUND,
                        message: "Tax not found",
                        data: null,
                    };
                }
                return {
                    status: common_1.STATUSCODES.SUCCESS,
                    message: "Tax retrieved successfully",
                    data: Taxes,
                };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    editTaxes(input, payload) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taxId, countryId, stateId } = input, otherFields = __rest(input, ["taxId", "countryId", "stateId"]);
                // 1️⃣ Validate taxId
                if (!taxId) {
                    return {
                        status: common_1.STATUSCODES.BAD_REQUEST,
                        message: "taxId is required.",
                        data: null
                    };
                }
                // 2️⃣ Find existing tax record
                const existingTax = yield this.TaxesRepository.findOne({
                    where: { taxId: Number(taxId), isDeleted: false },
                });
                if (!existingTax) {
                    return {
                        status: common_1.STATUSCODES.NOT_FOUND,
                        message: "Tax record does not exist.",
                        data: null
                    };
                }
                // 3️⃣ Prepare update object
                const updateData = Object.assign({}, otherFields);
                // Handle country relation if provided
                if (countryId) {
                    const countryExists = yield this.Country.exists({ where: { countryId: Number(countryId) } });
                    if (!countryExists) {
                        return {
                            status: common_1.STATUSCODES.BAD_REQUEST,
                            message: "Country does not exist.",
                            data: null
                        };
                    }
                    updateData.country = { countryId: Number(countryId) };
                }
                // Handle state relation if provided
                if (stateId) {
                    const stateExists = yield this.state.exists({ where: { stateId: Number(stateId) } });
                    if (!stateExists) {
                        return {
                            status: common_1.STATUSCODES.BAD_REQUEST,
                            message: "State does not exist.",
                            data: null
                        };
                    }
                    updateData.state = { stateId: Number(stateId) };
                }
                // 4️⃣ Update the tax record
                yield this.TaxesRepository.update({ taxId: Number(taxId) }, updateData);
                // 5️⃣ Fetch the updated record
                const updatedTax = yield this.TaxesRepository.findOne({
                    where: { taxId: Number(taxId), isDeleted: false },
                    relations: ["country", "state"],
                });
                if (!updatedTax) {
                    return {
                        status: common_1.STATUSCODES.NOT_FOUND,
                        message: "Failed to fetch updated tax record",
                        data: null
                    };
                }
                // 6️⃣ Map response to include only countryId and stateId
                const responseData = Object.assign(Object.assign({}, updatedTax), { country: (_b = (_a = updatedTax.country) === null || _a === void 0 ? void 0 : _a.countryId) !== null && _b !== void 0 ? _b : null, state: (_d = (_c = updatedTax.state) === null || _c === void 0 ? void 0 : _c.stateId) !== null && _d !== void 0 ? _d : null });
                return {
                    status: common_1.STATUSCODES.SUCCESS,
                    message: "Tax updated successfully.",
                    data: responseData
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteTaxes(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { taxId } = input;
                // Find the tax record that is not already deleted
                const tax = yield this.TaxesRepository.findOne({
                    where: {
                        taxId: Number(taxId),
                        isDeleted: false
                    }
                });
                if (!tax) {
                    return {
                        status: common_1.STATUSCODES.NOT_FOUND,
                        message: "Tax record does not exist or is already deleted.",
                        data: null
                    };
                }
                if (tax.isDeleted) {
                    return { status: common_1.STATUSCODES.BAD_REQUEST, message: "Tax record is already deleted.", data: null };
                }
                // Soft delete
                // Update isDeleted to true
                yield this.TaxesRepository.update({ taxId: tax.taxId }, { isDeleted: true });
                return {
                    status: common_1.STATUSCODES.SUCCESS,
                    message: "Tax deleted successfully.",
                    data: null
                };
            }
            catch (error) {
                console.error("Error in deleteTaxes:", error);
                throw new Error("Something went wrong while deleting tax");
            }
        });
    }
}
exports.Taxes = TaxesService;
