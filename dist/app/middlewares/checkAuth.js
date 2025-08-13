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
exports.checkAuth = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const generateToken_1 = require("../utils/generateToken");
const env_1 = require("../config/env");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError_1.default(403, "access token undefined");
        }
        const verifiedTokens = (0, generateToken_1.verifiedToken)(accessToken, env_1.envVars.JWT_SECRET);
        const userExist = yield user_model_1.User.findOne({ email: verifiedTokens.email });
        if (!userExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user not exist");
        }
        if (userExist.isActive === user_interface_1.IActive.BLOCKED || userExist.isActive === user_interface_1.IActive.INACTIVE) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user is block or inactive");
        }
        if (userExist.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user is deleted");
        }
        if (!userExist.isVerified) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user is not verified");
        }
        req.user = verifiedTokens;
        if (!authRoles.includes(verifiedTokens.role)) {
            throw new AppError_1.default(403, "you cannot access this route");
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;
