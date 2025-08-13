import { Response } from "express";
import { envVars } from "../config/env";


interface AuthToken {
    accessToken?: string;
    refreshToken?: string
}

export const setCookies = (res: Response, tokenInfo: AuthToken)=>{

    if(tokenInfo.accessToken){
        res.cookie("access-token", tokenInfo.accessToken, {
            httpOnly: true,
            // secure: envVars.NODE_ENV==="development"?false: true,
            secure: envVars.NODE_ENV !== "development",
            sameSite: "none"
        })
    }

    if(tokenInfo.refreshToken){
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true, // eta na dile frontend e cookie set hbe na
            // secure: false // eta na dile frontend e cookie access korte dibe na cors er karone
            secure: envVars.NODE_ENV !== "development",
            sameSite: "none"
        })
    }
}