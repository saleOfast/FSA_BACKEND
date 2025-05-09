import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { PolicyHead, PolicyHeadRepository } from "../../../../core/DB/Entities/policyHead.entity";
import { ExpenseManagement, ExpenseManagementRepository } from "../../../../core/DB/Entities/expenseManagement.entity";
import { ExpenseReportStatus, STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { IPolicyHead } from "../../../../core/types/PolicyHeadService/PolicyHeadService";
import { ExpenseC, ExpenseD, ExpenseR, ExpenseU, IExpenseManagement } from "../../../../core/types/ExpenseManagement/ExpenseManagement";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { Between, IsNull, Not } from "typeorm";
import { emailGenerator } from "../../../../core/helper/sendEmail";
import { endOfDay, format } from "date-fns";

class ExpenseManagementService {
    private expenseManagementRepository = ExpenseManagementRepository();
    private userRepository = UserRepository()

    constructor() { }

    async createExpenseManagement(input: ExpenseC, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const user = await this.userRepository.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }

            const reportToUser = await this.userRepository.findOne({
                where: { user_id: user.manegerId },
                withDeleted: true // Include soft-deleted users
            });

            if (!reportToUser) {
                return { status: STATUSCODES.NOT_FOUND, message: "Reporting user not found." };
            }

            this.expenseManagementRepository.save({ ...input, emp_id: user.emp_id, manager_id: user.managerId, report_status: ExpenseReportStatus.PENDING });

            // await emailGenerator(
            //     reportToUser.email,
            //     "Expense Request",
            //     `Expense of ${input.total_expence} by ${payload.emp_id} on date ${input.from_date}`
            // );

            return { status: STATUSCODES.SUCCESS, message: "Expense application created successfully." };
        } catch (error) {
            console.log({ error })
            throw error;
        }
    }

    async getExpenseManagement(input: any | ExpenseR, payload: IUser): Promise<IApiResponse> {
        const { from_date, to_date, report_status, expence_id, userFil_id } = input
        const { emp_id, managerId } = payload


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
                const toDateObj = endOfDay(new Date(to_date)); // Ensures time is set to 23:59:59.999

                query.andWhere("expense_reports.created_at BETWEEN :from_date AND :to_date", {
                    from_date: format(fromDateObj, "yyyy-MM-dd HH:mm:ss"),
                    to_date: format(toDateObj, "yyyy-MM-dd HH:mm:ss")
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
                const data = await query.getOne();
                return { message: "Success", status: STATUSCODES.SUCCESS, data };
            }

            // **Get All Leave Applications**
            query.orderBy("expense_reports.report_status", "ASC")
                .addOrderBy("expense_reports.expence_id", "DESC");

            const data = await query.getMany();
            return { message: "Success", status: STATUSCODES.SUCCESS, data };

        } catch (error) {
            console.error("Error fetching leave applications:", error);
            throw new Error("Something Went Wrong");
        }
    }

    async editExpenseManagement(input: ExpenseU, payload: IUser): Promise<IApiResponse> {
        try {
            const { expence_id, remark, report_status } = input;
            if (!expence_id) {
                return { status: STATUSCODES.BAD_REQUEST, message: "Please provide Expense ID." };
            };

            const existingPolicy = await this.expenseManagementRepository.findOne({
                where: { expence_id },
            });

            if (!existingPolicy) {
                return { status: STATUSCODES.CONFLICT, message: "No data found with this Expense Id" };
            }
            await this.expenseManagementRepository.update({ expence_id }, {remark, report_status});
            return { status: STATUSCODES.SUCCESS, message: "Expense status updated successfully." };
        }
        catch (error: any) {
            console.error(error);
            throw new Error(error);
        }
    }

    async deleteExpenseManagement(input: ExpenseD, payload: IUser): Promise<IApiResponse> {
        try {
            const ExpenseManagement = await this.expenseManagementRepository.findOne({
                where: { policy_id: input.policy_id },
            });

            if (!ExpenseManagement) {
                return { status: STATUSCODES.NOT_FOUND, message: "Policy head does not exist." };
            }

            await this.expenseManagementRepository.softDelete({ policy_id: input.policy_id });
            return { status: STATUSCODES.SUCCESS, message: "Policy head deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }
}

export { ExpenseManagementService as ExpenseManagement }