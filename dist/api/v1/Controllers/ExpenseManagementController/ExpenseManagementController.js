"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseManagement = void 0;
const expenseManagement_entity_1 = require("../../../../core/DB/Entities/expenseManagement.entity");
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
const date_fns_1 = require("date-fns");
class ExpenseManagementService {
    constructor() {
        this.expenseManagementRepository = (0, expenseManagement_entity_1.ExpenseManagementRepository)();
        this.userRepository = (0, User_entity_1.UserRepository)();
    }
    createExpenseManagement(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const user = yield this.userRepository.findOne({ where: { emp_id } });
                if (!user) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
                }
                const reportToUser = yield this.userRepository.findOne({
                    where: { user_id: user.manegerId },
                    withDeleted: true // Include soft-deleted users
                });
                if (!reportToUser) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Reporting user not found." };
                }
                this.expenseManagementRepository.save(Object.assign(Object.assign({}, input), { emp_id: user.emp_id, manager_id: user.managerId, report_status: common_1.ExpenseReportStatus.PENDING }));
                // await emailGenerator(
                //     reportToUser.email,
                //     "Expense Request",
                //     `Expense of ${input.total_expence} by ${payload.emp_id} on date ${input.from_date}`
                // );
                return { status: common_1.STATUSCODES.SUCCESS, message: "Expense application created successfully." };
            }
            catch (error) {
                console.log({ error });
                throw error;
            }
        });
    }
    getExpenseManagement(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, report_status, expence_id, userFil_id } = input;
            const { emp_id, managerId } = payload;
            try {
                const query = this.expenseManagementRepository
                    .createQueryBuilder("expense_reports")
                    .leftJoinAndSelect("expense_reports.user", "user") // Join User table
                    .leftJoinAndSelect("expense_reports.manager", "manager")
                    .leftJoinAndSelect("expense_reports.policy", "policy") // Join LeaveHead table
                    .leftJoinAndSelect("expense_reports.policyType", "policyType")
                    .select([
                    "expense_reports.expence_id",
                    "expense_reports.from_date",
                    "expense_reports.to_date",
                    "expense_reports.kms",
                    "expense_reports.total_expence",
                    "expense_reports.detail",
                    "expense_reports.report_status",
                    "expense_reports.created_at",
                    "expense_reports.from_location",
                    "expense_reports.to_location",
                    "expense_reports.remark",
                    "user.emp_id",
                    "user.firstname",
                    "user.lastname",
                    "manager.firstname",
                    "manager.lastname",
                    "policy.policy_name",
                    "policyType.policy_type_name",
                    "policyType.claim_type"
                ]);
                // **Check User Role**
                // if (mode === 'rpt') {
                //     query.andWhere("LeaveApplication.manager_id = :manager_id", { manager_id: managerId })
                //          .andWhere("LeaveApplication.leave_app_status = :status", { status: 'pending' });
                // } else {
                //     query.andWhere("LeaveApplication.emp_id = :emp_id", { emp_id });
                // }
                // **Filter by Date Range**
                if (from_date && to_date) {
                    // Convert to proper date objects
                    const fromDateObj = new Date(from_date);
                    const toDateObj = (0, date_fns_1.endOfDay)(new Date(to_date)); // Ensures time is set to 23:59:59.999
                    query.andWhere("expense_reports.created_at BETWEEN :from_date AND :to_date", {
                        from_date: (0, date_fns_1.format)(fromDateObj, "yyyy-MM-dd HH:mm:ss"),
                        to_date: (0, date_fns_1.format)(toDateObj, "yyyy-MM-dd HH:mm:ss")
                    });
                }
                // **Filter by Status**
                if (report_status) {
                    query.andWhere("expense_reports.report_status = :report_status", { report_status });
                }
                // **Filter by Leave Head**
                // if (policy_id) {
                //     query.andWhere("expense_reports.policy_id = :policy_id", { policy_id });
                // }
                // **Filter by Submitted User**
                if (userFil_id) {
                    query.andWhere("expense_reports.emp_id = :emp_id", { emp_id: userFil_id });
                }
                // **Get Single Leave Application by ID**
                if (expence_id) {
                    query.andWhere("expense_reports.expence_id = :expence_id", { expence_id });
                    const data = yield query.getOne();
                    return { message: "Success", status: common_1.STATUSCODES.SUCCESS, data };
                }
                // **Get All Leave Applications**
                query.orderBy("expense_reports.report_status", "ASC")
                    .addOrderBy("expense_reports.expence_id", "DESC");
                const data = yield query.getMany();
                return { message: "Success", status: common_1.STATUSCODES.SUCCESS, data };
            }
            catch (error) {
                console.error("Error fetching leave applications:", error);
                throw new Error("Something Went Wrong");
            }
        });
    }
    editExpenseManagement(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { expence_id, remark, report_status } = input;
                if (!expence_id) {
                    return { status: common_1.STATUSCODES.BAD_REQUEST, message: "Please provide Expense ID." };
                }
                ;
                const existingPolicy = yield this.expenseManagementRepository.findOne({
                    where: { expence_id },
                });
                if (!existingPolicy) {
                    return { status: common_1.STATUSCODES.CONFLICT, message: "No data found with this Expense Id" };
                }
                yield this.expenseManagementRepository.update({ expence_id }, { remark, report_status });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Expense status updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error(error);
            }
        });
    }
    deleteExpenseManagement(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ExpenseManagement = yield this.expenseManagementRepository.findOne({
                    where: { policy_id: input.policy_id },
                });
                if (!ExpenseManagement) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Policy head does not exist." };
                }
                yield this.expenseManagementRepository.softDelete({ policy_id: input.policy_id });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Policy head deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.ExpenseManagement = ExpenseManagementService;
