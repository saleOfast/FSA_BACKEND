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
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const config_1 = require("./core/config");
const server = __importStar(require("./api/server"));
const cronService_1 = require("./api/cronService");
const validateConfigObject = () => {
    try {
        (0, config_1.validateConfig)();
    }
    catch (error) {
        console.log(`Invalid config: ${error.message}`);
        process.exit(1);
    }
};
let app = null;
(() => {
    validateConfigObject();
    server.start()
        .then((theApp) => {
        app = theApp;
        (0, cronService_1.cronService)();
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
