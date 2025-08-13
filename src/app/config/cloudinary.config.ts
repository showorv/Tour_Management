
/* Workflow of multer and cloudinary

Frontend -> form data with image file -> multer middleware -> form data -> body + file e convert kore
amdr upload kora form data image file k multer file e convert kore amdr project e nijr ekta temporary folder e rakhne and amra req.files diye get kori img file

cloudinary se image file k upload kore ekta url dey

but multer storage cloudinary package use korle r manually folder create kora lagbe na project e. multer auto cloudinaryr sthe folder er kaj kore in return url diye dibe.

*/

import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/AppError";
import stream from "stream"


cloudinary.config({
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_SECRET_KEY
})

// this is for given the url in invoiceUrl
export const uploadBufferInCloudinary = async (buffer: Buffer, fileName: string) : Promise<UploadApiResponse | undefined> =>{

    try {

        return new Promise((resolve,reject)=>{

            const public_id = `pdf/${fileName}-${Date.now()}`

            const bufferStream = new stream.PassThrough()
            bufferStream.end(buffer)
       

            cloudinary.uploader.upload_stream({
                resource_type: "auto",
                public_id: public_id,
                folder: "pdf",
                
            },
            (error, result)=>{
                    if(error){
                        return reject(error)
                    }
                        
                     resolve(result)
                    
            }).end(buffer)
            

        })

       
    } catch (error) {
        console.log("error in pdf upload in cloudinary", error);
        throw new AppError(401, "error in pdf upload")
        
    }

}

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
    } catch (error:any) {
        throw new AppError(401, "cloudinary image deletion failed", error.message)
    }

} // this delete function in globalError. if unnesseary error occur to create controller then file will not upload in cloudiniary


export const cloudinaryUpload = cloudinary;