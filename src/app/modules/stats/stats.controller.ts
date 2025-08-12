import { Request, Response } from "express"
import { catchAsyncError } from "../../utils/catchAsyncError"
import { sendResponse } from "../../utils/response"
import httpStatus from "http-status-codes"

import { statsService } from "./stats.service"

const userStats = catchAsyncError (async(req: Request, res: Response)=>{

     const user = await statsService.userStats()


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "user stats get successfully",
        data: user
       
    })
})
const tourStats = catchAsyncError (async(req: Request, res: Response)=>{

    const tour= await statsService.tourStats()


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "tour stats get successfully",
        data: tour
       
    })
})
const bookingStats = catchAsyncError (async(req: Request, res: Response)=>{


    const booking= await statsService.bookingStats()


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "booking stats get successfully",
        data:booking
       
    })
})
const paymentStats = catchAsyncError (async(req: Request, res: Response)=>{

    const payment= await statsService.paymentStats()



    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "payment stats get successfully",
        data: payment
       
    })
})

export const statsController = {userStats, tourStats,bookingStats,paymentStats}