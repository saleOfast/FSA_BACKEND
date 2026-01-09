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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeatService = void 0;
const common_1 = require("../../../../core/types/Constent/common");
const beat_entity_1 = require("../../../../core/DB/Entities/beat.entity");
const common_2 = require("../../../../core/types/Constent/common");
const customer_entity_1 = require("../../../../core/DB/Entities/customer.entity");
class BeatController {
    constructor() {
        this.beatRepositry = (0, beat_entity_1.BeatRepository)();
        this.customerRepo = customer_entity_1.Customer.getRepository();
    }
    createBeat(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customerChannel = yield this.customerRepo.findOne({
                    select: ["channelType"],
                    where: { customerId: input.customerId },
                });
                if (!customerChannel) {
                    return {
                        status: common_1.STATUSCODES.BAD_REQUEST,
                        message: "Customer not found",
                        data: null,
                    };
                }
                const beat = new beat_entity_1.Beat();
                /* ---------- Identity ---------- */
                beat.beatName = input.beatName;
                beat.beatCode = `BT-${Date.now()}`;
                /* ---------- Ownership ---------- */
                beat.customerId = input.customerId;
                beat.warehouseId = input.warehouseId;
                beat.userId = input.userId;
                /* ---------- Business ---------- */
                beat.beatType = input.beatType;
                beat.visitFrequency = input.visitFrequency;
                beat.defaultVisitDays = input.defaultVisitDays;
                beat.priority = input.priority;
                beat.status = common_2.BeatStatus.ACTIVE;
                /* ---------- Location ---------- */
                beat.countryId = input.countryId;
                beat.stateId = input.stateId;
                beat.districtId = input.districtId;
                beat.area = input.area;
                beat.zone = input.zone;
                /* ---------- Route ---------- */
                beat.startLat = input.startLat;
                beat.startLng = input.startLng;
                beat.endLat = input.endLat;
                beat.endLng = input.endLng;
                beat.plannedStartTime = input.plannedStartTime;
                beat.plannedEndTime = input.plannedEndTime;
                /* ---------- Audit ---------- */
                beat.createdBy = payload.emp_id;
                const beatData = yield this.beatRepositry.save(beat);
                // Save the beat
                const responseData = Object.assign(Object.assign({}, beatData), { channel: customerChannel.channelType });
                return {
                    status: common_1.STATUSCODES.SUCCESS,
                    message: "Beat created successfully",
                    data: responseData, // now beatWithCustomer.channel will return channel
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateBeat(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { beatId } = input, updateData = __rest(input, ["beatId"]);
                // Check beat exists
                const beat = yield this.beatRepositry.findOne({
                    where: { beatId },
                });
                if (!beat) {
                    return {
                        status: common_1.STATUSCODES.BAD_REQUEST,
                        message: "Beat not found",
                        data: null,
                    };
                }
                // Update only provided fields
                yield this.beatRepositry.update({ beatId }, Object.assign({}, updateData));
                const updatedBeat = yield this.beatRepositry.findOne({
                    where: { beatId },
                });
                return {
                    status: common_1.STATUSCODES.SUCCESS,
                    message: "Beat updated successfully",
                    data: updatedBeat,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { beatId } = input;
                const beat = yield this.beatRepositry.findOne({
                    where: { beatId: beatId },
                });
                if (!beat) {
                    return {
                        status: common_1.STATUSCODES.BAD_REQUEST,
                        message: "Beat not found",
                        data: null,
                    };
                }
                yield this.beatRepositry.update({ beatId: beatId }, {
                    isDeleted: true,
                });
                return {
                    status: common_1.STATUSCODES.SUCCESS,
                    message: "Beat deleted successfully",
                    data: null,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = this.beatRepositry.createQueryBuilder("beat");
                // Filter by beatId
                query.where("beat.beatId = :beatId", { beatId: input.beatId });
                // Optionally, filter out deleted beats if you use isDeleted
                query.andWhere("beat.isDeleted = false");
                const beat = yield query.getOne();
                if (!beat) {
                    return {
                        status: common_1.STATUSCODES.NOT_FOUND,
                        message: "Beat not found",
                        data: null,
                    };
                }
                return {
                    status: common_1.STATUSCODES.SUCCESS,
                    message: "Success.",
                    data: beat,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllBeats(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = this.beatRepositry.createQueryBuilder("beat");
                // ================= Filters =================
                if (input.customerId)
                    query.andWhere("beat.customerId = :customerId", { customerId: input.customerId });
                if (input.warehouseId)
                    query.andWhere("beat.warehouseId = :warehouseId", { warehouseId: input.warehouseId });
                if (input.userId)
                    query.andWhere("beat.userId = :userId", { userId: input.userId });
                if (input.channel)
                    query.andWhere("beat.channel = :channel", { channel: input.channel });
                if (input.beatType)
                    query.andWhere("beat.beatType = :beatType", { beatType: input.beatType });
                if (input.status)
                    query.andWhere("beat.status = :status", { status: input.status });
                if (input.priority)
                    query.andWhere("beat.priority = :priority", { priority: input.priority });
                // ================= Location Filters =================
                if (input.countryId)
                    query.andWhere("beat.countryId = :countryId", { countryId: input.countryId });
                if (input.stateId)
                    query.andWhere("beat.stateId = :stateId", { stateId: input.stateId });
                if (input.districtId)
                    query.andWhere("beat.districtId = :districtId", { districtId: input.districtId });
                if (input.area)
                    query.andWhere("beat.area ILIKE :area", { area: `%${input.area}%` });
                if (input.zone)
                    query.andWhere("beat.zone ILIKE :zone", { zone: `%${input.zone}%` });
                // ================= Search =================
                if (input.search) {
                    query.andWhere("(beat.beatName ILIKE :search OR beat.beatCode ILIKE :search)", { search: `%${input.search}%` });
                }
                // ================= Pagination =================
                const page = input.page || 1;
                const limit = input.limit || 20;
                const skip = (page - 1) * limit;
                const [beats, total] = yield query.skip(skip).take(limit).getManyAndCount();
                return {
                    status: common_1.STATUSCODES.SUCCESS,
                    message: "Success.",
                    data: {
                        items: beats,
                        total,
                        page,
                        limit,
                        totalPages: Math.ceil(total / limit),
                    },
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.BeatService = BeatController;
