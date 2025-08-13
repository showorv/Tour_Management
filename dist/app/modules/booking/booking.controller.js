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
exports.bookingController = void 0;
const catchAsyncError_1 = require("../../utils/catchAsyncError");
const response_1 = require("../../utils/response");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_service_1 = require("./booking.service");
const createBooking = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedtoken = req.user;
    const booking = yield booking_service_1.bookingService.createBookings(req.body, decodedtoken.userId);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Booking created successfully",
        data: booking
    });
}));
// const getAllBooking = catchAsyncError(async(req: Request, res: Response)=>{
//     const booking =await bookingService.getAllBooking()
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Booking retrived successfully",
//         data: booking
//     })
// })
// const getUserBooking = catchAsyncError(async(req: Request, res: Response)=>{
//     const booking = await bookingService.getUserBooking()
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Booking get successfully",
//         data: booking
//     })
// })
// const getSingleBooking = catchAsyncError(async(req: Request, res: Response)=>{
//     const booking = await bookingService.getSingleBooking()
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Booking get successfully",
//         data: booking
//     })
// })
// const updateStatusBooking = catchAsyncError(async(req: Request, res: Response)=>{
//     const booking = await bookingService.updateStatusBooking()
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Booking status updated",
//         data: booking
//     })
// })
exports.bookingController = { createBooking,
    // getAllBooking, getSingleBooking,getUserBooking,updateStatusBooking
};
