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
exports.brandServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../Error/AppError");
const brand_model_1 = require("./brand.model");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const getAllBrand = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brand_model_1.Brand.find({});
    return result;
});
const getSingleBrand = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBrandExist = yield brand_model_1.Brand.findById(_id);
    if (!isBrandExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Brand is not found");
    }
    const result = yield brand_model_1.Brand.findById(_id);
    return result;
});
const createBrand = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBrandExist = yield brand_model_1.Brand.findOne({ brandName: payload.brandName });
    if (isBrandExist) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "This brand name is already exist");
    }
    if (file) {
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(payload.brandName, file === null || file === void 0 ? void 0 : file.path);
        payload.logo = secure_url;
    }
    const result = yield brand_model_1.Brand.create(payload);
    return result;
});
const deleteBrand = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBrandExist = yield brand_model_1.Brand.findById(_id);
    if (!isBrandExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Brand is not found");
    }
    const result = yield brand_model_1.Brand.findByIdAndDelete(_id, {
        new: true
    });
    return result;
});
exports.brandServices = {
    createBrand,
    deleteBrand,
    getSingleBrand,
    getAllBrand
};
