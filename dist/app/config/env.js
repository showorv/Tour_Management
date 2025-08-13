"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.envVars = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    JWR_EXPIRED: process.env.JWR_EXPIRED,
    HASH_SALT: process.env.HASH_SALT,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRED: process.env.JWT_REFRESH_EXPIRED,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    SSL: {
        SSL_STORE_ID: process.env.SSL_STORE_ID,
        SSL_STORE_PASS: process.env.SSL_STORE_PASS,
        SSL_PAYMENT_API: process.env.SSL_PAYMENT_API,
        SSL_VALIDATION_API: process.env.SSL_VALIDATION_API,
        SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL,
        SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL,
        SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL,
        SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL,
        SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL,
        SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL,
        SSL_VALIDATE_IPN: process.env.SSL_VALIDATE_IPN
    },
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY,
    EMAILSENDER: {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
        SMTP_FROM: process.env.SMTP_FROM
    },
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT
};
