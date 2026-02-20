"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyResourceAccess = exports.close = exports.start = exports.postgresdb = void 0;
const postgresdb_1 = require("./postgresdb");
const postgresdb = postgresdb_1.DbConnections.AppDbConnection;
exports.postgresdb = postgresdb;
/**
 * @description Gracefully shutdown resources
 * @returns Promise
 */
const close = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (postgresdb.isConnected) {
            yield postgresdb.close();
            console.log('PostgresDB connection Closed');
        }
    }
    catch (error) {
        console.log('Error while closing postgresdb', error);
        throw error;
    }
});
exports.close = close;
/**
 * @description Initialise the application's resources
 * @returns Promise
 */
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield close();
    yield postgresdb.initialize();
    // Auto-seed customer data if it doesn't exist
    try {
        const { autoSeedCustomerData } = yield Promise.resolve().then(() => __importStar(require('../../scripts/seed-customer-data')));
        yield autoSeedCustomerData();
    }
    catch (error) {
        console.log('⚠️  Auto-seed skipped or failed:', error);
        // Continue server startup even if seeding fails
    }
});
exports.start = start;
/**
 * @description Verify if resources is connected or not
 * @throws Error if not connected
 */
const verifyResourceAccess = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!postgresdb.isConnected) {
        throw new Error('postgresdb is not connected.');
    }
});
exports.verifyResourceAccess = verifyResourceAccess;
