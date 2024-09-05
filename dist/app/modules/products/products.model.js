"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const brand_model_1 = require("../brand/brand.model");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
    },
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: brand_model_1.Brand,
        required: true,
    },
    productsQuantity: {
        type: Number,
        required: true,
        min: 0,
    },
    availableQuantity: {
        type: Number,
        min: 0,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    reviews: [{
            type: mongoose_1.Schema.Types.ObjectId,
            // ref: 'Review',
        }],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        required: true,
    },
    slug: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Products = mongoose_1.default.model("Products", productSchema);
