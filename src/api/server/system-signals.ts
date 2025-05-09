import http from 'http';

let signalSetup = false;
/**
 * @description Setup event handers dealing with termination events.
 */
export default (httpServer: http.Server) => {
    if (!signalSetup) {
        signalSetup = true;

        process.on('uncaughtException', err => {
            console.log('Uncaught exception', err);
            process.exit(1);
        })

        process.on('SIGINT', () => {
            console.log('SIGINT');
            httpServer.close();
            process.exit(0);
        })

        process.on('SIGTERM', () => {
            console.log('SIGTERM');
            httpServer.close();
            process.exit(0);
        })
    }
};