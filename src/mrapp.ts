import "reflect-metadata"
import { validateConfig } from './core/config';
import * as server from './api/server';
import { cronService } from "./api/cronService";

const validateConfigObject = () => {
    try {
        validateConfig();
    } catch (error: any) {
        console.log(`Invalid config: ${error.message}`);
        process.exit(1);
    }
} 
let app = null;

(() => {
    validateConfigObject();
    server.start()
        .then((theApp) => {
            app = theApp;
            cronService();
            console.log('Instance started!  ');
        })
        .catch((err) => {
            console.log('An instance has failed to start %s', err.stderr || err.message || JSON.stringify(err));
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        });
})();

module.exports = app;