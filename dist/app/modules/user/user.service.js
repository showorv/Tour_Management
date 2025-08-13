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
exports.userService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const userExist = yield user_model_1.User.findOne({ email });
    if (userExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "email already exist");
    }
    const hashPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.HASH_SALT));
    const authProvider = { provider: "credential", providerId: email };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashPassword, auths: [authProvider] }, rest));
    return user;
});
const updateUser = (userId, payload, decodeToken) => __awaiter(void 0, void 0, void 0, function* () {
    // email cannot updateUser,
    // name address password can updateUser. password will rehashing
    // role isverified isdelete isactive cant update without admin or superadmin
    if (decodeToken.role === user_interface_1.Role.USER || decodeToken.role === user_interface_1.Role.GUIDE) {
        if (userId !== decodeToken.userId) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "you are not authorized");
        }
    }
    const findUser = yield user_model_1.User.findById(userId);
    if (!findUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found");
    }
    if (decodeToken.role === user_interface_1.Role.ADMIN && findUser.role === user_interface_1.Role.SUPERADMIN) { // this means admin cannot update super admin
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "you are not authorized");
    }
    if (payload.role) {
        if (decodeToken.role === user_interface_1.Role.USER || decodeToken.role === user_interface_1.Role.GUIDE) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "you are not authorized");
        }
        // if(payload.role === Role.SUPERADMIN || decodeToken.role === Role.ADMIN){
        //     throw new AppError(httpStatus.FORBIDDEN, "you are not authorized")
        // }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodeToken.role === user_interface_1.Role.USER || decodeToken.role === user_interface_1.Role.GUIDE) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "you are not authorized");
        }
    }
    // if(payload.password){
    //     payload.password = await bcryptjs.hash(payload.password,Number( envVars.HASH_SALT))
    // }
    const newUpdateUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    if (payload.image && findUser.image) {
        yield (0, cloudinary_config_1.cloudinaryDeleteUpload)(findUser.image);
    }
    return newUpdateUser;
});
const getUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find();
    const totalUser = yield user_model_1.User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUser
        }
    };
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return user;
});
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return user;
});
exports.userService = {
    createUser,
    getUser,
    updateUser,
    getMe,
    getSingleUser
};
