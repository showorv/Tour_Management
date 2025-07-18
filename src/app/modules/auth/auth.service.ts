import AppError from "../../errorHelpers/AppError";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { IActive, Iuser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpsCode from "http-status-codes"
import bcryptjs from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"
import { generateToken, verifiedToken } from "../../utils/generateToken";
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
    const refreshToken = generateToken(jsonPayload, envVars.JWT_REFRESH_SECRET as string, envVars.JWT_REFRESH_EXPIRED as string)

  const {password: pass, ...rest} = userExist.toObject()

    return {
        accessToken,
        refreshToken,
        user: rest
    }
}

const getNewAccessToken =async ( refreshToken: string)=>{

    const verifiedRefreshToken = verifiedToken(refreshToken, envVars.JWT_REFRESH_SECRET as string) as JwtPayload;

    const userExist = await User.findOne({email: verifiedRefreshToken.email})

    if(!userExist){
        throw new AppError(httpsCode.BAD_REQUEST, "user not exist")
    }

    if(userExist.isActive === IActive.BLOCKED ||userExist.isActive === IActive.INACTIVE ){
        throw new AppError(httpsCode.BAD_REQUEST, "user is block or inactive")
    }
    if(userExist.isDeleted){
        throw new AppError(httpsCode.BAD_REQUEST, "user is deleted")
    }

    const jsonPayload = {
        userId: userExist._id,
        email: userExist.email,
        role: userExist.role
    }
    const accessToken = generateToken(jsonPayload, envVars.JWT_SECRET as string, envVars.JWR_EXPIRED as string)


    return {
        accessToken,
   
    }

}
const resetPassword =async (oldPassword: string, newPassword: string, decodedToken: JwtPayload)=>{

    // check old password  get old password from verifiedtoken. hash the newpassword and save in user

    const user = await User.findById(decodedToken.userId);
      
    if(!user){
        throw new AppError(httpsCode.FORBIDDEN, "user not found")
    }

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password as string);

    if(!isOldPasswordMatch){
        throw new AppError(httpsCode.FORBIDDEN, "old password is incorrect")
    }

    user.password = await bcryptjs.hash(newPassword, Number(envVars.HASH_SALT))

    user.save();

}


export const authService = {
    createLoginService,
    getNewAccessToken,
    resetPassword
}