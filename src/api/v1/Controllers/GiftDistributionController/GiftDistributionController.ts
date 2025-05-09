import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { Gifts, GiftsRepository } from "../../../../core/DB/Entities/giftDistribution.entity";
import { STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { IGifts, GiftsC, GiftsD, GiftsR, GiftsU } from "../../../../core/types/GiftsService/GiftsService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { Between, IsNull, Not } from "typeorm";

class GiftsService {
    private GiftsRepository = GiftsRepository();
    private userRespositry = UserRepository()

    constructor() { }

    async createGifts(input: GiftsC, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const user = await this.userRespositry.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }
            let newGifts = await this.GiftsRepository.save(input);
            return { status: STATUSCODES.SUCCESS, message: "Gifts created successfully.", data: newGifts };
        } catch (error) {
            throw error;
        }
    }

    async getGifts(input: GiftsR, payload: IUser): Promise<IApiResponse> {
        try {
            const GiftsList = await this.GiftsRepository.find({
                where: { storeId: input.storeId },
                relations: { store: true, user: true, product: true },
                order: { createdAt: "DESC" },
            });
            return { status: STATUSCODES.SUCCESS, message: "Gifts list retrieved successfully.", data: GiftsList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getGiftsById(payload: IUser, input: GiftsR): Promise<IApiResponse> {
        try {
            const { giftId } = input;
            const Gifts: any | null = await this.GiftsRepository.findOne({ where: { giftId: Number(giftId) } });
            if (!Gifts) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: Gifts }
        } catch (error) {
            throw error;
        }
    }

    async getGiftsByDate(input: GiftsR, payload: IUser): Promise<IApiResponse> {
        try {
            const { storeId } = input; // Assuming storeId is passed in the `input` object

            // const lastFiveDates = await this.SamplesRepository.createQueryBuilder("gift")
            //     .select("DATE(gift.createdAt) AS date")
            //     .where("store.storeId = :storeId", { storeId: storeId }) // Filter by storeId
            //     .groupBy("DATE(gift.createdAt)")
            //     .orderBy("date", "DESC")
            //     .limit(5)
            //     .getRawMany();

            const lastFiveDates = await this.GiftsRepository.createQueryBuilder("gift")
                .select("DATE(gift.createdAt) AS date")
                .leftJoin("gift.store", "store")
                .where("store.storeId = :storeId", { storeId })
                .groupBy("DATE(gift.createdAt)")
                .orderBy("date", "DESC")
                .limit(5)
                .getRawMany();

            const dates = lastFiveDates.map(result => result.date);

            if (dates.length === 0) {
                return { status: STATUSCODES.SUCCESS, message: "No data found for the last 5 days.", data: [] };
            }

            const SamplesList = await this.GiftsRepository.createQueryBuilder("gift")
                .leftJoinAndSelect("gift.store", "store")
                .leftJoinAndSelect("gift.user", "user")
                .leftJoinAndSelect("gift.product", "product")
                .where("store.storeId = :storeId", { storeId }) // Filter by storeId
                .andWhere("DATE(gift.createdAt) IN (:...dates)", { dates }) // Filter by the extracted dates
                .select([
                    "DATE(gift.createdAt) AS date",
                    "json_agg(json_build_object(" +
                    "'gift_id', gift.gift_id, " +
                    "'store', json_build_object('storeId', store.storeId, 'storeName', store.storeName), " +
                    "'user', json_build_object('emp_id', user.emp_id, 'firstname', user.firstname), " +
                    "'product', json_build_object('productId', product.productId, 'productName', product.productName), " +
                    "'quantity', gift.quantity, " +
                    "'gift_name', gift.gift, " +
                    "'remarks', gift.remarks, " +
                    "'status', gift.status, " +
                    "'createdAt', gift.createdAt" +
                    ")) AS gifts"
                ])
                .groupBy("DATE(gift.createdAt)")
                .orderBy("date", "DESC")
                .getRawMany();

            return { status: STATUSCODES.SUCCESS, message: "Gifts list retrieved successfully.", data: SamplesList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }


    async editGifts(input: GiftsU, payload: IUser): Promise<IApiResponse> {
        try {
            if (input.giftId) {
                const existingGifts = await this.GiftsRepository.findOne({
                    where: { giftId: input.giftId },
                });
                if (!existingGifts) {
                    return { status: STATUSCODES.CONFLICT, message: "Gifts does not exists." };
                }
                await this.GiftsRepository.update({ giftId: input.giftId }, input);
            }
            return { status: STATUSCODES.SUCCESS, message: "Gifts updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deleteGifts(input: GiftsD, payload: IUser): Promise<IApiResponse> {
        try {
            const Gifts = await this.GiftsRepository.findOne({
                where: { giftId: input.giftId },
            });

            if (!Gifts) {
                return { status: STATUSCODES.NOT_FOUND, message: "Gifts does not exist." };
            }
            await this.GiftsRepository.softDelete({ giftId: Gifts.giftId });
            return { status: STATUSCODES.SUCCESS, message: "Gifts deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

}

export { GiftsService as Gifts }