import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";


const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: {

        public_id: (req,file)=> {

            // my Image.png -> 45454h4rt4hfd-my-image.png

            const filename = file.originalname
            .toLowerCase()
            .replace( /\s+g/,"-") // remove empty space
            .replace(/\.g/, "-") // remove .

            const extensionName = file.originalname.split(".").pop();  // . diye split kore last er ta return korbe

            // 0.003435445656 -> 0.405454dfdhfgdkgofgd44545 -> 405454dfdhfgdkgofgd44545 -> 405454dfdhfgdkgofgd44545-milisecond of date-filename.extension

            const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + filename + "." + extensionName

            return uniqueName;
            
        }
    }  
})

export const multerUpload = multer({storage: storage})


