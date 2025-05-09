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
exports.PaymentModeService = void 0;
const common_1 = require("../../../../../core/types/Constent/common");
const paymentMode_entity_1 = require("../../../../../core/DB/Entities/paymentMode.entity");
class PaymentModeController {
    constructor() {
        this.paymentModeRepo = (0, paymentMode_entity_1.PaymentModeRepository)();
    }
    add(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = input;
                const { emp_id } = payload;
                const newPayMode = new paymentMode_entity_1.PaymentMode();
                newPayMode.name = name;
                newPayMode.empId = emp_id;
                yield this.paymentModeRepo.save(newPayMode);
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
                const payModeList = yield this.paymentModeRepo.find({
                    where: { isDeleted: false },
                    order: {
                        updatedAt: 'DESC',
                        createdAt: 'DESC'
                    }
                });
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: payModeList };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPaymentModeById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { paymentModeId } = input;
                const payMode = yield this.paymentModeRepo.findOne({ where: { paymentModeId: Number(paymentModeId) } });
                if (!payMode) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: payMode };
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
                const { name, paymentModeId } = input;
                if (!name) {
                    return { message: "Name can't be empty.", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                yield this.paymentModeRepo.createQueryBuilder().update({ name }).where({ paymentModeId }).execute();
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
                const { paymentModeId } = input;
                yield this.paymentModeRepo.createQueryBuilder().update({ isDeleted: true }).where({ paymentModeId }).execute();
                return { message: "Deleted Successfully.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.PaymentModeService = PaymentModeController;
