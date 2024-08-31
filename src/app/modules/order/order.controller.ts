import httpStatus from "http-status"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { orderService } from "./order.service"


const getAllOrder = catchAsync(async (req, res) => {
  const result = ""
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "",
    data: result
  })

})

const getMyOrderDB = catchAsync(async (req, res) => {
  const result = ""
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "",
    data: result
  })

})
const createNewOrder = catchAsync(async (req, res) => {
  const result = await orderService.createNewOrderIntoDB(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order is created successfully",
    data: result
  })

})

const updateMyOrder = catchAsync(async (req, res) => {
  const result = ""
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "",
    data: result
  })

})

const updateOrderById = catchAsync(async (req, res) => {
  const result = ""
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "",
    data: result
  })

})


export const orderControllers = {
  getAllOrder,
  getMyOrderDB,
  createNewOrder,
  updateMyOrder,
  updateOrderById
}