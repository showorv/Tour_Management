import AppError from "../../errorHelpers/AppError"
import { IDivision } from "./division.interface"
import { Division } from "./division.model"
import httpStatus from "http-status-codes"

const createDivisionService = async (payload : IDivision)=>{

    const existingDivision = await Division.findOne({ name: payload.name})

    if(existingDivision){
        throw new AppError(httpStatus.FORBIDDEN, "division already exist")
    }

    // const baseSlug =  payload.name.toLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}-division`

    // // to check uniquesness. we know anyhow its will be unique though we will again unique it

    // let counter = 0;

    // while(await Division.exists({slug})){
    //     slug = `${slug}-${counter++}` // dhaka-division-1 dhaka-division-2
    // }

    // payload.slug = slug


    const division = await Division.create(payload);

    return division
}

const getAllDivisionService = async()=>{

    const division = await Division.find();
    const totalDivision = await Division.countDocuments();

    return {
        data: division,
        meta: {
            total: totalDivision
        }
    }
}

const getSingleDivision = async( slug: string)=>{

    const singleDivision = await Division.findOne({slug})

    return {
        data: singleDivision
    }
}

const updateDivisionService = async (id: string, payload: Partial<IDivision>)=>{

    const divisionExist = await Division.findById(id)
    // console.log(id);
    

    if(!divisionExist){
        throw new AppError(httpStatus.NOT_FOUND, "division not found")
    }

    const duplicateDivision = await Division.findOne ( {
        name: payload.name,
        _id: {$ne: id}
    })

    if(duplicateDivision){
        throw new AppError(httpStatus.FORBIDDEN, "division name already exist")
    }

    // if(payload.name){
    //     const baseSlug =  payload.name.toLowerCase().split(" ").join("-")
    //     let slug = `${baseSlug}-division`

    //     let counter = 0;
    
    //     while(await Division.exists({slug})){
    //         slug = `${slug}-${counter++}` 
    //     }
    
    //     payload.slug = slug
    // }

    const updateDivision = await Division.findByIdAndUpdate ( id, payload , {new: true, runValidators: true})

    return updateDivision;

}
const deleteDivisionService = async (id: string)=>{

     await Division.findByIdAndDelete (id);

    return null

}
export const divisionServices = { createDivisionService, getAllDivisionService, getSingleDivision, updateDivisionService, deleteDivisionService}