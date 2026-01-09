import { STATUSCODES} from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { CreatePriceBookDto,UpdatePriceBookDto,DeletePriceBookDto,GetPriceBookDto,GetPriceBookByIdDto } from "../../../../core/types/PriceBookService/PriceBookService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { PriceBook, PriceBookRepository } from "../../../../core/DB/Entities/priceBook.entity";
 import { Customer } from "../../../../core/DB/Entities/customer.entity";
 import { CustomerType } from "../../../../core/DB/Entities/customerType.entity";
import { Country } from "../../../../core/DB/Entities/country.entity";
import { State } from "../../../../core/DB/Entities/state.entity";
import { District } from "../../../../core/DB/Entities/district.entity";
import { Beat } from "../../../../core/DB/Entities/beat.entity";



  import { Channel, CurrencyType , PriceBookType , PriorityType, PriceBookStatus, ApprovalStatus } from "../../../../core/types/Constent/common";

class PriceBookController {
    private priceBookRepo = PriceBookRepository();
    private customerRepo = Customer.getRepository();
    private districtRepo = District.getRepository();
   private countryRepo = Country.getRepository();
   private stateRepo = State.getRepository();
   private beatRepo = Beat.getRepository();
   private customerTypeRepo = CustomerType.getRepository(); 
  

