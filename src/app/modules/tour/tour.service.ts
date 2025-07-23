import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/AppError"
import { ITour, ItourType } from "./tour.interface"
import { Tour, TourType } from "./tour.model"


const createTourService = async (payload: ITour)=>{
        
    const existingTour = await Tour.findOne({ name: payload.title})

    if(existingTour){
        throw new AppError(httpStatus.FORBIDDEN, "tour already exist")
    }

    const baseSlug =  payload.title.toLowerCase().split(" ").join("-")
    let slug = `${baseSlug}-tour`

    // to check uniquesness. we know anyhow its will be unique though we will again unique it

    let counter = 0;

    while(await Tour.exists({slug})){
        slug = `${slug}-${counter++}` // dhaka-division-1 dhaka-division-2
    }

    payload.slug = slug

    const tour = await Tour.create(payload);

    return tour
}


const getAllTour = async()=>{

    const tour = await Tour.find();

    const totalTour = await Tour.countDocuments()

    return{
        data: tour,
        meta: {
            total: totalTour
        }
    }
}


const updateTour = async (id: string, payload: Partial<ITour>)=> {

    const tourExist = await Tour.findById(id)
    console.log(id);
    

    if(!tourExist){
        throw new AppError(httpStatus.NOT_FOUND, "tour not found")
    }


    if(payload.title){
        const baseSlug =  payload.title.toLowerCase().split(" ").join("-")
        let slug = `${baseSlug}-tour`

        let counter = 0;
    
        while(await Tour.exists({slug})){
            slug = `${slug}-${counter++}` 
        }
    
        payload.slug = slug
    }

    const updateTour = await Tour.findByIdAndUpdate ( id, payload , {new: true, runValidators: true})

    return updateTour;
}


const deleteTour = async (id: string)=>{
    await Tour.findByIdAndDelete (id)
    return null
}

//--- tour type ---

const createTourType = async (payload: ItourType) => {

    const existingTourType = await TourType.findOne({ name: payload.name });

    if (existingTourType) {
        throw new AppError(httpStatus.FORBIDDEN,"Tour type already exists.");
    }

    const tourType = await TourType.create(payload);
    return tourType;
};
const getAllTourTypes = async () => {
    return await TourType.find();
};
const updateTourType = async (id: string, payload: ItourType) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new AppError(httpStatus.NOT_FOUND,"Tour type not found.");
    }

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;
};
const deleteTourType = async (id: string) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new AppError(httpStatus.FORBIDDEN,"Tour type not found.");
    }

    return await TourType.findByIdAndDelete(id);
};


export const tourService = { createTourService, getAllTour, updateTour, deleteTour, createTourType, getAllTourTypes, updateTourType, deleteTourType}