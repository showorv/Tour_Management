import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { sendResponse } from "../../utils/response";
import { divisionServices } from "./division.service";
import httpStatus from "http-status-codes"


const createDivision = catchAsyncError(async(req: Request, res: Response)=>{

    const createDivision = await divisionServices.createDivisionService(req.body)


    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "division created successfully",
        data: createDivision,
       
    })

})
const getAllDivision = catchAsyncError(async(req: Request, res: Response)=>{

    const allDivision = await divisionServices.getAllDivisionService()

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "division get successfully",
        data: allDivision.data,
        metaData: allDivision.meta
       
    })


})
const getSingleDivision = catchAsyncError(async(req: Request, res: Response)=>{

    const slug = req.params.slug
    const singleDivision = await divisionServices.getSingleDivision(slug)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "division get successfully",
        data: singleDivision.data,
       
    })


})
const updateDivision = catchAsyncError(async(req: Request, res: Response)=>{

    const id = req.params.id

    const updateDivisions = await divisionServices.updateDivisionService(id, req.body)


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "division updated successfully",
        data: updateDivisions,
       
    })
})
const deleteDivision = catchAsyncError(async(req: Request, res: Response)=>{

    const id = req.params.id

    const deleteDivisions = await divisionServices.deleteDivisionService(id)


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "division deleted successfully",
        data: deleteDivisions,
       
    })
})


export const divisionController = { createDivision, getAllDivision, updateDivision, deleteDivision, getSingleDivision};