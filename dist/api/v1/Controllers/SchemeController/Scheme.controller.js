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
exports.SchemeService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const scheme_entity_1 = require("../../../../core/DB/Entities/scheme.entity");
const customer_entity_1 = require("../../../../core/DB/Entities/customer.entity");
const customerType_entity_1 = require("../../../../core/DB/Entities/customerType.entity");
const products_entity_1 = require("../../../../core/DB/Entities/products.entity");
const sku_entity_1 = require("../../../../core/DB/Entities/sku.entity");
const warehouse_entity_1 = require("../../../../core/DB/Entities/warehouse.entity");
const posm_entity_1 = require("../../../../core/DB/Entities/posm.entity");
class SchemeController {
    constructor() {
        this.getRepositry = (0, scheme_entity_1.getSchemeRepository)();
        this.customerRepository = (0, customer_entity_1.CustomerRepository)();
        this.customerTypeRepository = (0, customerType_entity_1.CustomerTypeRepository)();
        this.productRepository = (0, products_entity_1.ProductRepository)();
        this.skuRepository = (0, sku_entity_1.SkuRepository)();
        this.warehouseRepository = (0, warehouse_entity_1.WarehouseRepository)();
        this.posmRepository = (0, posm_entity_1.PosmRepository)();
    }
    createScheme(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const { schemeName, schemeType, schemeNature, startDate, endDate, status, priority, autoApply, customerId, customerTypeId, productId, skuId, warehouseId, posmId, beatId, minQty, minValue, slabFrom, slabTo, benefitType, benefitQty, BenefitLimit, isClaimable, claimPeriod, } = input;
                // Validate foreign keys if provided
                if (customerId) {
                    const customer = yield this.customerRepository.findOne({ where: { customerId } });
                    if (!customer) {
                        return {
                            status: common_1.STATUSCODES.NOT_FOUND,
                            message: `Customer with ID ${customerId} not found`,
                        };
                    }
                }
                if (customerTypeId) {
                    const customerType = yield this.customerTypeRepository.findOne({ where: { customerTypeId } });
                    if (!customerType) {
                        return {
                            status: common_1.STATUSCODES.NOT_FOUND,
                            message: `Customer Type with ID ${customerTypeId} not found`,
                        };
                    }
                }
                if (productId) {
                    const product = yield this.productRepository.findOne({ where: { productId } });
                    if (!product) {
                        return {
                            status: common_1.STATUSCODES.NOT_FOUND,
                            message: `Product with ID ${productId} not found`,
                        };
                    }
                }
                if (skuId) {
                    const sku = yield this.skuRepository.findOne({ where: { skuId } });
                    if (!sku) {
                        return {
                            status: common_1.STATUSCODES.NOT_FOUND,
                            message: `SKU with ID ${skuId} not found`,
                        };
                    }
                }
                if (warehouseId) {
                    const warehouse = yield this.warehouseRepository.findOne({ where: { warehouseId: String(warehouseId) } });
                    if (!warehouse) {
                        return {
                            status: common_1.STATUSCODES.NOT_FOUND,
                            message: `Warehouse with ID ${warehouseId} not found`,
                        };
                    }
                }
                if (posmId) {
                    const posm = yield this.posmRepository.findOne({ where: { posmId } });
                    if (!posm) {
                        return {
                            status: common_1.STATUSCODES.NOT_FOUND,
                            message: `POSM with ID ${posmId} not found`,
                        };
                    }
                }
                const newScheme = this.getRepositry.create({
                    schemeName,
                    schemeType,
                    schemeNature,
                    startDate,
                    endDate,
                    status,
                    priority,
                    autoApply,
                    // relations (IDs → entity refs)
                    customer: customerId ? { customerId } : undefined,
                    customerType: customerTypeId ? { customerTypeId } : undefined,
                    products: productId ? { productId } : undefined,
                    sku: skuId ? { skuId } : undefined,
                    warehouse: warehouseId ? { warehouseId } : undefined,
                    posm: posmId ? { posmId } : undefined,
                    beatId,
                    minQty,
                    minValue,
                    slabFrom,
                    slabTo,
                    benefitType,
                    benefitQty,
                    BenefitLimit,
                    isClaimable,
                    claimPeriod,
                    createdBy: emp_id,
                });
                const savedScheme = yield this.getRepositry.save(newScheme);
                return {
                    message: "Success.",
                    status: common_1.STATUSCODES.SUCCESS,
                    data: savedScheme,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    // async getScheme(): Promise<IApiResponse> {
    //     try {
    //         const schemes: IScheme[] | null = await this.getRepositry.find({ where: { isEnable: true } });
    //         const currentDate = new Date();
    //         const month = currentDate.getMonth() + 1;
    //         const year = currentDate.getFullYear();
    //         // console.log(month, year);
    //         let activeScheme: IScheme[] | null = [];
    //         for (let scheme of schemes) {
    //             if (scheme.month == month && scheme.year == year) {
    //                 activeScheme.push(scheme)
    //             }
    //         }
    //         if (!activeScheme) {
    //             return { message: "No Scheme Found for this Month.", status: STATUSCODES.NOT_FOUND }
    //         }
    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: activeScheme }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // async schemeList(payload: IUser): Promise<IApiResponse> {
    //     const { role } = payload;
    //     try {
    //         let filterQuery : any = {};
    //         if(role === UserRole.RETAILER){
    //             filterQuery = {isDeleted: false, isEnable: true}
    //         }else{
    //             filterQuery = {isDeleted: false}
    //         }
    //         const schemes: IScheme[] | null = await this.getRepositry.find({ where: filterQuery });
    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: schemes }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    update(payload, id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                // Build update object
                const updateData = {
                    updatedAt: new Date(),
                };
                // Only include fields that are present
                if (input.schemeName !== undefined)
                    updateData.schemeName = input.schemeName;
                if (input.schemeType !== undefined)
                    updateData.schemeType = input.schemeType;
                if (input.schemeNature !== undefined)
                    updateData.schemeNature = input.schemeNature;
                if (input.startDate !== undefined)
                    updateData.startDate = input.startDate;
                if (input.endDate !== undefined)
                    updateData.endDate = input.endDate;
                if (input.status !== undefined)
                    updateData.status = input.status;
                if (input.priority !== undefined)
                    updateData.priority = input.priority;
                if (input.autoApply !== undefined)
                    updateData.autoApply = input.autoApply;
                if (input.minQty !== undefined)
                    updateData.minQty = input.minQty;
                if (input.minValue !== undefined)
                    updateData.minValue = input.minValue;
                if (input.slabFrom !== undefined)
                    updateData.slabFrom = input.slabFrom;
                if (input.slabTo !== undefined)
                    updateData.slabTo = input.slabTo;
                if (input.benefitType !== undefined)
                    updateData.benefitType = input.benefitType;
                if (input.benefitQty !== undefined)
                    updateData.benefitQty = input.benefitQty;
                if (input.BenefitLimit !== undefined)
                    updateData.BenefitLimit = input.BenefitLimit;
                if (input.isClaimable !== undefined)
                    updateData.isClaimable = input.isClaimable;
                if (input.claimPeriod !== undefined)
                    updateData.claimPeriod = input.claimPeriod;
                if (input.isEnable !== undefined)
                    updateData.isEnable = input.isEnable;
                if (input.isDeleted !== undefined)
                    updateData.isDeleted = input.isDeleted;
                // Safety check
                if (Object.keys(updateData).length === 1) {
                    return {
                        status: common_1.STATUSCODES.BAD_REQUEST,
                        message: "No fields provided to update",
                    };
                }
                const result = yield this.getRepositry
                    .createQueryBuilder()
                    .update()
                    .set(updateData)
                    .where("id = :id AND is_deleted = false", { id })
                    .execute();
                if (!result.affected) {
                    return {
                        status: common_1.STATUSCODES.NOT_FOUND,
                        message: "Scheme not found or already deleted",
                    };
                }
                const updatedScheme = yield this.getRepositry.findOne({
                    where: { id },
                });
                return {
                    status: common_1.STATUSCODES.SUCCESS,
                    message: "Scheme updated successfully",
                    data: updatedScheme,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    // async deleteByIdOrName(payload: IUser, input: DeleteSchemeDto): Promise<IApiResponse> {
    //   const { id, schemeName } = input;
    //   if (!id && (!schemeName || schemeName.trim() === "")) {
    //     return {
    //       status: STATUSCODES.BAD_REQUEST,
    //       message: "Provide at least id or schemeName to delete",
    //     };
    //   }
    //   const query = this.getRepositry.createQueryBuilder()
    //     .update()
    //     .set({ isDeleted: true, updatedAt: new Date() });
    //   const conditions: string[] = [];
    //   const params: any = {};
    //   if (id) {
    //     conditions.push("id = :id");
    //     params.id = id;
    //   }
    //   if (schemeName) {
    //     conditions.push("schemeName = :name");
    //     params.name = schemeName;
    //   }
    //   query.where(conditions.join(" AND ") + " AND is_deleted = false", params);
    //   const result = await query.execute();
    //   if (!result.affected) {
    //     return {
    //       status: STATUSCODES.NOT_FOUND,
    //       message: "Scheme not found or already deleted",
    //     };
    //   }
    //   return {
    //     status: STATUSCODES.SUCCESS,
    //     message: "Scheme deleted successfully",
    //   };
    // }
    getAllSchemes(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = this.getRepositry.createQueryBuilder("scheme")
                    .where("scheme.isDeleted = :isDeleted", { isDeleted: false });
                if (input.schemeType)
                    query.andWhere("scheme.schemeType = :schemeType", { schemeType: input.schemeType });
                if (input.schemeNature)
                    query.andWhere("scheme.schemeNature = :schemeNature", { schemeNature: input.schemeNature });
                if (input.status)
                    query.andWhere("scheme.status = :status", { status: input.status });
                if (input.customerId)
                    query.andWhere("scheme.customerId = :customerId", { customerId: input.customerId });
                if (input.productId)
                    query.andWhere("scheme.productId = :productId", { productId: input.productId });
                if (input.skuId)
                    query.andWhere("scheme.skuId = :skuId", { skuId: input.skuId });
                if (input.warehouseId)
                    query.andWhere("scheme.warehouseId = :warehouseId", { warehouseId: input.warehouseId });
                if (input.posmId)
                    query.andWhere("scheme.posmId = :posmId", { posmId: input.posmId });
                if (input.beatId)
                    query.andWhere("scheme.beatId = :beatId", { beatId: input.beatId });
                if (input.isEnable !== undefined)
                    query.andWhere("scheme.isEnable = :isEnable", { isEnable: input.isEnable });
                // if (input.isDeleted !== undefined) query.andWhere("scheme.isDeleted = :isDeleted", { isDeleted: false });
                if (input.startDateFrom)
                    query.andWhere("scheme.startDate >= :startDateFrom", { startDateFrom: input.startDateFrom });
                if (input.startDateTo)
                    query.andWhere("scheme.startDate <= :startDateTo", { startDateTo: input.startDateTo });
                if (input.endDateFrom)
                    query.andWhere("scheme.endDate >= :endDateFrom", { endDateFrom: input.endDateFrom });
                if (input.endDateTo)
                    query.andWhere("scheme.endDate <= :endDateTo", { endDateTo: input.endDateTo });
                const schemes = yield query.getMany();
                return {
                    message: "Success.",
                    status: common_1.STATUSCODES.SUCCESS,
                    data: schemes,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getScheme(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, schemeName } = input;
                if (!id && !schemeName) {
                    return {
                        status: common_1.STATUSCODES.BAD_REQUEST,
                        message: "Please provide either scheme ID or scheme name",
                        data: null,
                    };
                }
                // If ID is provided, return exactly one scheme
                if (id) {
                    const scheme = yield this.getRepositry.findOne({
                        where: { id, isDeleted: false },
                        relations: ["customer", "customerType", "products", "sku", "warehouse", "posm"],
                    });
                    if (!scheme) {
                        return {
                            status: common_1.STATUSCODES.NOT_FOUND,
                            message: "Scheme not found",
                            data: null,
                        };
                    }
                    return {
                        status: common_1.STATUSCODES.SUCCESS,
                        message: "Scheme fetched successfully",
                        data: scheme,
                    };
                }
                // If schemeName is provided, return all matching schemes
                const schemes = yield this.getRepositry.find({
                    where: { schemeName, isDeleted: false },
                    relations: ["customer", "customerType", "products", "sku", "warehouse", "posm"],
                });
                if (!schemes.length) {
                    return {
                        status: common_1.STATUSCODES.NOT_FOUND,
                        message: "Schemes not found",
                        data: null,
                    };
                }
                return {
                    status: common_1.STATUSCODES.SUCCESS,
                    message: "Schemes fetched successfully",
                    data: schemes,
                };
            }
            catch (err) {
                console.error("Get Scheme error:", err);
                return {
                    status: common_1.STATUSCODES.BAD_REQUEST,
                    message: "Failed to fetch scheme",
                    data: (err === null || err === void 0 ? void 0 : err.message) || err,
                };
            }
        });
    }
    deleteScheme(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, schemeName } = input;
                if (!id && !schemeName) {
                    return {
                        status: common_1.STATUSCODES.BAD_REQUEST,
                        message: "Please provide either scheme ID or scheme name",
                        data: null
                    };
                }
                let deletedSchemes = [];
                if (id) {
                    // Delete by ID
                    const scheme = yield this.getRepositry.findOne({ where: { id } });
                    if (!scheme) {
                        return { status: common_1.STATUSCODES.NOT_FOUND, message: "Scheme not found", data: null };
                    }
                    if (scheme.isDeleted) {
                        return { status: common_1.STATUSCODES.NOT_FOUND, message: "Scheme already deleted", data: null };
                    }
                    scheme.isDeleted = true;
                    deletedSchemes.push(yield this.getRepositry.save(scheme));
                }
                else if (schemeName) {
                    // Delete by schemeName (all matching)
                    const schemes = yield this.getRepositry.find({ where: { schemeName } });
                    if (!schemes.length) {
                        return { status: common_1.STATUSCODES.NOT_FOUND, message: "Schemes not found", data: null };
                    }
                    // Soft delete all
                    for (const s of schemes) {
                        if (!s.isDeleted) {
                            s.isDeleted = true;
                            deletedSchemes.push(yield this.getRepositry.save(s));
                        }
                    }
                    if (!deletedSchemes.length) {
                        return { status: common_1.STATUSCODES.NOT_FOUND, message: "All schemes already deleted", data: null };
                    }
                }
                return {
                    status: common_1.STATUSCODES.SUCCESS,
                    message: "Scheme(s) deleted successfully",
                    data: deletedSchemes
                };
            }
            catch (err) {
                console.error("Delete Scheme error:", err);
                return {
                    status: common_1.STATUSCODES.BAD_REQUEST,
                    message: "Failed to delete scheme",
                    data: (err === null || err === void 0 ? void 0 : err.message) || err
                };
            }
        });
    }
}
exports.SchemeService = SchemeController;
