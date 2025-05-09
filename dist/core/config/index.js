"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const config = () => {
    const x = { path: path_1.default.join(__dirname, '../../../.env') };
    console.log(x);
    // console.log(x);
    dotenv_1.default.config(x);
    return {
        environment: process.env.NODE_ENV,
        postgresDBUrl: process.env.POSTGRESDB_URL || '',
        port: process.env.PORT || '',
        dbUserName: process.env.DBUSERNAME || 'postgres',
        dbPassword: process.env.DBPASSWORD || 'rootpassword',
        dbHost: process.env.DBHOST || 'localhost',
        dbPort: parseInt(process.env.DBPORT || '5432'),
        dbName: process.env.DBNAME || 'testdb',
        isSynchronize: process.env.IS_SYNCHRONIZE || 'false',
        privateKey: process.env.PRIVATEKEY,
        expiry: process.env.EXPIRY,
        accessKey: process.env.AWSACCESSKEY,
        secretKey: process.env.AWSSECRETKEY,
        region: process.env.AWSREGION,
        bucketName: process.env.AWSBUCKETNAME
    };
};
exports.config = config;
const validateConfig = () => {
    const cfg = (0, exports.config)();
    Object.keys(cfg).forEach((key) => {
        if (cfg[key] === undefined || typeof cfg[key] === 'undefined' || cfg[key] === '') {
            throw new Error(`Please define "${key}" configuration value. See your .env file or the environment variables
            of your system to configure the missing paramenters`);
        }
    });
    return true;
};
exports.validateConfig = validateConfig;
