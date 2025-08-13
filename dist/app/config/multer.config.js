"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = require("./cloudinary.config");
const multer_1 = __importDefault(require("multer"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.cloudinaryUpload,
    params: {
        public_id: (req, file) => {
            // my Image.png -> 45454h4rt4hfd-my-image.png
            const filename = file.originalname
                .toLowerCase()
                .replace(/\s+g/, "-") // remove empty space
                .replace(/\.g/, "-"); // remove .
            const extensionName = file.originalname.split(".").pop(); // . diye split kore last er ta return korbe
            // 0.003435445656 -> 0.405454dfdhfgdkgofgd44545 -> 405454dfdhfgdkgofgd44545 -> 405454dfdhfgdkgofgd44545-milisecond of date-filename.extension
            const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + filename + "." + extensionName;
            return uniqueName;
        }
    }
});
exports.multerUpload = (0, multer_1.default)({ storage: storage });
