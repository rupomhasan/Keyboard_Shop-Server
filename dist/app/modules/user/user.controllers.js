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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const createCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const _a = yield user_service_1.UserService.createCustomerIntoDB(req.file, data), { refreshToken } = _a, result = __rest(_a, ["refreshToken"]);
    res.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true, message: "Customer is created successfully",
        data: result
    });
}));
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield user_service_1.UserService.createOrUpdateAdminInDB(req.file, data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true, message: "Admin is created successfully",
        data: result
    });
}));
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserService.getUserByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true, message: "User retrieved successfully",
        data: result
    });
}));
const deleteSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserService.deleteUserByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true, message: "User is deleted successfully",
        data: result
    });
}));
const myProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_service_1.UserService.myProfile(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true, message: "Your is data retrieved successfully",
        data: result
    });
}));
exports.UserControllers = { createCustomer, createAdmin, getSingleUser, deleteSingleUser, myProfile };
