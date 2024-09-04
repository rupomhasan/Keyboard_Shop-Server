import { Types } from "mongoose";

export type TReview = {
  user?: Types.ObjectId;
  rating: number;
  product: Types.ObjectId;
  comment: string;
  isDeleted?: boolean;
  updatedAt: Date;
};
