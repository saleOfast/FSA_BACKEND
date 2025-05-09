import express from "express";
import { UserRoute } from './AuthRoute/Auth.route';
import { AttendanceRoute } from "./AttendanceRouter/Attendance.route";
import { ProfileRoute } from "./AuthRoute/ProfileRouter/Profile.route";
import { VisitRoute } from "./VisitRoute/Visit.route";
import { StoreRoute } from "./StoreRouter/Store.route";
import { BeatRoute } from "./BeatRouter/Beat.route";
import { ProductRoute } from "./ProductRouter/Product.route";
import { BrandRouter } from "./BrandRouter/Brand.route";
import { OrderRouter } from "./OrderRouter/Order.route";
import { InventoryRouter } from "./InventoryRouter/Inventory.route";
import { SchemeRoute } from "./SchemeRouter/SchemeRoute";
import { UsersListRoute } from "./UserRouter/user.route";
import { PaymentRouter } from "./PaymentRouter/Payment.route";
import { CourseRouter } from "./LearningModuleRouter/Learning.route";
import { TargetRouter } from "./TargetRouter/target.route";
import { ReportRoute } from "./ReportRouter/report.router";
import { ReasonRouter } from "./ReasonRouter/Reason.route";
import { ColourRouter } from "./ColourRouter/Colour.route";
import { SizeRouter } from "./SizeRouter/Size.route";
import { FeatureRouter } from "./FeatureRouter/Feature.route";
import { RoleRouter } from "./RoleRouter/Role.route";
import { PaymentModeRouter } from "./PaymentModeRouter/PaymentMode.route";

import { PolicyHeadRouter } from "./PolicyHeadRouter/PolicyHead.route";
import { PolicyHeadTypeRouter } from "./PolicyHeadTypeRouter/PolicyHeadType.route";
import { ExpenseManagementRouter } from "./ExpenseManagement/ExpenseManagement.route";
import { LeaveRoute } from "./LeaveRoute/Leave.route";
import { LeaveCountRoute } from "./LeaveRoute/LeaveCount.route";
import { DarRouter } from "./DarRouter/Dar.route";
import { LeaveApplicationRoute } from "./LeaveRoute/LeaveApplication.route";
import { ActivityRouter } from "./ActivityRouter/Activity.route";
import { SessionsRouter } from "./SessionsRouter/Sessions.route";
import { FeedbackRouter } from "./FeedbackRouter/Feedback.route";
import { SamplesRouter } from "./SamplesRouter/Samples.route";
import { GiftsRouter } from "./GiftsRouter/Gifts.route";
import { userLeave } from "./LeaveRoute/userLeave.route";
import { ActivityTypeRouter } from "./DarConfigRouter/activityType.route";
import { ActivityRelToRouter } from "./DarConfigRouter/activityRelatedTo.route";
import { NextActionOnRouter } from "./DarConfigRouter/nextActionOn.route";
import { StatusRouter } from "./DarConfigRouter/status.route";
import { WorkplaceRouter } from "./WorkplaceRouter/Workplace.route";
import { EDetailingRouter } from "./EDetailing/eDetailing.route";
import { HolidayRouter } from "./HolidayRouter/HolidayRouter";

import { RCPARouter } from "./RCPARouter/RCPA.route";

const router = express.Router();

/* Auth ROutes */
router.use('/user', UserRoute);
router.use('/profile', ProfileRoute);
router.use('/attendance', AttendanceRoute);
router.use('/visit', VisitRoute);
router.use('/store', StoreRoute);
router.use('/beat', BeatRoute);
router.use('/product', ProductRoute);
router.use('/brand', BrandRouter);
router.use('/order', OrderRouter);
router.use('/inventory', InventoryRouter);
router.use('/scheme', SchemeRoute);
router.use('/users', UsersListRoute);
router.use('/payment', PaymentRouter);
router.use('/course', CourseRouter);
router.use('/target', TargetRouter);
router.use('/report', ReportRoute);
router.use('/reason', ReasonRouter);
router.use('/colour', ColourRouter);
router.use('/size', SizeRouter);
router.use('/feature', FeatureRouter);
router.use('/role', RoleRouter);
router.use('/paymentMode', PaymentModeRouter);

router.use('/policyHead', PolicyHeadRouter);
router.use('/policyHeadType', PolicyHeadTypeRouter);
router.use('/expense', ExpenseManagementRouter);
router.use('/leaveHead', LeaveRoute);
router.use('/leaveCount', LeaveCountRoute);
router.use('/leaveApplicaton', LeaveApplicationRoute);
router.use('/userLeave', userLeave);

router.use('/workplace', WorkplaceRouter);
router.use('/activity', ActivityRouter);
router.use('/sessions', SessionsRouter);
router.use('/feedback', FeedbackRouter);
router.use('/samples', SamplesRouter);
router.use('/gifts', GiftsRouter);

router.use('/dar', DarRouter);
router.use('/dar/config/activityType', ActivityTypeRouter);
router.use('/dar/config/activityRelTo', ActivityRelToRouter);
router.use('/dar/config/nextActionOn', NextActionOnRouter);
router.use('/dar/config/status', StatusRouter);

router.use('/eDetailing', EDetailingRouter);
router.use('/holidays', HolidayRouter);
router.use('/rcpa', RCPARouter);

export { router as routes };