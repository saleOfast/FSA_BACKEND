import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { Samples, SamplesRepository } from "../../../../core/DB/Entities/samples.entity";
import { STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { ISamples, SamplesC, SamplesD, SamplesR, SamplesU } from "../../../../core/types/SamplesService/SamplesService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { Between, IsNull, Not } from "typeorm";

class SamplesService {
    private SamplesRepository = SamplesRepository();
    private userRespositry = UserRepository()

    constructor() { }

    async createSamples(input: SamplesC, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const user = await this.userRespositry.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }
            let newSamples = await this.SamplesRepository.save(input);
            return { status: STATUSCODES.SUCCESS, message: "Samples created successfully.", data: newSamples };
        } catch (error) {
            throw error;
        }
    }

    async createHoliday(input: SamplesC, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const user = await this.userRespositry.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }
            let newSamples = await this.SamplesRepository.save(input);
            return { status: STATUSCODES.SUCCESS, message: "Samples created successfully.", data: newSamples };
        } catch (error) {
            throw error;
        }
    }

    async getSamples(input: SamplesR, payload: IUser): Promise<IApiResponse> {
        try {
            const SamplesList = await this.SamplesRepository.find({
                where: { storeId: input.storeId },
                relations: { store: true, user: true, product: true },
                order: { createdAt: "DESC" },
            });
            return { status: STATUSCODES.SUCCESS, message: "Samples list retrieved successfully.", data: SamplesList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getSamplesByDateOLDDDD(input: SamplesR, payload: IUser): Promise<IApiResponse> {
        try {
            const fiveDaysAgo = new Date();
            fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 4); // Last 5 days including today

            const SamplesList = await this.SamplesRepository.createQueryBuilder("sample")
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
            return { status: STATUSCODES.SUCCESS, message: "Samples list retrieved successfully.", data: SamplesList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getSamplesByDate(input: SamplesR, payload: IUser): Promise<IApiResponse> {
        try {
            const { storeId } = input; // Assuming storeId is passed in the `input` object

            // const lastFiveDates = await this.SamplesRepository.createQueryBuilder("sample")
            //     .select("DATE(sample.createdAt) AS date")
            //     .where("store.storeId = :storeId", { storeId: storeId }) // Filter by storeId
            //     .groupBy("DATE(sample.createdAt)")
            //     .orderBy("date", "DESC")
            //     .limit(5)
            //     .getRawMany();

            const lastFiveDates = await this.SamplesRepository.createQueryBuilder("sample")
                .select("DATE(sample.createdAt) AS date")
                .leftJoin("sample.store", "store")
                .where("store.storeId = :storeId", { storeId })
                .groupBy("DATE(sample.createdAt)")
                .orderBy("date", "DESC")
                .limit(5)
                .getRawMany();

            const dates = lastFiveDates.map(result => result.date);

            if (dates.length === 0) {
                return { status: STATUSCODES.SUCCESS, message: "No data found for the last 5 days.", data: [] };
            }

            const SamplesList = await this.SamplesRepository.createQueryBuilder("sample")
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

            return { status: STATUSCODES.SUCCESS, message: "Samples list retrieved successfully.", data: SamplesList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getSamplesById(payload: IUser, input: SamplesR): Promise<IApiResponse> {
        try {
            const { samplesId } = input;
            const Samples: any | null = await this.SamplesRepository.findOne({ where: { samplesId: Number(samplesId) } });
            if (!Samples) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: Samples }
        } catch (error) {
            throw error;
        }
    }

    async editSamples(input: SamplesU, payload: IUser): Promise<IApiResponse> {
        try {
            if (input.samplesId) {
                const existingSamples = await this.SamplesRepository.findOne({
                    where: { samplesId: input.samplesId },
                });
                if (!existingSamples) {
                    return { status: STATUSCODES.CONFLICT, message: "Samples does not exists." };
                }
                await this.SamplesRepository.update({ samplesId: input.samplesId }, input);
            }
            return { status: STATUSCODES.SUCCESS, message: "Samples updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deleteSamples(input: SamplesD, payload: IUser): Promise<IApiResponse> {
        try {
            const Samples = await this.SamplesRepository.findOne({
                where: { samplesId: input.samplesId },
            });

            if (!Samples) {
                return { status: STATUSCODES.NOT_FOUND, message: "Samples does not exist." };
            }
            await this.SamplesRepository.softDelete({ samplesId: Samples.samplesId });
            return { status: STATUSCODES.SUCCESS, message: "Samples deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

}

export { SamplesService as Samples }