    constructor() { }

async createPriceBook(input: CreatePriceBookDto, payload: IUser): Promise<IApiResponse> {
  try {
    // ================== 1️⃣ Fetch customer + location info ==================
    const customer = await this.customerRepo.findOne({
      select: ["customerId", "customerName", "channelType"],
      where: { customerId: input.customerId },
    });
    if (!customer) {
      return { status: STATUSCODES.BAD_REQUEST, message: "Customer not found", data: null };
    }

    const country = await this.countryRepo.findOne({ where: { countryId: input.countryId } });
    if (!country) return { status: STATUSCODES.BAD_REQUEST, message: "Country not found", data: null };

    const state = await this.stateRepo.findOne({ where: { stateId: input.stateId } });
    if (!state) return { status: STATUSCODES.BAD_REQUEST, message: "State not found", data: null };

    const district = await this.districtRepo.findOne({ where: { districtId: input.districtId } });
    if (!district) return { status: STATUSCODES.BAD_REQUEST, message: "District not found", data: null };

    const beat = input.beatRouteId
      ? await this.beatRepo.findOne({ where: { beatId: input.beatRouteId } })
      : null;

    // ================== 2️⃣ Create PriceBook ==================
    const priceBook = new PriceBook();
    priceBook.tenantId = input.tenantId;
    priceBook.priceBookCode = input.priceBookCode;
    priceBook.priceBookName = input.priceBookName;
    priceBook.priceBookType = input.priceBookType;
    priceBook.Channel = input.Channel;
    priceBook.customer = customer;
    priceBook.country = country;
    priceBook.state = state;
    priceBook.district = district;
    priceBook.beatRoute = beat ?? undefined;
    priceBook.currency = input.currency;
    priceBook.priority = input.priority;
    priceBook.effectiveFrom = input.effectiveFrom;
    priceBook.effectiveTo = input.effectiveTo;
    priceBook.createdBy = payload.emp_id;
    // priceBook.approvedBy = input.approvedBy;
    // priceBook.approvedAt = input.approvedAt;
    priceBook.version = input.version?? 1;
    priceBook.status = input.status?? PriceBookStatus.DRAFT;
    priceBook.approvalStatus = input.approvalStatus?? ApprovalStatus.PENDING;

    const savedPriceBook = await PriceBookRepository().save(priceBook);

    // ================== 3️⃣ Flattened response ==================
    const response = {
      priceBookId: savedPriceBook.priceBookId,
      priceBookCode: savedPriceBook.priceBookCode,
      priceBookName: savedPriceBook.priceBookName,
      priceBookType: savedPriceBook.priceBookType,
      Channel: savedPriceBook.Channel,
      customerName: customer.customerName,
    //   channel: customer.channelType,
      countryId: country.countryId,
      stateId: state.stateId,
      districtId: district.districtId,
      beatRouteId: beat?.beatId ?? null,
      currency: savedPriceBook.currency,
      priority: savedPriceBook.priority,
      effectiveFrom: savedPriceBook.effectiveFrom,
      effectiveTo: savedPriceBook.effectiveTo,
      createdBy: savedPriceBook.createdBy,
      createdAt: savedPriceBook.createdAt,
      updatedAt: savedPriceBook.updatedAt,
        version: savedPriceBook.version,
        status: savedPriceBook.status,
        approvalStatus: savedPriceBook.approvalStatus,

    };

    return { status: STATUSCODES.SUCCESS, message: "PriceBook created successfully", data: response };
  } catch (error) {
    throw error;
  }
}


async updatePriceBook(input: UpdatePriceBookDto, payload: IUser): Promise<IApiResponse> {
  try {
    const { priceBookId, ...updateData } = input;

    // 1️⃣ Find existing price book
    const priceBook = await this.priceBookRepo.findOne({
      where: { priceBookId },
      relations: ["customer", "customerType", "country", "state", "district", "beatRoute"]
    });

    if (!priceBook) {
      return { status: STATUSCODES.NOT_FOUND, message: "Price book not found", data: null };
    }

    // 2️⃣ Validate & update customer
    if (updateData.customerId) {
      const customer = await this.customerRepo.findOne({
        select: ["customerId", "customerName", "channelType"],
        where: { customerId: updateData.customerId }
      });
      if (!customer) return { status: STATUSCODES.BAD_REQUEST, message: "Customer not found", data: null };

      // Optional: channel must match
      if (updateData.Channel && updateData.Channel !== customer.channelType) {
        return { status: STATUSCODES.BAD_REQUEST, message: "PriceBook channel must match customer channel", data: null };
      }

      priceBook.customer = customer;
    }

    // 3️⃣ Customer Type
    if (updateData.customerTypeId) {
      const customerType = await this.customerTypeRepo.findOne({ where: { customerTypeId: updateData.customerTypeId } });
      if (!customerType) return { status: STATUSCODES.BAD_REQUEST, message: "Customer type not found", data: null };
      priceBook.customerType = customerType;
    }

    // 4️⃣ Geography
    if (updateData.countryId) {
      const country = await this.countryRepo.findOne({ where: { countryId: updateData.countryId } });
      if (!country) return { status: STATUSCODES.BAD_REQUEST, message: "Country not found", data: null };
      priceBook.country = country;
    }

    if (updateData.stateId) {
      const state = await this.stateRepo.findOne({ where: { stateId: updateData.stateId } });
      if (!state) return { status: STATUSCODES.BAD_REQUEST, message: "State not found", data: null };
      priceBook.state = state;
    }

    if (updateData.districtId) {
      const district = await this.districtRepo.findOne({ where: { districtId: updateData.districtId } });
      if (!district) return { status: STATUSCODES.BAD_REQUEST, message: "District not found", data: null };
      priceBook.district = district;
    }

    if (updateData.beatRouteId) {
      const beat = await this.beatRepo.findOne({ where: { beatId: updateData.beatRouteId } });
      if (!beat) return { status: STATUSCODES.BAD_REQUEST, message: "Beat route not found", data: null };
      priceBook.beatRoute = beat;
    }

    // 5️⃣ Basic fields
    if (updateData.priceBookCode) priceBook.priceBookCode = updateData.priceBookCode;
    if (updateData.priceBookName) priceBook.priceBookName = updateData.priceBookName;
    if (updateData.priceBookType) priceBook.priceBookType = updateData.priceBookType;
    if (updateData.Channel) priceBook.Channel = updateData.Channel;

    // 6️⃣ Currency & priority
    if (updateData.currency) priceBook.currency = updateData.currency;
    if (updateData.priority) priceBook.priority = updateData.priority;

    // 7️⃣ Validity
    if (updateData.effectiveFrom) priceBook.effectiveFrom = updateData.effectiveFrom;
    if (updateData.effectiveTo) priceBook.effectiveTo = updateData.effectiveTo;

    // 8️⃣ Lifecycle / Governance
    if (updateData.status) priceBook.status = updateData.status;
    if (updateData.approvalStatus) priceBook.approvalStatus = updateData.approvalStatus;
    // if (updateData.approvedBy) priceBook.approvedBy = updateData.approvedBy;
    // if (updateData.approvedAt) priceBook.approvedAt = updateData.approvedAt;

    // 9️⃣ Version bump
    priceBook.version = 1;

    const updatedPriceBook = await this.priceBookRepo.save(priceBook);
 
    // 10️⃣ Flattened response
    const response = {
      priceBookId: updatedPriceBook.priceBookId,
      tenantId: updatedPriceBook.tenantId,
      priceBookCode: updatedPriceBook.priceBookCode,
      priceBookName: updatedPriceBook.priceBookName,
      priceBookType: updatedPriceBook.priceBookType,
      Channel: updatedPriceBook.Channel,
      customerName: updatedPriceBook.customer?.customerName ?? null,
    //   channel: updatedPriceBook.customer?.channelType ?? null,
      customerTypeId: updatedPriceBook.customerType?.customerTypeId ?? null,
      countryId: updatedPriceBook.country?.countryId ?? null,
      stateId: updatedPriceBook.state?.stateId ?? null,
      districtId: updatedPriceBook.district?.districtId ?? null,
      beatRouteId: updatedPriceBook.beatRoute?.beatId ?? null,
      currency: updatedPriceBook.currency,
      priority: updatedPriceBook.priority,
      effectiveFrom: updatedPriceBook.effectiveFrom,
      effectiveTo: updatedPriceBook.effectiveTo,
      version: updatedPriceBook.version,
      status: updatedPriceBook.status,
      approvalStatus: updatedPriceBook.approvalStatus,
      // approvedBy: updatedPriceBook.approvedBy ?? null,
      // approvedAt: updatedPriceBook.approvedAt ?? null,
      createdBy: updatedPriceBook.createdBy,
      createdAt: updatedPriceBook.createdAt,
      updatedAt: updatedPriceBook.updatedAt,
    };

    return { status: STATUSCODES.SUCCESS, message: "Price book updated successfully", data: response };
  } catch (error) {
    throw error;
  }
}

async deletePriceBook(
  input: DeletePriceBookDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const { priceBookId } = input;

    const priceBook = await this.priceBookRepo.findOne({
      where: {
        priceBookId,
        isDeleted: false
      }
    });

    if (!priceBook) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Price book not found",
        data: null
      };
    }

    await this.priceBookRepo.update(
      { priceBookId },
      { isDeleted: true }
    );

    return {
      status: STATUSCODES.SUCCESS,
      message: "Price book deleted successfully",
      data: null
    };
  } catch (error) {
    throw error;
  }
}

