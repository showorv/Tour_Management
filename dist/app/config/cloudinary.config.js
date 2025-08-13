"use strict";
/* Workflow of multer and cloudinary

Frontend -> form data with image file -> multer middleware -> form data -> body + file e convert kore
amdr upload kora form data image file k multer file e convert kore amdr project e nijr ekta temporary folder e rakhne and amra req.files diye get kori img file

cloudinary se image file k upload kore ekta url dey

but multer storage cloudinary package use korle r manually folder create kora lagbe na project e. multer auto cloudinaryr sthe folder er kaj kore in return url diye dibe.

*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUpload = exports.cloudinaryDeleteUpload = exports.uploadBufferInCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const stream_1 = __importDefault(require("stream"));
cloudinary_1.v2.config({
    cloud_name: env_1.envVars.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.envVars.CLOUDINARY_API_KEY,
    api_secret: env_1.envVars.CLOUDINARY_SECRET_KEY
});
// this is for given the url in invoiceUrl
const uploadBufferInCloudinary = (buffer, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const public_id = `pdf/${fileName}-${Date.now()}`;
            const bufferStream = new stream_1.default.PassThrough();
            bufferStream.end(buffer);
            cloudinary_1.v2.uploader.upload_stream({
                resource_type: "auto",
                public_id: public_id,
                folder: "pdf",
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }).end(buffer);
        });
    }
    catch (error) {
        console.log("error in pdf upload in cloudinary", error);
        throw new AppError_1.default(401, "error in pdf upload");
    }
});
exports.uploadBufferInCloudinary = uploadBufferInCloudinary;
const cloudinaryDeleteUpload = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // destroy by public_id
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex);
        if (match && match[1]) {
            const public_id = match[1];
            yield cloudinary_1.v2.uploader.destroy(public_id);
            console.log(`deleted images ${public_id}`);
        }
    }
    catch (error) {
        throw new AppError_1.default(401, "cloudinary image deletion failed", error.message);
    }
}); // this delete function in globalError. if unnesseary error occur to create controller then file will not upload in cloudiniary
exports.cloudinaryDeleteUpload = cloudinaryDeleteUpload;
exports.cloudinaryUpload = cloudinary_1.v2;
