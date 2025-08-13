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
exports.bookingService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const booking_interface_1 = require("./booking.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_model_1 = require("./booking.model");
const payment_model_1 = require("../payment/payment.model");
const payment_interface_1 = require("../payment/payment.interface");
const tour_model_1 = require("../tour/tour.model");
const sslcomerz_service_1 = require("../sslcomerz/sslcomerz.service");
const getTransaction = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
// booking er mddhe user ta k amra decodedtoken theke pathiye dibo. booking er mddhei payment ta create korbo. booking add korle auto payment create hobe bt unpaid thakbe.shudhu booking id r amount ta add hoye jabe. but jdi kono booking er por kono error hoy booking create hoileo payment create hbe na. thats a catch. etai hcche transaction rollback. means bkash e jdi amra j num e bkash on nei sekhane tk pathay seta kintu user theke tk kate but j number e pathaise sekhane jai na.se tk user chaile ferot ante pare,
// transaction rollback ->>>
/*
    first of all its duplicate the db collections/ replica

    then its create session

    old db ->> [ create booking, create payment, update booking ] ->> real db
    old db ->> [ create booking, error, create payment, error update booking, error ] ->> if any error-> not going to real db. its stop the work of previous and send same old db

*/
//! SSLCOMERZ workflow
/*

1/ Frontend(localhost:5173)-> user-> tour -> booking (pending) -> payment (unpaid) -> sslcomerz page -> payment complete -> backend api(payment/success) -> update booking (success) payment (paid) -> redirect -> Frontend (localhost:5173/payment/sucess)

2/ Frontend(localhost:5173)-> user-> tour -> booking (pending) -> payment (unpaid) -> sslcomerz page -> payment failed/canceled -> backend api -> update booking (pending) payment (unpaid) -> redirect -> Frontend (localhost:5173/payment/fail or cancel)

*/
const createBookings = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = getTransaction();
    // create session for transaction rollback
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction(); // give this session to create,update, in get not. in create have to give an array in first arguement
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!(user === null || user === void 0 ? void 0 : user.phone) || !(user === null || user === void 0 ? void 0 : user.address)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please update your profile by adding phone no and address");
        }
        const tour = yield tour_model_1.Tour.findById(payload.tour).select("costFrom");
        if (!tour) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "tour not found");
        }
        if (!tour.costFrom) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "tour has no cost");
        }
        const amount = Number(tour === null || tour === void 0 ? void 0 : tour.costFrom) * Number(payload.guestCount);
        const booking = yield booking_model_1.Booking.create([Object.assign({ user: userId, status: booking_interface_1.BookingStatus.PENDING }, payload)], { session }); // in create or update session gives an array.
        // throw new Error()
        // booking create er payment e kono error na thkle booking create hoileo payment create hobe na. thats why transaction rollback use korte hbe
        const payment = yield payment_model_1.Payment.create([{
                booking: booking[0]._id,
                status: payment_interface_1.PaymentStatus.UNPAID,
                transactionId: transactionId,
                amount: amount
            }], { session });
        const updatedBoking = yield booking_model_1.Booking.findByIdAndUpdate(booking[0]._id, { payment: payment[0]._id }, { new: true, runValidators: true, session }).populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment");
        const userAddress = (updatedBoking === null || updatedBoking === void 0 ? void 0 : updatedBoking.user).address;
        const userName = (updatedBoking === null || updatedBoking === void 0 ? void 0 : updatedBoking.user).name;
        const userPhone = (updatedBoking === null || updatedBoking === void 0 ? void 0 : updatedBoking.user).phone;
        const userEmail = (updatedBoking === null || updatedBoking === void 0 ? void 0 : updatedBoking.user).email;
        const sslPayload = {
            address: userAddress,
            name: userName,
            phone: userPhone,
            email: userEmail,
            transactionId: transactionId,
            amount: amount
        };
        const sslcomerz = yield sslcomerz_service_1.sslcomerzService.sslcomerzInitialize(sslPayload);
        yield session.commitTransaction(); // transaction here
        session.endSession();
        // return updatedBoking;
        return {
            // payment: sslcomerz, ekhane amader shudhu gatewaypageurl drokasr
            paymentUrl: sslcomerz.GatewayPageURL,
            booking: updatedBoking
        };
    }
    catch (error) {
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw error;
    }
});
// const getAllBooking =async ()=>{
// }
// const getSingleBooking =async ()=>{
// }
// const getUserBooking = async()=>{
// }
// const updateStatusBooking =async ()=>{
// }
exports.bookingService = { createBookings,
    //  getAllBooking, getSingleBooking,getUserBooking,updateStatusBooking
};
