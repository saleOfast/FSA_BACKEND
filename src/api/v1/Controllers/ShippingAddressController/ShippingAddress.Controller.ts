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
    // ================= Customer Validation =================
    const customer = await this.customerRepo.findOne({
      where: { customerId: input.customerId },
    });
    if (!customer) {
      return { status: 400, message: "Customer not found", data: null };
    }

    // ================= Country Validation =================
    const country = await this.countryRepo.findOne({
      where: { countryId: input.shippingCountryId },
    });
    if (!country) {
      return { status: 400, message: "Invalid shipping country", data: null };
    }

    // ================= State Validation =================
    const state = await this.stateRepo.findOne({
      where: { stateId: input.shippingStateId },
    });
    if (!state) {
      return { status: 400, message: "Invalid shipping state", data: null };
    }

    // ================= District Validation =================
    const district = await this.districtRepo.findOne({
      where: { districtId: input.shippingDistrictId },
    });
    if (!district) {
      return { status: 400, message: "Invalid shipping district", data: null };
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

    // ================= Validate addressId =================
    if (!addressId || isNaN(addressId)) {
      return {
        status: 400,
        message: "Invalid addressId",
        data: null,
      };
    }

    // ================= Prevent empty update =================
    if (Object.keys(updateData).length === 0) {
      return {
        status: 400,
        message: "No fields provided to update",
        data: null,
      };
    }

    // ================= Find existing address =================
    const shippingAddress = await this.repo.findOne({
      where: { addressId, isDeleted: false },
    });

    if (!shippingAddress) {
      return {
        status: 404,
        message: "Shipping address not found",
        data: null,
      };
    }

    // ================= Validate foreign keys =================
    if (updateData.shippingCountryId) {
      const country = await this.countryRepo.findOne({
        where: { countryId: updateData.shippingCountryId },
      });
      if (!country) {
        return { status: 400, message: "Invalid shipping country", data: null };
      }
    }

    if (updateData.shippingStateId) {
      const state = await this.stateRepo.findOne({
        where: { stateId: updateData.shippingStateId },
      });
      if (!state) {
        return { status: 400, message: "Invalid shipping state", data: null };
      }
    }

    if (updateData.shippingDistrictId) {
      const district = await this.districtRepo.findOne({
        where: { districtId: updateData.shippingDistrictId },
      });
      if (!district) {
        return { status: 400, message: "Invalid shipping district", data: null };
      }
    }

    // ================= Update =================
    await this.repo.update({ addressId }, updateData);

    // ================= Fetch updated record =================
    const updatedAddress = await this.repo.findOne({
      where: { addressId },
      relations: ["customer", "shippingCountry", "shippingState", "shippingDistrict"],
    });

    if (!updatedAddress) {
      return {
        status: 404,
        message: "Shipping address not found after update",
        data: null,
      };
    }

    // ================= Response =================
    return {
      status: 200,
      message: "Shipping address updated successfully",
      data: {
        addressId: updatedAddress.addressId,
        customerId: updatedAddress.customerId,
        customerName: updatedAddress.customer?.customerName,
        shippingCountryId: updatedAddress.shippingCountryId,
        shippingCountryName: updatedAddress.shippingCountry?.countryName,
        shippingStateId: updatedAddress.shippingStateId,
        shippingStateName: updatedAddress.shippingState?.stateName,
        shippingDistrictId: updatedAddress.shippingDistrictId,
        shippingDistrictName: updatedAddress.shippingDistrict?.districtName,
        shippingStreet: updatedAddress.shippingStreet,
        shippingCity: updatedAddress.shippingCity,
        shippingPinCode: updatedAddress.shippingPinCode,
        deliveryTimeSlot: updatedAddress.deliveryTimeSlot,
        preferredDays: updatedAddress.preferredDays,
        receiverName: updatedAddress.receiverName,
        receiverContactNo: updatedAddress.receiverContactNo,
        isDeleted: updatedAddress.isDeleted,
      },
    };
  } catch (error) {
    throw error;
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