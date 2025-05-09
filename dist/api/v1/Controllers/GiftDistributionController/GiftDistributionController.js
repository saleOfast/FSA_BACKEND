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
exports.Gifts = void 0;
const giftDistribution_entity_1 = require("../../../../core/DB/Entities/giftDistribution.entity");
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
class GiftsService {
    constructor() {
        this.GiftsRepository = (0, giftDistribution_entity_1.GiftsRepository)();
        this.userRespositry = (0, User_entity_1.UserRepository)();
    }
    createGifts(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const user = yield this.userRespositry.findOne({ where: { emp_id } });
                if (!user) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
                }
                let newGifts = yield this.GiftsRepository.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Gifts created successfully.", data: newGifts };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getGifts(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const GiftsList = yield this.GiftsRepository.find({
                    where: { storeId: input.storeId },
                    relations: { store: true, user: true, product: true },
                    order: { createdAt: "DESC" },
                });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Gifts list retrieved successfully.", data: GiftsList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getGiftsById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { giftId } = input;
                const Gifts = yield this.GiftsRepository.findOne({ where: { giftId: Number(giftId) } });
                if (!Gifts) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: Gifts };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getGiftsByDate(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { storeId } = input; // Assuming storeId is passed in the `input` object
                // const lastFiveDates = await this.SamplesRepository.createQueryBuilder("gift")
                //     .select("DATE(gift.createdAt) AS date")
                //     .where("store.storeId = :storeId", { storeId: storeId }) // Filter by storeId
                //     .groupBy("DATE(gift.createdAt)")
                //     .orderBy("date", "DESC")
                //     .limit(5)
                //     .getRawMany();
                const lastFiveDates = yield this.GiftsRepository.createQueryBuilder("gift")
                    .select("DATE(gift.createdAt) AS date")
                    .leftJoin("gift.store", "store")
                    .where("store.storeId = :storeId", { storeId })
                    .groupBy("DATE(gift.createdAt)")
                    .orderBy("date", "DESC")
                    .limit(5)
                    .getRawMany();
                const dates = lastFiveDates.map(result => result.date);
                if (dates.length === 0) {
                    return { status: common_1.STATUSCODES.SUCCESS, message: "No data found for the last 5 days.", data: [] };
                }
                const SamplesList = yield this.GiftsRepository.createQueryBuilder("gift")
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
                return { status: common_1.STATUSCODES.SUCCESS, message: "Gifts list retrieved successfully.", data: SamplesList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    editGifts(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (input.giftId) {
                    const existingGifts = yield this.GiftsRepository.findOne({
                        where: { giftId: input.giftId },
                    });
                    if (!existingGifts) {
                        return { status: common_1.STATUSCODES.CONFLICT, message: "Gifts does not exists." };
                    }
                    yield this.GiftsRepository.update({ giftId: input.giftId }, input);
                }
                return { status: common_1.STATUSCODES.SUCCESS, message: "Gifts updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deleteGifts(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Gifts = yield this.GiftsRepository.findOne({
                    where: { giftId: input.giftId },
                });
                if (!Gifts) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Gifts does not exist." };
                }
                yield this.GiftsRepository.softDelete({ giftId: Gifts.giftId });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Gifts deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.Gifts = GiftsService;
