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
exports.UserService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../Error/AppError");
const user_model_1 = require("./user.model");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const handleExistingUser_1 = require("./utils/handleExistingUser");
const createNewAdmin_1 = require("./utils/createNewAdmin");
;
const config_1 = __importDefault(require("../../config"));
const myProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const myData = yield user_model_1.User.findOne({ email: user.email }).populate("order");
    if (!myData) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Your not authorized your");
    }
    if (myData.isDeleted) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Your  nor authorized");
    }
    return myData;
});
const createCustomerIntoDB = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: payload.email });
    if (isUserExist) {
        if (isUserExist.isDeleted) {
            throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "user is deleted");
        }
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "user already exists");
    }
    if (file) {
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(payload.name, file === null || file === void 0 ? void 0 : file.path);
        payload.photoUrl = secure_url;
    }
    payload.isDeleted = false;
    const result = (yield user_model_1.User.create(payload));
    result.password = "";
    const jwtPayload = {
        email: result.email,
        role: result.role
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, { expiresIn: config_1.default.accessTokenExpiresIn });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_refresh_secret, { expiresIn: config_1.default.refreshTokenExpiresIn });
    return { result, accessToken, refreshToken };
});
const createOrUpdateAdminInDB = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.User.findOne({ email: payload.email });
    if (existingUser) {
        return yield (0, handleExistingUser_1.handleExistingUser)(existingUser, file, payload);
    }
    else {
        return yield (0, createNewAdmin_1.createNewAdminUser)(payload, file);
    }
});
const getUserByIdFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(_id).select("-password");
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "no user available with this account");
    }
    return result;
});
const deleteUserByIdFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(_id);
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "user is not found");
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "this user is deleted");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(_id, { isDeleted: true });
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "no user available with this account");
    }
    return result;
});
exports.UserService = {
    myProfile,
    createCustomerIntoDB,
    createOrUpdateAdminInDB,
    getUserByIdFromDB,
    deleteUserByIdFromDB
};
