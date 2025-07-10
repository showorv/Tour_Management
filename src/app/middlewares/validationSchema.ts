import { AnyZodObject } from "zod"
import{ NextFunction, Request, Response } from "express"

export const validateSchma = (zodSchema: AnyZodObject)=> async( req: Request, res: Response, next:NextFunction)=>{
    try {
        req.body = await zodSchema.parseAsync(req.body)
        next()
        
    } catch (error) {
        next(error)
    }
   
}