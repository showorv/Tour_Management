"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserToken = void 0;
const env_1 = require("../config/env");
const generateToken_1 = require("./generateToken");
const createUserToken = (user) => {
    const jsonPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    const accessToken = (0, generateToken_1.generateToken)(jsonPayload, env_1.envVars.JWT_SECRET, env_1.envVars.JWR_EXPIRED);
    const refreshToken = (0, generateToken_1.generateToken)(jsonPayload, env_1.envVars.JWT_REFRESH_SECRET, env_1.envVars.JWT_REFRESH_EXPIRED);
    return {
        accessToken,
        refreshToken
    };
};
exports.createUserToken = createUserToken;
