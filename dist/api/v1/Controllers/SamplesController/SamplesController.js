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
exports.Samples = void 0;
const samples_entity_1 = require("../../../../core/DB/Entities/samples.entity");
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
class SamplesService {
    constructor() {
        this.SamplesRepository = (0, samples_entity_1.SamplesRepository)();
        this.userRespositry = (0, User_entity_1.UserRepository)();
    }
    createSamples(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const user = yield this.userRespositry.findOne({ where: { emp_id } });
                if (!user) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
                }
                let newSamples = yield this.SamplesRepository.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Samples created successfully.", data: newSamples };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createHoliday(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const user = yield this.userRespositry.findOne({ where: { emp_id } });
                if (!user) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
                }
                let newSamples = yield this.SamplesRepository.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Samples created successfully.", data: newSamples };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getSamples(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const SamplesList = yield this.SamplesRepository.find({
                    where: { storeId: input.storeId },
                    relations: { store: true, user: true, product: true },
                    order: { createdAt: "DESC" },
                });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Samples list retrieved successfully.", data: SamplesList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getSamplesByDateOLDDDD(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fiveDaysAgo = new Date();
                fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 4); // Last 5 days including today
                const SamplesList = yield this.SamplesRepository.createQueryBuilder("sample")
                    .leftJoinAndSelect("sample.store", "store")
                    .leftJoinAndSelect("sample.user", "user")
                    .leftJoinAndSelect("sample.product", "product")
                    .where("DATE(sample.createdAt) BETWEEN :startDate AND :endDate", {
                    startDate: fiveDaysAgo.toISOString().split("T")[0],
                    endDate: new Date().toISOString().split("T")[0]
                })
                    .select([
                    "DATE(sample.createdAt) AS date",
                    "json_agg(json_build_object(" +
                        "'samplesId', sample.samplesId, " +
                        "'store', json_build_object('storeId', store.storeId, 'storeName', store.storeName), " +
                        "'user', json_build_object('emp_id', user.emp_id, 'firstname', user.firstname), " +
                        "'product', json_build_object('productId', product.productId, 'productName', product.productName), " +
                        "'quantity', sample.quantity, " +
                        "'remarks', sample.remarks, " +
                        "'status', sample.status, " +
                        "'createdAt', sample.createdAt" +
                        ")) AS samples"
                ])
                    .groupBy("DATE(sample.createdAt)")
                    .orderBy("date", "DESC")
                    .getRawMany();
                return { status: common_1.STATUSCODES.SUCCESS, message: "Samples list retrieved successfully.", data: SamplesList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getSamplesByDate(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { storeId } = input; // Assuming storeId is passed in the `input` object
                // const lastFiveDates = await this.SamplesRepository.createQueryBuilder("sample")
                //     .select("DATE(sample.createdAt) AS date")
                //     .where("store.storeId = :storeId", { storeId: storeId }) // Filter by storeId
                //     .groupBy("DATE(sample.createdAt)")
                //     .orderBy("date", "DESC")
                //     .limit(5)
                //     .getRawMany();
                const lastFiveDates = yield this.SamplesRepository.createQueryBuilder("sample")
                    .select("DATE(sample.createdAt) AS date")
                    .leftJoin("sample.store", "store")
                    .where("store.storeId = :storeId", { storeId })
                    .groupBy("DATE(sample.createdAt)")
                    .orderBy("date", "DESC")
                    .limit(5)
                    .getRawMany();
                const dates = lastFiveDates.map(result => result.date);
                if (dates.length === 0) {
                    return { status: common_1.STATUSCODES.SUCCESS, message: "No data found for the last 5 days.", data: [] };
                }
                const SamplesList = yield this.SamplesRepository.createQueryBuilder("sample")
                    .leftJoinAndSelect("sample.store", "store")
                    .leftJoinAndSelect("sample.user", "user")
                    .leftJoinAndSelect("sample.product", "product")
                    .where("store.storeId = :storeId", { storeId }) // Filter by storeId
                    .andWhere("DATE(sample.createdAt) IN (:...dates)", { dates }) // Filter by the extracted dates
                    .select([
                    "DATE(sample.createdAt) AS date",
                    "json_agg(json_build_object(" +
                        "'samplesId', sample.samplesId, " +
                        "'store', json_build_object('storeId', store.storeId, 'storeName', store.storeName), " +
                        "'user', json_build_object('emp_id', user.emp_id, 'firstname', user.firstname), " +
                        "'product', json_build_object('productId', product.productId, 'productName', product.productName), " +
                        "'quantity', sample.quantity, " +
                        "'remarks', sample.remarks, " +
                        "'status', sample.status, " +
                        "'createdAt', sample.createdAt" +
                        ")) AS samples"
                ])
                    .groupBy("DATE(sample.createdAt)")
                    .orderBy("date", "DESC")
                    .getRawMany();
                return { status: common_1.STATUSCODES.SUCCESS, message: "Samples list retrieved successfully.", data: SamplesList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getSamplesById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { samplesId } = input;
                const Samples = yield this.SamplesRepository.findOne({ where: { samplesId: Number(samplesId) } });
                if (!Samples) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: Samples };
            }
            catch (error) {
                throw error;
            }
        });
    }
    editSamples(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (input.samplesId) {
                    const existingSamples = yield this.SamplesRepository.findOne({
                        where: { samplesId: input.samplesId },
                    });
                    if (!existingSamples) {
                        return { status: common_1.STATUSCODES.CONFLICT, message: "Samples does not exists." };
                    }
                    yield this.SamplesRepository.update({ samplesId: input.samplesId }, input);
                }
                return { status: common_1.STATUSCODES.SUCCESS, message: "Samples updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deleteSamples(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Samples = yield this.SamplesRepository.findOne({
                    where: { samplesId: input.samplesId },
                });
                if (!Samples) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Samples does not exist." };
                }
                yield this.SamplesRepository.softDelete({ samplesId: Samples.samplesId });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Samples deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.Samples = SamplesService;
