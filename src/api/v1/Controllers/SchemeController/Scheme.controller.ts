import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateScheme, IScheme, UpdateScheme } from "../../../../core/types/SchemeService/SchemeService";
import { STATUSCODES, UserRole } from "../../../../core/types/Constent/common";
import { getSchemeRepository } from "../../../../core/DB/Entities/scheme.entity";

class SchemeController {
    private getRepositry = getSchemeRepository()

    constructor() { }

    async createScheme(payload: IUser, input: CreateScheme): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { name, month, year, file } = input;

            const newScheme = this.getRepositry.create({ empId: emp_id, name, month, year, file });

            await this.getRepositry.save(newScheme);

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async getScheme(): Promise<IApiResponse> {
        try {
            const schemes: IScheme[] | null = await this.getRepositry.find({ where: { isEnable: true } });

            const currentDate = new Date();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            // console.log(month, year);

            let activeScheme: IScheme[] | null = [];
            for (let scheme of schemes) {
                if (scheme.month == month && scheme.year == year) {
                    activeScheme.push(scheme)
                }
            }

            if (!activeScheme) {
                return { message: "No Scheme Found for this Month.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: activeScheme }
        } catch (error) {
            throw error;
        }
    }

    async schemeList(payload: IUser): Promise<IApiResponse> {
        const { role } = payload;
        try {
            let filterQuery : any = {};
            if(role === UserRole.RETAILER){
                filterQuery = {isDeleted: false, isEnable: true}
            }else{
                filterQuery = {isDeleted: false}
            }
            const schemes: IScheme[] | null = await this.getRepositry.find({ where: filterQuery });
            return { message: "Success.", status: STATUSCODES.SUCCESS, data: schemes }
        } catch (error) {
            throw error;
        }
    }

    async update(payload: IUser, input: UpdateScheme): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { id, isEnable } = input;
            if (!id) {
                return { message: "Opps! Something Went Wrong", status: STATUSCODES.BAD_REQUEST }
            }

            await this.getRepositry.createQueryBuilder().update({isEnable}).where({ id }).execute();

            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }
}

export { SchemeController as SchemeService }