/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { AppError } from "../../Error/AppError";
import { TUser } from "./user.interface"
import { User } from "./user.model"
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { handleExistingUser } from "./utils/handleExistingUser";
import { createNewAdminUser } from "./utils/createNewAdmin";




const createCustomerIntoDB = async (file: any, payload: TUser) => {
  const isUserExist = await User.findOne({ email: payload.email });

  if (isUserExist) {
    if (isUserExist.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "user is deleted");
    }

    throw new AppError(httpStatus.BAD_REQUEST, "user already exists");
  }
  if (file) {

    if (file) {
      const { secure_url } = await sendImageToCloudinary(payload.name, file?.path);
      payload.photoUrl = secure_url
    }

  }

  payload.isDeleted = false
  const result = await User.create(payload);
  return result;
};

const createOrUpdateAdminInDB = async (file: any, payload: Partial<TUser>): Promise<TUser> => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    return await handleExistingUser(existingUser, file, payload);
  } else {
    return await createNewAdminUser(payload, file);
  }
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
  createOrUpdateAdminInDB,
  getUserByIdFromDB,
  deleteUserByIdFromDB
} 