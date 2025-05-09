import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateRole, DeleteRole, GetRole, IRole, IsActiveRole, UpdateRole } from "../../../../core/types/ReasonService/ReasonService";
import { Role, RoleRepository } from "../../../../core/DB/Entities/role.entity";

class RoleController {
    private role = RoleRepository();

    constructor() { }

    async add(input: CreateRole, payload: IUser): Promise<IApiResponse> {
        try {
            const { name } = input;
            const { emp_id } = payload;

            const newBrand = new Role();
            newBrand.name = name;
            newBrand.empId = emp_id;

            await this.role.save(newBrand);

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }


    async list(payload: IUser, input: IsActiveRole): Promise<IApiResponse> {
        console.log({ input })

        try {
            let filter: any = {};
            if (input?.isActive) {
                filter = { isActive: input?.isActive }
            }
            const list: IRole[] | null = await this.role.find({
                where: { isDeleted: false, ...filter },
                order: { createdAt: 'ASC' }
            });

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: list }
        } catch (error) {
            throw error;
        }
    }


    async getRoleById(payload: IUser, input: GetRole): Promise<IApiResponse> {
        try {
            const { roleId } = input;
            const role: IRole | null = await this.role.findOne({ where: { roleId: Number(roleId) } });
            if (!role) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: role }
        } catch (error) {
            throw error;
        }
    }


    async update(payload: IUser, input: UpdateRole): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { name, roleId } = input;
            if (!name) {
                return { message: "Name can't be empty.", status: STATUSCODES.BAD_REQUEST }
            }

            await this.role.createQueryBuilder().update({ name }).where({ roleId }).execute();

            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async delete(payload: IUser, input: DeleteRole): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { roleId } = input;
            await this.role.createQueryBuilder().update({ isDeleted: true }).where({ roleId }).execute();
            return { message: "Deleted Successfully.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }
}

export { RoleController as RoleService }