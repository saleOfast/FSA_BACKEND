import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { STATUSCODES } from "../../../../core/types/Constent/common";
import { LeaveApplication, LeaveApplicationRepository } from "../../../../core/DB/Entities/userLeaveApplication.entity";
import { CreateUserLeaveApplication, DeleteUserLeaveAppl, GetUserLeaveApplication, UpdateLeaveApp } from "core/types/LeaveService/userLeaveApplicationService";
import { HeadLeaveCountRepository } from "../../../../core/DB/Entities/LeaveCount.entity";
import { UserLeaveRepository } from "../../../../core/DB/Entities/userLeave.entity";
import { endOfDay, format } from "date-fns";

class LeaveApplicationController {
    private leaveApplicationRepository = LeaveApplicationRepository();
    private leaveCountRepository = HeadLeaveCountRepository();
    private userLeaveRepository = UserLeaveRepository();

    constructor() { }

    async createUserLeaveApplication(input: CreateUserLeaveApplication, payload: IUser): Promise<IApiResponse> {
        try {
            const { head_leave_id, head_leave_cnt_id, from_date, to_date, no_of_days, reason } = input;
            const { emp_id, managerId } = payload
            const newLeaveAppl = new LeaveApplication()

            newLeaveAppl.head_leave_id = Number(head_leave_id);
            newLeaveAppl.head_leave_cnt_id = Number(head_leave_cnt_id);
            newLeaveAppl.from_date = from_date;
            newLeaveAppl.to_date = to_date;
            newLeaveAppl.no_of_days = no_of_days;
            newLeaveAppl.reason = reason;
            newLeaveAppl.manager_id = managerId == 0 ? null : managerId;
            newLeaveAppl.emp_id = Number(emp_id);

            await this.leaveApplicationRepository.save(newLeaveAppl);
            // const headLeaveCountData = await this.leaveCountRepository.findByPk(head_leave_cnt_id);
            const userLeaveData = await this.userLeaveRepository.findOne({
                where: {
                    head_leave_cnt_id: Number(head_leave_cnt_id),
                    user_id: emp_id,
                },
            });
            if (!userLeaveData) {
                const headLeaveCountData: any = await this.leaveCountRepository.findOne({
                    where: { headLeaveCntId: Number(head_leave_cnt_id) }
                });

                await this.userLeaveRepository.save({
                    user_id: Number(emp_id),
                    head_leave_id: Number(head_leave_id),
                    head_leave_cnt_id: Number(head_leave_cnt_id),
                    left_leave: headLeaveCountData.totalHeadLeave - no_of_days,
                    remarks: "",
                });
            } else {
                // If user leave table exists, update the table leaves
                await this.userLeaveRepository.update(
                    { user_id: emp_id, head_leave_cnt_id: Number(head_leave_cnt_id) }, // WHERE condition
                    { left_leave: userLeaveData.left_leave - no_of_days } // Update fields
                );
            }
            return { message: "Success", status: STATUSCODES.SUCCESS };
        } catch (error) {
            console.log({ error })
            throw error;
        }
    }


    // async getLeaveApplication(payload: IUser): Promise<IApiResponse> {
    //     try {
    //         const data = await this.leaveApplicationRepository
    //             .createQueryBuilder("LeaveApplication")
    //             .leftJoinAndSelect("LeaveApplication.user", "user") // Join User table
    //             .leftJoinAndSelect("LeaveApplication.LeaveHead", "leaveHead") // Join LeaveHead table
    //             .select([
    //                 "LeaveApplication.leave_app_id",
    //                 "LeaveApplication.from_date",
    //                 "LeaveApplication.to_date",
    //                 "LeaveApplication.no_of_days",
    //                 "LeaveApplication.reason",
    //                 "LeaveApplication.leave_app_status",
    //                 "user.emp_id",
    //                 "user.firstname", // Get user name
    //                 "user.lastname",
    //                 "leaveHead.head_leave_name", // Get leave head name
    //                 "leaveHead.head_leave_short_name" // Get leave head short name
    //             ])
    //             .where("LeaveApplication.leave_app_status = :status", { status: 'pending' })
    //             .orderBy("LeaveApplication.from_date", "DESC")
    //             .getMany();

    //         return { message: "Success", status: STATUSCODES.SUCCESS, data };
    //     } catch (error) {
    //         console.log({ error })
    //         throw error;
    //     }
    // }