async listPriceBooks(input: GetPriceBookDto, payload: IUser): Promise<IApiResponse> {
  try {
    const query = this.priceBookRepo
      .createQueryBuilder("pb")
      .leftJoinAndSelect("pb.customer", "customer")
      .leftJoinAndSelect("pb.customerType", "customerType")
      .leftJoinAndSelect("pb.country", "country")
      .leftJoinAndSelect("pb.state", "state")
      .leftJoinAndSelect("pb.district", "district")
      .leftJoinAndSelect("pb.beatRoute", "beatRoute")
      .where("pb.isDeleted = false");

    // 🔍 Filters (price_book fields)
    if (input.priceBookId) query.andWhere("pb.priceBookId = :priceBookId", { priceBookId: input.priceBookId });
    if (input.priceBookCode) query.andWhere("LOWER(pb.priceBookCode) LIKE :priceBookCode", { priceBookCode: `%${input.priceBookCode.toLowerCase()}%` });
    if (input.priceBookName) query.andWhere("LOWER(pb.priceBookName) LIKE :priceBookName", { priceBookName: `%${input.priceBookName.toLowerCase()}%` });
    if (input.priceBookType) query.andWhere("pb.priceBookType = :priceBookType", { priceBookType: input.priceBookType });
    if (input.Channel) query.andWhere("pb.Channel = :Channel", { Channel: input.Channel });
    if (input.currency) query.andWhere("pb.currency = :currency", { currency: input.currency });
    if (input.priority) query.andWhere("pb.priority = :priority", { priority: input.priority });
    if (input.status) query.andWhere("pb.status = :status", { status: input.status });
    if (input.approvalStatus) query.andWhere("pb.approvalStatus = :approvalStatus", { approvalStatus: input.approvalStatus });

    // 📅 Date filters
    if (input.effectiveFrom) query.andWhere("pb.effectiveFrom >= :effectiveFrom", { effectiveFrom: input.effectiveFrom });
    if (input.effectiveTo) query.andWhere("pb.effectiveTo <= :effectiveTo", { effectiveTo: input.effectiveTo });

    // 🔢 Sorting
    query.orderBy("pb.priceBookId", "DESC");

    const priceBooks = await query.getMany();

    // 🔄 Map to flattened response
    const data = priceBooks.map(pb => ({
      priceBookId: pb.priceBookId,
      tenantId: pb.tenantId,
      priceBookCode: pb.priceBookCode,
      priceBookName: pb.priceBookName,
      priceBookType: pb.priceBookType,
      Channel: pb.Channel,
      customerName: pb.customer?.customerName ?? null,
    //   channel: pb.customer?.channelType ?? null,
      customerTypeId: pb.customerType?.customerTypeId ?? null,
      countryId: pb.country?.countryId ?? null,
      stateId: pb.state?.stateId ?? null,
      districtId: pb.district?.districtId ?? null,
      beatRouteId: pb.beatRoute?.beatId ?? null,
      currency: pb.currency,
      priority: pb.priority,
      effectiveFrom: pb.effectiveFrom,
      effectiveTo: pb.effectiveTo,
      version: pb.version,
      status: pb.status,
      approvalStatus: pb.approvalStatus,
      // approvedBy: pb.approvedBy ?? null,
      // approvedAt: pb.approvedAt ?? null,
      createdBy: pb.createdBy,
      createdAt: pb.createdAt,
      updatedAt: pb.updatedAt,
    }));

    return {
      status: STATUSCODES.SUCCESS,
      message: "Price book list fetched successfully",
      data
    };
  } catch (error) {
    throw error;
  }
}


