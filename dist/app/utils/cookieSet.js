"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookies = void 0;
const env_1 = require("../config/env");
const setCookies = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie("access-token", tokenInfo.accessToken, {
            httpOnly: true,
            // secure: envVars.NODE_ENV==="development"?false: true,
            secure: env_1.envVars.NODE_ENV !== "development",
            sameSite: "none"
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true, // eta na dile frontend e cookie set hbe na
            // secure: false // eta na dile frontend e cookie access korte dibe na cors er karone
            secure: env_1.envVars.NODE_ENV !== "development",
            sameSite: "none"
        });
    }
};
exports.setCookies = setCookies;
