import { STATUSCODES, UserRole } from "../../../../core/types/Constent/common";
import { Beat, BeatRepository } from "../../../../core/DB/Entities/beat.entity";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {CreateBeatDto , UpdateBeatDto ,  DeleteBeatDto, GetBeatDto, IBeat,GetAllBeatDto } from "../../../../core/types/BeatService/Beat";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { 
  BeatPriority,
  BeatStatus,
  BeatType,
  VisitFrequency,
  VisitDay } from "../../../../core/types/Constent/common";
  import { Customer } from "../../../../core/DB/Entities/customer.entity";

class BeatController {
    private beatRepositry = BeatRepository();
    private customerRepo = Customer.getRepository();

    constructor() { }
async createBeat(
  input: CreateBeatDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
     const customerChannel = await this.customerRepo.findOne({
      select: ["channelType"],      // Only fetch channelType
      where: { customerId: input.customerId },
    });

    if (!customerChannel) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Customer not found",
        data: null,
      };
    }

    const beat = new Beat();

    /* ---------- Identity ---------- */
    beat.beatName = input.beatName;
    beat.beatCode = `BT-${Date.now()}`;

    /* ---------- Ownership ---------- */
    beat.customerId =  input.customerId;
    beat.warehouseId = input.warehouseId;
    beat.userId = input.userId;

    /* ---------- Business ---------- */
    beat.beatType = input.beatType;
    beat.visitFrequency = input.visitFrequency;
    beat.defaultVisitDays = input.defaultVisitDays;
    beat.priority = input.priority;
    beat.status = BeatStatus.ACTIVE;

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
        const beatData = await this.beatRepositry.save(beat);

    // Save the beat
      const responseData = {
      ...beatData,
      channel: customerChannel.channelType, // only this field
    };


    return {
      status: STATUSCODES.SUCCESS,
      message: "Beat created successfully",
      data: responseData, // now beatWithCustomer.channel will return channel
    };
  } catch (error) {
    throw error;
  }
}

async updateBeat(
  payload: IUser,
  input: UpdateBeatDto
): Promise<IApiResponse> {
  try {
    const { beatId, ...updateData } = input;

    // 1️⃣ Check if beat exists
    const beat = await this.beatRepositry.findOne({
      where: { beatId },
    });

    if (!beat) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Beat not found",
        data: null,
      };
    }

    // 2️⃣ Update only provided fields
    await this.beatRepositry.update(
      { beatId },
      { ...updateData }
    );

    // 3️⃣ Fetch the updated beat
    const updatedBeat = await this.beatRepositry.findOne({
      where: { beatId },
    });

    if (!updatedBeat) {
      // Safety check in case something went wrong after update
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Failed to fetch updated beat",
        data: null,
      };
    }

    // 4️⃣ Fetch customer channel
    const customer = await this.customerRepo.findOne({
      select: ["channelType"],
      where: { customerId: updatedBeat.customerId },
    });

    // 5️⃣ Prepare response with channel
    const responseData = {
      ...updatedBeat,
      channel: customer?.channelType ?? null, // safe fallback
    };

    return {
      status: STATUSCODES.SUCCESS,
      message: "Beat updated successfully",
      data: responseData,
    };
  } catch (error) {
    throw error;
  }
}



async delete(
  payload: IUser,
  input: DeleteBeatDto
): Promise<IApiResponse> {
  try {
    const { beatId } = input;

    const beat = await this.beatRepositry.findOne({
      where: { beatId: beatId },
    });

    if (!beat) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Beat not found",
        data: null,
      };
    }

    await this.beatRepositry.update(
      { beatId: beatId },
      {
        isDeleted: true,
      }
    );

    return {
      status: STATUSCODES.SUCCESS,
      message: "Beat deleted successfully",
      data: null,
    };
  } catch (error) {
    throw error;
  }
}


async getById(payload: IUser, input: GetBeatDto): Promise<IApiResponse> {
  try {
    // 1️⃣ Build query to fetch beat
    const query = this.beatRepositry.createQueryBuilder("beat");

    // Filter by beatId
    query.where("beat.beatId = :beatId", { beatId: input.beatId });

    // Optionally filter out deleted beats
    query.andWhere("beat.isDeleted = false");

    const beat = await query.getOne();

    if (!beat) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Beat not found",
        data: null,
      };
    }

    // 2️⃣ Fetch customer channel
    const customer = await this.customerRepo.findOne({
      select: ["channelType"],
      where: { customerId: beat.customerId },
    });

    // 3️⃣ Merge channel into response
    const responseData = {
      ...beat,
      channel: customer?.channelType ?? null,
    };

    return {
      status: STATUSCODES.SUCCESS,
      message: "Success",
      data: responseData,
    };
  } catch (error) {
    throw error;
  }
}


async getAllBeats(input: GetAllBeatDto, payload: IUser): Promise<IApiResponse> {
  try {
      const query = this.beatRepositry
      .createQueryBuilder("beat")
      .leftJoin("beat.customer", "customer")
      .addSelect([
        "customer.customerName",
        "customer.channelType",
      ]);

    // ================= Filters =================
    if (input.customerId) query.andWhere("beat.customerId = :customerId", { customerId: input.customerId });
    if (input.warehouseId) query.andWhere("beat.warehouseId = :warehouseId", { warehouseId: input.warehouseId });
    if (input.userId) query.andWhere("beat.userId = :userId", { userId: input.userId });
    if (input.channel) query.andWhere("beat.channel = :channel", { channel: input.channel });
    if (input.beatType) query.andWhere("beat.beatType = :beatType", { beatType: input.beatType });
    if (input.status) query.andWhere("beat.status = :status", { status: input.status });
    if (input.priority) query.andWhere("beat.priority = :priority", { priority: input.priority });
  
      if (input.channel)
      query.andWhere("customer.channelType = :channel", { channel: input.channel });
    // ================= Location Filters =================
    if (input.countryId) query.andWhere("beat.countryId = :countryId", { countryId: input.countryId });
    if (input.stateId) query.andWhere("beat.stateId = :stateId", { stateId: input.stateId });
    if (input.districtId) query.andWhere("beat.districtId = :districtId", { districtId: input.districtId });
    if (input.area) query.andWhere("beat.area ILIKE :area", { area: `%${input.area}%` });
    if (input.zone) query.andWhere("beat.zone ILIKE :zone", { zone: `%${input.zone}%` });

    // ================= Search =================
    if (input.search) {
      query.andWhere("(beat.beatName ILIKE :search OR beat.beatCode ILIKE :search)", { search: `%${input.search}%` });
    }

    // ================= Pagination =================
    const page = input.page || 1;
    const limit = input.limit || 20;
    const skip = (page - 1) * limit;

    const [beats, total] = await query.skip(skip).take(limit).getManyAndCount();

    return {
      status: STATUSCODES.SUCCESS,
      message: "Success.",
      data: {
        items: beats,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
}



}

export { BeatController as BeatService }