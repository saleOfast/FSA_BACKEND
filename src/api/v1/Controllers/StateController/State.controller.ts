import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateState,
  UpdateState,
  DeleteStateById,
  GetStateById,
  StateListFilter,
  GetStatesByCountryId,
  IState
} from "../../../../core/types/StateService/StateService";
import { State, StateRepository } from "../../../../core/DB/Entities/state.entity";
import { CountryRepository } from "../../../../core/DB/Entities/country.entity";
import { IsNull } from "typeorm";

class StateController {
  private stateRepository = StateRepository();
  private countryRepository = CountryRepository();

  constructor() { }

  async createState(input: CreateState, payload: IUser): Promise<IApiResponse> {
    try {
      const {  countryId } = input;

      const stateName = input.stateName.trim().toLowerCase();

      if(!stateName){
        return {
          status: STATUSCODES.BAD_REQUEST,
          message: "State name cannot be empty or whitespace."
        }
      }

          if (!countryId) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "CountryId is required"
      };
    }
      // Validate country exists
      const country = await this.countryRepository.findOne({
        where: { countryId, deletedAt: IsNull() }
      });

      if (!country) {
        return { message: "Country not found", status: STATUSCODES.NOT_FOUND };
      }

      // Check for duplicate state name in the same country
      const existingState = await this.stateRepository.findOne({
        where: { stateName, countryId ,isDeleted: false}
        
      });

      if (existingState) {
        return { message: "State with this name already exists in the selected country", status: STATUSCODES.BAD_REQUEST };
      }

      const newState = new State();
      newState.stateName = stateName;
      newState.countryId = countryId;
      newState.country = country;

      const savedState = await this.stateRepository.save(newState);

      // Load country relation for response
      // const stateWithCountry = await this.stateRepository.findOne({
      //   where: { stateId: savedState.stateId },
      //   relations: ['country']
      // });

      return {
        status: STATUSCODES.SUCCESS,
        message: "State created successfully.",
        data:savedState
      };
    } catch (error:any) {
      console.error("Create State Error:", error);
        if (error.code === "23505") {
      return {
        status: STATUSCODES.CONFLICT,
        message: "State already exists in this country"
      };
    }
      throw error;
    }
  }

  async updateState(input: UpdateState, payload: IUser): Promise<IApiResponse> {
    try {
      const { stateId, stateName, countryId } = input;

      const state = await this.stateRepository.findOne({
        where: { stateId: Number(stateId) }
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

      // Check for duplicate state name in the same country (excluding current state)
      if (stateName !== state.stateName || countryId !== state.countryId) {
        const existingState = await this.stateRepository.findOne({
          where: { stateName, countryId }
        });
        if (existingState && existingState.stateId !== Number(stateId)) {
          return { message: "State with this name already exists in the selected country", status: STATUSCODES.BAD_REQUEST };
        }
      }

      state.stateName = stateName;
      state.countryId = countryId;
      const updatedState = await this.stateRepository.save(state);

      // Load country relation for response
      const stateWithCountry = await this.stateRepository.findOne({
        where: { stateId: updatedState.stateId },
        relations: ['country']
      });

      return {
        status: STATUSCODES.SUCCESS,
        message: "State updated successfully.",
        data: stateWithCountry
      };
    } catch (error) {
      console.error("Update State Error:", error);
      throw error;
    }
  }

  async deleteState(input: DeleteStateById): Promise<IApiResponse> {
    try {
      const { stateId } = input;

      const state = await this.stateRepository.findOne({
        where: { stateId: Number(stateId) }
      });

      if (!state) {
        return { message: "State not found", status: STATUSCODES.NOT_FOUND };
      }

    state.isDeleted = true;

    await this.stateRepository.save(state);

      return { message: "State deleted successfully", status: STATUSCODES.SUCCESS };
    } catch (error) {
      console.error("Delete State Error:", error);
      throw error;
    }
  }

  async getStateById(input: GetStateById): Promise<IApiResponse> {
    try {
      const { stateId } = input;

      const state = await this.stateRepository.findOne({
        where: { stateId: Number(stateId) ,  isDeleted: false  },
        relations: ['country']
      });

      if (!state) {
        return { message: "State not found", status: STATUSCODES.NOT_FOUND };
      }

      return {
        status: STATUSCODES.SUCCESS,
        message: "Success.",
        data: state
      };
    } catch (error) {
      console.error("Get State Error:", error);
      throw error;
    }
  }

  async stateList(input: StateListFilter, payload: IUser): Promise<IApiResponse> {
    try {
      const { search, countryId, pageNumber, pageSize } = input;

      const queryBuilder = this.stateRepository.createQueryBuilder('state')
        .leftJoinAndSelect('state.country', 'country')
        .where('country.deletedAt IS NULL')
         .andWhere('state.isDeleted = false'); 

      if (search) {
        queryBuilder.andWhere(
          `(LOWER(state.stateName) LIKE LOWER(:search) OR 
           LOWER(country.countryName) LIKE LOWER(:search) OR
           CAST(state.stateId AS TEXT) LIKE :search)`,
          { search: `%${search}%` }
        );
      }

      if (countryId !== undefined && countryId !== null) {
        queryBuilder.andWhere('state.countryId = :countryId', { countryId });
      }

      queryBuilder.orderBy('state.createdAt', 'DESC')
        .skip((+pageNumber - 1) * +pageSize)
        .take(+pageSize);

      const [states, total] = await queryBuilder.getManyAndCount();

      return {
        status: STATUSCODES.SUCCESS,
        message: "Success.",
        data: {
          states,
          pagination: {
            pageNumber: +pageNumber,
            pageSize: +pageSize,
            totalRecords: total
          }
        }
      };
    } catch (error) {
      console.error("State List Error:", error);
      throw error;
    }
  }

  async getStatesByCountryId(input: GetStatesByCountryId): Promise<IApiResponse> {
    try {
      const { countryId } = input;

      // Validate country exists
      const country = await this.countryRepository.findOne({
        where: { countryId: Number(countryId), deletedAt: IsNull() }
      });

      if (!country) {
        return { message: "Country not found", status: STATUSCODES.NOT_FOUND };
      }

      // Get all states for the country
      const states = await this.stateRepository.find({
        where: { countryId: Number(countryId) },
        relations: ['country'],
        order: { stateName: 'ASC' }
      });

      return {
        status: STATUSCODES.SUCCESS,
        message: "Success.",
        data: states
      };
    } catch (error) {
      console.error("Get States By Country ID Error:", error);
      throw error;
    }
  }
}

export { StateController as StateService };

