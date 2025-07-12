import AppError from "../../errorHelpers/AppError"
import { IAuths, Iuser } from "./user.interface"
import { User } from "./user.model"
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"


const createUser =async (payload: Partial<Iuser>)=>{

    const {email, password,...rest } = payload

    const userExist = await User.findOne({email})

    if(userExist){
        throw new AppError(httpStatus.BAD_REQUEST, "email already exist")
    }

    const hashPassword = await bcryptjs.hash(password as string, 10);


    const authProvider: IAuths = { provider: "credential", providerId: email as string}

    const user = await User.create({
        
        email,
        password: hashPassword,
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