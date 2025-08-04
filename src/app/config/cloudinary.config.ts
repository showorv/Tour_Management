
/* Workflow of multer and cloudinary

Frontend -> form data with image file -> multer middleware -> form data -> body + file e convert kore
amdr upload kora form data image file k multer file e convert kore amdr project e nijr ekta temporary folder e rakhne and amra req.files diye get kori img file

cloudinary se image file k upload kore ekta url dey

but multer storage cloudinary package use korle r manually folder create kora lagbe na project e. multer auto cloudinaryr sthe folder er kaj kore in return url diye dibe.

*/

import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/AppError";

cloudinary.config({
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_SECRET_KEY
})

export const cloudinaryDeleteUpload = async (url : string)=>{

    try {
        // destroy by public_id

        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

        const match = url.match(regex)

        if(match && match[1]){
            const public_id = match[1]

            await cloudinary.uploader.destroy(public_id)

            console.log(`deleted images ${public_id}`);
            
        }
    } catch (error) {
        throw new AppError(401, "cloudinary image deletion failed")
    }

} // this delete function in globalError. if unnesseary error occur to create controller then file will not upload in cloudiniary


export const cloudinaryUpload = cloudinary;