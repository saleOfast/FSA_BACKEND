import { STATUSCODES} from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { DeleteShippingAddressDto,GetAllShippingAddressDto, GetShippingAddressByIdDto,UpdateShippingAddressDto, CreateShippingAddressDto} from "../../../../core/types/ShippingAddressService/shippingAddressService"
import { IUser } from "../../../../core/types/AuthService/AuthService";

 import { Customer } from "../../../../core/DB/Entities/customer.entity";

import { Country } from "../../../../core/DB/Entities/country.entity";
import { State } from "../../../../core/DB/Entities/state.entity";
import { District } from "../../../../core/DB/Entities/district.entity";
import {ItemShippingAddress, ShippingAddressRepository} from "../../../../core/DB/Entities/shippingAddress.entity"
import { promises } from "dns";
import { IsNull,Not } from "typeorm";


class ShippingAddress{

     private customerRepo = Customer.getRepository();
    private districtRepo = District.getRepository();
   private countryRepo = Country.getRepository();
   private stateRepo = State.getRepository();
   private repo=ItemShippingAddress.getRepository();

      constructor() { }

async createShippingAddress(
  input: CreateShippingAddressDto,
  payload: IUser
): Promise<IApiResponse> {
  try {

      const street = input.shippingStreet?.trim().toLowerCase();
    const city = input.shippingCity?.trim().toLowerCase();
    const receiverName = input.receiverName?.trim().toLowerCase();

    if (!receiverName) {
      return { status: 400, message: "Receiver name is required", data: null };
    }

    if (!street || !city) {
      return { status: 400, message: "Street and city are required", data: null };
    }

    // ================= Customer Validation =================
    const customer = await this.customerRepo.findOne({
      where: { customerId: input.customerId,isDeleted:false },
    });
    if (!customer) {
      return { status: 400, message: "Customer not found", data: null };
    }

    // ================= Country Validation =================
    const country = await this.countryRepo.findOne({
      where: { countryId: input.shippingCountryId ,deletedAt:IsNull()},
    });
    if (!country) {
      return { status: 400, message: "Invalid shipping country", data: null };
    }

    // ================= State Validation =================
    const state = await this.stateRepo.findOne({
      where: { stateId: input.shippingStateId,
        countryId: input.shippingCountryId,
        isDeleted: false
       },
    });
    if (!state) {
      return { status: 400, message: "Invalid shipping state", data: null };
    }

    // ================= District Validation =================
    const district = await this.districtRepo.findOne({
      where: { districtId: input.shippingDistrictId,
        stateId: input.shippingStateId,
        isDeleted: false
       },
    });
    if (!district) {
      return { status: 400, message: "Invalid shipping district", data: null };
    }

    const existingAddress=await this.repo.findOne({
      where:{
        customerId:input.customerId,
        shippingStreet:street,
        shippingCity:city,
        shippingPinCode:input.shippingPinCode,
        isDeleted:false
      }

    });
    if(existingAddress){
      return{
        status:400,
        message:"A shipping address with the same street, city, and pin code already exists for this customer",
        data:null
      }
    }
    // ================= Create Address =================
    const repo = ShippingAddressRepository();

    const shippingAddress = repo.create({
      customerId: input.customerId,
      shippingCountryId: input.shippingCountryId,
      shippingStateId: input.shippingStateId,
      shippingDistrictId: input.shippingDistrictId,
      shippingStreet: input.shippingStreet,
      shippingCity: input.shippingCity,
      shippingPinCode: input.shippingPinCode,
      deliveryTimeSlot: input.deliveryTimeSlot,
      preferredDays: input.preferredDays,
      receiverName: input.receiverName,
      receiverContactNo: input.receiverContactNo,
      isDeleted: false,
    // if audit fields exist
    });

    const savedAddress = await repo.save(shippingAddress);

    return {
      status: 201,
      message: "Shipping address created successfully",
      data: savedAddress,
    };
  } catch (error) {
  throw error;
  }
}


async getShippingAddressById(
  input: GetShippingAddressByIdDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const { addressId } = input;

    if (!addressId) {
      return {
        status: 400,
        message: "addressId is required",
        data: null,
      };
    }

    // Fetch the shipping address
    const address = await this.repo.createQueryBuilder("address")
      .leftJoinAndSelect("address.customer", "customer")
      .leftJoinAndSelect("address.shippingCountry", "country")
      .leftJoinAndSelect("address.shippingState", "state")
      .leftJoinAndSelect("address.shippingDistrict", "district")
      .where("address.addressId = :addressId", { addressId })
      .andWhere("address.isDeleted = false")
      .getOne();

    if (!address) {
      return {
        status: 404,
        message: "Shipping address not found",
        data: null,
      };
    }

    // Return structured response
    return {
      status: 200,
      message: "Shipping address fetched successfully",
      data: {
        addressId: address.addressId,
        customerId: address.customerId,
        shippingCountryId: address.shippingCountryId,
        shippingStateId: address.shippingStateId,
        shippingDistrictId: address.shippingDistrictId,
        shippingStreet: address.shippingStreet,
        shippingCity: address.shippingCity,
        shippingPinCode: address.shippingPinCode,
        deliveryTimeSlot: address.deliveryTimeSlot,
        preferredDays: address.preferredDays,
        receiverName: address.receiverName,
        receiverContactNo: address.receiverContactNo,
        isDeleted: address.isDeleted,
       
      },
    };
  } catch (error) {
    throw error;
  }
}
async getAllShippingAddresse(
  input: GetAllShippingAddressDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const query = this.repo.createQueryBuilder("address")
      .leftJoinAndSelect("address.customer", "customer")
      .leftJoinAndSelect("address.shippingCountry", "country")
      .leftJoinAndSelect("address.shippingState", "state")
      .leftJoinAndSelect("address.shippingDistrict", "district")
      // ✅ always exclude deleted
      .where("address.isDeleted = :isDeleted", { isDeleted: false });

    if (input.customerId)
      query.andWhere("address.customerId = :customerId", { customerId: input.customerId });

    if (input.shippingCountryId)
      query.andWhere("address.shippingCountryId = :countryId", { countryId: input.shippingCountryId });

    if (input.shippingStateId)
      query.andWhere("address.shippingStateId = :stateId", { stateId: input.shippingStateId });

    if (input.shippingDistrictId)
      query.andWhere("address.shippingDistrictId = :districtId", { districtId: input.shippingDistrictId });

    if (input.preferredDays)
      query.andWhere("address.preferredDays = :preferredDays", { preferredDays: input.preferredDays });

    const addresses = await query.getMany();

    if (!addresses.length) {
      return {
        status: 404,
        message: "Shipping address not found",
        data: [],
      };
    }

    return {
      status: 200,
      message: "Shipping addresses fetched successfully",
      data: addresses.map(address => ({
        addressId: address.addressId,
        customerId: address.customerId,
        shippingCountryId: address.shippingCountryId,
        shippingStateId: address.shippingStateId,
        shippingDistrictId: address.shippingDistrictId,
        shippingStreet: address.shippingStreet,
        shippingCity: address.shippingCity,
        shippingPinCode: address.shippingPinCode,
        deliveryTimeSlot: address.deliveryTimeSlot,
        preferredDays: address.preferredDays,
        receiverName: address.receiverName,
        receiverContactNo: address.receiverContactNo,
        isDeleted: address.isDeleted,
      })),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}


async updateShippingAddress(
  input: UpdateShippingAddressDto,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const { addressId, ...updateData } = input;

    /* =====================================================
     1️⃣ VALIDATE ID
    ===================================================== */
    if (!addressId || isNaN(addressId)) {
      return { status: 400, message: "Invalid addressId", data: null };
    }

    if (Object.keys(updateData).length === 0) {
      return { status: 400, message: "No fields provided", data: null };
    }

    /* =====================================================
     2️⃣ FIND EXISTING
    ===================================================== */
    const shippingAddress = await this.repo.findOne({
      where: { addressId, isDeleted: false },
    });

    if (!shippingAddress) {
      return { status: 404, message: "Shipping address not found", data: null };
    }

    /* =====================================================
     3️⃣ SANITIZATION (Bug fix)
    ===================================================== */
    if (updateData.shippingCity) {
      updateData.shippingCity = updateData.shippingCity.trim();
    }

    if (updateData.shippingStreet) {
      updateData.shippingStreet = updateData.shippingStreet.trim();
    }

    if (updateData.receiverName !== undefined) {
      const name = updateData.receiverName.trim();
      if (!name) {
        return { status: 400, message: "Receiver name cannot be empty" };
      }
      updateData.receiverName = name;
    }

    /* =====================================================
     4️⃣ FK + RELATION VALIDATION (CRITICAL FIX)
    ===================================================== */

    const countryId =
      updateData.shippingCountryId ?? shippingAddress.shippingCountryId;

    const stateId =
      updateData.shippingStateId ?? shippingAddress.shippingStateId;

    const districtId =
      updateData.shippingDistrictId ?? shippingAddress.shippingDistrictId;

    // COUNTRY
    const country = await this.countryRepo.findOne({
      where: { countryId },
    });
    if (!country) {
      return { status: 400, message: "Invalid country" };
    }

    // STATE (belongs to country)
    const state = await this.stateRepo.findOne({
      where: {
        stateId,
        countryId,
        isDeleted: false,
      },
    });

    if (!state) {
      return {
        status: 400,
        message: "State does not belong to selected country",
      };
    }

    // DISTRICT (belongs to state)
    const district = await this.districtRepo.findOne({
      where: {
        districtId,
        stateId,
        isDeleted: false,
      },
    });

    if (!district) {
      return {
        status: 400,
        message: "District does not belong to selected state",
      };
    }

    /* =====================================================
     5️⃣ DUPLICATE CHECK
    ===================================================== */
    const existing = await this.repo.findOne({
      where: {
        addressId: Not(addressId),
        customerId: shippingAddress.customerId,
        shippingStreet:
          updateData.shippingStreet ?? shippingAddress.shippingStreet,
        shippingCity:
          updateData.shippingCity ?? shippingAddress.shippingCity,
        shippingPinCode:
          updateData.shippingPinCode ?? shippingAddress.shippingPinCode,
        isDeleted: false,
      },
    });

    if (existing) {
      return {
        status: 409,
        message: "Shipping address already exists",
      };
    }

    /* =====================================================
     6️⃣ UPDATE
    ===================================================== */
    await this.repo.update({ addressId }, updateData);

    /* =====================================================
     7️⃣ FETCH UPDATED
    ===================================================== */
    const updatedAddress = await this.repo.findOne({
      where: { addressId },
      relations: ["customer", "shippingCountry", "shippingState", "shippingDistrict"],
    });

    return {
      status: 200,
      message: "Shipping address updated successfully",
      data: updatedAddress,
    };

  } catch (error: any) {
    console.error("Update Shipping Address Error:", error);

    return {
      status: 500,
      message: "Failed to update shipping address",
      data: error.message,
    };
  }
}





async DeleteShippingAddress(input:DeleteShippingAddressDto,payload:IUser):Promise<IApiResponse>{

  try{

    const {addressId}=input;

       // ================= Find Address =================
    const shippingAddress = await this.repo.findOne({
      where: {
        addressId:input.addressId,
        isDeleted: false,
      },
    });

    if (!shippingAddress) {
      return {
        status: 404,
        message: "Shipping address not found",
        data: null,
      };
    }

    // ================= Soft Delete =================
     await this.repo.update(
      { addressId },
      { isDeleted: true }
    );


    return {
      status: 200,
      message: "Shipping address deleted successfully",
      data: null,
    };
  } catch (error) {
 throw error;
  }
}
}


export {ShippingAddress as ShippingAddressService}