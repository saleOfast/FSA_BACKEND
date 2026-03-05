import { STATUSCODES } from "../../../../core/types/Constent/common";
import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import {
  CreateCustomer,
  UpdateCustomer,
  DeleteCustomerById,
  GetCustomerById,
  CustomerListFilter,
  ICustomer
} from "../../../../core/types/CustomerService/CustomerService";
import { Customer, CustomerRepository } from "../../../../core/DB/Entities/customer.entity";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { BeatRepository } from "../../../../core/DB/Entities/beat.entity";
import { WarehouseRepository,Warehouse } from "../../../../core/DB/Entities/warehouse.entity"
import { ILike } from "typeorm";

class CustomerController {
  private customerRepository = CustomerRepository();
  private userRepository = UserRepository();
  private beatRepository = BeatRepository();
  private warehouseRepository=WarehouseRepository();

  constructor() { }

  async createCustomer(input: CreateCustomer, payload: IUser): Promise<IApiResponse> {
    try {
      const {
        parentId,
        customerName,
        customerType,
        channelType,
        phone,
        email,
        accountOwnerId,
        beatRouteId,
        category,
        billingCountry,
        billingState,
        billingDistrict,
        billingStreet,
        billingCity,
        billingPinCode,
        shippingCountry,
        shippingState,
        shippingDistrict,
        shippingStreet,
        shippingCity,
        shippingPinCode,
        deliveryTimeSlot,
        preferredDays,
        gstCertificate,
        gstNo,
        businessLicense,
        panDetail,
        tanDetail,
        agreementSigned,
        cinNo,
        bankName,
        bankAccountNo,
        ifscCode,
        micrCode,
        modeOfPayment,
        currency,
        paymentTerms,
        creditLimit,
        openingBalance,
        lastPaymentDate,
        averageMonthlySales,
        outstandingAmount,
        discountEligibility,
        warehouseName
      } = input;

      const { emp_id } = payload;

      // Check for duplicate phone number
      const existingCustomer = await this.customerRepository.findOne({
        where: { phone, isDeleted: false }
      });

      if (existingCustomer) {
        return { message: "Customer with this phone number already exists", status: STATUSCODES.BAD_REQUEST };
      }

      // Check for duplicate GST number if provided
      if (gstNo) {
        const existingGst = await this.customerRepository.findOne({
          where: { gstNo, isDeleted: false }
        });
        if (existingGst) {
          return { message: "Customer with this GST number already exists", status: STATUSCODES.BAD_REQUEST };
        }
      }

      // Check for duplicate PAN if provided
      if (panDetail) {
        const existingPan = await this.customerRepository.findOne({
          where: { panDetail, isDeleted: false }
        });
        if (existingPan) {
          return { message: "Customer with this PAN already exists", status: STATUSCODES.BAD_REQUEST };
        }
      }

      // Check for duplicate TAN if provided
      if (tanDetail) {
        const existingTan = await this.customerRepository.findOne({
          where: { tanDetail, isDeleted: false }
        });
        if (existingTan) {
          return { message: "Customer with this TAN already exists", status: STATUSCODES.BAD_REQUEST };
        }
      }

      // Get user for audit fields
      const user = await this.userRepository.findOne({ where: { emp_id } });
      if (!user) {
        return { message: "User not found", status: STATUSCODES.NOT_FOUND };
      }

      // Validate accountOwnerId if provided
      if (accountOwnerId) {
        const accountOwner = await this.userRepository.findOne({ where: { emp_id: accountOwnerId } });
        if (!accountOwner) {
          return { message: "Account Owner not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Validate beatRouteId if provided
      if (beatRouteId) {
        const beatRoute = await this.beatRepository.findOne({ where: { beatId: beatRouteId } });
        if (!beatRoute) {
          return { message: "Beat Route not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Validate parentId if provided
      if (parentId) {
        const parentCustomer = await this.customerRepository.findOne({ 
          where: { customerId: parentId, isDeleted: false } 
        });
        if (!parentCustomer) {
          return { message: "Parent Customer not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      const existingWarehouse= await this.warehouseRepository.findOne({
        where:{warehouseName, isDeleted: false}

      })
      if(warehouseName && !existingWarehouse){
        return {message:"Warehouse not found", status: STATUSCODES.NOT_FOUND}
      }




      const newCustomer = new Customer();
      newCustomer.parentId = parentId;
      newCustomer.customerName = customerName;
      newCustomer.customerType = customerType;
      newCustomer.channelType = channelType;
      newCustomer.phone = phone;
      newCustomer.email = email;
      newCustomer.accountOwnerId = accountOwnerId;
      newCustomer.beatRouteId = beatRouteId;
      newCustomer.category = category;
      
      // Billing Address
      newCustomer.billingCountry = billingCountry;
      newCustomer.billingState = billingState;
      newCustomer.billingDistrict = billingDistrict;
      newCustomer.billingStreet = billingStreet;
      newCustomer.billingCity = billingCity;
      newCustomer.billingPinCode = billingPinCode;
      
      // Shipping Address
      newCustomer.shippingCountry = shippingCountry;
      newCustomer.shippingState = shippingState;
      newCustomer.shippingDistrict = shippingDistrict;
      newCustomer.shippingStreet = shippingStreet;
      newCustomer.shippingCity = shippingCity;
      newCustomer.shippingPinCode = shippingPinCode;
      
      // Delivery Details
      newCustomer.deliveryTimeSlot = deliveryTimeSlot;
      newCustomer.preferredDays = preferredDays;
      
      // KYC Details
      newCustomer.gstCertificate = gstCertificate;
      newCustomer.gstNo = gstNo;
      newCustomer.businessLicense = businessLicense;
      newCustomer.panDetail = panDetail;
      newCustomer.tanDetail = tanDetail;
      newCustomer.agreementSigned = agreementSigned;
      newCustomer.cinNo = cinNo;
      
      // Bank Details
      newCustomer.bankName = bankName;
      newCustomer.bankAccountNo = bankAccountNo;
      newCustomer.ifscCode = ifscCode;
      newCustomer.micrCode = micrCode;
      newCustomer.modeOfPayment = modeOfPayment;
      newCustomer.currency = currency;
      
      // Financial & Transactional Data
      newCustomer.paymentTerms = paymentTerms;
      newCustomer.creditLimit = creditLimit;
      newCustomer.openingBalance = openingBalance || 0;
      newCustomer.lastPaymentDate = lastPaymentDate ? new Date(lastPaymentDate) : undefined;
      newCustomer.averageMonthlySales = averageMonthlySales;
      newCustomer.outstandingAmount = outstandingAmount || 0;
      newCustomer.discountEligibility = discountEligibility;
      newCustomer.warehouseName=warehouseName;

      // Set audit fields
      newCustomer.setCreatedByUser(user);

      const savedCustomer = await this.customerRepository.save(newCustomer);

      return {
        status: STATUSCODES.SUCCESS,
        message: "Customer created successfully.",
        data: savedCustomer
      };
    } catch (error) {
      console.error("Create Customer Error:", error);
      throw error;
    }
  }

  async updateCustomer(input: UpdateCustomer, payload: IUser): Promise<IApiResponse> {
    try {
      const { customerId, ...updateData } = input;
      const { emp_id } = payload;

      const customer = await this.customerRepository.findOne({
        where: { customerId: Number(customerId), isDeleted: false }
      });

      if (!customer) {
        return { message: "Customer not found", status: STATUSCODES.NOT_FOUND };
      }

      // Check for duplicate phone number (excluding current customer)
      if (updateData.phone && updateData.phone !== customer.phone) {
        const existingCustomer = await this.customerRepository.findOne({
          where: { phone: updateData.phone, isDeleted: false }
        });
        if (existingCustomer && existingCustomer.customerId !== Number(customerId)) {
          return { message: "Customer with this phone number already exists", status: STATUSCODES.BAD_REQUEST };
        }
      }

      // Check for duplicate GST number if provided
      if (updateData.gstNo && updateData.gstNo !== customer.gstNo) {
        const existingGst = await this.customerRepository.findOne({
          where: { gstNo: updateData.gstNo, isDeleted: false }
        });
        if (existingGst && existingGst.customerId !== Number(customerId)) {
          return { message: "Customer with this GST number already exists", status: STATUSCODES.BAD_REQUEST };
        }
      }

      // Check for duplicate PAN if provided
      if (updateData.panDetail && updateData.panDetail !== customer.panDetail) {
        const existingPan = await this.customerRepository.findOne({
          where: { panDetail: updateData.panDetail, isDeleted: false }
        });
        if (existingPan && existingPan.customerId !== Number(customerId)) {
          return { message: "Customer with this PAN already exists", status: STATUSCODES.BAD_REQUEST };
        }
      }

      // Check for duplicate TAN if provided
      if (updateData.tanDetail && updateData.tanDetail !== customer.tanDetail) {
        const existingTan = await this.customerRepository.findOne({
          where: { tanDetail: updateData.tanDetail, isDeleted: false }
        });
        if (existingTan && existingTan.customerId !== Number(customerId)) {
          return { message: "Customer with this TAN already exists", status: STATUSCODES.BAD_REQUEST };
        }
      }

      // Get user for audit fields
      const user = await this.userRepository.findOne({ where: { emp_id } });
      if (!user) {
        return { message: "User not found", status: STATUSCODES.NOT_FOUND };
      }

      // Validate accountOwnerId if provided
      if (updateData.accountOwnerId !== undefined && updateData.accountOwnerId !== null) {
        const accountOwner = await this.userRepository.findOne({ where: { emp_id: updateData.accountOwnerId } });
        if (!accountOwner) {
          return { message: "Account Owner not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Validate beatRouteId if provided
      if (updateData.beatRouteId !== undefined && updateData.beatRouteId !== null) {
        const beatRoute = await this.beatRepository.findOne({ where: { beatId: updateData.beatRouteId } });
        if (!beatRoute) {
          return { message: "Beat Route not found", status: STATUSCODES.NOT_FOUND };
        }
      }

      // Validate parentId if provided
      if (updateData.parentId !== undefined && updateData.parentId !== null) {
        const parentCustomer = await this.customerRepository.findOne({ 
          where: { customerId: updateData.parentId, isDeleted: false } 
        });
        if (!parentCustomer) {
          return { message: "Parent Customer not found", status: STATUSCODES.NOT_FOUND };
        }
      }


      if (updateData.warehouseName) {
  const warehouse = await this.warehouseRepository.findOne({
    where: { warehouseName: updateData.warehouseName, isDeleted: false }
  });

  if (!warehouse) {
    return {
      message: "Warehouse not found",
      status: STATUSCODES.NOT_FOUND
    };
  }

  customer.warehouseName = warehouse.warehouseName;
}

      // Update fields
      if (updateData.parentId !== undefined) customer.parentId = updateData.parentId;
      if (updateData.customerName) customer.customerName = updateData.customerName;
      if (updateData.customerType) customer.customerType = updateData.customerType;
      if (updateData.channelType) customer.channelType = updateData.channelType;
      if (updateData.phone) customer.phone = updateData.phone;
      if (updateData.email !== undefined) customer.email = updateData.email;
      if (updateData.accountOwnerId !== undefined) customer.accountOwnerId = updateData.accountOwnerId;
      if (updateData.beatRouteId !== undefined) customer.beatRouteId = updateData.beatRouteId;
      if (updateData.category !== undefined) customer.category = updateData.category;
      
      // Billing Address
      if (updateData.billingCountry !== undefined) customer.billingCountry = updateData.billingCountry;
      if (updateData.billingState !== undefined) customer.billingState = updateData.billingState;
      if (updateData.billingDistrict !== undefined) customer.billingDistrict = updateData.billingDistrict;
      if (updateData.billingStreet !== undefined) customer.billingStreet = updateData.billingStreet;
      if (updateData.billingCity !== undefined) customer.billingCity = updateData.billingCity;
      if (updateData.billingPinCode !== undefined) customer.billingPinCode = updateData.billingPinCode;
      
      // Shipping Address
      if (updateData.shippingCountry) customer.shippingCountry = updateData.shippingCountry;
      if (updateData.shippingState) customer.shippingState = updateData.shippingState;
      if (updateData.shippingDistrict) customer.shippingDistrict = updateData.shippingDistrict;
      if (updateData.shippingStreet) customer.shippingStreet = updateData.shippingStreet;
      if (updateData.shippingCity) customer.shippingCity = updateData.shippingCity;
      if (updateData.shippingPinCode) customer.shippingPinCode = updateData.shippingPinCode;
      
      // Delivery Details
      if (updateData.deliveryTimeSlot) customer.deliveryTimeSlot = updateData.deliveryTimeSlot;
      if (updateData.preferredDays) customer.preferredDays = updateData.preferredDays;
      
      // KYC Details
      if (updateData.gstCertificate !== undefined) customer.gstCertificate = updateData.gstCertificate;
      if (updateData.gstNo !== undefined) customer.gstNo = updateData.gstNo;
      if (updateData.businessLicense !== undefined) customer.businessLicense = updateData.businessLicense;
      if (updateData.panDetail !== undefined) customer.panDetail = updateData.panDetail;
      if (updateData.tanDetail !== undefined) customer.tanDetail = updateData.tanDetail;
      if (updateData.agreementSigned !== undefined) customer.agreementSigned = updateData.agreementSigned;
      if (updateData.cinNo !== undefined) customer.cinNo = updateData.cinNo;
      
      // Bank Details
      if (updateData.bankName !== undefined) customer.bankName = updateData.bankName;
      if (updateData.bankAccountNo !== undefined) customer.bankAccountNo = updateData.bankAccountNo;
      if (updateData.ifscCode !== undefined) customer.ifscCode = updateData.ifscCode;
      if (updateData.micrCode !== undefined) customer.micrCode = updateData.micrCode;
      if (updateData.modeOfPayment !== undefined) customer.modeOfPayment = updateData.modeOfPayment;
      if (updateData.currency !== undefined) customer.currency = updateData.currency;
      
      // Financial & Transactional Data
      if (updateData.paymentTerms) customer.paymentTerms = updateData.paymentTerms;
      if (updateData.creditLimit !== undefined) customer.creditLimit = updateData.creditLimit;
      if (updateData.openingBalance !== undefined) customer.openingBalance = updateData.openingBalance;
      if (updateData.lastPaymentDate) customer.lastPaymentDate = new Date(updateData.lastPaymentDate);
      if (updateData.averageMonthlySales !== undefined) customer.averageMonthlySales = updateData.averageMonthlySales;
      if (updateData.outstandingAmount !== undefined) customer.outstandingAmount = updateData.outstandingAmount;
      if (updateData.discountEligibility !== undefined) customer.discountEligibility = updateData.discountEligibility;
      if (updateData.warehouseName !== undefined) customer.warehouseName = updateData.warehouseName;

      // Update audit fields
      customer.setModifiedByUser(user);

      const updatedCustomer = await this.customerRepository.save(customer);

      return {
        status: STATUSCODES.SUCCESS,
        message: "Customer updated successfully.",
        data: updatedCustomer
      };
    } catch (error) {
      console.error("Update Customer Error:", error);
      throw error;
    }
  }

  async deleteCustomer(input: DeleteCustomerById): Promise<IApiResponse> {
    try {
      const { customerId } = input;

      const customer = await this.customerRepository.findOne({
        where: { customerId: Number(customerId), isDeleted: false }
      });

      if (!customer) {
        return { message: "Customer not found", status: STATUSCODES.NOT_FOUND };
      }

      await this.customerRepository.createQueryBuilder()
        .update({ isDeleted: true })
        .where({ customerId: Number(customerId) })
        .execute();

      return { message: "Customer deleted successfully", status: STATUSCODES.SUCCESS };
    } catch (error) {
      console.error("Delete Customer Error:", error);
      throw error;
    }
  }

  async getCustomerById(input: GetCustomerById): Promise<IApiResponse> {
    try {
      const { customerId } = input;

      const customer = await this.customerRepository.createQueryBuilder('customer')
        .leftJoinAndSelect('customer.parent', 'parent')
        .leftJoinAndSelect('customer.accountOwner', 'accountOwner')
        .leftJoinAndSelect('customer.beatRoute', 'beatRoute')
        .where('customer.customerId = :customerId', { customerId: Number(customerId) })
        .andWhere('customer.isDeleted = :isDeleted', { isDeleted: false })
        .getOne();

      if (!customer) {
        return { message: "Customer not found", status: STATUSCODES.NOT_FOUND };
      }

      return {
        status: STATUSCODES.SUCCESS,
        message: "Success.",
        data: customer
      };
    } catch (error) {
      console.error("Get Customer Error:", error);
      throw error;
    }
  }

  async customerList(input: CustomerListFilter, payload: IUser): Promise<IApiResponse> {
    try {
      const { search, customerType, channelType, category, pageNumber, pageSize } = input;

      const queryBuilder = this.customerRepository.createQueryBuilder('customer')
        .leftJoinAndSelect('customer.parent', 'parent')
        .leftJoinAndSelect('customer.accountOwner', 'accountOwner')
        .leftJoinAndSelect('customer.beatRoute', 'beatRoute')
        .where('customer.isDeleted = :isDeleted', { isDeleted: false });

      if (search) {
        queryBuilder.andWhere(
          `(LOWER(customer.customerName) LIKE LOWER(:search) OR 
           customer.phone LIKE :search OR 
           CAST(customer.customerId AS TEXT) LIKE :search OR
           LOWER(customer.email) LIKE LOWER(:search))`,
          { search: `%${search}%` }
        );
      }

      if (customerType) {
        queryBuilder.andWhere('customer.customerType = :customerType', { customerType });
      }

      if (channelType) {
        queryBuilder.andWhere('customer.channelType = :channelType', { channelType });
      }

      if (category) {
        queryBuilder.andWhere('customer.category = :category', { category });
      }

      queryBuilder.orderBy('customer.createdDate', 'DESC')
        .skip((+pageNumber - 1) * +pageSize)
        .take(+pageSize);

      const [customers, total] = await queryBuilder.getManyAndCount();

      return {
        status: STATUSCODES.SUCCESS,
        message: "Success.",
        data: {
          customers,
          pagination: {
            pageNumber: +pageNumber,
            pageSize: +pageSize,
            totalRecords: total
          }
        }
      };
    } catch (error) {
      console.error("Customer List Error:", error);
      throw error;
    }
  }
}

export { CustomerController as CustomerService };

