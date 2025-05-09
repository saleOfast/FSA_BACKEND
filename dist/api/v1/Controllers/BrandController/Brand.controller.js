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
exports.BrandService = void 0;
const brand_entity_1 = require("../../../../core/DB/Entities/brand.entity");
const brand_competitor_entity_1 = require("../../../../core/DB/Entities/brand.competitor.entity");
const common_1 = require("../../../../core/types/Constent/common");
class BrandController {
    constructor() {
        this.brand = (0, brand_entity_1.BrandRepository)();
        this.competitorBrandRepository = (0, brand_competitor_entity_1.CompetitorBrandRepository)();
    }
    add(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, isCompetitor } = input;
                const { emp_id } = payload;
                const newBrand = new brand_entity_1.Brand();
                newBrand.name = name;
                newBrand.empId = emp_id;
                if (isCompetitor == 1) {
                    yield this.competitorBrandRepository.save(newBrand);
                }
                else {
                    yield this.brand.save(newBrand);
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    list(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let brandList;
                if (input.isCompetitor == 1) {
                    brandList = yield this.competitorBrandRepository.find({
                        where: { isDeleted: false },
                        order: {
                            createdAt: 'DESC'
                        }
                    });
                }
                else {
                    brandList = yield this.brand.find({
                        where: { isDeleted: false },
                        order: {
                            createdAt: 'DESC'
                        }
                    });
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: brandList };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getBrandById(payload, input, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { brandId } = input;
                let brand;
                if (query.isCompetitor == 1) {
                    brand = yield this.competitorBrandRepository.findOne({ where: { CompetitorBrandId: Number(brandId) } });
                }
                else {
                    brand = yield this.brand.findOne({ where: { brandId: Number(brandId) } });
                }
                if (!brand) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: brand };
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
                const { name, brandId } = input;
                if (!name) {
                    return { message: "Name can't be empty.", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                if (input.isCompetitor == 1) {
                    yield this.competitorBrandRepository.createQueryBuilder().update({ name: name }).where({ CompetitorBrandId: brandId }).execute();
                }
                else {
                    yield this.brand.createQueryBuilder().update({ name: name }).where({ brandId }).execute();
                }
                return { message: "Updated.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(payload, input, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const { brandId } = input;
                if (query.isCompetitor == 1) {
                    yield this.competitorBrandRepository.createQueryBuilder().update({ isDeleted: true }).where({ CompetitorBrandId: brandId }).execute();
                }
                else {
                    yield this.brand.createQueryBuilder().update({ isDeleted: true }).where({ brandId: brandId }).execute();
                }
                return { message: "Deleted Successfully.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    addMultipleBrands(inputs, payload, isCompetitor) {
        return __awaiter(this, void 0, void 0, function* () {
            const { emp_id } = payload;
            console.log({ inputs });
            const brandRepository = (0, brand_entity_1.BrandRepository)();
            const competitorBrandRepository = (0, brand_competitor_entity_1.CompetitorBrandRepository)();
            if (!brandRepository) {
                throw new Error("BrandRepository is not properly initialized.");
            }
            // Set to track processed brands (name + empId)
            const processedBrands = new Set();
            const skippedBrands = []; // Track skipped brands
            try {
                for (const input of inputs) {
                    if (!input || !input.name) {
                        throw new Error("Invalid input data.");
                    }
                    const { name } = input;
                    const key = `${name}-${emp_id}`; // Create a unique key based on name and empId
                    console.log(`Processing brand: ${name}`);
                    // Check for in-memory duplicates
                    if (processedBrands.has(key)) {
                        skippedBrands.push(`Brand with the name ${name} (Duplicate in input)`);
                        continue; // Skip the brand if it already exists in the input
                    }
                    // Mark this brand as processed
                    processedBrands.add(key);
                    // Validate that the brand doesn't already exist in the database
                    let existingBrand;
                    if (isCompetitor == 1) {
                        existingBrand = yield brandRepository.findOneBy({ name, empId: emp_id });
                    }
                    else {
                        existingBrand = yield competitorBrandRepository.findOneBy({ name, empId: emp_id });
                    }
                    if (existingBrand) {
                        skippedBrands.push(`Brand with the name ${name} (Already exists in database)`);
                        continue; // Skip if the brand already exists in the database
                    }
                    // Create new brand entity
                    const newBrand = new brand_entity_1.Brand();
                    newBrand.name = name;
                    newBrand.empId = emp_id;
                    // Save the brand
                    if (isCompetitor == 1) {
                        yield competitorBrandRepository.save(newBrand);
                    }
                    else {
                        yield brandRepository.save(newBrand);
                    }
                }
                // Construct the response message
                const message = skippedBrands.length > 0
                    ? `Brands created successfully. Skipped brands: ${skippedBrands.join(', ')}.`
                    : "All brands created successfully.";
                return {
                    message,
                    status: common_1.STATUSCODES.SUCCESS,
                };
            }
            catch (error) {
                console.log({ error }, "******************************");
                throw error;
            }
        });
    }
}
exports.BrandService = BrandController;
