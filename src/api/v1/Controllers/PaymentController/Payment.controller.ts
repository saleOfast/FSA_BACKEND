import { STATUSCODES } from "../../../../core/types/Constent/common";
import { Payment, PaymentRepository } from "../../../../core/DB/Entities/payment.entity";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { GetPayment, IPayment, OrderPayment } from "../../../../core/types/PaymentService/PaymentService";
require('dotenv').config();
const Razorpay = require('razorpay')
const crypto = require('crypto')

class PaymentController {
    private payment = PaymentRepository();

    constructor() { }

    async addByCash(input: OrderPayment, payload: IUser) {
        try {
            const { orderId, paymentDate, transactionId, status, paymentMode, amount, paymentRefImg } = input;
            const { emp_id } = payload;

            const newPayment = new Payment();
            newPayment.orderId = orderId;
            newPayment.empId = emp_id;
            newPayment.paymentDate = paymentDate;
            newPayment.transactionId = transactionId;
            newPayment.status = status;
            newPayment.paymentMode = paymentMode;
            newPayment.amount = amount;
            newPayment.paymentRefImg = paymentRefImg ?? ""

            await this.payment.save(newPayment);

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }
    async addByOnline(input: any) {

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
            const response = await razorpay.orders.create(options)
            const orderResponse = {
                order_id: response.id,
                currency: response.currency,
                amount: response.amount,
            }
            return { status: STATUSCODES.SUCCESS, message: "Success.", data: orderResponse }
        } catch (error) {
            throw error;
        }
    }

    async paymentCapture(input: any, payload: any) {
        const { emp_id } = payload;
        try {
            const {
                orderId,
                transactionId,
                razorpayOrderId,
                razorpaySignature,
                amount,
                paymentDate,
                paymentMode,
                status
            } = input;
            const currencyFromSmallestUnit = (totalAmountInPaise: any) => {
                const rupees = Math.floor(totalAmountInPaise / 100); // Get the rupee part
                const paise = totalAmountInPaise % 100; // Get the remaining paise

                // Combine rupees and paise to get the total amount
                const totalAmount = rupees + paise / 100;
                return totalAmount;
            }
            const data = crypto.createHmac('sha256', 'L2cU3hOSi3OBwaoNggCkpbrG')
            data.update(`${razorpayOrderId}|${transactionId}`);
            const digest = data.digest('hex')
            if (digest === razorpaySignature) {
                //We can send the response and store information in a database.
                const newPayment = new Payment();
                newPayment.orderId = orderId;
                newPayment.empId = emp_id;
                newPayment.paymentDate = paymentDate;
                newPayment.transactionId = transactionId;
                newPayment.status = status;
                newPayment.paymentMode = paymentMode;
                newPayment.amount = currencyFromSmallestUnit(amount);

                await this.payment.save(newPayment);

                return { status: STATUSCODES.SUCCESS, message: "Success", data: newPayment }
            } else {
                return { status: STATUSCODES.BAD_REQUEST, message: "Payment Failed", data: orderId, transactionId }
            }
        } catch (error) {
            throw error;
        }
    }

    async getPaymentHistoryByOrderID(payload: IUser, input: GetPayment): Promise<IApiResponse> {
        const { orderId } = input;
        try {
            const paymentList: IPayment[] | null = await this.payment.find({ where: { orderId: Number(orderId) } });
            return { status: STATUSCODES.SUCCESS, message: "Success.", data: paymentList }
        } catch (error) {
            throw error;
        }
    }

}

export { PaymentController as PaymentService }