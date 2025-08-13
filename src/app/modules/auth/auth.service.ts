import AppError from "../../errorHelpers/AppError";

import { IActive, IAuths, Iuser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpsCode from "http-status-codes"
import bcryptjs from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"
import { generateToken, verifiedToken } from "../../utils/generateToken";
import { envVars } from "../../config/env";
import { createUserToken } from "../../utils/createUserToken";
import { sendEmail } from "../../utils/sendEmail";


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

    // const jsonPayload = {
    //     userId: userExist._id,
    //     email: userExist.email,
    //     role: userExist.role
    // }
    const accessUserToken =createUserToken(userExist)
    // const refreshToken = generateToken(jsonPayload, envVars.JWT_REFRESH_SECRET as string, envVars.JWT_REFRESH_EXPIRED as string)

  const {password: pass, ...rest} = userExist.toObject()

    return {
        accessToken: accessUserToken.accessToken,
        refreshToken: accessUserToken.refreshToken,
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
const changePassword =async (oldPassword: string, newPassword: string, decodedToken: JwtPayload)=>{

    // check old password  get old password from verifiedtoken. hash the newpassword and save in user

    const user = await User.findById(decodedToken.userId);
      
    if(!user){
        throw new AppError(httpsCode.FORBIDDEN, "user not found")
    }

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password as string);

    if(!isOldPasswordMatch){
        throw new AppError(httpsCode.FORBIDDEN, "old password is incorrect")
    }

    if(oldPassword === newPassword){
        throw new AppError(httpsCode.FORBIDDEN, "new password cannot be same as old password")
    }

    user.password = await bcryptjs.hash(newPassword, Number(envVars.HASH_SALT))

    user.save();

}

const setPassword =async (userId: string, password: string)=>{

   const user = await User.findById(userId)

   if(!user){
    throw new AppError(httpsCode.FORBIDDEN, "user not found")
   }

   if( user.password && user.auths.some(providerObject => providerObject.provider==="google")){
    throw new AppError(httpsCode.FORBIDDEN, "user already has password. you can change password from profile")
   }

   const hashPassword = await bcryptjs.hash ( password, Number(envVars.HASH_SALT))

   const credentialAuths : IAuths = {
    provider: "credential",
    providerId: user.email
   }

   const auths: IAuths [] = [...user.auths, credentialAuths]

   user.password = hashPassword

   user.auths = auths

   await user.save()

}
const forgotPassword =async (email: string)=>{

   const userExist = await User.findOne({email})

        if(!userExist){
            throw new AppError(httpsCode.BAD_REQUEST, "user not exist")
        }

        if(userExist.isActive === IActive.BLOCKED ||userExist.isActive === IActive.INACTIVE ){
            throw new AppError(httpsCode.BAD_REQUEST, "user is block or inactive")
        }
        if(userExist.isDeleted){
            throw new AppError(httpsCode.BAD_REQUEST, "user is deleted")
        }
        if(!userExist.isVerified){
        throw new AppError(httpsCode.BAD_REQUEST, "user is not verified")
        }
        
        const JwtPayload = {
            userId: userExist._id,
            email: userExist.email,
            role: userExist.role
        }

        const resetToken = jwt.sign(JwtPayload, envVars.JWT_SECRET as string , {
            expiresIn: "10m"
        })

        const forgotUILink = `${envVars.FRONTEND_URL}/reset-password?id=${userExist._id}&token=${resetToken}`

        sendEmail({
            to: userExist.email,
            subject: "Reset Password ",
            templateName: "sendEmail",
            templateData: {
                name: userExist.name,
                reseturl: forgotUILink,
            }
        })
        

}
const resetPassword =async (payload: Record<string,any>, decodedToken: JwtPayload)=>{

    if(payload.id !== decodedToken.userId){
        throw new AppError(401, "you cannot change password")
    }


    const user = await User.findById(decodedToken.userId)

    if(!user){
        throw new AppError(401, "user not found")
    }

    const hashPassword = await bcryptjs.hash ( payload.newPassword, Number(envVars.HASH_SALT))

    user.password = hashPassword

    await user.save()



}

export const authService = {
    createLoginService,
    getNewAccessToken,
    resetPassword,
    changePassword,
    setPassword,
    forgotPassword
}