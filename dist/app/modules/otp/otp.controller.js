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
exports.otpController = void 0;
const catchAsyncError_1 = require("../../utils/catchAsyncError");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const response_1 = require("../../utils/response");
const otp_service_1 = require("./otp.service");
const sendOTP = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name } = req.body;
    yield otp_service_1.otpService.sendOTP(email, name);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "otp send successfully",
        data: null,
    });
}));
const verifyOTP = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    yield otp_service_1.otpService.verifyOTP(email, otp);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "otp verified successfully",
        data: null,
    });
}));
exports.otpController = { sendOTP, verifyOTP };
