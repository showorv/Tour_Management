"use strict";
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
exports.divisionServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const division_model_1 = require("./division.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createDivisionService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDivision = yield division_model_1.Division.findOne({ name: payload.name });
    if (existingDivision) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "division already exist");
    }
    // const baseSlug =  payload.name.toLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}-division`
    // // to check uniquesness. we know anyhow its will be unique though we will again unique it
    // let counter = 0;
    // while(await Division.exists({slug})){
    //     slug = `${slug}-${counter++}` // dhaka-division-1 dhaka-division-2
    // }
    // payload.slug = slug
    const division = yield division_model_1.Division.create(payload);
    return division;
});
const getAllDivisionService = () => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield division_model_1.Division.find();
    const totalDivision = yield division_model_1.Division.countDocuments();
    return {
        data: division,
        meta: {
            total: totalDivision
        }
    };
});
const getSingleDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const singleDivision = yield division_model_1.Division.findOne({ slug });
    return {
        data: singleDivision
    };
});
const updateDivisionService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const divisionExist = yield division_model_1.Division.findById(id);
    // console.log(id);
    if (!divisionExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "division not found");
    }
    const duplicateDivision = yield division_model_1.Division.findOne({
        name: payload.name,
        _id: { $ne: id }
    });
    if (duplicateDivision) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "division name already exist");
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
    const updateDivision = yield division_model_1.Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (payload.thumbnail && divisionExist.thumbnail) {
        yield (0, cloudinary_config_1.cloudinaryDeleteUpload)(divisionExist.thumbnail);
    }
    return updateDivision;
});
const deleteDivisionService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield division_model_1.Division.findByIdAndDelete(id);
    return null;
});
exports.divisionServices = { createDivisionService, getAllDivisionService, getSingleDivision, updateDivisionService, deleteDivisionService };
