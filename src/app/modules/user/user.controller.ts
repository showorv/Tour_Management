import { Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { sendResponse } from "../../utils/response";

import { JwtPayload } from "jsonwebtoken";
import { Iuser } from "./user.interface";

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

    const payload: Iuser = {
        ...req.body,
        image: req.file?.path
    }

    const user = await userService.createUser(payload);
    
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
const getMe = catchAsyncError(async(req: Request,res: Response)=>{

    const decodedToken = req.user as JwtPayload

    const user = await userService.getMe(decodedToken.userId);
    

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "your profile retrived successfully",
        data: user,
       
    })
})

const updateUser = catchAsyncError(async(req: Request,res: Response)=>{
    const userId = req.params.id
    // const token = req.headers.authorization
    // const tokenVerified = verifiedToken(token as string, envVars.JWT_SECRET as string) as JwtPayload

    const tokenVerified = req.user

    const payload: Iuser = {
        ...req.body,
        image: req.file?.path
    }

    const updateUser = await userService.updateUser(userId, payload, tokenVerified as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users updated successfully",
        data: updateUser,
       
    })
})

export const getSingleUser = catchAsyncError(async(req: Request,res: Response)=>{

    const {id} = req.params

    const user = await userService.getSingleUser(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "single user retrived successfully",
        data: user,
       
    })
})
export const userController =  {createUser, getAllUser, updateUser, getMe,getSingleUser}