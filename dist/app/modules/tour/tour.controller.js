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
exports.tourController = void 0;
const catchAsyncError_1 = require("../../utils/catchAsyncError");
const tour_service_1 = require("./tour.service");
const response_1 = require("../../utils/response");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// tour type
const createTourType = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { name } = req.body;
    const result = yield tour_service_1.tourService.createTourType(req.body);
    (0, response_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });
}));
const getTourType = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_service_1.tourService.getAllTourTypes();
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tour types retrieved successfully',
        data: result,
    });
}));
const updateTourType = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    const result = yield tour_service_1.tourService.updateTourType(id, name);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type updated successfully',
        data: result,
    });
}));
const deleteTourType = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield tour_service_1.tourService.deleteTourType(id);
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type deleted successfully',
        data: result,
    });
}));
// Tour
const createTour = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // throw new AppError(httpStatus.NOT_FOUND,"Tour type not found."); // to check deleted image if not controller works
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { images: (_a = req.files) === null || _a === void 0 ? void 0 : _a.map(file => file.path) });
    const createTour = yield tour_service_1.tourService.createTourService(payload);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "tour created successfully",
        data: createTour,
    });
}));
const getTour = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const allTour = yield tour_service_1.tourService.getAllTour(query);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "tour get successfully",
        data: allTour.data,
        metaData: allTour.meta
    });
}));
const getSingleTour = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const allTour = yield tour_service_1.tourService.getSingleTour(slug);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "tour get successfully",
        data: allTour,
    });
}));
const updateTour = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const payload = Object.assign(Object.assign({}, req.body), { images: (_a = req.files) === null || _a === void 0 ? void 0 : _a.map(file => file.path) });
    const updateTours = yield tour_service_1.tourService.updateTour(id, payload);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "tour updated successfully",
        data: updateTours,
    });
}));
const deleteTour = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const deleteTours = yield tour_service_1.tourService.deleteTour(id);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "tour deleted successfully",
        data: deleteTours,
    });
}));
exports.tourController = { createTour, getTour, updateTour, deleteTour, createTourType, getTourType, updateTourType, deleteTourType, getSingleTour };
