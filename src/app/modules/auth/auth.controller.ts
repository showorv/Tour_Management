

import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { authService } from "./auth.service";
import httpsCode from "http-status-codes"

const createLogin = catchAsyncError(async(req: Request, res: Response)=>{

    const loginInfo = await authService.createLoginService(req.body)

    res.status(httpsCode.OK).json({
        success: true,
        message: "User logged in successfully",
        data: loginInfo
    })
    
})


const getNewAccessToken = catchAsyncError(async(req: Request, res: Response)=>{

    const token = req.headers.authorization
    const accessToken= await authService.getNewAccessToken(token as string)

    res.status(httpsCode.OK).json({
        success: true,
        message: "User get new accessToken",
        data: accessToken
    })
    
})

export const authController = {
    createLogin,
    getNewAccessToken
}