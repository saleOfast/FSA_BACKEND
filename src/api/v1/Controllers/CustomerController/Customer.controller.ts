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

 async createCustomer(
  input: CreateCustomer,
  payload: IUser
): Promise<IApiResponse> {
  try {
    const { emp_id } = payload;

    // ============================
    // 1️⃣ Normalize Input
    // ============================
    const normalize = (val?: string) => val?.trim();

    const customerName = normalize(input.customerName);
    const phone = normalize(input.phone);
    const gstNo = normalize(input.gstNo)?.toUpperCase();
    const panDetail = normalize(input.panDetail)?.toUpperCase();
    const tanDetail = normalize(input.tanDetail)?.toUpperCase();
    const warehouseName = normalize(input.warehouseName)?.toLowerCase();

    // ============================
    // 2️⃣ Required Field Validation
    // ============================
    if (!customerName) {
      return { status: STATUSCODES.BAD_REQUEST, message: "Customer name is required" };
    }

    if (!phone) {
      return { status: STATUSCODES.BAD_REQUEST, message: "Phone is required" };
    }

    // ============================
    // 3️⃣ Phone Format Validation (India)
    // ============================
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Invalid phone number format"
      };
    }

    // ============================
    // 4️⃣ Fetch dependencies in parallel
    // ============================
    const [
      existingCustomer,
      existingGst,
      existingPan,
      existingTan,
      user,
      accountOwner,
      beatRoute,
      parentCustomer,
      warehouse
    ] = await Promise.all([
      // Phone duplicate
      this.customerRepository.findOne({
        where: { phone, isDeleted: false }
      }),

      // GST duplicate
      gstNo
        ? this.customerRepository
            .createQueryBuilder("c")
            .where("LOWER(c.gstNo) = :gst", { gst: gstNo.toLowerCase() })
            .andWhere("c.isDeleted = false")
            .getOne()
        : null,

      // PAN duplicate
      panDetail
        ? this.customerRepository
            .createQueryBuilder("c")
            .where("LOWER(c.panDetail) = :pan", { pan: panDetail.toLowerCase() })
            .andWhere("c.isDeleted = false")
            .getOne()
        : null,

      // TAN duplicate
      tanDetail
        ? this.customerRepository
            .createQueryBuilder("c")
            .where("LOWER(c.tanDetail) = :tan", { tan: tanDetail.toLowerCase() })
            .andWhere("c.isDeleted = false")
            .getOne()
        : null,

      // Logged-in user
      this.userRepository.findOne({ where: { emp_id } }),

      // Account owner
      input.accountOwnerId
        ? this.userRepository.findOne({ where: { emp_id: input.accountOwnerId } })
        : null,

      // Beat route
      input.beatRouteId
        ? this.beatRepository.findOne({ where: { beatId: input.beatRouteId } })
        : null,

      // Parent customer
      input.parentId
        ? this.customerRepository.findOne({
            where: { customerId: input.parentId, isDeleted: false }
          })
        : null,

      // Warehouse (case-insensitive + trimmed)
      warehouseName
        ? this.warehouseRepository
            .createQueryBuilder("w")
            .where("LOWER(TRIM(w.warehouseName)) = :name", { name: warehouseName })
            .andWhere("w.isDeleted = false")
            .getOne()
        : null
    ]);

    // ============================
    // 5️⃣ Validations
    // ============================

    if (existingCustomer) {
      return { status: STATUSCODES.BAD_REQUEST, message: "Phone already exists" };
    }

    if (gstNo && existingGst) {
      return { status: STATUSCODES.BAD_REQUEST, message: "GST already exists" };
    }

    if (panDetail && existingPan) {
      return { status: STATUSCODES.BAD_REQUEST, message: "PAN already exists" };
    }

    if (tanDetail && existingTan) {
      return { status: STATUSCODES.BAD_REQUEST, message: "TAN already exists" };
    }

    if (!user) {
      return { status: STATUSCODES.NOT_FOUND, message: "User not found" };
    }

    if (input.accountOwnerId && !accountOwner) {
      return { status: STATUSCODES.NOT_FOUND, message: "Account Owner not found" };
    }

    if (input.beatRouteId && !beatRoute) {
      return { status: STATUSCODES.NOT_FOUND, message: "Beat Route not found" };
    }

    if (input.parentId && !parentCustomer) {
      return { status: STATUSCODES.NOT_FOUND, message: "Parent Customer not found" };
    }

    if (warehouseName && !warehouse) {
      return { status: STATUSCODES.NOT_FOUND, message: "Warehouse not found" };
    }

    // ============================
    // 6️⃣ Create Customer
    // ============================
    const newCustomer = this.customerRepository.create({
      parentId: input.parentId,
      customerName,
      customerType: input.customerType,
      channelType: input.channelType,
      phone,
      email: normalize(input.email),
      accountOwnerId: input.accountOwnerId,
      beatRouteId: input.beatRouteId,
      category: input.category,

      // Billing
      billingCountry: input.billingCountry,
      billingState: input.billingState,
      billingDistrict: input.billingDistrict,
      billingStreet: normalize(input.billingStreet),
      billingCity: input.billingCity,
      billingPinCode: input.billingPinCode,

      // Shipping
      shippingCountry: input.shippingCountry,
      shippingState: input.shippingState,
      shippingDistrict: input.shippingDistrict,
      shippingStreet: normalize(input.shippingStreet),
      shippingCity: input.shippingCity,
      shippingPinCode: input.shippingPinCode,

      // Delivery
      deliveryTimeSlot: input.deliveryTimeSlot,
      preferredDays: input.preferredDays,

      // KYC
      gstCertificate: input.gstCertificate,
      gstNo,
      businessLicense: input.businessLicense,
      panDetail,
      tanDetail,
      agreementSigned: input.agreementSigned,
      cinNo: normalize(input.cinNo),

      // Bank
      bankName: normalize(input.bankName),
      bankAccountNo: input.bankAccountNo,
      ifscCode: normalize(input.ifscCode),
      micrCode: input.micrCode,
      modeOfPayment: input.modeOfPayment,
      currency: input.currency,

      // Financial
      paymentTerms: input.paymentTerms,
      creditLimit: input.creditLimit,
      openingBalance: input.openingBalance || 0,
      lastPaymentDate: input.lastPaymentDate
        ? new Date(input.lastPaymentDate)
        : undefined,
      averageMonthlySales: input.averageMonthlySales,
      outstandingAmount: input.outstandingAmount || 0,
      discountEligibility: input.discountEligibility,

      // ✅ FIXED: store relation instead of name
   warehouseName: warehouse?.warehouseName || warehouseName
    });

    // Audit
    newCustomer.setCreatedByUser(user);

    // ============================
    // 7️⃣ Save
    // ============================
    const savedCustomer = await this.customerRepository.save(newCustomer);

    return {
      status: STATUSCODES.SUCCESS,
      message: "Customer created successfully",
      data: savedCustomer
    };

  } catch (error: any) {
    console.error("Create Customer Error:", error);

    // ============================
    // 8️⃣ Handle DB Unique Errors (Best Practice)
    // ============================
    if (error.code === "23505") {
      return {
        status: STATUSCODES.BAD_REQUEST,
        message: "Duplicate entry found"
      };
    }

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

