import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { sendResponse } from "../../utils/response";

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




export const userController =  {createUser, getAllUser}