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
exports.DarController = void 0;
const dar_entity_1 = require("../../../../core/DB/Entities/dar.entity");
const common_1 = require("../../../../core/types/Constent/common");
class DarController {
    constructor() {
        this.darRepo = (0, dar_entity_1.DARRepository)();
    }
    createDar(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let darBodies = Array.isArray(input) ? input : [input];
                const { emp_id, managerId } = payload;
                darBodies = darBodies.flatMap((dar) => (Array.isArray(dar.data) ? dar.data : [dar])
                    .map((entry) => (Object.assign(Object.assign({}, entry), { emp_id,
                    managerId }))));
                const existingDarData = yield this.darRepo
                    .createQueryBuilder("dar")
                    .where(darBodies.map((dar, index) => `(dar.emp_id = :emp_id${index} AND dar.date = :date${index})`).join(" OR "), Object.assign({}, ...darBodies.map((dar, index) => ({
                    [`emp_id${index}`]: dar.emp_id,
                    [`date${index}`]: dar.date
                }))))
                    .getMany();
                if (existingDarData.length > 0) {
                    return {
                        message: `DAR already assigned for Selected date(s) ${existingDarData.map((dar) => dar.date).join(", ")}`,
                        status: common_1.STATUSCODES.CONFLICT,
                    };
                }
                // Insert DAR records
                for (const dar of darBodies) {
                    const newDar = new dar_entity_1.Dar();
                    newDar.activity_type = dar.activity_type,
                        newDar.activity_related = dar.activity_related,
                        newDar.related_to = dar.related_to,
                        newDar.date = dar.date,
                        newDar.subject = dar.subject,
                        newDar.next_action_on = dar.next_action_on,
                        newDar.remarks = dar.remarks,
                        newDar.status = dar.status,
                        newDar.emp_id = dar.emp_id,
                        newDar.manager_id = dar.managerId;
                    yield this.darRepo.save(newDar);
                }
                return { message: "Success", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                console.error("Error in createDar:", error);
                return {
                    message: "Something went wrong",
                    status: common_1.STATUSCODES.ERROR_CANNOT_FULLFILL_REQUEST,
                    data: error
                };
            }
        });
    }
    listDar(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, from_date, to_date } = input;
                let query = this.darRepo.createQueryBuilder("dar");
                if (status) {
                    query.where("dar.status = :status", { status });
                }
                // Filter by date range if both `from_date` and `to_date` are provided
                if (from_date && to_date) {
                    query.where("dar.date BETWEEN :from_date AND :to_date", { from_date, to_date });
                }
                const list = yield query.getMany();
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: list };
            }
            catch (error) {
                console.error("Error in listDar:", error);
                throw error;
            }
        });
    }
    getDarById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dar_id } = input;
                const dar = yield this.darRepo.findOne({ where: { dar_id } });
                if (!dar) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: dar };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateDar(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = input;
                const { emp_id, managerId } = payload;
                if (!data || !Array.isArray(data) || data.length === 0) {
                    return { message: "Nothing to update.", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                for (const darBody of data) {
                    if (!darBody.dar_id) {
                        yield this.darRepo.save(Object.assign({ emp_id, manager_id: managerId }, darBody));
                        continue;
                    }
                    console.log({ darBody });
                    const darData = yield this.darRepo.findOne({
                        where: { dar_id: darBody.dar_id }
                    });
                    if (darData) {
                        yield this.darRepo.update({ dar_id: darData.dar_id }, Object.assign({}, darBody));
                    }
                }
                return { message: "Updated successfully.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                console.error("Error in updateDar:", error);
                throw error;
            }
        });
    }
    deleteDar(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dar_id } = input;
                yield this.darRepo.update({ dar_id }, { deletedAt: new Date() });
                return { message: "Deleted Successfully.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.DarController = DarController;
