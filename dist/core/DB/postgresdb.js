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
exports.DbConnections = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../config");
const policyHead_entity_1 = require("./Entities/policyHead.entity");
const policyHeadType_entity_1 = require("./Entities/policyHeadType.entity");
const expenseManagement_entity_1 = require("./Entities/expenseManagement.entity");
const User_entity_1 = require("./Entities/User.entity");
const attendance_entity_1 = require("./Entities/attendance.entity");
const beat_entity_1 = require("./Entities/beat.entity");
const collect_payment_entity_1 = require("./Entities/collect_payment.entity");
const discount_entity_1 = require("./Entities/discount.entity");
const distributors_entity_1 = require("./Entities/distributors.entity");
const inventory_entity_1 = require("./Entities/inventory.entity");
const orders_entity_1 = require("./Entities/orders.entity");
const outlet_inventory_entity_1 = require("./Entities/outlet_inventory.entity");
const products_entity_1 = require("./Entities/products.entity");
const storeCategory_entity_1 = require("./Entities/storeCategory.entity");
const stores_entity_1 = require("./Entities/stores.entity");
const Visit_entity_1 = require("./Entities/Visit.entity");
const brand_entity_1 = require("./Entities/brand.entity");
const brand_competitor_entity_1 = require("./Entities/brand.competitor.entity");
const productCategory_entity_1 = require("./Entities/productCategory.entity");
const scheme_entity_1 = require("./Entities/scheme.entity");
const collected_amount_entity_1 = require("./Entities/collected_amount.entity");
const payment_entity_1 = require("./Entities/payment.entity");
const course_entity_1 = require("./Entities/LearningModule/course.entity");
const learningSession_entity_1 = require("./Entities/LearningModule/learningSession.entity");
const quiz_entity_1 = require("./Entities/LearningModule/quiz.entity");
const target_entity_1 = require("./Entities/target.entity");
const reason_entity_1 = require("./Entities/reason.entity");
const colour_entity_1 = require("./Entities/colour.entity");
const size_entity_1 = require("./Entities/size.entity");
const feature_entity_1 = require("./Entities/feature.entity");
const role_entity_1 = require("./Entities/role.entity");
const paymentMode_entity_1 = require("./Entities/paymentMode.entity");
const Leave_entity_1 = require("./Entities/Leave.entity");
const LeaveCount_entity_1 = require("./Entities/LeaveCount.entity");
const userLeave_entity_1 = require("./Entities/userLeave.entity");
const userLeaveApplication_entity_1 = require("./Entities/userLeaveApplication.entity");
const activities_entity_1 = require("./Entities/activities.entity");
const activities_jointWork_entity_1 = require("./Entities/activities.jointWork.entity");
const feedback_entity_1 = require("./Entities/feedback.entity");
const samples_entity_1 = require("./Entities/samples.entity");
const giftDistribution_entity_1 = require("./Entities/giftDistribution.entity");
const sessions_entity_1 = require("./Entities/sessions.entity");
const userType_entity_1 = require("./Entities/userType.entity");
const activityRelatedTo_entity_1 = require("./Entities/activityRelatedTo.entity");
const activityType_entity_1 = require("./Entities/activityType.entity");
const nextActionOn_entity_1 = require("./Entities/nextActionOn.entity");
const status_entity_1 = require("./Entities/status.entity");
const dar_entity_1 = require("./Entities/dar.entity");
const workplace_entity_1 = require("./Entities/workplace.entity");
const eDetailing_entity_1 = require("./Entities/eDetailing.entity");
// import { Edetailing } from './Entities/edetailing.entity';
const holidays_entity_1 = require("./Entities/holidays.entity");
const rcpa_entity_1 = require("./Entities/rcpa.entity");
const tax_entity_1 = require("./Entities/tax.entity");
const new_target_entity_1 = require("./Entities/new.target.entity");
const { dbHost, dbName, dbPassword, dbPort, dbUserName, isSynchronize } = (0, config_1.config)();
const dbConfig = { userName: dbUserName, password: dbPassword, host: dbHost, port: dbPort, dbName: dbName, isSynchronize: isSynchronize };
class Postgresdb {
    constructor(config) {
        this.dbConfig = config;
        this.masterDb = null;
        this.isConnected = false;
        this.masterConnection = null;
        this.connectionUrl = `postgresql://${config.userName}:${config.password}@${config.host}:${config.port}/${config.dbName}`;
        console.log(this.connectionUrl, 'connection url');
        this.isSync = config.isSynchronize;
        console.log(this.isSync, 'this.isSync==============');
    }
    /**
     * @description Initialize the Postgresdb
     * @returns Promise<void>
     */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('-------------------------------------------------------------');
                console.log('Initializing postgresdb');
                const { postgresDBUrl } = (0, config_1.config)();
                const dbConn = new typeorm_1.DataSource({
                    type: 'postgres',
                    url: this.connectionUrl,
                    synchronize: JSON.parse(this.isSync),
                    logging: true,
                    entities: [
                        policyHeadType_entity_1.PolicyTypeHead, policyHead_entity_1.PolicyHead, expenseManagement_entity_1.ExpenseManagement, User_entity_1.User,
                        attendance_entity_1.Attendance, beat_entity_1.Beat, collect_payment_entity_1.CollectPayment, discount_entity_1.Discount, distributors_entity_1.Distributor,
                        inventory_entity_1.Inventory, orders_entity_1.Orders, outlet_inventory_entity_1.OutletInventory, products_entity_1.Products, storeCategory_entity_1.StoreCategory,
                        stores_entity_1.Stores, Visit_entity_1.Visits, brand_entity_1.Brand, productCategory_entity_1.ProductCategory, scheme_entity_1.Scheme, collected_amount_entity_1.CollectAmount,
                        payment_entity_1.Payment, course_entity_1.Course, learningSession_entity_1.LearningSession, quiz_entity_1.Quiz, target_entity_1.Target, reason_entity_1.Reason, colour_entity_1.Colour,
                        size_entity_1.Size, feature_entity_1.Feature, role_entity_1.Role, paymentMode_entity_1.PaymentMode, Leave_entity_1.LeaveHead, LeaveCount_entity_1.LeaveHeadCount,
                        userType_entity_1.UserTypes, feedback_entity_1.FeedBack, samples_entity_1.Samples, activities_entity_1.Activities, activities_jointWork_entity_1.JointWork, sessions_entity_1.Sessions,
                        userLeave_entity_1.UserLeave, userLeaveApplication_entity_1.LeaveApplication,
                        activityRelatedTo_entity_1.ActivityRelTo, activityType_entity_1.ActivityType, nextActionOn_entity_1.NextActionOn, status_entity_1.Status, workplace_entity_1.Workplace, holidays_entity_1.Holiday,
                        dar_entity_1.Dar, eDetailing_entity_1.Edetailing, brand_competitor_entity_1.CompetitorBrand, rcpa_entity_1.RCPA, tax_entity_1.Taxes, giftDistribution_entity_1.Gifts, new_target_entity_1.NewTarget
                    ],
                    schema: 'public',
                    extra: {
                        ssl: {
                            rejectUnauthorized: false,
                        },
                        host: this.dbConfig.host,
                        port: 22,
                        user: this.dbConfig.userName,
                        password: this.dbConfig.password,
                        keepAlive: true,
                        timeZone: 'IST'
                    }
                });
                this.isConnected = true;
                this.masterConnection = yield dbConn.initialize();
                console.log('Connected to host', postgresDBUrl);
                return dbConn;
            }
            catch (err) {
                this.isConnected = false;
                console.log('Failed to connect to postgres db. ', err);
                throw err;
            }
        });
    }
    getConnection() {
        try {
            if (this.masterConnection) {
                return this.masterConnection;
            }
            throw new Error(`PostgresDbConnection is not created`);
        }
        catch (err) {
            console.log('????????????????????????????????', err);
        }
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.masterConnection.close();
            this.isConnected = false;
        });
    }
}
exports.DbConnections = {
    AppDbConnection: new Postgresdb(dbConfig)
};
