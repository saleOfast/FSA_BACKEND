import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateCountry,
  UpdateCountry,
  DeleteCountryById,
  GetCountryById,
  CountryListFilter,
  ICountry
} from "../../../../core/types/CountryService/CountryService";
import { Country, CountryRepository } from "../../../../core/DB/Entities/country.entity";
import { IsNull } from "typeorm";

class CountryController {
  private countryRepository = CountryRepository();

  constructor() { }

  async createCountry(input: CreateCountry, payload: IUser): Promise<IApiResponse> {
    try {
      const { countryName } = input;

      // Check for duplicate name
      const existingCountry = await this.countryRepository.findOne({
        where: { countryName, deletedAt: IsNull() }
      });

      if (existingCountry) {
        return { message: "Country with this name already exists", status: STATUSCODES.BAD_REQUEST };
      }

      const newCountry = new Country();
      newCountry.countryName = countryName;

      const savedCountry = await this.countryRepository.save(newCountry);

      return {
        status: STATUSCODES.SUCCESS,
        message: "Country created successfully.",
        data: savedCountry
      };
    } catch (error) {
      console.error("Create Country Error:", error);
      throw error;
    }
  }

  async updateCountry(input: UpdateCountry, payload: IUser): Promise<IApiResponse> {
    try {
      const { countryId, countryName } = input;

      const country = await this.countryRepository.findOne({
        where: { countryId: Number(countryId), deletedAt: IsNull() }
      });

      if (!country) {
        return { message: "Country not found", status: STATUSCODES.NOT_FOUND };
      }

      // Check for duplicate name (excluding current country)
      if (countryName !== country.countryName) {
        const existingCountry = await this.countryRepository.findOne({
          where: { countryName, deletedAt: IsNull() }
        });
        if (existingCountry && existingCountry.countryId !== Number(countryId)) {
          return { message: "Country with this name already exists", status: STATUSCODES.BAD_REQUEST };
        }
      }

      country.countryName = countryName;
      const updatedCountry = await this.countryRepository.save(country);

      return {
        status: STATUSCODES.SUCCESS,
        message: "Country updated successfully.",
        data: updatedCountry
      };
    } catch (error) {
      console.error("Update Country Error:", error);
      throw error;
    }
  }

  async deleteCountry(input: DeleteCountryById): Promise<IApiResponse> {
    try {
      const { countryId } = input;

      const country = await this.countryRepository.findOne({
        where: { countryId: Number(countryId), deletedAt: IsNull() }
      });

      if (!country) {
        return { message: "Country not found", status: STATUSCODES.NOT_FOUND };
      }

      // Soft delete
      await this.countryRepository.softDelete({ countryId: Number(countryId) });

      return { message: "Country deleted successfully", status: STATUSCODES.SUCCESS };
    } catch (error) {
      console.error("Delete Country Error:", error);
      throw error;
    }
  }

  async getCountryById(input: GetCountryById): Promise<IApiResponse> {
    try {
      const { countryId } = input;

      const country = await this.countryRepository.findOne({
        where: { countryId: Number(countryId), deletedAt: IsNull() }
      });

      if (!country) {
        return { message: "Country not found", status: STATUSCODES.NOT_FOUND };
      }

      return {
        status: STATUSCODES.SUCCESS,
        message: "Success.",
        data: country
      };
    } catch (error) {
      console.error("Get Country Error:", error);
      throw error;
    }
  }

  async countryList(input: CountryListFilter, payload: IUser): Promise<IApiResponse> {
    try {
      const { search, pageNumber, pageSize } = input;

      const queryBuilder = this.countryRepository.createQueryBuilder('country')
        .where('country.deletedAt IS NULL');

      if (search) {
        queryBuilder.andWhere(
          `(LOWER(country.countryName) LIKE LOWER(:search) OR 
           CAST(country.countryId AS TEXT) LIKE :search)`,
          { search: `%${search}%` }
        );
      }

      queryBuilder.orderBy('country.createdAt', 'DESC')
        .skip((+pageNumber - 1) * +pageSize)
        .take(+pageSize);

      const [countries, total] = await queryBuilder.getManyAndCount();

      return {
        status: STATUSCODES.SUCCESS,
        message: "Success.",
        data: {
          countries,
          pagination: {
            pageNumber: +pageNumber,
            pageSize: +pageSize,
            totalRecords: total
          }
        }
      };
    } catch (error) {
      console.error("Country List Error:", error);
      throw error;
    }
  }
}

export { CountryController as CountryService };

