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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.shutdown = exports.start = void 0;
const init_app_1 = require("./init-app");
const DB_1 = require("../../core/DB");
const system_signals_1 = __importDefault(require("./system-signals"));
const express_1 = __importDefault(require("express"));
let app;
let httpServer;
const shutdownHttpServer = () => {
    return new Promise((resolve, reject) => {
        if (httpServer) {
            httpServer.close();
            httpServer = null;
            app = null;
        }
        else {
            console.log('Http server is not running');
        }
        resolve(true);
    });
};
const startHttpServer = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        console.log('Started listening to port %s', process.env.PORT || 5000);
        if (app)
            resolve(app.listen(process.env.PORT));
        else
            reject('App was not initialized properly');
    });
});
/**
 * @description shutdown server/application
 * @returns Promise<void>
 */
const shutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield shutdownHttpServer();
        yield (0, DB_1.close)();
    }
    catch (err) {
        console.log('Server shutdown failed ', JSON.stringify(err));
        throw err;
    }
});
exports.shutdown = shutdown;
/**
 * @description start server/application
 * @returns Promise<void>
 */
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (httpServer) {
            yield shutdown();
        }
        console.log('Connecting to resources');
        yield (0, DB_1.start)();
        console.log('PostgresDB Status', DB_1.postgresdb.isConnected);
        app = (0, express_1.default)();
        yield (0, init_app_1.initExpressApp)(app);
        app.set('view engine', 'ejs');
        console.log('Starting httpServer');
        httpServer = yield startHttpServer();
        console.log('System signals setup');
        (0, system_signals_1.default)(httpServer);
        return { app, httpServer };
    }
    catch (err) {
        console.log('Server Startup failed', JSON.stringify(err));
        throw err;
    }
});
exports.start = start;
const port = () => {
    if (httpServer)
        return httpServer.address().port || '3000';
    else
        return '3000';
};
exports.port = port;
