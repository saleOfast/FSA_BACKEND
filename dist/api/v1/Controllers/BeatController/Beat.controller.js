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
exports.BeatService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const beat_entity_1 = require("../../../../core/DB/Entities/beat.entity");
class BeatController {
    constructor() {
        this.beatRepositry = (0, beat_entity_1.BeatRepository)();
    }
    createBeat(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const { beatName, store, area, country, state, district, city, salesRep } = input;
                const newBeat = new beat_entity_1.Beat();
                newBeat.beatName = beatName;
                newBeat.area = area;
                newBeat.country = country;
                newBeat.state = state;
                newBeat.district = district;
                newBeat.city = city;
                newBeat.empId = salesRep;
                newBeat.store = store;
                yield this.beatRepositry.save(newBeat);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Success." };
            }
            catch (error) {
                throw error;
            }
        });
    }
    beatList(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { emp_id, role } = payload;
            const { isVisit } = input;
            const isVisitBoolean = Boolean(isVisit); // Converts to a boolean
            try {
                let queryBuilder = this.beatRepositry.createQueryBuilder('beat')
                    .leftJoinAndSelect("beat.user", "user");
                if (isVisitBoolean) {
                    queryBuilder.where("user.role = :role", { role: common_1.UserRole.SSM });
                }
                queryBuilder.andWhere('beat.isDeleted = :isDeleted', { isDeleted: false })
                    .orderBy('beat.updatedAt', 'DESC')
                    .addOrderBy('beat.createdAt', 'DESC');
                if (role === common_1.UserRole.RSM) {
                    const beatIds = yield this.beatRepositry.createQueryBuilder("beat")
                        .leftJoin("beat.user", "user")
                        .where("user.managerId = :managerId", { managerId: emp_id })
                        .select("beat.beatId")
                        .getMany()
                        .then((beats) => beats.map(beat => beat.beatId));
                    if (beatIds.length > 0) {
                        queryBuilder.where("beat.beatId IN (:...beatId)", { beatId: beatIds });
                    }
                    else {
                        return { message: "No visitIds found for admin user.", status: common_1.STATUSCODES.NOT_FOUND };
                    }
                }
                if (role === common_1.UserRole.SSM) {
                    queryBuilder = queryBuilder.andWhere('beat.empId = :empId', { empId: emp_id });
                }
                const beatList = yield queryBuilder.getMany();
                return { status: common_1.STATUSCODES.SUCCESS, message: "Success.", data: beatList };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getBeatById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { beatId } = input;
                // const brand: IBeat | null = await this.beatRepositry.findOne({ where: { beatId: Number(beatId), isDeleted: false } });
                const brand = yield this.beatRepositry.createQueryBuilder('beat')
                    .leftJoin('beat.user', 'user') // Assuming there is a relation between beat and user
                    .addSelect('user.role') // Select the role from the user table
                    .where('beat.beatId = :beatId', { beatId: Number(beatId) })
                    .andWhere('beat.isDeleted = false')
                    .getOne();
                if (!brand) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: brand };
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
                const { beatName, area, beatId, store, country, state, district, city, salesRep } = input;
                if (!beatName) {
                    return { message: "Name can't be empty.", status: common_1.STATUSCODES.BAD_REQUEST };
                }
                yield this.beatRepositry.createQueryBuilder().update({ beatName, area, store, country, state, district, city, empId: salesRep }).where({ beatId }).execute();
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
                const { beatId } = input;
                yield this.beatRepositry.createQueryBuilder().update({ isDeleted: true }).where({ beatId: Number(beatId) }).execute();
                return { message: "Deleted Successfully.", status: common_1.STATUSCODES.SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.BeatService = BeatController;
