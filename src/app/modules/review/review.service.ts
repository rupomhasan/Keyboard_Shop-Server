/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { TReview } from "./review.interface";
import { User } from "../user/user.model";
import { AppError } from "../../Error/AppError";
import httpStatus from "http-status";
import { Products } from "../products/products.model";
import { Review } from "./review.model";
import mongoose from "mongoose";
import { USER_ROLE } from "../user/utils/user.constant";

const giveReviewSelectedProduct = async (user: JwtPayload, payload: TReview) => {

  const isUserExist = await User.findOne({ email: user.email });
  const isProductExist = await Products.findById(payload.product);
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not found ")
  }
  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, `this ${payload.product} is not found`)
  }
  payload.user = isUserExist._id
  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    const result = await Review.create([payload], { new: true, session })
    await Products.findByIdAndUpdate(payload.product, {
      $push: { reviews: result[0]._id }
    }, {
      new: true, session
    })

    await session.commitTransaction();
    await session.endSession()
    return result;

  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getAllReviewFromDB = async () => {

  const result = await Review.find({})
  return result;


}


const getMyReview = async (user: JwtPayload) => {

  const isUser = await User.findOne({ email: user.email })


  if (!isUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found")
  }


  const myReviews = await Review.find({ user: isUser._id })

  return myReviews

}


const getReviewsForProduct = async (productId: string) => {

  const result = await Review.find({ product: productId })
  return result

}


const updateMyReview = async (user: JwtPayload, id: string, payload: Partial<TReview>) => {
  const isUser = await User.findOne({ email: user.email });

  if (!isUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const review = await Review.findById(id);

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  if (!isUser._id.equals(review.user)) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to update this review");
  }

  const result = await Review.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

const deleteReview = async (user: JwtPayload, id: string) => {


  const review = await Review.findById(id)

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review is not found")
  }



  if (user.role === USER_ROLE.Admin) {
    await Review.findByIdAndDelete(id)

  }
  else {

    const isUser = await User.findOne({ email: user.email })
    if (!isUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User is not found")

    }

    if (!isUser._id.equals(review?.user)) {
      throw new AppError(httpStatus.FORBIDDEN, "You can not delete this review")
    }

    await Review.findByIdAndDelete(id)

  }


}

export const reviewService = {
  giveReviewSelectedProduct,
  getAllReviewFromDB,
  getMyReview,
  getReviewsForProduct,
  deleteReview,
  updateMyReview
}