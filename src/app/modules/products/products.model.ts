import mongoose, { Schema } from "mongoose";
import { TProducts } from "./products.interface";
import { Brand } from "../brand/brand.model";

const productSchema: Schema = new Schema({
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
  reviews: [{
    type: Schema.Types.ObjectId,
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


export const Products = mongoose.model<TProducts>("Products", productSchema)