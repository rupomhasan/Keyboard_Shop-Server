import mongoose, { Schema } from "mongoose";
import { Brand } from "../brand/brand.model";
import { TProducts } from "./products.interface";

const productSchema: Schema = new Schema<TProducts>(
  {
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
      type: Schema.Types.ObjectId,
      ref: Brand,
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
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    sku: {
      type: String,
      trim: true,
    },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    connectivity: {
      type: String,
      required: true,
    },
    dimensions: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["instock", "upcoming", "preorder", "outofstock"],
      required: true,
    },
    type: {
      type: String,
      enum: ["standard", "gaming"],
      required: true,
    },
    features: {
      size: { type: String },
      keys: { type: Number },
      SwitchLifecycle: { type: String },
      Switch: { type: String },
      SwitchColor: { type: String },
      mode: { type: String },
      battery: { type: String },
      lighting: { type: String },
      weight: { type: String },
    },
    slug: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Products = mongoose.model<TProducts>("Products", productSchema);
