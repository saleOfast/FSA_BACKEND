import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateDistrict,
  UpdateDistrict,
  DeleteDistrictById,
  GetDistrictById,
  DistrictListFilter,
  GetDistrictsByStateId,
  IDistrict
} from "../../../../core/types/DistrictService/DistrictService";
import { District, DistrictRepository } from "../../../../core/DB/Entities/district.entity";
import { StateRepository } from "../../../../core/DB/Entities/state.entity";
import { CountryRepository } from "../../../../core/DB/Entities/country.entity";
import { IsNull } from "typeorm";

class DistrictController {
  private districtRepository = DistrictRepository();
  private stateRepository = StateRepository();
  private countryRepository = CountryRepository();

  constructor() { }

  async createDistrict(input: CreateDistrict, payload: IUser): Promise<IApiResponse> {
    try {
      const { districtName, stateId, countryId } = input;

      // Validate state exists
      const state = await this.stateRepository.findOne({
        where: { stateId }
      });

      if (!state) {
        return { message: "State not found", status: STATUSCODES.NOT_FOUND };
      }

      // Validate country exists
      const country = await this.countryRepository.findOne({
        where: { countryId, deletedAt: IsNull() }
      });

      if (!country) {
        return { message: "Country not found", status: STATUSCODES.NOT_FOUND };
      }

      // Validate state belongs to country
      if (state.countryId !== countryId) {
        return { message: "State does not belong to the selected country", status: STATUSCODES.BAD_REQUEST };
      }

      // Check for duplicate district name in the same state
      const existingDistrict = await this.districtRepository.findOne({
        where: { districtName, stateId }
      });

      if (existingDistrict) {
        return { message: "District with this name already exists in the selected state", status: STATUSCODES.BAD_REQUEST };
      }

      const newDistrict = new District();
      newDistrict.districtName = districtName;
      newDistrict.stateId = stateId;
      newDistrict.countryId = countryId;

      const savedDistrict = await this.districtRepository.save(newDistrict);

      // Load relations for response
      const districtWithRelations = await this.districtRepository.findOne({
        where: { districtId: savedDistrict.districtId },
        relations: ['state', 'country']
      });

      return {
        status: STATUSCODES.SUCCESS,
        message: "District created successfully.",
        data: districtWithRelations
      };
    } catch (error) {
      console.error("Create District Error:", error);
      throw error;
    }
  }

  async updateDistrict(input: UpdateDistrict, payload: IUser): Promise<IApiResponse> {
    try {
      const { districtId, districtName, stateId, countryId } = input;

      const district = await this.districtRepository.findOne({
        where: { districtId: Number(districtId) }
      });

      if (!district) {
        return { message: "District not found", status: STATUSCODES.NOT_FOUND };
      }

      // Validate state exists
      const state = await this.stateRepository.findOne({
        where: { stateId }
      });

      if (!state) {
        return { message: "State not found", status: STATUSCODES.NOT_FOUND };
      }

      // Validate country exists
      const country = await this.countryRepository.findOne({
        where: { countryId, deletedAt: IsNull() }
      });

      if (!country) {
        return { message: "Country not found", status: STATUSCODES.NOT_FOUND };
      }

      // Validate state belongs to country
      if (state.countryId !== countryId) {
        return { message: "State does not belong to the selected country", status: STATUSCODES.BAD_REQUEST };
      }

      // Check for duplicate district name in the same state (excluding current district)
      if (districtName !== district.districtName || stateId !== district.stateId) {
        const existingDistrict = await this.districtRepository.findOne({
          where: { districtName, stateId }
        });
        if (existingDistrict && existingDistrict.districtId !== Number(districtId)) {
          return { message: "District with this name already exists in the selected state", status: STATUSCODES.BAD_REQUEST };
        }
      }

      district.districtName = districtName;
      district.stateId = stateId;
      district.countryId = countryId;
      const updatedDistrict = await this.districtRepository.save(district);

      // Load relations for response
      const districtWithRelations = await this.districtRepository.findOne({
        where: { districtId: updatedDistrict.districtId },
        relations: ['state', 'country']
      });

      return {
        status: STATUSCODES.SUCCESS,
        message: "District updated successfully.",
        data: districtWithRelations
      };
    } catch (error) {
      console.error("Update District Error:", error);
      throw error;
    }
  }

