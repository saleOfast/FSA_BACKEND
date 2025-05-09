import { DataSource } from 'typeorm';
import { config as envConfig } from '../config';

import { PolicyHead } from "./Entities/policyHead.entity";
import { PolicyTypeHead } from "./Entities/policyHeadType.entity";
import { ExpenseManagement } from "./Entities/expenseManagement.entity";

import { User } from './Entities/User.entity';
import { Attendance } from './Entities/attendance.entity';
import { Beat } from './Entities/beat.entity';
import { CollectPayment } from './Entities/collect_payment.entity';
import { Discount } from './Entities/discount.entity';
import { Distributor } from './Entities/distributors.entity';
import { Inventory } from './Entities/inventory.entity';
import { Orders } from './Entities/orders.entity';
import { OutletInventory } from './Entities/outlet_inventory.entity';
import { Products } from './Entities/products.entity';
import { StoreCategory } from './Entities/storeCategory.entity';
import { Stores } from './Entities/stores.entity';
import { Visits } from './Entities/Visit.entity';
import { Brand } from './Entities/brand.entity';
import { CompetitorBrand } from './Entities/brand.competitor.entity';
import { ProductCategory } from './Entities/productCategory.entity';
import { Scheme } from './Entities/scheme.entity';
import { CollectAmount } from './Entities/collected_amount.entity';
import { Payment } from './Entities/payment.entity';
import { Course } from './Entities/LearningModule/course.entity';
import { LearningSession } from './Entities/LearningModule/learningSession.entity';
import { Quiz } from './Entities/LearningModule/quiz.entity';
import { Target } from './Entities/target.entity';
import { Reason } from './Entities/reason.entity';
import { Colour } from './Entities/colour.entity';
import { Size } from './Entities/size.entity';
import { Feature } from './Entities/feature.entity';
import { Role } from './Entities/role.entity';
import { PaymentMode } from './Entities/paymentMode.entity';

import { LeaveHead } from './Entities/Leave.entity';
import { LeaveHeadCount } from './Entities/LeaveCount.entity';
import { UserLeave } from './Entities/userLeave.entity';
import { LeaveApplication } from './Entities/userLeaveApplication.entity';

import { Activities } from './Entities/activities.entity';
import { JointWork } from './Entities/activities.jointWork.entity';
import { FeedBack } from './Entities/feedback.entity';
import { Samples } from './Entities/samples.entity';
import { Gifts } from './Entities/giftDistribution.entity';

import { Sessions } from './Entities/sessions.entity';
import { UserTypes } from './Entities/userType.entity';
import { ActivityRelTo } from './Entities/activityRelatedTo.entity';
import { ActivityType } from './Entities/activityType.entity';
import { NextActionOn } from './Entities/nextActionOn.entity';
import { Status } from './Entities/status.entity';
import { Dar } from './Entities/dar.entity';
import { Workplace } from './Entities/workplace.entity';
import { Edetailing } from './Entities/eDetailing.entity';
// import { Edetailing } from './Entities/edetailing.entity';
import { Holiday } from './Entities/holidays.entity';
import { RCPA } from './Entities/rcpa.entity';
import { Taxes } from './Entities/tax.entity';

import { NewTarget } from './Entities/new.target.entity';


const { dbHost, dbName, dbPassword, dbPort, dbUserName, isSynchronize } = envConfig();

interface IDBConfig {
	userName: string,
	password: string,
	host: string,
	port: number,
	dbName: string,
	isSynchronize: string
}

const dbConfig: IDBConfig = { userName: dbUserName, password: dbPassword, host: dbHost, port: dbPort, dbName: dbName, isSynchronize: isSynchronize };

class Postgresdb {
	masterDb: any;
	isConnected: any;
	masterConnection: any;
	private connectionUrl: string;
	private isSync: string;
	private dbConfig: IDBConfig;

	constructor(config: IDBConfig) {
		this.dbConfig = config;
		this.masterDb = null;
		this.isConnected = false;
		this.masterConnection = null;
		this.connectionUrl = `postgresql://${config.userName}:${config.password}@${config.host}:${config.port}/${config.dbName}` as string;
		console.log(this.connectionUrl, 'connection url')
		this.isSync = config.isSynchronize;
		console.log(this.isSync, 'this.isSync==============')
	}
	/**
	 * @description Initialize the Postgresdb
	 * @returns Promise<void>
	 */
	async initialize() {
		try {
			console.log('-------------------------------------------------------------');
			console.log('Initializing postgresdb');

			const { postgresDBUrl } = envConfig();
			const dbConn: DataSource = new DataSource({
				type: 'postgres',
				url: this.connectionUrl,
				synchronize: JSON.parse(this.isSync),
				logging: true,
				entities: [
					PolicyTypeHead, PolicyHead, ExpenseManagement, User,
					Attendance, Beat, CollectPayment, Discount, Distributor,
					Inventory, Orders, OutletInventory, Products, StoreCategory,
					Stores, Visits, Brand, ProductCategory, Scheme, CollectAmount,
					Payment, Course, LearningSession, Quiz, Target, Reason, Colour,
					Size, Feature, Role, PaymentMode, LeaveHead, LeaveHeadCount,
					UserTypes, FeedBack, Samples, Activities, JointWork, Sessions,
					UserLeave, LeaveApplication,
					ActivityRelTo, ActivityType, NextActionOn, Status, Workplace, Holiday,
					Dar, Edetailing, CompetitorBrand, RCPA, Taxes, Gifts, NewTarget
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
			this.masterConnection = await dbConn.initialize();
			console.log('Connected to host', postgresDBUrl);

			return dbConn;
		} catch (err) {
			this.isConnected = false;
			console.log('Failed to connect to postgres db. ', err);
			throw err;
		}
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
	async close() {
		await this.masterConnection.close();
		this.isConnected = false;
	}
}


export const DbConnections = {
	AppDbConnection: new Postgresdb(dbConfig)
}
