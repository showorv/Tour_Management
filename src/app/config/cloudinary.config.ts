
/* Workflow of multer and cloudinary

Frontend -> form data with image file -> multer middleware -> form data -> body + file e convert kore
amdr upload kora form data image file k multer file e convert kore amdr project e nijr ekta temporary folder e rakhne and amra req.files diye get kori img file

cloudinary se image file k upload kore ekta url dey

but multer storage cloudinary package use korle r manually folder create kora lagbe na project e. multer auto cloudinaryr sthe folder er kaj kore in return url diye dibe.

*/

import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";

cloudinary.config({
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_SECRET_KEY
})


export const cloudinaryUpload = cloudinary;