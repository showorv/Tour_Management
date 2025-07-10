import AppError from "../../errorHelpers/AppError"
import { IAuths, Iuser } from "./user.interface"
import { User } from "./user.model"
import httpStatus from "http-status-codes"
const createUser =async (payload: Partial<Iuser>)=>{

    const {email, ...rest } = payload

    const userExist = await User.findOne({email})

    if(userExist){
        throw new AppError(httpStatus.BAD_REQUEST, "email already exist")
    }

    const authProvider: IAuths = { provider: "credential", providerId: email as string}

    const user = await User.create({
        
        email,
        auths: [ authProvider],
        ...rest
    })

    return user;


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
    getUser
}