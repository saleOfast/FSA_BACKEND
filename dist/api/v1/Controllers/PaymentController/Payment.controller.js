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
exports.PaymentService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const payment_entity_1 = require("../../../../core/DB/Entities/payment.entity");
require('dotenv').config();
const Razorpay = require('razorpay');
const crypto = require('crypto');
class PaymentController {
    constructor() {
        this.payment = (0, payment_entity_1.PaymentRepository)();
    }
    addByCash(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, paymentDate, transactionId, status, paymentMode, amount, paymentRefImg } = input;
                const { emp_id } = payload;
                const newPayment = new payment_entity_1.Payment();
                newPayment.orderId = orderId;
                newPayment.empId = emp_id;
                newPayment.paymentDate = paymentDate;
                newPayment.transactionId = transactionId;
                newPayment.status = status;
                newPayment.paymentMode = paymentMode;
                newPayment.amount = amount;
                newPayment.paymentRefImg = paymentRefImg !== null && paymentRefImg !== void 0 ? paymentRefImg : "";
                yield this.payment.save(newPayment);
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    addByOnline(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { keyId, keySecret, amount, currency } = input;
                const razorpay = new Razorpay({
                    key_id: keyId,
                    key_secret: keySecret,
                });
                const options = {
                    amount: amount,
                    currency: currency,
                    receipt: "any unique id for every order",
                    payment_capture: 1,
                };
                const response = yield razorpay.orders.create(options);
                const orderResponse = {
                    order_id: response.id,
                    currency: response.currency,
                    amount: response.amount,
                };
                return { status: common_1.STATUSCODES.SUCCESS, message: "Success.", data: orderResponse };
            }
            catch (error) {
                throw error;
            }
        });
    }
    paymentCapture(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { emp_id } = payload;
            try {
                const { orderId, transactionId, razorpayOrderId, razorpaySignature, amount, paymentDate, paymentMode, status } = input;
                const currencyFromSmallestUnit = (totalAmountInPaise) => {
                    const rupees = Math.floor(totalAmountInPaise / 100); // Get the rupee part
                    const paise = totalAmountInPaise % 100; // Get the remaining paise
                    // Combine rupees and paise to get the total amount
                    const totalAmount = rupees + paise / 100;
                    return totalAmount;
                };
                const data = crypto.createHmac('sha256', 'L2cU3hOSi3OBwaoNggCkpbrG');
                data.update(`${razorpayOrderId}|${transactionId}`);
                const digest = data.digest('hex');
                if (digest === razorpaySignature) {
                    //We can send the response and store information in a database.
                    const newPayment = new payment_entity_1.Payment();
                    newPayment.orderId = orderId;
                    newPayment.empId = emp_id;
                    newPayment.paymentDate = paymentDate;
                    newPayment.transactionId = transactionId;
                    newPayment.status = status;
                    newPayment.paymentMode = paymentMode;
                    newPayment.amount = currencyFromSmallestUnit(amount);
                    yield this.payment.save(newPayment);
                    return { status: common_1.STATUSCODES.SUCCESS, message: "Success", data: newPayment };
                }
                else {
                    return { status: common_1.STATUSCODES.BAD_REQUEST, message: "Payment Failed", data: orderId, transactionId };
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPaymentHistoryByOrderID(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderId } = input;
            try {
                const paymentList = yield this.payment.find({ where: { orderId: Number(orderId) } });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Success.", data: paymentList };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.PaymentService = PaymentController;
