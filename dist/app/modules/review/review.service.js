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
exports.reviewService = void 0;
const user_model_1 = require("../user/user.model");
const AppError_1 = require("../../Error/AppError");
const http_status_1 = __importDefault(require("http-status"));
const products_model_1 = require("../products/products.model");
const review_model_1 = require("./review.model");
const mongoose_1 = __importDefault(require("mongoose"));
const user_constant_1 = require("../user/utils/user.constant");
const giveReviewSelectedProduct = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(user);
    if (user === null || user === void 0 ? void 0 : user.email) {
        const isUserExist = yield user_model_1.User.findOne({ email: user.email });
        if (isUserExist) {
            payload.user = isUserExist._id;
        }
    }
    const isProductExist = yield products_model_1.Products.findById(payload.product).populate("reviews");
    if (!isProductExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, `this ${payload.product} is not found`);
    }
    const session = yield mongoose_1.default.startSession();
    const totalReview = (isProductExist === null || isProductExist === void 0 ? void 0 : isProductExist.reviews) ? isProductExist.reviews.length : 0;
    try {
        session.startTransaction();
        const result = yield review_model_1.Review.create([payload], { new: true, session });
        yield products_model_1.Products.findByIdAndUpdate(payload.product, {
            $push: { reviews: result[0]._id },
            numberOfReviews: totalReview + 1
        }, { new: true, session });
        const updatedProduct = yield products_model_1.Products.findById(payload.product).populate("reviews");
        let averageRating = 0;
        if ((updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.reviews) && (updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct.reviews.length) > 0) {
            const totalRatings = updatedProduct.reviews.reduce((acc, review) => {
                if (typeof review === "object" && "rating" in review) {
                    return acc + (review.rating || 0);
                }
                return acc;
            }, 0);
            averageRating = totalRatings / updatedProduct.reviews.length;
        }
        yield products_model_1.Products.findByIdAndUpdate(payload.product, {
            averageRating: averageRating
        }, { new: true, session });
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
    }
});
const getAllReviewFromDB = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.find({}).populate("user").limit(limit);
    return result;
});
const getMyReview = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield user_model_1.User.findOne({ email: user.email });
    if (!isUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User is not found");
    }
    const myReviews = yield review_model_1.Review.find({ user: isUser._id });
    return myReviews;
});
const getReviewsForProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(productId);
    const result = yield review_model_1.Review.find({ product: productId });
    return result;
});
const updateMyReview = (user, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield user_model_1.User.findOne({ email: user.email });
    if (!isUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    const review = yield review_model_1.Review.findById(id);
    if (!review) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Review not found");
    }
    if (!isUser._id.equals(review.user)) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "You are not authorized to update this review");
    }
    const result = yield review_model_1.Review.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteReview = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(id);
    if (!review) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Review is not found");
    }
    if (user.role === user_constant_1.USER_ROLE.Admin) {
        yield review_model_1.Review.findByIdAndDelete(id);
    }
    else {
        const isUser = yield user_model_1.User.findOne({ email: user.email });
        if (!isUser) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User is not found");
        }
        if (!isUser._id.equals(review === null || review === void 0 ? void 0 : review.user)) {
            throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "You can not delete this review");
        }
        yield review_model_1.Review.findByIdAndDelete(id);
    }
});
exports.reviewService = {
    giveReviewSelectedProduct,
    getAllReviewFromDB,
    getMyReview,
    getReviewsForProduct,
    deleteReview,
    updateMyReview
};
