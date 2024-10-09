import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const giveReview = catchAsync(async (req, res) => {

  const result = await reviewService.giveReviewSelectedProduct(req.user, req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review successfully added",
    data: result
  })
})


const getAllReview = catchAsync(async (req, res) => {
  const { limit } = req.query


  const result = await reviewService.getAllReviewFromDB(Number(limit))

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All reviews are retrieved successfully",
    data: result
  })
})


const getMyReviews = catchAsync(async (req, res) => {

  const result = await reviewService.getMyReview(req.user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your review are retrieved successfully ",
    data: result
  })
})
const getReviewsForProduct = catchAsync(async (req, res) => {

  const result = await reviewService.getReviewsForProduct(req.params.id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Particular product reviews are retrieved successfully",
    data: result
  })
})
const updateMyReview = catchAsync(async (req, res) => {

  const result = await reviewService.updateMyReview(req.user, req.params.id, req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review is updated successfully",
    data: result
  })
})
const deleteReview = catchAsync(async (req, res) => {

  const result = await reviewService.deleteReview(req.user, req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review is deleted successfully",
    data: result
  })
})

export const reviewControllers = {
  giveReview,
  getAllReview,
  getMyReviews,
  getReviewsForProduct,
  deleteReview,
  updateMyReview
}