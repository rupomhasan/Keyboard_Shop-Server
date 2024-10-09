import { Types } from "mongoose";

export type TReview = {
  customerName: string
  user?: Types.ObjectId;
  rating: number;
  product: Types.ObjectId;
  comment: string;
  isDeleted?: boolean;
  updatedAt: Date;
};
