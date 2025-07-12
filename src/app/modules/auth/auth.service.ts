import AppError from "../../errorHelpers/AppError";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { Iuser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpsCode from "http-status-codes"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
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
    const accessToken = jwt.sign(jsonPayload, "secret", {
        expiresIn:"1d"
    })

    return {
        accessToken
    }
}

export const authService = {
    createLoginService
}