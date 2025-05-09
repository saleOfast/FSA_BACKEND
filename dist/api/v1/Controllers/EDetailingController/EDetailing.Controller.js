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
exports.EDetainingController = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const eDetailing_entity_1 = require("../../../../core/DB/Entities/eDetailing.entity");
class EDetainingController {
    constructor() {
        this.eDetailingRepo = (0, eDetailing_entity_1.EdetailingRepository)();
    }
    createEDetailing(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newStatus = yield this.eDetailingRepo.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "E-Detailing created successfully.", data: newStatus };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getEDetailing(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status } = input;
            try {
                const whereCondition = status ? { status } : {};
                const statusList = yield this.eDetailingRepo.find();
                return { status: common_1.STATUSCODES.SUCCESS, message: "E-Detailing list retrieved successfully.", data: statusList };
            }
            catch (error) {
                console.error({ error }, ">>>>>>>>>");
                throw new Error("Something went wrong");
            }
        });
    }
    getEDetailingById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { e_detailing_id } = input;
            try {
                const status = yield this.eDetailingRepo.findOne({ where: { e_detailing_id } });
                if (!status) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    editEDetailing(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { e_detailing_id } = input;
                const existingStatus = yield this.eDetailingRepo.findOne({ where: { e_detailing_id } });
                if (!existingStatus) {
                    return { status: common_1.STATUSCODES.CONFLICT, message: "E-Detailing does not exist." };
                }
                yield this.eDetailingRepo.update({ e_detailing_id }, input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "E-Detailing updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deleteEDetailing(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { e_detailing_id } = input;
            try {
                const data = yield this.eDetailingRepo.findOne({ where: { e_detailing_id } });
                if (!data) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "E-Detailing does not exist." };
                }
                yield this.eDetailingRepo.softDelete({ e_detailing_id });
                return { status: common_1.STATUSCODES.SUCCESS, message: "E-Detailing deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.EDetainingController = EDetainingController;
