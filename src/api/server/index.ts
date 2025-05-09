
import { initExpressApp } from './init-app';
import { close, postgresdb, start as startResource } from '../../core/DB';
import setupSystemSignals from './system-signals';

import express, { Request, Response, Application } from 'express';
import http from 'http';

let app: Application | null;
let httpServer: http.Server | null;



const shutdownHttpServer = () => {
    return new Promise((resolve, reject) => {
        if (httpServer) {
            httpServer.close();
            httpServer = null;
            app = null;
        } else {
            console.log('Http server is not running');
        }
        resolve(true);
    });
};


const startHttpServer = async (): Promise<http.Server> => {
    return new Promise((resolve, reject) => {
        console.log('Started listening to port %s', process.env.PORT || 5000);
        if (app) resolve(app.listen(process.env.PORT));
        else reject('App was not initialized properly');
    })
};

/**
 * @description shutdown server/application
 * @returns Promise<void>
 */
const shutdown = async () => {
    try {
        await shutdownHttpServer();
        await close();
    } catch (err) {
        console.log('Server shutdown failed ', JSON.stringify(err));
        throw err;
    }
};

/**
 * @description start server/application
 * @returns Promise<void>
 */
const start = async () => {
    try {
        if (httpServer) {
            await shutdown();
        }
        console.log('Connecting to resources');
        await startResource();
        console.log('PostgresDB Status', postgresdb.isConnected);
        app = express();
        await initExpressApp(app);
        app.set('view engine', 'ejs');
       
        console.log('Starting httpServer');
        httpServer = await startHttpServer();

        console.log('System signals setup');
        setupSystemSignals(httpServer);

        return { app, httpServer };

    } catch (err) {
        console.log('Server Startup failed', JSON.stringify(err));
        throw err;
    }
};

const port = () => {
    if (httpServer)
        return (httpServer.address() as any).port || '3000';
    else return '3000';
};

export {
    start,
    shutdown,
    port
}