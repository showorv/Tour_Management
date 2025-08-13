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
exports.paymentController = void 0;
const catchAsyncError_1 = require("../../utils/catchAsyncError");
const payment_service_1 = require("./payment.service");
const env_1 = require("../../config/env");
const response_1 = require("../../utils/response");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sslcomerz_service_1 = require("../sslcomerz/sslcomerz.service");
const initPayment = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const result = yield payment_service_1.paymentService.initPayment(bookingId);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "payment init successfully",
        data: result
    });
}));
const paymentSuccess = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.paymentService.paymentSuccess(query);
    if (result) {
        res.redirect(`${env_1.envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
}));
const paymentFail = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.paymentService.paymentFail(query);
    if (result) {
        res.redirect(`${env_1.envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
}));
const paymentCancel = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.paymentService.paymentCancel(query);
    if (result) {
        res.redirect(`${env_1.envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    }
}));
const invoicePaymentDownloadUrl = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { paymentId } = req.params;
    const result = yield payment_service_1.paymentService.invoicePaymentDownloadUrl(paymentId, decodedToken);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "invoice url get successfully",
        data: result
    });
}));
const validatePayment = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("sslcomerz ipn url body", req.body);
    yield sslcomerz_service_1.sslcomerzService.validatePayment(req.body);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "payment validated successfully",
        data: null
    });
}));
exports.paymentController = { paymentFail, paymentSuccess, paymentCancel, initPayment, invoicePaymentDownloadUrl, validatePayment };
