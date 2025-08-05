import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/AppError"
import { ITour, ItourType } from "./tour.interface"
import { Tour, TourType } from "./tour.model"
import { tourSearchable } from "./tour.constants"
import { Query } from "mongoose"
import { QueryBuilder } from "../../utils/queryBuilder"
import { cloudinaryDeleteUpload } from "../../config/cloudinary.config"


const createTourService = async (payload: ITour)=>{
        
    const existingTour = await Tour.findOne({ name: payload.title})

    if(existingTour){
        throw new AppError(httpStatus.FORBIDDEN, "tour already exist")
    }

    // const baseSlug =  payload.title.toLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}-tour`

    // // to check uniquesness. we know anyhow its will be unique though we will again unique it

    // let counter = 0;

    // while(await Tour.exists({slug})){
    //     slug = `${slug}-${counter++}` // dhaka-division-1 dhaka-division-2
    // }

    // payload.slug = slug

    const tour = await Tour.create(payload);

    return tour
}

//! without queryBuilder

// const getAllTour = async(query: Record<string, string>)=>{ // query is a object thats why record
//      console.log(query);
//      const filter = query
//          // const tour = await Tour.find(query);

//      const searchItem = query.searchItem || "";

//      const sort = query.sort || "-createdAt"

//      const fieldFiltering = query.fieldFiltering?.split(",").join(" ") || "" //title,location => title location

//      const page = Number(query.page) || 1
//      const limit = Number(query.limit) || 10
//      const skip = (page -1)*limit

//      delete filter["searchItem"]  // ?location=Dhaka&searchItem=ban  delete na korle query filter kore r search korte parbe na. tai filter theke search delete korbo
//      delete filter["sort"]
//      delete filter["fieldFiltering"]
//      delete filter["limit"]
//      delete filter["page"]

//     //  const deletedFiled = ["searchItem", "sort"]
//     //  for(const field of deletedFiled ){
//     //     delete filter[field]
//     //  }



//     //  console.log(query); // location=Dhaka
     
//     //  const tourSearchable = [ "title", "description", "location"]

//     //  const searchArray = tourSearchable.map(field => ({[field]:{ $regex: searchItem, $options: "i"} }))

//      const searchQuery = {
//         $or: tourSearchable.map(field => ({[field]:{ $regex: searchItem, $options: "i"} }))
//      }

//     const tour = await Tour.find(searchQuery ).find(filter).sort(sort).select(fieldFiltering).skip(skip).limit(limit);    
    
//     //     {
//         //     $or: searchArray
//         //      [
//         //        { title: { $regex: searchItem, $options: "i"}}, // options i is case insensitive
//         //        { description: {$regex: searchItem, $options: "i"}},
//         //        { location: {$regex: searchItem, $options: "i"}}
//         //     ]
            
//         // }

//     const totalTour = await Tour.countDocuments()
//     const totalPage = Math.ceil(totalTour/limit)

//     const meta = {
//         page: page,
//         limit: limit,
//         total: totalTour,
//         totalPage: totalPage,
        
//     }

//     return{
//         data: tour,
//         meta: meta
//     }
// }


//! With queryBuilder ->> for reusing for all model filtering -> user,tour etc
// first create class of queryBuilder 



const getAllTour = async(query: Record<string, string>)=>{ // query is a object thats why record
    //  console.log(query);
     
    // const tour = await Tour.find(searchQuery ).find(filter).sort(sort).select(fieldFiltering).skip(skip).limit(limit);    

    const queryBuilder =  new QueryBuilder(Tour.find(), query)

    const allTour = await queryBuilder
    .search(tourSearchable)
    .filter()
    .sort()
    .fieldsFiltering()
    .paginate()
    // .modelQuery
    // .build()

    const [data,meta] = await Promise.all([
        allTour.build(),
        queryBuilder.getMeta()
    ])

   
    return{
        data,
        meta
    }
}

const getSingleTour = async (slug: string)=>{
    const tour = await Tour.findOne({slug})

    return tour;
}

const updateTour = async (id: string, payload: Partial<ITour>)=> {

    const tourExist = await Tour.findById(id)
    console.log(id);
    

    if(!tourExist){
        throw new AppError(httpStatus.NOT_FOUND, "tour not found")
    }


    // if(payload.title){
    //     const baseSlug =  payload.title.toLowerCase().split(" ").join("-")
    //     let slug = `${baseSlug}-tour`

    //     let counter = 0;
    
    //     while(await Tour.exists({slug})){
    //         slug = `${slug}-${counter++}` 
    //     }
    
    //     payload.slug = slug
    // }



    // case 1: upload image in update

    if(payload.images && payload.images.length > 0 && tourExist.images && tourExist.images?.length > 0){
        payload.images = [...payload.images , ...tourExist.images]
    }

     // case 2: if user want to delete especific images during update then->  data -> deleteImages: [ "imgurl1", "imgurl2"]

     if(payload.deleteImages && payload.deleteImages.length > 0 && tourExist.images && tourExist.images?.length > 0 ){

        const restDBImages = tourExist.images.filter(imgUrl => !payload.deleteImages?.includes(imgUrl)) // means user j gula delete korbe na segula theke jabe

        const updatedPayloadImages = (payload.images || [])
        .filter (imgUrl => !payload.deleteImages?.includes(imgUrl))
        .filter (imgUrl => !restDBImages?.includes(imgUrl))

        payload.images = [...restDBImages , ...updatedPayloadImages]



     }

    const updateTour = await Tour.findByIdAndUpdate ( id, payload , {new: true, runValidators: true})

   // case 3: delete from cloudinary

   if(payload.deleteImages && payload.deleteImages.length > 0 && tourExist.images && tourExist.images?.length > 0 ){

    await Promise.all(payload.deleteImages.map (imgUrl => cloudinaryDeleteUpload(imgUrl)))

 }



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


export const tourService = { createTourService, getAllTour, updateTour, deleteTour, createTourType, getAllTourTypes, updateTourType, deleteTourType, getSingleTour}