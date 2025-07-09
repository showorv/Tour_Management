import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";

export const globalError = (err:any, req: Request, res: Response, next: NextFunction)=>{

    let statuscode = 500;
    let message = ` something went wrong `;
    

    if( err instanceof AppError){
        statuscode = err.statusCode,
        message = err.message
    }else if(err instanceof Error){
        statuscode = 500,
        message = err.message
    }
    res.status(statuscode).json({
        success: false,
        message, 
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}