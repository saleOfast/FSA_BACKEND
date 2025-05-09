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
exports.initExpressApp = void 0;
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = __importDefault(require("util"));
const error_handler_1 = __importDefault(require("./error-handler"));
const routers_1 = require("../v1/routers");
const PARAMS = {
    basePath: '/api',
    supportedVersions: ['v1'],
    currentVersion: 'v1'
};
const addApiRoutes = (app) => {
    app.use(util_1.default.format('%s/%s', PARAMS.basePath, PARAMS.currentVersion), routers_1.routes);
};
const finalization = (app) => {
    app.use(error_handler_1.default);
    app.all('/', (req, res) => res.status(202).json({ status: 202, message: "Route Working..." }));
    app.all('*', (req, res) => res.status(404).json({ status: 404, message: "Route Not Found." }));
};
/**
 * @description Initialise the express app, middleware, route handlers etc
 * @returns Promise<*||Function>
 */
const initExpressApp = (app) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Setting OPTIONS requests to return CORS headers');
    app.use((0, cors_1.default)({
        origin: '*'
    }));
    // TODO load if any global middlewares
    console.log('Setting request body parser');
    app.use(body_parser_1.default.json({ limit: '10mb' }));
    app.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: true }));
    // app.use(session({
    //     resave: false,
    //     saveUninitialized: true,
    //     secret: 'thisIsSecret'
    // }));
    console.log('Setting passport');
    // app.use(passport.session());
    console.log('Adding api routes from init-app');
    addApiRoutes(app);
    finalization(app);
});
exports.initExpressApp = initExpressApp;
