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
exports.Sessions = void 0;
const sessions_entity_1 = require("../../../../core/DB/Entities/sessions.entity");
const common_1 = require("../../../../core/types/Constent/common");
const User_entity_1 = require("../../../../core/DB/Entities/User.entity");
class SessionsService {
    constructor() {
        this.sessionsRepository = (0, sessions_entity_1.SessionsRepository)();
        this.userRespositry = (0, User_entity_1.UserRepository)();
    }
    createSessions(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emp_id } = payload;
                const user = yield this.userRespositry.findOne({ where: { emp_id } });
                if (!user) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "User Not Found." };
                }
                let newSession = yield this.sessionsRepository.save(input);
                return { status: common_1.STATUSCODES.SUCCESS, message: "Session created successfully.", data: newSession };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getSessions(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const SessionsList = yield this.sessionsRepository.find({
                    where: { storeId: input.storeId },
                    relations: { store: true, user: true, product: true },
                    order: { createdAt: "DESC" },
                });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Session list retrieved successfully.", data: SessionsList };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    getSessionsById(payload, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionId } = input;
                const Session = yield this.sessionsRepository.findOne({ where: { sessionId: Number(sessionId) } });
                if (!Session) {
                    return { message: "Not Found.", status: common_1.STATUSCODES.NOT_FOUND };
                }
                return { message: "Success.", status: common_1.STATUSCODES.SUCCESS, data: Session };
            }
            catch (error) {
                throw error;
            }
        });
    }
    editSessions(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (input.sessionId) {
                    const existingSession = yield this.sessionsRepository.findOne({
                        where: { sessionId: input.sessionId },
                    });
                    if (!existingSession) {
                        return { status: common_1.STATUSCODES.CONFLICT, message: "Session does not exists." };
                    }
                    yield this.sessionsRepository.update({ sessionId: input.sessionId }, input);
                }
                return { status: common_1.STATUSCODES.SUCCESS, message: "Session updated successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
    deleteSessions(input, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Sessions = yield this.sessionsRepository.findOne({
                    where: { sessionId: input.sessionId },
                });
                if (!Sessions) {
                    return { status: common_1.STATUSCODES.NOT_FOUND, message: "Session does not exist." };
                }
                yield this.sessionsRepository.softDelete({ sessionId: Sessions.sessionId });
                return { status: common_1.STATUSCODES.SUCCESS, message: "Session deleted successfully." };
            }
            catch (error) {
                console.error(error);
                throw new Error("Something went wrong");
            }
        });
    }
}
exports.Sessions = SessionsService;
