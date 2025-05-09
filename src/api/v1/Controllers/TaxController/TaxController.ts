import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { Taxes, TaxesRepository } from "../../../../core/DB/Entities/tax.entity";
import { STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { ITaxes, TaxesC, TaxesD, TaxesR, TaxesU } from "../../../../core/types/TaxesService/TaxesService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { Between, IsNull, Not } from "typeorm";

class TaxesService {
    private TaxesRepository = TaxesRepository();
    private userRespositry = UserRepository()

    constructor() { }

    async createTaxes(input: TaxesC, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const user = await this.userRespositry.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }
            let newTaxes = await this.TaxesRepository.save(input);
            return { status: STATUSCODES.SUCCESS, message: "Taxes created successfully.", data: newTaxes };
        } catch (error) {
            throw error;
        }
    }

    async getTaxes(input: TaxesR, payload: IUser): Promise<IApiResponse> {
        try {
            const TaxesList = await this.TaxesRepository.find({
                relations: { user: true },
                order: { createdAt: "DESC" },
            });
            return { status: STATUSCODES.SUCCESS, message: "Taxes list retrieved successfully.", data: TaxesList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getTaxesById(payload: IUser, input: TaxesR): Promise<IApiResponse> {
        try {
            const { taxId } = input;
            const Taxes: any | null = await this.TaxesRepository.findOne({ where: { taxId: Number(taxId) } });
            if (!Taxes) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: Taxes }
        } catch (error) {
            throw error;
        }
    }

    async editTaxes(input: TaxesU, payload: IUser): Promise<IApiResponse> {
        try {
            if (input.taxId) {
                const existingTaxes = await this.TaxesRepository.findOne({
                    where: { taxId: input.taxId },
                });
                if (!existingTaxes) {
                    return { status: STATUSCODES.CONFLICT, message: "Taxes does not exists." };
                }
                await this.TaxesRepository.update({ taxId: input.taxId }, input);
            }
            return { status: STATUSCODES.SUCCESS, message: "Taxes updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deleteTaxes(input: TaxesD, payload: IUser): Promise<IApiResponse> {
        try {
            const Taxes = await this.TaxesRepository.findOne({
                where: { taxId: input.taxId },
            });

            if (!Taxes) {
                return { status: STATUSCODES.NOT_FOUND, message: "Taxes does not exist." };
            }
            await this.TaxesRepository.softDelete({ taxId: Taxes.taxId });
            return { status: STATUSCODES.SUCCESS, message: "Taxes deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

}

export { TaxesService as Taxes }