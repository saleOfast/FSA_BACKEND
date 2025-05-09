import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { Sessions, SessionsRepository } from "../../../../core/DB/Entities/sessions.entity";
import { STATUSCODES, TimelineEnum, UserRole } from "../../../../core/types/Constent/common";
import { ISessions, SessionsC, SessionsD, SessionsR, SessionsU } from "../../../../core/types/SessionsService/SessionsService";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import { Between, IsNull, Not } from "typeorm";

class SessionsService {
    private sessionsRepository = SessionsRepository();
    private userRespositry = UserRepository()

    constructor() { }

    async createSessions(input: SessionsC, payload: IUser): Promise<IApiResponse> {
        try {
            const { emp_id } = payload;
            const user = await this.userRespositry.findOne({ where: { emp_id } });
            if (!user) {
                return { status: STATUSCODES.NOT_FOUND, message: "User Not Found." };
            }
            let newSession = await this.sessionsRepository.save(input);
            return { status: STATUSCODES.SUCCESS, message: "Session created successfully.", data: newSession };
        } catch (error) {
            throw error;
        }
    }

    async getSessions(input: SessionsR, payload: IUser): Promise<IApiResponse> {
        try {
            const SessionsList = await this.sessionsRepository.find({
                where: { storeId: input.storeId },
                relations: { store: true, user: true, product: true },
                order: { createdAt: "DESC" },
            });
            return { status: STATUSCODES.SUCCESS, message: "Session list retrieved successfully.", data: SessionsList };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async getSessionsById(payload: IUser, input: SessionsR): Promise<IApiResponse> {
        try {
            const { sessionId } = input;
            const Session: any | null = await this.sessionsRepository.findOne({ where: { sessionId: Number(sessionId) } });
            if (!Session) {
                return { message: "Not Found.", status: STATUSCODES.NOT_FOUND }
            }

            return { message: "Success.", status: STATUSCODES.SUCCESS, data: Session }
        } catch (error) {
            throw error;
        }
    }

    async editSessions(input: SessionsU, payload: IUser): Promise<IApiResponse> {
        try {
            if (input.sessionId) {
                const existingSession = await this.sessionsRepository.findOne({
                    where: { sessionId: input.sessionId },
                });
                if (!existingSession) {
                    return { status: STATUSCODES.CONFLICT, message: "Session does not exists." };
                }
                await this.sessionsRepository.update({ sessionId: input.sessionId }, input);
            }
            return { status: STATUSCODES.SUCCESS, message: "Session updated successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

    async deleteSessions(input: SessionsD, payload: IUser): Promise<IApiResponse> {
        try {
            const Sessions = await this.sessionsRepository.findOne({
                where: { sessionId: input.sessionId },
            });

            if (!Sessions) {
                return { status: STATUSCODES.NOT_FOUND, message: "Session does not exist." };
            }
            await this.sessionsRepository.softDelete({ sessionId: Sessions.sessionId });
            return { status: STATUSCODES.SUCCESS, message: "Session deleted successfully." };
        } catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }

}

export { SessionsService as Sessions }