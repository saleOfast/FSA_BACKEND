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
  import { Warehouse, WarehouseRepository, } from "../../../../core/DB/Entities/warehouse.entity";
  import{ Country ,CountryRepository} from "../../../../core/DB/Entities/country.entity"
  import { State, StateRepository } from "../../../../core/DB/Entities/state.entity";
  import { District, DistrictRepository } from "../../../../core/DB/Entities/district.entity";
  import { User, UserRepository } from "../../../../core/DB/Entities/User.entity";
import { IsNull } from "typeorm/find-options/operator/IsNull";

class BeatController {
    private beatRepositry = BeatRepository();
    private customerRepo = Customer.getRepository();
    private warehouseRepo = WarehouseRepository();
    private countryRepo = CountryRepository();
    private districtRepo = DistrictRepository();
    private stateRepo = StateRepository();
    private  userRepo = UserRepository();

    constructor() { }
async createBeat(
  input: CreateBeatDto,
  payload: IUser
): Promise<IApiResponse> {
  try {

    /* =====================================================
     1️⃣ BASIC VALIDATION (Bug 61 & 65)
    ===================================================== */
    if (!input.beatName || input.beatName.trim() === "") {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Beat name is required",
        data: null,
      };
    }

    if (!input.beatType) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Beat type is required",
        data: null,
      };
    }

    if (!input.visitFrequency) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Visit frequency is required",
        data: null,
      };
    }

