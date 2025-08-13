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
exports.userController = exports.getSingleUser = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const catchAsyncError_1 = require("../../utils/catchAsyncError");
const response_1 = require("../../utils/response");
// const createUser = async (req: Request,res: Response, next: NextFunction)=>{
//     try {
//         const user = await userService.createUser(req.body);
//         res.status(httpStatus.CREATED).json({
//             message: "User created successfully",
//             data: user
//         })
//     } catch (error) {
//         next(error)
//     }
// }
const createUser = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const user = yield user_service_1.userService.createUser(payload);
    // res.status(httpStatus.CREATED).json({
    //     message: "User created successfully",
    //     data: user
    // })
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "User created successfully",
        data: user
    });
}));
const getAllUser = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_service_1.userService.getUser();
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Users retrived successfully",
        data: users.data,
        metaData: users.meta
    });
}));
const getMe = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const user = yield user_service_1.userService.getMe(decodedToken.userId);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "your profile retrived successfully",
        data: user,
    });
}));
const updateUser = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.params.id;
    // const token = req.headers.authorization
    // const tokenVerified = verifiedToken(token as string, envVars.JWT_SECRET as string) as JwtPayload
    const tokenVerified = req.user;
    const payload = Object.assign(Object.assign({}, req.body), { image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const updateUser = yield user_service_1.userService.updateUser(userId, payload, tokenVerified);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Users updated successfully",
        data: updateUser,
    });
}));
exports.getSingleUser = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_service_1.userService.getSingleUser(id);
    (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "single user retrived successfully",
        data: user,
    });
}));
exports.userController = { createUser, getAllUser, updateUser, getMe, getSingleUser: exports.getSingleUser };
