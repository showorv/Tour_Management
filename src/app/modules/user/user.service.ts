import AppError from "../../errorHelpers/AppError"
import { IAuths, Iuser, Role } from "./user.interface"
import { User } from "./user.model"
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"


const createUser =async (payload: Partial<Iuser>)=>{

    const {email, password,...rest } = payload

    const userExist = await User.findOne({email})

    if(userExist){
        throw new AppError(httpStatus.BAD_REQUEST, "email already exist")
    }

    const hashPassword = await bcryptjs.hash(password as string, Number(envVars.HASH_SALT ));


    const authProvider: IAuths = { provider: "credential", providerId: email as string}

    const user = await User.create({
        
        email,
        password: hashPassword,
        auths: [ authProvider],
        ...rest
    })

    return user;


}

const updateUser = async(userId: string, payload: Partial<Iuser>, decodeToken: JwtPayload)=>{
        // email cannot updateUser,
        // name address password can updateUser. password will rehashing
        // role isverified isdelete isactive cant update without admin or superadmin

        const findUser = await User.findById(userId)

        if(!findUser){
            throw new AppError(httpStatus.NOT_FOUND, "user not found")
        }

        if(payload.role){
            if(decodeToken.role === Role.USER || decodeToken.role === Role.GUIDE){
                throw new AppError(httpStatus.FORBIDDEN, "you are not authorized")
            }

            if(payload.role === Role.SUPERADMIN || decodeToken.role === Role.ADMIN){
                throw new AppError(httpStatus.FORBIDDEN, "you are not authorized")
            }
        }

        if(payload.isActive || payload.isDeleted ||  payload.isVerified){
            if(decodeToken.role === Role.USER || decodeToken.role === Role.GUIDE){
                throw new AppError(httpStatus.FORBIDDEN, "you are not authorized")
            }
        }

        if(payload.password){
            payload.password = await bcryptjs.hash(payload.password,Number( envVars.HASH_SALT))
        }

        const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true})

        return newUpdateUser;
        

}

const getUser = async()=>{
    const users = await User.find()
    const totalUser = await User.countDocuments()

    return {
        data: users,
        meta: {
            total: totalUser
        }
    }
}

export const userService = {
    createUser,
    getUser,
    updateUser
}