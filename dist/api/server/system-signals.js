"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let signalSetup = false;
/**
 * @description Setup event handers dealing with termination events.
 */
exports.default = (httpServer) => {
    if (!signalSetup) {
        signalSetup = true;
        process.on('uncaughtException', err => {
            console.log('Uncaught exception', err);
            process.exit(1);
        });
        process.on('SIGINT', () => {
            console.log('SIGINT');
            httpServer.close();
            process.exit(0);
        });
        process.on('SIGTERM', () => {
            console.log('SIGTERM');
            httpServer.close();
            process.exit(0);
        });
    }
};
