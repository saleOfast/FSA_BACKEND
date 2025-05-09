import { STATUSCODES } from "../../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../../core/types/Constent/commonService";
import { IUser } from "../../../../../core/types/AuthService/AuthService";
import { CreatePaymentMode, DeletePaymentMode, GetPaymentMode, IPaymentMode, UpdatePaymentMode } from "../../../../../core/types/PaymentModeService/PaymentModeService";
import { PaymentMode, PaymentModeRepository } from "../../../../../core/DB/Entities/paymentMode.entity";

class PaymentModeController {
    private paymentModeRepo = PaymentModeRepository();

    constructor() { }

    async add(input: CreatePaymentMode, payload: IUser): Promise<IApiResponse> {
        try {
            const { name } = input;
            const { emp_id } = payload;

            const newPayMode = new PaymentMode();
            newPayMode.name = name;
            newPayMode.empId = emp_id;

            await this.paymentModeRepo.save(newPayMode);

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }


    async list(payload: IUser): Promise<IApiResponse> {
        try {

            const payModeList: IPaymentMode[] | null = await this.paymentModeRepo.find({
                where: { isDeleted: false },
                order: {
                    updatedAt: 'DESC',
                    createdAt: 'DESC'
                }
            });

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: payModeList }
        } catch (error) {
            throw error;
        }
    }


    async getPaymentModeById(payload: IUser, input: GetPaymentMode): Promise<IApiResponse> {
        try {
            const { paymentModeId } = input;
            const payMode: IPaymentMode | null = await this.paymentModeRepo.findOne({ where: { paymentModeId: Number(paymentModeId) } });
            if (!payMode) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: payMode }
        } catch (error) {
            throw error;
        }
    }


    async update(payload: IUser, input: UpdatePaymentMode): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { name, paymentModeId } = input;
            if (!name) {
                return { message: "Name can't be empty.", status: STATUSCODES.BAD_REQUEST }
            }

            await this.paymentModeRepo.createQueryBuilder().update({ name }).where({ paymentModeId }).execute();

            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async delete(payload: IUser, input: DeletePaymentMode): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { paymentModeId } = input;
            await this.paymentModeRepo.createQueryBuilder().update({ isDeleted: true }).where({ paymentModeId }).execute();
            return { message: "Deleted Successfully.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }
}

export { PaymentModeController as PaymentModeService }