import { envVars } from "../config/env";
import { Iuser } from "../modules/user/user.interface";
import { generateToken } from "./generateToken";


export const createUserToken = (user: Iuser)=>{
  
    const jsonPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const accessToken = generateToken(jsonPayload, envVars.JWT_SECRET as string, envVars.JWR_EXPIRED as string)
    const refreshToken = generateToken(jsonPayload, envVars.JWT_REFRESH_SECRET as string, envVars.JWT_REFRESH_EXPIRED as string)

    return {
        accessToken,
        refreshToken
    }
}