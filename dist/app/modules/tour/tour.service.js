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
exports.tourService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const tour_model_1 = require("./tour.model");
const tour_constants_1 = require("./tour.constants");
const queryBuilder_1 = require("../../utils/queryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createTourService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findOne({ name: payload.title });
    if (existingTour) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "tour already exist");
    }
    // const baseSlug =  payload.title.toLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}-tour`
    // // to check uniquesness. we know anyhow its will be unique though we will again unique it
    // let counter = 0;
    // while(await Tour.exists({slug})){
    //     slug = `${slug}-${counter++}` // dhaka-division-1 dhaka-division-2
    // }
    // payload.slug = slug
    const tour = yield tour_model_1.Tour.create(payload);
    return tour;
});
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
const getAllTour = (query) => __awaiter(void 0, void 0, void 0, function* () {
    //  console.log(query);
    // const tour = await Tour.find(searchQuery ).find(filter).sort(sort).select(fieldFiltering).skip(skip).limit(limit);    
    const queryBuilder = new queryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const allTour = yield queryBuilder
        .search(tour_constants_1.tourSearchable)
        .filter()
        .sort()
        .fieldsFiltering()
        .paginate();
    // .modelQuery
    // .build()
    const [data, meta] = yield Promise.all([
        allTour.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const getSingleTour = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tour_model_1.Tour.findOne({ slug });
    return tour;
});
const updateTour = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const tourExist = yield tour_model_1.Tour.findById(id);
    console.log(id);
    if (!tourExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "tour not found");
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
    if (payload.images && payload.images.length > 0 && tourExist.images && ((_a = tourExist.images) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        payload.images = [...payload.images, ...tourExist.images];
    }
    // case 2: if user want to delete especific images during update then->  data -> deleteImages: [ "imgurl1", "imgurl2"]
    if (payload.deleteImages && payload.deleteImages.length > 0 && tourExist.images && ((_b = tourExist.images) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        const restDBImages = tourExist.images.filter(imgUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imgUrl)); }); // means user j gula delete korbe na segula theke jabe
        const updatedPayloadImages = (payload.images || [])
            .filter(imgUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imgUrl)); })
            .filter(imgUrl => !(restDBImages === null || restDBImages === void 0 ? void 0 : restDBImages.includes(imgUrl)));
        payload.images = [...restDBImages, ...updatedPayloadImages];
    }
    const updateTour = yield tour_model_1.Tour.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    // case 3: delete from cloudinary
    if (payload.deleteImages && payload.deleteImages.length > 0 && tourExist.images && ((_c = tourExist.images) === null || _c === void 0 ? void 0 : _c.length) > 0) {
        yield Promise.all(payload.deleteImages.map(imgUrl => (0, cloudinary_config_1.cloudinaryDeleteUpload)(imgUrl)));
    }
    return updateTour;
});
const deleteTour = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield tour_model_1.Tour.findByIdAndDelete(id);
    return null;
});
//--- tour type ---
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findOne({ name: payload.name });
    if (existingTourType) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Tour type already exists.");
    }
    const tourType = yield tour_model_1.TourType.create(payload);
    return tourType;
});
const getAllTourTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield tour_model_1.TourType.find();
});
const updateTourType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findById(id);
    if (!existingTourType) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour type not found.");
    }
    const updatedTourType = yield tour_model_1.TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;
});
const deleteTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findById(id);
    if (!existingTourType) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Tour type not found.");
    }
    return yield tour_model_1.TourType.findByIdAndDelete(id);
});
exports.tourService = { createTourService, getAllTour, updateTour, deleteTour, createTourType, getAllTourTypes, updateTourType, deleteTourType, getSingleTour };
