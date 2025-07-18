

import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { authService } from "./auth.service";
import httpsCode from "http-status-codes"
import AppError from "../../errorHelpers/AppError";
import { setCookies } from "../../utils/cookieSet";

const createLogin = catchAsyncError(async(req: Request, res: Response)=>{

    const loginInfo = await authService.createLoginService(req.body)

    // res.cookie("access-token", loginInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })

    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true, // eta na dile frontend e cookie set hbe na
    //     secure: false // eta na dile frontend e cookie access korte dibe na cors er karone
    // })

    setCookies(res,loginInfo)

    res.status(httpsCode.OK).json({
        success: true,
        message: "User logged in successfully",
        data: loginInfo
    })
    
})


const getNewAccessToken = catchAsyncError(async(req: Request, res: Response)=>{

    const token = req.cookies.refreshToken

    if(!token){
        throw new AppError(httpsCode.BAD_REQUEST, "cannot get refreshtoken from cookie")
    }
    const accessToken= await authService.getNewAccessToken(token as string)


    // to set new accessToken in cookie

    // res.cookie("access-token", accessToken.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })

    setCookies(res, accessToken)


    res.status(httpsCode.OK).json({
        success: true,
        message: "User get new accessToken",
        data: accessToken
    })
    
})

const logout = catchAsyncError(async(req: Request, res: Response)=>{

    res.clearCookie("access-token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })


    res.status(httpsCode.OK).json({
        success: true,
        message: "User logged out",
        data: null
    })
    
})

export const authController = {
    createLogin,
    getNewAccessToken,
    logout
}