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
exports.divisionController = void 0;
const catchAsyncError_1 = require("../../utils/catchAsyncError");
const response_1 = require("../../utils/response");
const division_service_1 = require("./division.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createDivision = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const createDivision = yield division_service_1.divisionServices.createDivisionService(payload);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "division created successfully",
        data: createDivision,
    });
}));
const getAllDivision = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allDivision = yield division_service_1.divisionServices.getAllDivisionService();
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "division get successfully",
        data: allDivision.data,
        metaData: allDivision.meta
    });
}));
const getSingleDivision = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const singleDivision = yield division_service_1.divisionServices.getSingleDivision(slug);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "division get successfully",
        data: singleDivision.data,
    });
}));
const updateDivision = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const updateDivisions = yield division_service_1.divisionServices.updateDivisionService(id, payload);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "division updated successfully",
        data: updateDivisions,
    });
}));
const deleteDivision = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const deleteDivisions = yield division_service_1.divisionServices.deleteDivisionService(id);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "division deleted successfully",
        data: deleteDivisions,
    });
}));
exports.divisionController = { createDivision, getAllDivision, updateDivision, deleteDivision, getSingleDivision };