async getPriceBookById(input: GetPriceBookByIdDto, payload: IUser): Promise<IApiResponse> {
  try {
    const { priceBookId } = input;

    if (!priceBookId) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "PriceBook ID is required",
        data: null
      };
    }

    // Fetch price book with relations
    const priceBook = await this.priceBookRepo.createQueryBuilder("pb")
      .leftJoinAndSelect("pb.customer", "customer")
      .leftJoinAndSelect("pb.customerType", "customerType")
      .leftJoinAndSelect("pb.country", "country")
      .leftJoinAndSelect("pb.state", "state")
      .leftJoinAndSelect("pb.district", "district")
      .leftJoinAndSelect("pb.beatRoute", "beatRoute")
      .where("pb.priceBookId = :priceBookId", { priceBookId })
      .andWhere("pb.isDeleted = false")
      .getOne();

    if (!priceBook) {
      return {
        status: STATUSCODES.NOT_FOUND,
        message: "Price book not found",
        data: null
      };
    }

    // Flattened response
    const response = {
      priceBookId: priceBook.priceBookId,
      priceBookCode: priceBook.priceBookCode,
      priceBookName: priceBook.priceBookName,
      priceBookType: priceBook.priceBookType,
      Channel: priceBook.Channel,
      customerName: priceBook.customer?.customerName ?? null,
    //   channel: priceBook.customer?.channelType ?? null,
      customerTypeId: priceBook.customerType?.customerTypeId ?? null,
      countryId: priceBook.country?.countryId ?? null,
      stateId: priceBook.state?.stateId ?? null,
      districtId: priceBook.district?.districtId ?? null,
      beatRouteId: priceBook.beatRoute?.beatId ?? null,
      currency: priceBook.currency,
      priority: priceBook.priority,
      effectiveFrom: priceBook.effectiveFrom,
      effectiveTo: priceBook.effectiveTo,
      version: priceBook.version,
      status: priceBook.status,
      approvalStatus: priceBook.approvalStatus,
      // approvedBy: priceBook.approvedBy ?? null,
      // approvedAt: priceBook.approvedAt ?? null,
      createdBy: priceBook.createdBy,
      createdAt: priceBook.createdAt,
      updatedAt: priceBook.updatedAt
    };

    return {
      status: STATUSCODES.SUCCESS,
      message: "Price book fetched successfully",
      data: response
    };
  } catch (error) {
    throw error;
  }
}

}

export { PriceBookController as PriceBookService }