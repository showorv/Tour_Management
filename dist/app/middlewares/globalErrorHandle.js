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
exports.globalError = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const cloudinary_config_1 = require("../config/cloudinary.config");
// egula k function hishebeo rkhte pari. helper folder e function create kore. 
const globalError = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let statuscode = 500;
    let message = ` something went wrong `;
    const errorSources = [
    //     {
    //     path: "",
    //     message: ""
    // }
    ];
    /*
    console log(err) e code pabo
    mongoose error ->>
                 duplicate -> SC=11000
                 cast error -> if object id is wrong

    */
    if (req.file) {
        yield (0, cloudinary_config_1.cloudinaryDeleteUpload)(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const allImages = (_a = req.files) === null || _a === void 0 ? void 0 : _a.map(file => file.path);
        yield Promise.all(allImages.map(url => (0, cloudinary_config_1.cloudinaryDeleteUpload)(url)));
    }
    if (err.code === 11000) {
        const matchArray = err.message.match(/"([^"]*)"/); // regx
        statuscode = 400;
        message = `${matchArray[1]} already exist`;
    }
    else if (err.name === "CastError") {
        statuscode = 400;
        message = "Invalid Mongodb ObjectId";
        errorSources.push({
            path: err.path,
            message: `Invalid value for ${err.path}`,
        });
    }
    else if (err.name === "ValidationError") {
        statuscode = 400;
        const errors = Object.values(err.errors); /* converting const err = {
                                                    errors: {
                                                    name: { message: "Name is required" },
                                                    email: { message: "Email is invalid" },
                                                    }
                                                }; into array [{name}, {email}]
                                                 */
        errors.forEach((errorObject) => errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        }));
        message = " mongoose Validation error";
    }
    else if (err.name === "ZodError") {
        statuscode = 400;
        message = "Zod validation error";
        err.issues.forEach((issue) => errorSources.push({
            path: issue.path[issue.path - 1], // path: [] so always last index er ta dhore anbo zod er jnne. 
            message: issue.message
        }));
    }
    else if (err instanceof AppError_1.default) { // business logic error
        statuscode = err.statusCode,
            message = err.message;
    }
    else if (err instanceof Error) { // global error
        statuscode = 500,
            message = err.message;
    }
    res.status(statuscode).json({
        success: false,
        message,
        errorSources,
        err: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null
    });
});
exports.globalError = globalError;
