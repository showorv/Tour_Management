import { Iuser } from "./user.interface"
import { User } from "./user.model"

const createUser =async (payload: Partial<Iuser>)=>{

    const {name,email } = payload

    const user = await User.create({
        name,
        email
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