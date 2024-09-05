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
exports.productsServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../Error/AppError");
const brand_model_1 = require("../brand/brand.model");
const products_model_1 = require("./products.model");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const slugify_1 = __importDefault(require("slugify"));
const getAllProductsFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // getProducts by search fields
    let searchTerm = "";
    if (payload === null || payload === void 0 ? void 0 : payload.searchTerm) {
        searchTerm = payload.searchTerm;
    }
    const searchAbleFields = ["description", "slug", "size", "name",];
    const SearchProducts = products_model_1.Products.find({
        $or: searchAbleFields.map((field) => ({
            [field]: { $regex: searchTerm, $options: "i" }
        }))
    });
    // search by brand 
    let brandIds = [];
    let BrandIdFilters;
    if (payload === null || payload === void 0 ? void 0 : payload.brandIds) {
        brandIds = payload.brandIds;
    }
    if (brandIds.length > 0) {
        // BrandIdFilters = SearchProducts.find({
        //   $or: brandIds.map((id) => ({
        //     brand: id
        //   }))
        // })
        BrandIdFilters = SearchProducts.find({
            brand: { $in: brandIds }
        });
    }
    else {
        BrandIdFilters = SearchProducts;
    }
    // Price filtering
    let minPrice = 0;
    let maxPrice = 100000;
    if (payload === null || payload === void 0 ? void 0 : payload.min) {
        minPrice = payload.min;
    }
    if (payload.max) {
        maxPrice = payload.max;
    }
    const PriceFilter = BrandIdFilters.find({
        price: { $gte: minPrice, $lte: maxPrice }
    });
    // Pagination 
    let skip = 0;
    let limit = 10;
    let page = 1;
    if (payload === null || payload === void 0 ? void 0 : payload.limit) {
        limit = Number(payload.limit);
    }
    if (payload === null || payload === void 0 ? void 0 : payload.page) {
        page = Number(payload === null || payload === void 0 ? void 0 : payload.page);
        skip = Number(page - 1) * limit;
    }
    // Sorting 
    let sortBy = "_cratedAt";
    if ((payload === null || payload === void 0 ? void 0 : payload.sortBy)) {
        sortBy = payload.sortBy;
    }
    // field filtering 
    let filed = "";
    if (payload === null || payload === void 0 ? void 0 : payload.field) {
        filed = (payload === null || payload === void 0 ? void 0 : payload.field).split(",").join(" ");
    }
    const payloadObj = Object.assign({}, payload);
    const excludedFields = ["searchTerm", "page", "limit", "sortBy", "filed", "minPrice", "maxPrice"];
    excludedFields.forEach((e) => delete payloadObj[e]);
    const result = yield PriceFilter.find({ isDeleted: false }, payloadObj).populate("brand").skip(skip).limit(limit).sort(sortBy).select(filed);
    return result;
});
const getSingleProductFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield products_model_1.Products.findOne({ _id, isDeleted: false });
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Product is not found");
    }
    return result;
});
const createNewProductIntoDB = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, brand } = payload;
    const isBrandNameValid = yield brand_model_1.Brand.findById({ _id: brand });
    if (!isBrandNameValid) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Brand is not exist");
    }
    const isProductExist = yield products_model_1.Products.findOne({ name, price, brand });
    if (isProductExist) {
        const updatedProductQuantity = payload.productsQuantity + isProductExist.productsQuantity;
        const updatedAvailableQuantity = isProductExist.availableQuantity + payload.productsQuantity;
        const updatedProduct = yield products_model_1.Products.findByIdAndUpdate(isProductExist._id, {
            productsQuantity: updatedProductQuantity,
            availableQuantity: updatedAvailableQuantity
        }, { new: true });
        return updatedProduct;
    }
    if (file) {
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(payload.name, file === null || file === void 0 ? void 0 : file.path);
        payload.image = secure_url;
    }
    payload.slug = (0, slugify_1.default)(`${payload.name}-${isBrandNameValid.brandName}`, { lower: true });
    payload.availableQuantity = payload.productsQuantity;
    const result = yield products_model_1.Products.create(payload);
    return result;
});
const updateProductFromDB = (_id, file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExist = yield products_model_1.Products.findById(_id);
    if (payload.brand) {
        const isBrandNameValid = yield brand_model_1.Brand.findById(payload.brand);
        if (!isBrandNameValid) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, `This ${payload.brand} not available in DB`);
        }
    }
    if (!isProductExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, `this ${_id} is not found`);
    }
    if (file) {
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(payload === null || payload === void 0 ? void 0 : payload.name, file === null || file === void 0 ? void 0 : file.path);
        payload.image = secure_url;
    }
    const result = yield products_model_1.Products.findByIdAndUpdate(_id, {
        $set: payload
    }, { new: true });
    return result;
});
const deleteProductFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExist = yield products_model_1.Products.findById(_id);
    if (!isProductExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, `${_id} is not found`);
    }
    const result = yield products_model_1.Products.findByIdAndUpdate(_id, {
        isDeleted: true
    }, { new: true });
    return result;
});
exports.productsServices = {
    getAllProductsFromDB,
    getSingleProductFromDB,
    createNewProductIntoDB,
    updateProductFromDB,
    deleteProductFromDB
};
