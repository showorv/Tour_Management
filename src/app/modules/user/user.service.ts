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

export const userService = {
    createUser
}