const beatName = input.beatName.trim().toLowerCase();


    /* =====================================================
     2️⃣ CUSTOMER VALIDATION (Bug 57)
    ===================================================== */
    const customer = await this.customerRepo.findOne({
      select: ["customerId", "channelType"],
      where: {
        customerId: input.customerId,
        isDeleted: false,
      },
    });

    if (!customer) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Customer not found or deleted",
        data: null,
      };
    }

    if (input.userId) {
  const user = await this.userRepo.findOne({
    where: {
      emp_id: input.userId,isDeleted: false
    },
  });

  if (!user) {
    return {
      status: STATUSCODES.BAD_REQUEST,
      message: "Invalid userId",
      data: null,
    };
  }
}

    /* =====================================================
     3️⃣ WAREHOUSE VALIDATION (Bug 58)
    ===================================================== */
    const warehouse = await this.warehouseRepo.findOne({
      where: {
        warehouseId: String(input.warehouseId),
        isDeleted: false,
      },
    });

    if (!warehouse) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Invalid or inactive warehouse",
        data: null,
      };
    }

   
    /* =====================================================
     5️⃣ DUPLICATE CHECK (Bug 60)
    ===================================================== */
    const existingBeat = await this.beatRepositry.findOne({
      where: {
        beatName: beatName,
        customerId: input.customerId,
        isDeleted: false,
      },
    });

    if (existingBeat) {
      return {
        status: STATUSCODES.CONFLICT,
        message: "Beat with same name already exists",
        data: null,
      };
    }

    /* =====================================================
     6️⃣ LOCATION VALIDATION (Bug 62)
    ===================================================== */
    const country = await this.countryRepo.findOne({
      where: { countryId: input.countryId, deletedAt: IsNull() },
    });

    if (!country) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Invalid country",
        data: null,
      };
    }

    const state = await this.stateRepo.findOne({
      where: {
        stateId: input.stateId,
        country: { countryId: input.countryId },
        isDeleted: false,
      },
    });

    if (!state) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "State does not belong to country",
        data: null,
      };
    }

    const district = await this.districtRepo.findOne({
      where: {
        districtId: input.districtId,
        state: { stateId: input.stateId },
        isDeleted: false,
      },
    });

    if (!district) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "District does not belong to state",
        data: null,
      };
    }

    /* =====================================================
     7️⃣ TIME VALIDATION (Bug 63)
    ===================================================== */
    if (
      input.plannedStartTime &&
      input.plannedEndTime &&
      input.plannedEndTime <= input.plannedStartTime
    ) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "End time must be greater than start time",
        data: null,
      };
    }

    /* =====================================================
     8️⃣ CREATE BEAT
    ===================================================== */
    const beat = new Beat();

    beat.beatName = beatName;
    beat.beatCode = `BT-${Date.now()}`;

    /* Ownership */
    beat.customerId = input.customerId;
    beat.warehouseId = String(input.warehouseId);
    beat.userId = input.userId;

    /* Business */
    beat.beatType = input.beatType;
    beat.visitFrequency = input.visitFrequency;
    beat.defaultVisitDays = input.defaultVisitDays;
    beat.priority = input.priority;

    /* Bug 64 Fix → Use input OR default */
   beat.status = BeatStatus.ACTIVE;

    /* Location */
    beat.countryId = input.countryId;
    beat.stateId = input.stateId;
    beat.districtId = input.districtId;
    beat.area = input.area?.trim() || undefined;
    beat.zone = input.zone?.trim() || undefined;

    /* Route */
    beat.startLat = input.startLat;
    beat.startLng = input.startLng;
    beat.endLat = input.endLat;
    beat.endLng = input.endLng;
    beat.plannedStartTime = input.plannedStartTime;
    beat.plannedEndTime = input.plannedEndTime;

    /* Audit */
    beat.createdBy = payload.emp_id;

    const beatData = await this.beatRepositry.save(beat);

    /* =====================================================
     9️⃣ RESPONSE
    ===================================================== */
    return {
      status: STATUSCODES.SUCCESS,
      message: "Beat created successfully",
      data: {
        ...beatData,
        channel: customer.channelType,
      },
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
    const { beatId } = input;

    /* =====================================================
     1️⃣ CHECK BEAT (Soft Delete Fix)
    ===================================================== */
    const beat = await this.beatRepositry.findOne({
      where: { beatId, isDeleted: false },
    });

    if (!beat) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Beat not found or deleted",
        data: null,
      };
    }

    /* =====================================================
     2️⃣ VALIDATIONS (ONLY IF FIELD PROVIDED)
    ===================================================== */

    /* ✅ Beat Name */
    if (input.beatName !== undefined) {
      const beatName = input.beatName.trim().toLowerCase();

      if (!beatName) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Beat name cannot be empty",
          data: null,
        };
      }

      // Duplicate check
      const existing = await this.beatRepositry.findOne({
        where: {
          beatName,
          customerId: beat.customerId,
          isDeleted: false,
        },
      });

      if (existing && existing.beatId !== beatId) {
        return {
          status: STATUSCODES.CONFLICT,
          message: "Beat name already exists",
          data: null,
        };
      }

      beat.beatName = beatName;
    }

    /* ✅ Warehouse */
    if (input.warehouseId !== undefined) {
      const warehouse = await this.warehouseRepo.findOne({
        where: { warehouseId: String(input.warehouseId), isDeleted: false },
      });

      if (!warehouse) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Invalid warehouse",
          data: null,
        };
      }

      beat.warehouseId = String(input.warehouseId);
    }

    if (input.userId !== undefined) {
  const user = await this.userRepo.findOne({
    where: {
      emp_id: input.userId,
    },
  });

  if (!user) {
    return {
      status: STATUSCODES.BAD_REQUEST,
      message: "Invalid userId",
      data: null,
    };
  }

  beat.userId = input.userId;
}

    /* =====================================================
     3️⃣ PICKLIST STATUS VALIDATION
    ===================================================== */
    // if (input.status !== undefined) {
    //   const statusRecord = await this.picklistRepo.findOne({
    //     where: {
    //       picklistCode: "BEAT_STATUS",
    //       value: input.status,
    //       isDeleted: false,
    //     },
    //   });

    //   if (!statusRecord) {
    //     return {
    //       status: STATUSCODES.BAD_REQUEST,
    //       message: "Invalid status",
    //       data: null,
    //     };
    //   }

    //   beat.status = statusRecord.value;
    // }

    /* =====================================================
     4️⃣ LOCATION VALIDATION
    ===================================================== */
    if (input.countryId !== undefined) {
      const country = await this.countryRepo.findOne({
        where: { countryId: input.countryId, deletedAt: IsNull() },
      });

      if (!country) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Invalid country",
          data: null,
        };
      }

      beat.countryId = input.countryId;
    }

    if (input.stateId !== undefined) {
      const state = await this.stateRepo.findOne({
        where: {
          stateId: input.stateId,
          country: { countryId: input.countryId || beat.countryId },
          isDeleted: false,
        },
      });

      if (!state) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Invalid state",
          data: null,
        };
      }

      beat.stateId = input.stateId;
    }

    if (input.districtId !== undefined) {
      const district = await this.districtRepo.findOne({
        where: {
          districtId: input.districtId,
          state: { stateId: input.stateId || beat.stateId },
          isDeleted: false,
        },
      });

      if (!district) {
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "Invalid district",
          data: null,
        };
      }

      beat.districtId = input.districtId;
    }

    /* =====================================================
     5️⃣ TIME VALIDATION
    ===================================================== */
    const startTime = input.plannedStartTime ?? beat.plannedStartTime;
    const endTime = input.plannedEndTime ?? beat.plannedEndTime;

    if (startTime && endTime && endTime <= startTime) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "End time must be greater than start time",
        data: null,
      };
    }

    if (input.plannedStartTime !== undefined) {
      beat.plannedStartTime = input.plannedStartTime;
    }

    if (input.plannedEndTime !== undefined) {
      beat.plannedEndTime = input.plannedEndTime;
    }

    /* =====================================================
     6️⃣ SAFE FIELD UPDATES
    ===================================================== */
    if (input.beatType !== undefined) beat.beatType = input.beatType;
    if (input.visitFrequency !== undefined) beat.visitFrequency = input.visitFrequency;
    if (input.defaultVisitDays !== undefined) beat.defaultVisitDays = input.defaultVisitDays;
    if (input.priority !== undefined) beat.priority = input.priority;

    if (input.area !== undefined) beat.area = input.area?.trim() || undefined;
    if (input.zone !== undefined) beat.zone = input.zone?.trim() || undefined;

    if (input.startLat !== undefined) beat.startLat = input.startLat;
    if (input.startLng !== undefined) beat.startLng = input.startLng;
    if (input.endLat !== undefined) beat.endLat = input.endLat;
    if (input.endLng !== undefined) beat.endLng = input.endLng;



    /* =====================================================
     8️⃣ SAVE
    ===================================================== */
    const updatedBeat = await this.beatRepositry.save(beat);

    /* =====================================================
     9️⃣ CUSTOMER CHANNEL
    ===================================================== */
    const customer = await this.customerRepo.findOne({
      select: ["channelType"],
      where: { customerId: updatedBeat.customerId, isDeleted: false },
    });

    return {
      status: STATUSCODES.SUCCESS,
      message: "Beat updated successfully",
      data: {
        ...updatedBeat,
        channel: customer?.channelType ?? null,
      },
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
      

      if (input.isDeleted !== undefined) {
  query.andWhere("beat.isDeleted = :isDeleted", {
    isDeleted: input.isDeleted,
  });
} else {
  query.andWhere("beat.isDeleted = false");
}
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