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
class SchemeController {
    constructor() {
        this.getRepositry = (0, scheme_entity_1.getSchemeRepository)();
    }
    createScheme(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const { name, month, year, file } = input;
                const newScheme = this.getRepositry.create({ empId: emp_id, name, month, year, file });
                yield this.getRepositry.save(newScheme);
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getScheme() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schemes = yield this.getRepositry.find({ where: { isEnable: true } });
                const currentDate = new Date();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                // console.log(month, year);
                let activeScheme = [];
                for (let scheme of schemes) {
                    if (scheme.month == month && scheme.year == year) {
                        activeScheme.push(scheme);
                    }
                }
                if (!activeScheme) {
                    return { message: "No Scheme Found for this Month.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: activeScheme };
            }
            catch (error) {
                throw error;
            }
        });
    }
    schemeList(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { role } = payload;
            try {
                let filterQuery = {};
                if (role === common_1.UserRole.RETAILER) {
                    filterQuery = { isDeleted: false, isEnable: true };
                }
                else {
                    filterQuery = { isDeleted: false };
                }
                const schemes = yield this.getRepositry.find({ where: filterQuery });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: schemes };
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
                const { id, isEnable } = input;
                if (!id) {
                    return { message: "Opps! Something Went Wrong", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                yield this.getRepositry.createQueryBuilder().update({ isEnable }).where({ id }).execute();
                return { message: "Updated.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.SchemeService = SchemeController;
