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
exports.paymentService = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const invoice_1 = require("../../utils/invoice");
const sendEmail_1 = require("../../utils/sendEmail");
const booking_interface_1 = require("../booking/booking.interface");
const booking_model_1 = require("../booking/booking.model");
const sslcomerz_service_1 = require("../sslcomerz/sslcomerz.service");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    // assume user first e payment e cancel korse.but pore abr pay korar jnne to url ashbe na. tai ekhan theke again url create kore sslcomerz page e pathanoi  main logic
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "payment not found. you have not booked tour");
    }
    const booking = yield booking_model_1.Booking.findById(payment.booking);
    const userAddress = (booking === null || booking === void 0 ? void 0 : booking.user).address;
    const userName = (booking === null || booking === void 0 ? void 0 : booking.user).name;
    const userPhone = (booking === null || booking === void 0 ? void 0 : booking.user).phone;
    const userEmail = (booking === null || booking === void 0 ? void 0 : booking.user).email;
    const sslPayload = {
        address: userAddress,
        name: userName,
        phone: userPhone,
        email: userEmail,
        transactionId: payment.transactionId,
        amount: payment.amount
    };
    const sslcomerz = yield sslcomerz_service_1.sslcomerzService.sslcomerzInitialize(sslPayload);
    return {
        paymentUrl: sslcomerz.GatewayPageURL
    };
});
const paymentSuccess = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // updated booking status
    // update payment status
    // redirect to frontend
    //not send reponse
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        // payment k transaction id er maddhome get korte pari. r transaction id amra query theke nite pari.
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PaymentStatus.PAID
        }, { new: true, runValidators: true, session });
        if (!updatedPayment) {
            throw new AppError_1.default(401, "payment not found");
        }
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.BookingStatus.COMPLETE }, { new: true, runValidators: true, session })
            .populate("tour", "title")
            .populate("user", "name email");
        if (!updatedBooking) {
            throw new AppError_1.default(401, "booking not found");
        }
        const invoiceData = {
            bookingDate: updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.createdAt,
            guestCount: updatedBooking.guestCount,
            totalAmount: updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.amount,
            tourTitle: updatedBooking.tour.title,
            transactionId: updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.transactionId,
            userName: updatedBooking.user.name
        };
        const bufferPDF = yield (0, invoice_1.generatePDF)(invoiceData);
        const paymentUrl = yield (0, cloudinary_config_1.uploadBufferInCloudinary)(bufferPDF, "invoice");
        // console.log(paymentUrl);
        yield payment_model_1.Payment.findByIdAndUpdate(updatedPayment._id, { invoiceUrl: paymentUrl === null || paymentUrl === void 0 ? void 0 : paymentUrl.secure_url }, { runValidators: true, session });
        yield (0, sendEmail_1.sendEmail)({
            to: updatedBooking.user.email,
            subject: "Your booking invoice",
            templateName: "invoice",
            templateData: {
                name: updatedBooking.user.name,
                transactionId: updatedPayment.transactionId,
                paid: updatedPayment.amount
            },
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: bufferPDF,
                    contentType: "application/pdf"
                }
            ]
        });
        yield session.commitTransaction(); // transaction here
        session.endSession();
        return { success: true, message: "Payment completed successfully" };
    }
    catch (error) {
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw error;
    }
});
const paymentFail = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        // payment k transaction id er maddhome get korte pari. r transaction id amra query theke nite pari.
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PaymentStatus.FAILED
        }, { new: true, runValidators: true, session });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.BookingStatus.FAILED }, { new: true, runValidators: true, session });
        yield session.commitTransaction(); // transaction here
        session.endSession();
        return { success: true, message: "Payment failed" };
    }
    catch (error) {
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw error;
    }
});
const paymentCancel = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PaymentStatus.CANCELLED
        }, { new: true, runValidators: true, session });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.BookingStatus.CANCEL }, { new: true, runValidators: true, session });
        yield session.commitTransaction(); // transaction here
        session.endSession();
        return { success: true, message: "Payment cancelled" };
    }
    catch (error) {
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw error;
    }
});
const invoicePaymentDownloadUrl = (paymentId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!decodedToken.userId) {
        throw new AppError_1.default(401, "you cannot access this");
    }
    const payment = yield payment_model_1.Payment.findById(paymentId)
        .populate({
        path: "booking",
        select: "user"
    })
        .select("invoiceUrl booking");
    if (!payment) {
        throw new AppError_1.default(401, " payment not found");
    }
    if (!payment.invoiceUrl) {
        throw new AppError_1.default(401, " payment not found");
    }
    const bookingUserId = (_b = (_a = payment === null || payment === void 0 ? void 0 : payment.booking) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.toString();
    // console.log(bookingUserId);
    if (bookingUserId !== decodedToken.userId) {
        throw new AppError_1.default(403, "You are not authorized to view this invoice");
    }
    return payment.invoiceUrl;
});
exports.paymentService = { paymentCancel, paymentFail, paymentSuccess, initPayment, invoicePaymentDownloadUrl };
