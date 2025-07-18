import   { JwtPayload }  from "jsonwebtoken";

import { NextFunction, Request, Response} from "express";
import AppError from "../errorHelpers/AppError";
import { verifiedToken } from "../utils/generateToken";
import { envVars } from "../config/env";
import httpsCode from "http-status-codes"
import { IActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";


export const checkAuth = (...authRoles: string[])=>async(req:Request, res: Response, next: NextFunction)=>{

    try {
        const accessToken = req.headers.authorization
    if(!accessToken){
      throw new AppError(403,"access token undefined")
    }

    const verifiedTokens = verifiedToken(accessToken, envVars.JWT_SECRET as string) as JwtPayload

    const userExist = await User.findOne({email: verifiedTokens.email})

        if(!userExist){
          throw new AppError(httpsCode.BAD_REQUEST, "user not exist")
      }

      if(userExist.isActive === IActive.BLOCKED ||userExist.isActive === IActive.INACTIVE ){
          throw new AppError(httpsCode.BAD_REQUEST, "user is block or inactive")
      }
      if(userExist.isDeleted){
          throw new AppError(httpsCode.BAD_REQUEST, "user is deleted")
      }


    req.user = verifiedTokens;

    if(!authRoles.includes(verifiedTokens.role)){
      throw new AppError(403,"you cannot access this route")
    }

    next()
    
    } catch (error) {
        next(error)
    }
    
}