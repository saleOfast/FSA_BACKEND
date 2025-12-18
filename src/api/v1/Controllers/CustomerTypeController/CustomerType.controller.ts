import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateCustomerType,
  UpdateCustomerType,
  DeleteCustomerTypeById,
  GetCustomerTypeById,
  CustomerTypeListFilter,
  ICustomerType
} from "../../../../core/types/CustomerTypeService/CustomerTypeService";
import { CustomerType, CustomerTypeRepository } from "../../../../core/DB/Entities/customerType.entity";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";

class CustomerTypeController {
  private customerTypeRepository = CustomerTypeRepository();
  private userRepository = UserRepository();

  constructor() { }

  async createCustomerType(input: CreateCustomerType, payload: IUser): Promise<IApiResponse> {
    try {
      const {
        name,
        description,
        parentId,
        tradeCategory,
        canPurchase,
        canSell,
        inventoryVisibilityScope
      } = input;

      const { emp_id } = payload;

      // Check for duplicate name
      const existingCustomerType = await this.customerTypeRepository.findOne({
        where: { name, isDeleted: false }
      });

      if (existingCustomerType) {
        return { message: "Customer Type with this name already exists", status: STATUSCODES.BAD_REQUEST };
      }

      // Get user for audit fields
      const user = await this.userRepository.findOne({ 
        where: { emp_id },
        select: ['emp_id', 'firstname', 'lastname']
      });
      if (!user) {
        return { message: "User not found", status: STATUSCODES.NOT_FOUND };
      }

      // Validate parentId if provided
      if (parentId) {
        const parentCustomerType = await this.customerTypeRepository.findOne({ 
          where: { customerTypeId: parentId, isDeleted: false } 
        });
        if (!parentCustomerType) {
          return { message: "Parent Customer Type not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      const newCustomerType = new CustomerType();
      newCustomerType.name = name;
      newCustomerType.description = description;
      newCustomerType.parentId = parentId;
      newCustomerType.tradeCategory = tradeCategory;
      newCustomerType.canPurchase = canPurchase;
      newCustomerType.canSell = canSell;
      newCustomerType.inventoryVisibilityScope = inventoryVisibilityScope;

      // Set audit fields
      newCustomerType.setCreatedByUser(user);

      const savedCustomerType = await this.customerTypeRepository.save(newCustomerType);

      return {
        status: STATUSCODES.SUCCESS,
        message: "Customer Type created successfully.",
        data: savedCustomerType
      };
    } catch (error) {
      console.error("Create Customer Type Error:", error);
      throw error;
    }
  }

  async updateCustomerType(input: UpdateCustomerType, payload: IUser): Promise<IApiResponse> {
    try {
      const { customerTypeId, ...updateData } = input;
      const { emp_id } = payload;

      const customerType = await this.customerTypeRepository.findOne({
        where: { customerTypeId: Number(customerTypeId), isDeleted: false }
      });

      if (!customerType) {
        return { message: "Customer Type not found", status: STATUSCODES.NOT_FOUND };
      }

      // Check for duplicate name (excluding current customer type)
      if (updateData.name && updateData.name !== customerType.name) {
        const existingCustomerType = await this.customerTypeRepository.findOne({
          where: { name: updateData.name, isDeleted: false }
        });
        if (existingCustomerType && existingCustomerType.customerTypeId !== Number(customerTypeId)) {
          return { message: "Customer Type with this name already exists", status: STATUSCODES.BAD_REQUEST };
        }
      }

      // Get user for audit fields
      const user = await this.userRepository.findOne({ 
        where: { emp_id },
        select: ['emp_id', 'firstname', 'lastname']
      });
      if (!user) {
        return { message: "User not found", status: STATUSCODES.NOT_FOUND };
      }

      // Validate parentId if provided
      if (updateData.parentId !== undefined && updateData.parentId !== null) {
        // Prevent self-reference
        if (updateData.parentId === Number(customerTypeId)) {
          return { message: "Customer Type cannot be its own parent", status: STATUSCODES.BAD_REQUEST };
        }
        const parentCustomerType = await this.customerTypeRepository.findOne({ 
          where: { customerTypeId: updateData.parentId, isDeleted: false } 
        });
        if (!parentCustomerType) {
          return { message: "Parent Customer Type not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Update fields
      if (updateData.name) customerType.name = updateData.name;
      if (updateData.description !== undefined) customerType.description = updateData.description;
      if (updateData.parentId !== undefined) customerType.parentId = updateData.parentId;
      if (updateData.tradeCategory !== undefined) customerType.tradeCategory = updateData.tradeCategory;
      if (updateData.canPurchase !== undefined) customerType.canPurchase = updateData.canPurchase;
      if (updateData.canSell !== undefined) customerType.canSell = updateData.canSell;
      if (updateData.inventoryVisibilityScope) customerType.inventoryVisibilityScope = updateData.inventoryVisibilityScope;

      // Update audit fields
      customerType.setModifiedByUser(user);

      const updatedCustomerType = await this.customerTypeRepository.save(customerType);

      return {
        status: STATUSCODES.SUCCESS,
        message: "Customer Type updated successfully.",
        data: updatedCustomerType
      };
    } catch (error) {
      console.error("Update Customer Type Error:", error);
      throw error;
    }
  }

  async deleteCustomerType(input: DeleteCustomerTypeById): Promise<IApiResponse> {
    try {
      const { customerTypeId } = input;

      const customerType = await this.customerTypeRepository.findOne({
        where: { customerTypeId: Number(customerTypeId), isDeleted: false }
      });

      if (!customerType) {
        return { message: "Customer Type not found", status: STATUSCODES.NOT_FOUND };
      }

      // Check if there are child customer types
      const childCustomerTypes = await this.customerTypeRepository.find({
        where: { parentId: Number(customerTypeId), isDeleted: false }
      });

      if (childCustomerTypes.length > 0) {
        return { 
          message: "Cannot delete Customer Type with child types. Please remove or reassign child types first.", 
          status: STATUSCODES.BAD_REQUEST 
        };
      }

      await this.customerTypeRepository.createQueryBuilder()
        .update({ isDeleted: true })
        .where({ customerTypeId: Number(customerTypeId) })
        .execute();

      return { message: "Customer Type deleted successfully", status: STATUSCODES.SUCCESS };
    } catch (error) {
      console.error("Delete Customer Type Error:", error);
      throw error;
    }
  }

  async getCustomerTypeById(input: GetCustomerTypeById): Promise<IApiResponse> {
    try {
      const { customerTypeId } = input;

      const customerType = await this.customerTypeRepository.createQueryBuilder('customerType')
        .leftJoinAndSelect('customerType.parent', 'parent')
        .where('customerType.customerTypeId = :customerTypeId', { customerTypeId: Number(customerTypeId) })
        .andWhere('customerType.isDeleted = :isDeleted', { isDeleted: false })
        .getOne();

      if (!customerType) {
        return { message: "Customer Type not found", status: STATUSCODES.NOT_FOUND };
      }

      return {
        status: STATUSCODES.SUCCESS,
        message: "Success.",
        data: customerType
      };
    } catch (error) {
      console.error("Get Customer Type Error:", error);
      throw error;
    }
  }

  async customerTypeList(input: CustomerTypeListFilter, payload: IUser): Promise<IApiResponse> {
    try {
      const { search, tradeCategory, parentId, pageNumber, pageSize } = input;

      const queryBuilder = this.customerTypeRepository.createQueryBuilder('customerType')
        .leftJoinAndSelect('customerType.parent', 'parent')
        .where('customerType.isDeleted = :isDeleted', { isDeleted: false });

      if (search) {
        queryBuilder.andWhere(
          `(LOWER(customerType.name) LIKE LOWER(:search) OR 
           LOWER(customerType.description) LIKE LOWER(:search) OR
           CAST(customerType.customerTypeId AS TEXT) LIKE :search)`,
          { search: `%${search}%` }
        );
      }

      if (tradeCategory) {
        queryBuilder.andWhere('customerType.tradeCategory = :tradeCategory', { tradeCategory });
      }

      if (parentId !== undefined && parentId !== null) {
        queryBuilder.andWhere('customerType.parentId = :parentId', { parentId });
      }

      queryBuilder.orderBy('customerType.createdDate', 'DESC')
        .skip((+pageNumber - 1) * +pageSize)
        .take(+pageSize);

      const [customerTypes, total] = await queryBuilder.getManyAndCount();

      return {
        status: STATUSCODES.SUCCESS,
        message: "Success.",
        data: {
          customerTypes,
          pagination: {
            pageNumber: +pageNumber,
            pageSize: +pageSize,
            totalRecords: total
          }
        }
      };
    } catch (error) {
      console.error("Customer Type List Error:", error);
      throw error;
    }
  }
}

export { CustomerTypeController as CustomerTypeService };