    // async getLeaveHeadById(payload: IUser, input: HeadLeaveR): Promise<IApiResponse> {
    //     try {
    //         const { head_leave_id } = input;
    //         const policy: any | null = await this.leaveHeadRepository.findOne({ where: { head_leave_id: Number(head_leave_id) } });
    //         if (!policy) {
    //             return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
    //         }

    //         return { message: "Success.", status: STATUSCODES.SUCCESS, data: policy }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    async getLeaveApplication(payload: IUser, input: any): Promise<IApiResponse> {
        const { mode, from_date, to_date, status, head_leave_id, leave_app_id, userFil_id } = input
        const { emp_id, managerId } = payload


        try {
            const query = this.leaveApplicationRepository
                .createQueryBuilder("LeaveApplication")
                .leftJoinAndSelect("LeaveApplication.user", "user") // Join User table
                .leftJoinAndSelect("LeaveApplication.manager", "manager")
                .leftJoinAndSelect("LeaveApplication.LeaveHead", "leaveHead") // Join LeaveHead table
                .select([
                    "LeaveApplication.leave_app_id",
                    "LeaveApplication.from_date",
                    "LeaveApplication.to_date",
                    "LeaveApplication.no_of_days",
                    "LeaveApplication.reason",
                    "LeaveApplication.leave_app_status",
                    "LeaveApplication.created_at",
                    "LeaveApplication.remarks",
                    "user.emp_id",
                    "user.firstname",
                    "user.lastname",
                    "manager.firstname",
                    "manager.lastname",
                    "leaveHead.head_leave_name",
                    "leaveHead.head_leave_short_name"
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
            
                query.andWhere("LeaveApplication.created_at BETWEEN :from_date AND :to_date", {
                    from_date: format(fromDateObj, "yyyy-MM-dd HH:mm:ss"),
                    to_date: format(toDateObj, "yyyy-MM-dd HH:mm:ss")
                });
            }
            // **Filter by Status**
            if (status) {
                query.andWhere("LeaveApplication.leave_app_status = :status", { status });
            }

            // **Filter by Leave Head**
            if (head_leave_id) {
                query.andWhere("LeaveApplication.head_leave_id = :head_leave_id", { head_leave_id });
            }

            // **Filter by Submitted User**
            if (userFil_id) {
                query.andWhere("LeaveApplication.emp_id = :emp_id", { emp_id:userFil_id });
            }

            // **Get Single Leave Application by ID**
            if (leave_app_id) {
                query.andWhere("LeaveApplication.leave_app_id = :user_leave_id", { leave_app_id });
                const data = await query.getOne();
                return { message: "Success", status: STATUSCODES.SUCCESS, data };
            }

            // **Get All Leave Applications**
            query.orderBy("LeaveApplication.leave_app_status", "ASC")
                .addOrderBy("LeaveApplication.leave_app_id", "DESC");

            const data = await query.getMany();
            return { message: "Success", status: STATUSCODES.SUCCESS, data };

        } catch (error) {
            console.error("Error fetching leave applications:", error);
            throw new Error("Something Went Wrong");
        }
    }


    async updateLeaveApplication(input: UpdateLeaveApp, payload: IUser): Promise<IApiResponse> {
        try {
            const { leave_app_id, remarks, leave_app_status } = input;
            if (!leave_app_id) return { status: STATUSCODES.BAD_REQUEST, message: "Leave Id is required." };

            const data = await this.leaveApplicationRepository.findOne({ where: { leave_app_id } });
            if (!data) return { status: STATUSCODES.NOT_FOUND, message: "No data found with this leave id" };

            await this.leaveApplicationRepository.update({ leave_app_id }, {remarks, leave_app_status} )
            return { message: "Leave Application Updated Successfully", status: STATUSCODES.SUCCESS, data: data }
        } catch (error) {
            throw error;
        }
    }

    async deleteLeaveApplication(input: DeleteUserLeaveAppl, payload: IUser): Promise<IApiResponse> {
        try {
            const { leave_app_id } = input;
            if (!leave_app_id) return { status: STATUSCODES.BAD_REQUEST, message: "Leave Id is required." };

            const data = await this.leaveApplicationRepository.findOne({ where: { leave_app_id: Number(leave_app_id) } });
            if (!data) return { status: STATUSCODES.NOT_FOUND, message: "No data found with this leave Application id" };

            await this.leaveApplicationRepository.softDelete({ leave_app_id: Number(leave_app_id) })
            return { message: "Leave Deleted Successfully", status: STATUSCODES.SUCCESS }
        } catch (error) {
            throw error;
        }
    }
}

export { LeaveApplicationController }