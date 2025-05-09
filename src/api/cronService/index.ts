import { CronJob } from "cron";
import { UpdateAttendanceCronService } from "./UpdateCheckoutTIme/UpdateUserCheckout";


export async function cronService() {
    
    new CronJob(
        '59 23 * * *', // cronTime
        function () {
            console.log('You will see this message at 11:58 PM IST');
            const attendanceService = new UpdateAttendanceCronService();
            attendanceService.updateCheckOutTime();
        },
        null,
        true,
        'Asia/Kolkata'
    );
}