  async deleteDistrict(input: DeleteDistrictById): Promise<IApiResponse> {
    try {
      const { districtId } = input;

      const district = await this.districtRepository.findOne({
        where: { districtId: Number(districtId) }
      });

      if (!district) {
        return { message: "District not found", status: STATUSCODES.NOT_FOUND };
      }

      await this.districtRepository.remove(district);

      return { message: "District deleted successfully", status: STATUSCODES.SUCCESS };
    } catch (error) {
      console.error("Delete District Error:", error);
      throw error;
    }
  }

  async getDistrictById(input: GetDistrictById): Promise<IApiResponse> {
    try {
      const { districtId } = input;

      const district = await this.districtRepository.findOne({
        where: { districtId: Number(districtId) },
        relations: ['state', 'country']
      });

      if (!district) {
        return { message: "District not found", status: STATUSCODES.NOT_FOUND };
      }

      return {
        status: STATUSCODES.SUCCESS,
        message: "Success.",
        data: district
      };
    } catch (error) {
      console.error("Get District Error:", error);
      throw error;
    }
  }

  async districtList(input: DistrictListFilter, payload: IUser): Promise<IApiResponse> {
    try {
      const { search, stateId, countryId, pageNumber, pageSize } = input;

      const queryBuilder = this.districtRepository.createQueryBuilder('district')
        .leftJoinAndSelect('district.state', 'state')
        .leftJoinAndSelect('district.country', 'country')
        .where('country.deletedAt IS NULL');

      if (search) {
        queryBuilder.andWhere(
          `(LOWER(district.districtName) LIKE LOWER(:search) OR 
           LOWER(state.stateName) LIKE LOWER(:search) OR
           LOWER(country.countryName) LIKE LOWER(:search) OR
           CAST(district.districtId AS TEXT) LIKE :search)`,
          { search: `%${search}%` }
        );
      }

      if (stateId !== undefined && stateId !== null) {
        queryBuilder.andWhere('district.stateId = :stateId', { stateId });
      }

      if (countryId !== undefined && countryId !== null) {
        queryBuilder.andWhere('district.countryId = :countryId', { countryId });
      }

      queryBuilder.orderBy('district.createdAt', 'DESC')
        .skip((+pageNumber - 1) * +pageSize)
        .take(+pageSize);

      const [districts, total] = await queryBuilder.getManyAndCount();

      return {
        status: STATUSCODES.SUCCESS,
        message: "Success.",
        data: {
          districts,
          pagination: {
            pageNumber: +pageNumber,
            pageSize: +pageSize,
            totalRecords: total
          }
        }
      };
    } catch (error) {
      console.error("District List Error:", error);
      throw error;
    }
  }

  async getDistrictsByStateId(input: GetDistrictsByStateId): Promise<IApiResponse> {
    try {
      const { stateId } = input;

      // Validate state exists
      const state = await this.stateRepository.findOne({
        where: { stateId: Number(stateId) }
      });

      if (!state) {
        return { message: "State not found", status: STATUSCODES.NOT_FOUND };
      }

      // Get all districts for the state
      const districts = await this.districtRepository.find({
        where: { stateId: Number(stateId) },
        relations: ['state', 'country'],
        order: { districtName: 'ASC' }
      });

      return {
        status: STATUSCODES.SUCCESS,
        message: "Success.",
        data: districts
      };
    } catch (error) {
      console.error("Get Districts By State ID Error:", error);
      throw error;
    }
  }
}

export { DistrictController as DistrictService };

