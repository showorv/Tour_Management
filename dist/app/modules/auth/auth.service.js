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
exports.authService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken_1 = require("../../utils/generateToken");
const env_1 = require("../../config/env");
const createUserToken_1 = require("../../utils/createUserToken");
const sendEmail_1 = require("../../utils/sendEmail");
const createLoginService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const userExist = yield user_model_1.User.findOne({ email });
    if (!userExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Email is incorrect");
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, userExist.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "password is incorrect");
    }
    // const jsonPayload = {
    //     userId: userExist._id,
    //     email: userExist.email,
    //     role: userExist.role
    // }
    const accessUserToken = (0, createUserToken_1.createUserToken)(userExist);
    // const refreshToken = generateToken(jsonPayload, envVars.JWT_REFRESH_SECRET as string, envVars.JWT_REFRESH_EXPIRED as string)
    const _a = userExist.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken: accessUserToken.accessToken,
        refreshToken: accessUserToken.refreshToken,
        user: rest
    };
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = (0, generateToken_1.verifiedToken)(refreshToken, env_1.envVars.JWT_REFRESH_SECRET);
    const userExist = yield user_model_1.User.findOne({ email: verifiedRefreshToken.email });
    if (!userExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user not exist");
    }
    if (userExist.isActive === user_interface_1.IActive.BLOCKED || userExist.isActive === user_interface_1.IActive.INACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user is block or inactive");
    }
    if (userExist.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user is deleted");
    }
    const jsonPayload = {
        userId: userExist._id,
        email: userExist.email,
        role: userExist.role
    };
    const accessToken = (0, generateToken_1.generateToken)(jsonPayload, env_1.envVars.JWT_SECRET, env_1.envVars.JWR_EXPIRED);
    return {
        accessToken,
    };
});
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // check old password  get old password from verifiedtoken. hash the newpassword and save in user
    const user = yield user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "user not found");
    }
    const isOldPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "old password is incorrect");
    }
    if (oldPassword === newPassword) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "new password cannot be same as old password");
    }
    user.password = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.HASH_SALT));
    user.save();
});
const setPassword = (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "user not found");
    }
    if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "user already has password. you can change password from profile");
    }
    const hashPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.HASH_SALT));
    const credentialAuths = {
        provider: "credential",
        providerId: user.email
    };
    const auths = [...user.auths, credentialAuths];
    user.password = hashPassword;
    user.auths = auths;
    yield user.save();
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield user_model_1.User.findOne({ email });
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
    const JwtPayload = {
        userId: userExist._id,
        email: userExist.email,
        role: userExist.role
    };
    const resetToken = jsonwebtoken_1.default.sign(JwtPayload, env_1.envVars.JWT_SECRET, {
        expiresIn: "10m"
    });
    const forgotUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${userExist._id}&token=${resetToken}`;
    (0, sendEmail_1.sendEmail)({
        to: userExist.email,
        subject: "Reset Password ",
        templateName: "sendEmail",
        templateData: {
            name: userExist.name,
            reseturl: forgotUILink,
        }
    });
});
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.id !== decodedToken.userId) {
        throw new AppError_1.default(401, "you cannot change password");
    }
    const user = yield user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError_1.default(401, "user not found");
    }
    const hashPassword = yield bcryptjs_1.default.hash(payload.newPassword, Number(env_1.envVars.HASH_SALT));
    user.password = hashPassword;
    yield user.save();
});
exports.authService = {
    createLoginService,
    getNewAccessToken,
    resetPassword,
    changePassword,
    setPassword,
    forgotPassword
};
