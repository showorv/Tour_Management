import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status-codes"
import { bookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";


const createBooking = catchAsyncError(async(req: Request, res: Response)=>{

    const decodedtoken = req.user as JwtPayload

    const booking = await bookingService.createBookings( req.body,decodedtoken.userId)

   

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Booking created successfully",
        data: booking
    })
})
const getAllBooking = catchAsyncError(async(req: Request, res: Response)=>{

    
    const booking = bookingService.getAllBooking()
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking retrived successfully",
        data: booking
    })
})
const getUserBooking = catchAsyncError(async(req: Request, res: Response)=>{

    
    const booking = bookingService.getUserBooking()
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking get successfully",
        data: booking
    })
})
const getSingleBooking = catchAsyncError(async(req: Request, res: Response)=>{

    
    const booking = bookingService.getSingleBooking()
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking get successfully",
        data: booking
    })
})
const updateStatusBooking = catchAsyncError(async(req: Request, res: Response)=>{

    
    const booking = bookingService.updateStatusBooking()
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking status updated",
        data: booking
    })
})


export const bookingController = {createBooking, getAllBooking, getSingleBooking,getUserBooking,updateStatusBooking}