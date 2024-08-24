
import catchAsync from "../../utils/catchAsync";
import { UserService } from "./user.service";

const createCustomer = catchAsync(async (req, res) => {
  const data = req.body
  const result = await UserService.createCustomerIntoDB(data)
  res.send(result)
})

const createAdmin = catchAsync(async (req, res) => {
  const data = req.body
  const result = await UserService.createAdminIntoDB(data)
  res.send(result)
})


const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await UserService.getUserByIdFromDB(id)
  res.send(result)
})


const deleteSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await UserService.deleteUserByIdFromDB(id)
  res.send(result)
})



export const UserControllers = { createCustomer, createAdmin, getSingleUser, deleteSingleUser }