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
exports.cronService = void 0;
const cron_1 = require("cron");
const UpdateUserCheckout_1 = require("./UpdateCheckoutTIme/UpdateUserCheckout");
function cronService() {
    return __awaiter(this, void 0, void 0, function* () {
        new cron_1.CronJob('59 23 * * *', // cronTime
        function () {
            console.log('You will see this message at 11:58 PM IST');
            const attendanceService = new UpdateUserCheckout_1.UpdateAttendanceCronService();
            attendanceService.updateCheckOutTime();
        }, null, true, 'Asia/Kolkata');
    });
}
exports.cronService = cronService;
