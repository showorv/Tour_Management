import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";

const createUser = async (req: Request,res: Response, next: NextFunction)=>{

    try {
       
        
        const user = await userService.createUser(req.body);
    
        res.status(httpStatus.CREATED).json({
            message: "User created successfully",
            data: user
        })
        
    } catch (error) {
        next(error)
    }
   
}

export const userController =  {createUser}