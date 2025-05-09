import { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import util from 'util';

// internal
import * as response from '../../core/utils/response';
import errorHandler from './error-handler';
import { routes } from '../v1/routers';

const PARAMS = {
    basePath: '/api',
    supportedVersions: ['v1'],
    currentVersion: 'v1'
}
const addApiRoutes = (app: Application) => {
    app.use(util.format('%s/%s', PARAMS.basePath, PARAMS.currentVersion), routes);
};

const finalization = (app: Application) => {
    app.use(errorHandler);
    app.all('/', (req, res) => res.status(202).json({ status: 202, message: "Route Working..." }));
    app.all('*', (req, res) => res.status(404).json({ status: 404, message: "Route Not Found." }));
}

/**
 * @description Initialise the express app, middleware, route handlers etc
 * @returns Promise<*||Function>
 */

const initExpressApp = async (app: Application) => {
    console.log('Setting OPTIONS requests to return CORS headers');
    app.use(cors({
        origin: '*'
    }));

    // TODO load if any global middlewares

    console.log('Setting request body parser');
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
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
};

export { initExpressApp };