import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateFeature, DeleteFeature, GetFeature, IFeature, UpdateFeature } from "../../../../core/types/ReasonService/ReasonService";
import { Feature, FeatureRepository } from "../../../../core/DB/Entities/feature.entity";
import { RoleRepository } from "../../../../core/DB/Entities/role.entity";

class FeatureController {
    private feature = FeatureRepository();
    private role = RoleRepository();

    constructor() { }

    async add(input: CreateFeature, payload: IUser): Promise<IApiResponse> {
        try {
            const { name, isActive } = input;
            const { emp_id } = payload;

            const newBrand = new Feature();
            newBrand.name = name;
            newBrand.empId = emp_id;
            newBrand.isActive = isActive

            await this.feature.save(newBrand);

            return { message: "Success.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }


    async list(payload: IUser): Promise<IApiResponse> {
        try {

            const list: IFeature[] | null = await this.feature.find({
                where: { isDeleted: false },
                order: { createdAt: 'ASC' }
            });

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: list }
        } catch (error) {
            throw error;
        }
    }


    async getFeatureById(payload: IUser, input: GetFeature): Promise<IApiResponse> {
        try {
            const { featureId } = input;
            const feature: IFeature | null = await this.feature.findOne({ where: { featureId: Number(featureId) } });
            if (!feature) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: feature }
        } catch (error) {
            throw error;
        }
    }


    async update(payload: IUser, input: UpdateFeature): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { key, isActive } = input;
            // console.log({key})

            if (!key) {
                return { message: "Opps! something Went Wrong", status: STATUSCODES.BAD_REQUEST }
            }
            await this.feature.createQueryBuilder()
                .update()
                .set({ isActive })
                .where("key = :key", { key })
                .execute();

            const roleMapping: any = {
                "e18b2f1a": ["da693r2", "da693r3", "da693r4", "da693r5"],
                "e18b2f2a": ["da693r7"],
                "e18b2f3a": ["da693r6"],
                "e18b2f4a": ["da693r8"]
            };

            if (roleMapping[key]) {
                const roleIds = roleMapping[key];

                // Update `role` table for the provided list of role IDs
                await this.role.createQueryBuilder()
                    .update()
                    .set({ isActive })
                    .where("key IN (:...roleIds)", { roleIds })
                    .execute();
            }

            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async delete(payload: IUser, input: DeleteFeature): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { featureId } = input;
            await this.feature.createQueryBuilder().update({ isDeleted: true }).where({ featureId }).execute();
            return { message: "Deleted Successfully.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }
}

export { FeatureController as FeatureService }