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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const catchAsyncError_1 = require("../../utils/catchAsyncError");
const auth_service_1 = require("./auth.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const cookieSet_1 = require("../../utils/cookieSet");
const passport_1 = __importDefault(require("passport"));
const createUserToken_1 = require("../../utils/createUserToken");
const env_1 = require("../../config/env");
const createLogin = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //manual login
    // const loginInfo = await authService.createLoginService(req.body)
    // res.cookie("access-token", loginInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })
    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true, // eta na dile frontend e cookie set hbe na
    //     secure: false // eta na dile frontend e cookie access korte dibe na cors er karone
    // })
    // setCookies(res,loginInfo)
    // res.status(httpsCode.OK).json({
    //     success: true,
    //     message: "User logged in successfully",
    //     data: loginInfo
    // })
    //passport local login
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            // return new AppError(401, err) dewa jabe na direct
            return next(new AppError_1.default(401, err));
        }
        if (!user) {
            return next(new AppError_1.default(401, info.message)); // all are comes from passport.ts local
        }
        const userToken = (0, createUserToken_1.createUserToken)(user);
        (0, cookieSet_1.setCookies)(res, userToken);
        // delete user.toObject().password
        const _a = user.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
        res.status(http_status_codes_1.default.OK).json({
            success: true,
            message: "User logged in successfully",
            data: {
                accessToken: userToken.accessToken,
                refreshToken: userToken.refreshToken,
                user: rest
            }
        });
    }))(req, res, next);
}));
const getNewAccessToken = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.refreshToken;
    if (!token) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "cannot get refreshtoken from cookie");
    }
    const accessToken = yield auth_service_1.authService.getNewAccessToken(token);
    // to set new accessToken in cookie
    // res.cookie("access-token", accessToken.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })
    (0, cookieSet_1.setCookies)(res, accessToken);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "User get new accessToken",
        data: accessToken
    });
}));
const logout = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("access-token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "User logged out",
        data: null
    });
}));
const changePassword = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;
    yield auth_service_1.authService.changePassword(oldPassword, newPassword, decodedToken);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "password change successfully",
        data: null
    });
}));
const resetPassword = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    yield auth_service_1.authService.resetPassword(req.body, decodedToken);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "password reset successfully",
        data: null
    });
}));
const setPassword = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { password } = req.body;
    yield auth_service_1.authService.setPassword(decodedToken.userId, password);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "password set successfully",
        data: null
    });
}));
const forgotPassword = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auth_service_1.authService.forgotPassword(email);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "reset password link sent successfully",
        data: null
    });
}));
// http://localhost:5000/api/v1/auth/google?redirect=/booking
const googleController = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const redirect = req.query.redirect || "";
    passport_1.default.authenticate("google", { scope: ["profile", "email"], state: redirect })(req, res);
}));
// http://localhost:5000/api/v1/auth/google/callback?state=/booking or /
const googleCallback = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let state = req.query.state ? req.query.state : "";
    if (state.startsWith("/")) {
        state = state.slice(1); // /booking-> booking
    }
    //  jkhn passport e user create hobe tkhn passport amdr k ta req.user e diye dibe
    const user = req.user;
    console.log("user", user);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found");
    }
    const tokenInfo = (0, createUserToken_1.createUserToken)(user);
    (0, cookieSet_1.setCookies)(res, tokenInfo);
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${state}`);
}));
exports.authController = {
    createLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallback,
    googleController,
    changePassword,
    setPassword,
    forgotPassword
};
