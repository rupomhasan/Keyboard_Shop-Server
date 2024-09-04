
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const createCustomer = catchAsync(async (req, res) => {
  const data = req.body
  const { refreshToken, ...result } = await UserService.createCustomerIntoDB(req.file, data)

  res.cookie("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true, message: "Customer is created successfully",
    data: result
  })
})

const createAdmin = catchAsync(async (req, res) => {
  const data = req.body
  const result = await UserService.createOrUpdateAdminInDB(req.file, data)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true, message: "Admin is created successfully",
    data: result
  })
})


const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await UserService.getUserByIdFromDB(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true, message: "User retrieved successfully",
    data: result
  })
})


const deleteSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await UserService.deleteUserByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true, message: "User is deleted successfully",
    data: result
  })
})

const myProfile = catchAsync(async (req, res) => {

  const user = req.user
  const result = await UserService.myProfile(user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true, message: "Your is data retrieved successfully",
    data: result
  })

})


export const UserControllers = { createCustomer, createAdmin, getSingleUser, deleteSingleUser, myProfile }