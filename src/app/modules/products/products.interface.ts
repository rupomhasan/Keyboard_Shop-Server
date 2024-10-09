import mongoose from "mongoose";
import { TBrand } from "../brand/brand.interface";
import { TReview } from "../review/review.interface";
type TDimensions = {
  length: number;
  width: number;
  height: number;
};

type TFeatures = {
  size?: string;
  keys?: number;
  SwitchLifecycle?: string;
  Switch?: string;
  mode?: string;
  battery?: string;
  lighting?: string;
  weight?: string;
};

export type TProducts = {
  _id: string
  name: string;
  description: string;
  image?: string;
  brand: mongoose.ObjectId | TBrand;
  status: "instock" | "upcoming" | "preorder" | "outofstock",
  type: "standard" | "gaming";
  productsQuantity: number;
  availableQuantity?: number;
  price: number;
  discount?: number;
  specialPrice?: number;
  sku?: string;
  reviews?: mongoose.ObjectId[] | TReview[],
  connectivity: string;
  dimensions: TDimensions;
  averageRating?: number;
  numberOfReviews: number;
  features?: TFeatures;
  slug?: string,
  isDeleted?: boolean,
};

