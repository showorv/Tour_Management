import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { sendResponse } from "../../utils/response";
import { verifiedToken } from "../../utils/generateToken";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// const createUser = async (req: Request,res: Response, next: NextFunction)=>{

//     try {
       
        
//         const user = await userService.createUser(req.body);
    
//         res.status(httpStatus.CREATED).json({
//             message: "User created successfully",
//             data: user
//         })
        
//     } catch (error) {
//         next(error)
//     }
   
// }

const createUser = catchAsyncError(async(req: Request,res: Response)=>{

    const user = await userService.createUser(req.body);
    
    // res.status(httpStatus.CREATED).json({
    //     message: "User created successfully",
    //     data: user
    // })

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message:  "User created successfully",
        data: user
    })
})

const getAllUser = catchAsyncError(async(req: Request,res: Response)=>{

    const users = await userService.getUser();
    

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users retrived successfully",
        data: users.data,
        metaData: users.meta
    })
})

const updateUser = catchAsyncError(async(req: Request,res: Response)=>{
    const userId = req.params.id
    // const token = req.headers.authorization
    // const tokenVerified = verifiedToken(token as string, envVars.JWT_SECRET as string) as JwtPayload

    const tokenVerified = req.user

    const payload = req.body

    const updateUser = await userService.updateUser(userId, payload, tokenVerified)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users updated successfully",
        data: updateUser,
       
    })
})


export const userController =  {createUser, getAllUser, updateUser}