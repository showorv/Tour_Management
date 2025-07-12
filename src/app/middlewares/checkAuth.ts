import   { JwtPayload }  from "jsonwebtoken";

import { NextFunction, Request, Response} from "express";
import AppError from "../errorHelpers/AppError";
import { verifiedToken } from "../utils/generateToken";
import { envVars } from "../config/env";

export const checkAuth = (...authRoles: string[])=>async(req:Request, res: Response, next: NextFunction)=>{

    try {
        const accessToken = req.headers.authorization
    if(!accessToken){
      throw new AppError(403,"access token undefined")
    }

    const verifiedTokens = verifiedToken(accessToken, envVars.JWT_SECRET as string) as JwtPayload

    req.user = verifiedToken;

    if(!authRoles.includes(verifiedTokens.role)){
      throw new AppError(403,"you cannot access this route")
    }

    next()
    
    } catch (error) {
        next(error)
    }
    
}