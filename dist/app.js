"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./app/config/passport");
const cors_1 = __importDefault(require("cors"));
const routers_1 = require("./app/routers");
const globalErrorHandle_1 = require("./app/middlewares/globalErrorHandle");
const routeNotFound_1 = require("./app/middlewares/routeNotFound");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const env_1 = require("./app/config/env");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: "my secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.set("trust proxy", 1);
app.use(express_1.default.urlencoded({ extended: true })); // for read form-data
app.use((0, cors_1.default)({
    origin: env_1.envVars.FRONTEND_URL,
    credentials: true
}));
app.use("/api/v1", routers_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to tour management"
    });
});
// route not found
app.use(routeNotFound_1.routeNotFound);
// global error
app.use(globalErrorHandle_1.globalError);
exports.default = app;
