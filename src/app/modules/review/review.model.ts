import mongoose, { Schema } from "mongoose";
import { TReview } from "./review.interface";

const ReviewSchema = new Schema<TReview>({
  customerName: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1, max: 5
  },
  comment:
  {
    type: String,
    required: true,
    maxlength: 500
  },
  isDeleted:
  {
    type: Boolean,
    default: false
  },
  updatedAt:
  {
    type: Date,
    default: Date.now
  },
}, { timestamps: true }
);

export const Review = mongoose.model<TReview>("Review", ReviewSchema)
