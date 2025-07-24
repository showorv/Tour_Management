import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/catchAsyncError";
import { tourService } from "./tour.service";
import { sendResponse } from "../../utils/response";
import httpStatus from "http-status-codes"

// tour type


const createTourType = catchAsyncError (async(req: Request, res: Response)=>{

    // const { name } = req.body;
    const result = await tourService.createTourType(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });

})
const getTourType = catchAsyncError (async(req: Request, res: Response)=>{

    const result = await tourService.getAllTourTypes();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour types retrieved successfully',
        data: result,
    });
  

})
const updateTourType = catchAsyncError (async(req: Request, res: Response)=>{

    const { id } = req.params;
    const { name } = req.body;
    const result = await tourService.updateTourType(id, name);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type updated successfully',
        data: result,
    });
   
})
const deleteTourType = catchAsyncError (async(req: Request, res: Response)=>{
    const { id } = req.params;
    const result = await tourService.deleteTourType(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type deleted successfully',
        data: result,
    });
})


// Tour


const createTour = catchAsyncError (async(req: Request, res: Response)=>{
    
    const createTour = await tourService.createTourService(req.body)


    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "tour created successfully",
        data: createTour,
       
    })
})
const getTour = catchAsyncError (async(req: Request, res: Response)=>{

    const query = req.query

    const allTour= await tourService.getAllTour(query as Record<string,string>)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "tour get successfully",
        data: allTour.data,
        metaData: allTour.meta
       
    })
})

const getSingleTour = catchAsyncError (async(req: Request, res: Response)=>{

    const slug = req.params.slug

    const allTour= await tourService.getSingleTour(slug)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "tour get successfully",
        data: allTour,
       
       
    })
})


const updateTour = catchAsyncError (async(req: Request, res: Response)=>{

    const id = req.params.id

    const updateTours= await tourService.updateTour(id, req.body)


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "tour updated successfully",
        data: updateTours,
       
    })
})
const deleteTour = catchAsyncError (async(req: Request, res: Response)=>{

    const id = req.params.id

    const deleteTours = await tourService.deleteTour(id)


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "tour deleted successfully",
        data: deleteTours,
       
    })
})






export const tourController = {createTour, getTour, updateTour, deleteTour , createTourType, getTourType, updateTourType, deleteTourType, getSingleTour}