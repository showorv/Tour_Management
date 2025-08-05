

import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { authService } from "./auth.service";
import httpsCode from "http-status-codes"
import AppError from "../../errorHelpers/AppError";
import { setCookies } from "../../utils/cookieSet";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { createUserToken } from "../../utils/createUserToken";
import { Iuser } from "../user/user.interface";
import { envVars } from "../../config/env";

const createLogin = catchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{

    //manual login

    // const loginInfo = await authService.createLoginService(req.body)

    // res.cookie("access-token", loginInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })

    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //     httpOnly: true, // eta na dile frontend e cookie set hbe na
    //     secure: false // eta na dile frontend e cookie access korte dibe na cors er karone
    // })

    // setCookies(res,loginInfo)

    // res.status(httpsCode.OK).json({
    //     success: true,
    //     message: "User logged in successfully",
    //     data: loginInfo
    // })



    //passport local login

    passport.authenticate("local", async(err: any, user: any, info: any)=>{

        if(err){
            // return new AppError(401, err) dewa jabe na direct
            return next(new AppError(401, err))
        }

        if(!user){
            return next( new AppError(401, info.message) )// all are comes from passport.ts local
        }

        const userToken = createUserToken(user);

        setCookies(res,userToken)

        // delete user.toObject().password

        const {password, ...rest} = user.toObject()

        res.status(httpsCode.OK).json({
            success: true,
            message: "User logged in successfully",
            data: {
                accessToken: userToken.accessToken,
                refreshToken: userToken.refreshToken,
                user: rest
            }
        })

    })(req,res,next)
    
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


const changePassword = catchAsyncError(async(req: Request, res: Response)=>{

    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword

    const decodedToken =  req.user

    await authService.changePassword(oldPassword, newPassword, decodedToken as JwtPayload)


    res.status(httpsCode.OK).json({
        success: true,
        message: "password change successfully",
        data: null
    })
    
})
const resetPassword = catchAsyncError(async(req: Request, res: Response)=>{

  

    const decodedToken =  req.user

    await authService.resetPassword(req.body, decodedToken as JwtPayload)


    res.status(httpsCode.OK).json({
        success: true,
        message: "password reset successfully",
        data: null
    })
    
})
const setPassword = catchAsyncError(async(req: Request, res: Response)=>{


    const decodedToken =  req.user as JwtPayload
    const {password} = req.body

    await authService.setPassword( decodedToken.userId , password)


    res.status(httpsCode.OK).json({
        success: true,
        message: "password set successfully",
        data: null
    })
    
})
const forgotPassword = catchAsyncError(async(req: Request, res: Response)=>{


    
    const {email} = req.body

    await authService.forgotPassword( email)


    res.status(httpsCode.OK).json({
        success: true,
        message: "reset password link sent successfully",
        data: null
    })
    
})


// http://localhost:5000/api/v1/auth/google?redirect=/booking

const googleController = catchAsyncError(async(req: Request, res: Response)=>{

    const redirect = req.query.redirect || "";


    passport.authenticate("google", {scope: ["profile", "email"], state: redirect as string})(req,res)

    
})

// http://localhost:5000/api/v1/auth/google/callback?state=/booking or /
const googleCallback = catchAsyncError(async(req: Request, res: Response)=>{

    let state = req.query.state? req.query.state as string : ""

    if(state.startsWith("/")){
        state= state.slice(1) // /booking-> booking
    }
    
    //  jkhn passport e user create hobe tkhn passport amdr k ta req.user e diye dibe

    const user= req.user

    console.log("user", user);
    

    if(!user){
        throw new AppError(httpsCode.NOT_FOUND, "user not found")
    }

    const tokenInfo = createUserToken(user as Iuser);

    setCookies(res, tokenInfo);


    

    res.redirect(`${envVars.FRONTEND_URL as string}/${state}`)
 
    
})

export const authController = {
    createLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallback,
    googleController,
    changePassword,
    setPassword,
    forgotPassword
}