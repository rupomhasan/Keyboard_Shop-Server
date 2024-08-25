import httpStatus from "http-status";
import { AppError } from "../../Error/AppError";
import { TUser } from "./user.interface"
import { User } from "./user.model"
const createCustomerIntoDB = async (data: TUser) => {
  const isUserExist = await User.findOne({ email: data.email });

  if (isUserExist) {
    if (isUserExist.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "user is deleted");
    }

    throw new AppError(httpStatus.BAD_REQUEST, "user already exists");
  }
  data.isDeleted = false
  const result = await User.create(data);
  return result;
};

const createAdminIntoDB = async (data
  : Partial<TUser>) => {
  const isUserExist = await User.findOne({ email: data.email });
  let result;
  if (isUserExist) {
    if (isUserExist.role === "Admin") {
      throw new AppError(httpStatus.BAD_REQUEST, "this user is already admin")
    }
    result = await User.findOneAndUpdate({ email: isUserExist.email }, {
      role: "Admin"
    })
  }
  data.role = "Admin";
  data.isDeleted = false
  result = await User.create(data)
  return result;
};

const getUserByIdFromDB = async (_id: string) => {

  const result = await User.findById(_id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "no user available with this account")
  }
  return result
}
const deleteUserByIdFromDB = async (_id: string) => {


  const isUserExist = await User.findById(_id);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "user is not found")
  }

  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "this user is deleted")
  }


  const result = await User.findByIdAndUpdate(_id, { isDeleted: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "no user available with this account")
  }
  return result
}
export const UserService = {
  createCustomerIntoDB,
  createAdminIntoDB,
  getUserByIdFromDB,
  deleteUserByIdFromDB
} 