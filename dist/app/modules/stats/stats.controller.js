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
exports.statsController = void 0;
const catchAsyncError_1 = require("../../utils/catchAsyncError");
const response_1 = require("../../utils/response");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const stats_service_1 = require("./stats.service");
const userStats = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield stats_service_1.statsService.userStats();
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "user stats get successfully",
        data: user
    });
}));
const tourStats = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield stats_service_1.statsService.tourStats();
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "tour stats get successfully",
        data: tour
    });
}));
const bookingStats = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield stats_service_1.statsService.bookingStats();
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "booking stats get successfully",
        data: booking
    });
}));
const paymentStats = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield stats_service_1.statsService.paymentStats();
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "payment stats get successfully",
        data: payment
    });
}));
exports.statsController = { userStats, tourStats, bookingStats, paymentStats };
