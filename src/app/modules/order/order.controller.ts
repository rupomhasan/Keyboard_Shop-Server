import httpStatus from "http-status"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { orderService } from "./order.service"


const getAllOrder = catchAsync(async (req, res) => {
  const result = await orderService.getAllOrderFormDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All order are retrieved successfully",
    data: result
  })

})

const getMyOrder = catchAsync(async (req, res) => {

  const result = await orderService.getMyOrderFromDB(req.user)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${result.length > 0 ? "Her is you order list" : "You have not yet order any this"}`,
    data: result
  })

})
const createNewOrder = catchAsync(async (req, res) => {
  const result = await orderService.createNewOrderIntoDB(req.body, req.user)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order is created successfully",
    data: result
  })

})

const canceledMyOrder = catchAsync(async (req, res) => {

  const result = await orderService.canceledMyOrderFormDB(req.user, req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your are order is canceled successfully",
    data: result
  })

})



const updateOrderById = catchAsync(async (req, res) => {

  const result = await orderService.updateOrderStatusFormDB(req.params.id, req.body.status)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product is updated successfully",
    data: result
  })

})


const deleteOrderById = catchAsync(async (req, res) => {

  const result = await orderService.deleteOrderByIdFormDB(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "product is deleted successfully",
    data: result
  })

})


export const orderControllers = {
  getAllOrder,
  getMyOrder,
  createNewOrder,
  canceledMyOrder,
  deleteOrderById,
  updateOrderById
}