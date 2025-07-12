import AppError from "../../errorHelpers/AppError";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { Iuser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpsCode from "http-status-codes"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { generateToken } from "../../utils/generateToken";
import { envVars } from "../../config/env";
const createLoginService =async (payload: Partial<Iuser>)=>{

    const {email, password} = payload
    
    const userExist = await User.findOne({email})

    if(!userExist){
        throw new AppError(httpsCode.BAD_REQUEST, "Email is incorrect")
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, userExist.password as string)


    if(!isPasswordMatch){
        throw new AppError(httpsCode.BAD_REQUEST, "password is incorrect")
    }

    const jsonPayload = {
        userId: userExist._id,
        email: userExist.email,
        role: userExist.role
    }
    const accessToken = generateToken(jsonPayload, envVars.JWT_SECRET as string, envVars.JWR_EXPIRED as string)

    return {
        accessToken
    }
}

export const authService = {
    createLoginService
}