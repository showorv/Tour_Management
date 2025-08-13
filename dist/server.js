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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const seed_1 = require("./app/seed/seed");
const redis_config_1 = require("./app/config/redis.config");
let server;
// dotenv.config();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // console.log(envVars.NODE_ENV);
            yield mongoose_1.default.connect(env_1.envVars.MONGODB_URI);
            server = app_1.default.listen(env_1.envVars.PORT, () => {
                console.log(`Server listening at ${env_1.envVars.PORT}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectRedis)();
    yield main();
    yield (0, seed_1.superAdmin)();
}))();
// server error handle and server off
process.on("unhandledRejection", (err) => {
    console.log("unhandle rejection detected... server shutting down..", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", (err) => {
    console.log("uncaught exception detected... server shutting down..", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGTERM", () => {
    console.log("sigterm signal recived... server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGINT", () => {
    console.log("sigintsignal recived... server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
