import { STATUSCODES, UserRole } from "../../../../core/types/Constent/common";
import { Beat, BeatRepository } from "../../../../core/DB/Entities/beat.entity";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { CreateBeat, DeleteBeat, GetBeat, GetBeatOnVisit, IBeat, UpdateBeat } from "../../../../core/types/BeatService/Beat";
import { IApiResponse } from "../../../../core/types/Constent/commonService";

class BeatController {
    private beatRepositry = BeatRepository();

    constructor() { }

    async createBeat(input: any, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { beatName, store, area, country, state, district, city, salesRep } = input;
            const newBeat = new Beat();
            newBeat.beatName = beatName;
            newBeat.area = area;
            newBeat.country = country;
            newBeat.state = state;
            newBeat.district = district;
            newBeat.city = city;
            newBeat.empId = salesRep;
            newBeat.store = store;

            await this.beatRepositry.save(newBeat);

            return { status: STATUSCODES.SUCCESS, message: "Success." }
        } catch (error) {
            throw error;
        }
    }

    async beatList(payload: IUser, input: GetBeatOnVisit): Promise<IApiResponse> {
        const { emp_id, role } = payload;
        const { isVisit } = input;
        const isVisitBoolean = Boolean(isVisit);  // Converts to a boolean
        try {
            let queryBuilder = this.beatRepositry.createQueryBuilder('beat')
                .leftJoinAndSelect("beat.user", "user")
                
                if(isVisitBoolean){ 
                    queryBuilder.where("user.role = :role", {role : UserRole.SSM} )
                }
                
                queryBuilder.andWhere('beat.isDeleted = :isDeleted', { isDeleted: false })
                .orderBy('beat.updatedAt', 'DESC')
                .addOrderBy('beat.createdAt', 'DESC');

            if (role === UserRole.RSM) {
                const beatIds: any = await this.beatRepositry.createQueryBuilder("beat")
                    .leftJoin("beat.user", "user")
                    .where("user.managerId = :managerId", { managerId: emp_id })
                    .select("beat.beatId")
                    .getMany()
                    .then((beats: IBeat[]) => beats.map(beat => beat.beatId));
                if (beatIds.length > 0) {
                    queryBuilder.where("beat.beatId IN (:...beatId)", { beatId: beatIds });
                } else {
                    return { message: "No visitIds found for admin user.", status: STATUSCODES.NOT_FOUND };
                }
            }
            if (role === UserRole.SSM) {
                queryBuilder = queryBuilder.andWhere('beat.empId = :empId', { empId: emp_id });
            }

            const beatList: IBeat[] = await queryBuilder.getMany();

            return { status: STATUSCODES.SUCCESS, message: "Success.", data: beatList };
        } catch (error) {
            throw error;
        }
    }


    async getBeatById(payload: IUser, input: GetBeat): Promise<IApiResponse> {
        try {
            const { beatId } = input;
            // const brand: IBeat | null = await this.beatRepositry.findOne({ where: { beatId: Number(beatId), isDeleted: false } });
            const brand: IBeat | null = await this.beatRepositry.createQueryBuilder('beat')
                .leftJoin('beat.user', 'user')  // Assuming there is a relation between beat and user
                .addSelect('user.role')  // Select the role from the user table
                .where('beat.beatId = :beatId', { beatId: Number(beatId) })
                .andWhere('beat.isDeleted = false')
                .getOne();

            if (!brand) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: brand }
        } catch (error) {
            throw error;
        }
    }


    async update(payload: IUser, input: UpdateBeat): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { beatName, area, beatId, store, country, state, district, city, salesRep } = input;
            if (!beatName) {
                return { message: "Name can't be empty.", status: STATUSCODES.BAD_REQUEST }
            }

            await this.beatRepositry.createQueryBuilder().update({ beatName, area, store, country, state, district, city, empId: salesRep }).where({ beatId }).execute();

            return { message: "Updated.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }

    async delete(payload: IUser, input: DeleteBeat): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const { beatId } = input;
            await this.beatRepositry.createQueryBuilder().update({ isDeleted: true }).where({ beatId: Number(beatId) }).execute();
            return { message: "Deleted Successfully.", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }
}

export { BeatController as BeatService }