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
exports.DistributorService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const distributors_entity_1 = require("../../../../core/DB/Entities/distributors.entity");
class DistributorController {
    constructor() {
        this.distributorRepository = (0, distributors_entity_1.DistributorRepository)();
    }
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { distributorName, type, address, isActive } = input;
                const entity = new distributors_entity_1.Distributor();
                entity.distributorName = distributorName;
                entity.type = type;
                entity.address = address;
                entity.isActive = isActive;
                yield this.distributorRepository.save(entity);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Success." };
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { distributorId, distributorName, type, address, isActive } = input;
                const existing = yield this.distributorRepository.findOne({ where: { distributorId: Number(distributorId) } });
                if (!existing) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                yield this.distributorRepository.createQueryBuilder()
                    .update({ distributorName, type, address, isActive })
                    .where({ distributorId: Number(distributorId) })
                    .execute();
                return { status: common_1.STATUSCODES.SUCCESS, message: 'Success.' };
            }
            catch (error) {
                throw error;
            }
        });
    }
    list(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { search, pageNumber = '1', pageSize = '10' } = input;
                let query = this.distributorRepository.createQueryBuilder('distributor');
                if (search) {
                    query.where(`(
                        LOWER(distributor.distributor_name) LIKE LOWER(:searchTerm) OR
                        LOWER(distributor.type) LIKE LOWER(:searchTerm)
                     )`, { searchTerm: `%${search.toLowerCase()}%` });
                }
                query.orderBy('distributor.updatedAt', 'DESC');
                query.skip((+pageNumber - 1) * +pageSize).take(+pageSize);
                const result = yield query.getManyAndCount();
                const response = {
                    distributors: result.length > 0 ? result[0] : [],
                    pagination: {
                        pageNumber: +pageNumber,
                        pageSize: +pageSize,
                        totalRecords: result.length > 0 ? result[1] : 0
                    }
                };
                return { status: common_1.STATUSCODES.SUCCESS, message: 'Success.', data: response };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { distributorId } = input;
                const distributorDetails = yield this.distributorRepository.findOne({ where: { distributorId: Number(distributorId) } });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: distributorDetails };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.DistributorService = DistributorController;
