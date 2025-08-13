"use strict";
// frontend e user req for google auth-> hit the backend url of http://localhost:5000/api/v1/auth/google ->passport-> google consent -> select email-> successfull -> http://localhost:5000/api/v1/auth/google/callback -> db store -> token provide for api access
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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
passport_1.default.use(new passport_local_1.Strategy({
    // passport local e username r password field rkhe seta rename korte hbe
    usernameField: "email",
    passwordField: "password"
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield user_model_1.User.findOne({ email });
    if (!userExist) {
        return done(null, false, { message: "user doesnot exist" });
    }
    if (userExist.isActive === user_interface_1.IActive.BLOCKED || userExist.isActive === user_interface_1.IActive.INACTIVE) {
        // throw new AppError(httpsCode.BAD_REQUEST, "user is block or inactive")
        return done("user is block or inactive");
    }
    if (userExist.isDeleted) {
        // throw new AppError(httpsCode.BAD_REQUEST, "user is deleted")
        return done("user is deleted");
    }
    if (!userExist.isVerified) {
        //   throw new AppError(httpsCode.BAD_REQUEST, "user is not verified")
        return done("user isnot verified");
    }
    const isGoogleAuthenticated = userExist.auths.some(providerCheck => providerCheck.provider == "google");
    if (isGoogleAuthenticated && !userExist.password) {
        return done(null, false, { message: "You signed up with Google. To use email and password, log in with Google first and set a password." });
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, userExist.password);
    if (!isPasswordMatch) {
        return done(null, false, { message: "password doesnot match" });
    }
    return done(null, userExist);
})));
// bridge == goolge ? db store -> token -> already store thakle only token provide
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(null, false, { message: "no email found" });
        }
        let user = yield user_model_1.User.findOne({ email });
        if (user && user.isActive === user_interface_1.IActive.BLOCKED || user && user.isActive === user_interface_1.IActive.INACTIVE) {
            // throw new AppError(httpsCode.BAD_REQUEST, "user is block or inactive")
            return done("user is block or inactive");
        }
        if (user && user.isDeleted) {
            // throw new AppError(httpsCode.BAD_REQUEST, "user is deleted")
            return done(null, false, { message: "user is deleted" });
        }
        if (user && !user.isVerified) {
            //   throw new AppError(httpsCode.BAD_REQUEST, "user is not verified")
            return done("user is not verified");
        }
        if (!user) {
            user = yield user_model_1.User.create({
                email,
                name: profile.displayName,
                image: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                isVerified: true,
                role: user_interface_1.Role.USER,
                auths: [
                    {
                        provider: "google",
                        providerId: profile.id
                    }
                ]
            });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
