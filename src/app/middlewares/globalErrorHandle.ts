import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";


interface iError {
    path: string,
    message: string
}


// egula k function hishebeo rkhte pari. helper folder e function create kore. 
export const globalError = (err:any, req: Request, res: Response, next: NextFunction)=>{

    let statuscode = 500;
    let message = ` something went wrong `;
    let errorSources: iError[] = [
    //     {
    //     path: "",
    //     message: ""
    // }
];

    /*
    console log(err) e code pabo
    mongoose error ->>
                 duplicate -> SC=11000
                 cast error -> if object id is wrong

    */
    
    if(err.code === 11000){

        const matchArray = err.message.match(/"([^"]*)"/) // regx
         statuscode = 400;
        message = `${matchArray[1]} already exist`

    }else if(err.name === "CastError"){
        statuscode = 400;
        message = "Invalid Mongodb ObjectId"


    }else if(err.name === "ValidationError"){
        statuscode= 400;

        const errors = Object.values(err.errors) /* converting const err = {
                                                    errors: {
                                                    name: { message: "Name is required" },
                                                    email: { message: "Email is invalid" },
                                                    }
                                                }; into array [{name}, {email}]
                                                 */

        errors.forEach((errorObject: any) => errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        }))

        message = " mongoose Validation error"


    }else if(err.name === "ZodError"){

        statuscode= 400
        message = "Zod validation error"

        err.issues.forEach((issue:any)=> errorSources.push({
            path: issue.path[ issue.path -1],  // path: [] so always last index er ta dhore anbo zod er jnne. 
            message: issue.message
        }))

    }
    else if( err instanceof AppError){ // business logic error
        statuscode = err.statusCode,
        message = err.message



    }else if(err instanceof Error){ // global error
        statuscode = 500,
        message = err.message


    }
    res.status(statuscode).json({
        success: false,
        message,
        errorSources, 
        err: envVars.NODE_ENV === "development"? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}